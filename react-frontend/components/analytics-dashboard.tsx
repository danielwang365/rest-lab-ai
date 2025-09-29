'use client';

import { useState, useEffect } from 'react';
import { Room } from 'livekit-client';
import { Calendar, Download, Settings } from 'lucide-react';
import { MetricCards } from './metric-cards';
import { TrendCharts } from './trend-charts';
import { LiveUpdatesFeed } from './live-updates-feed';
import type { 
  TrackingData, 
  AgentTrackingMessage, 
  PainAssessment, 
  SleepQuality, 
  MoodAssessment 
} from '@/lib/tracking-types';

interface AnalyticsDashboardProps {
  room: Room | null;
  sessionStarted: boolean;
}

export function AnalyticsDashboard({ room, sessionStarted }: AnalyticsDashboardProps) {
  const [trackingData, setTrackingData] = useState<TrackingData>({
    painAssessments: [],
    sleepQuality: [],
    moodAssessments: [],
  });

  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d');
  const [latestUpdate, setLatestUpdate] = useState<string>('');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('therapist-tracking-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        const convertedData = {
          painAssessments: parsedData.painAssessments?.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          })) || [],
          sleepQuality: parsedData.sleepQuality?.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          })) || [],
          moodAssessments: parsedData.moodAssessments?.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          })) || [],
        };
        setTrackingData(convertedData);
      } catch (error) {
        console.error('Failed to load tracking data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('therapist-tracking-data', JSON.stringify(trackingData));
  }, [trackingData]);

  // Listen for agent tracking messages
  useEffect(() => {
    if (!room) return;
    
    // Wait for room to be connected before setting up listeners
    if (room.state !== 'connected') {
      const handleRoomConnected = () => {
        setupDataListeners();
      };
      
      room.once('connected', handleRoomConnected);
      
      return () => {
        room.off('connected', handleRoomConnected);
      };
    } else {
      setupDataListeners();
    }
    
    function setupDataListeners() {
      const handleDataReceived = (payload: Uint8Array) => {
        try {
          const messageText = new TextDecoder().decode(payload);
          const message = JSON.parse(messageText) as AgentTrackingMessage;
          if (message.type && message.data) {
            const newEntry = {
              ...message.data,
              id: `${message.type}-${Date.now()}`,
              timestamp: new Date(),
            };

            setTrackingData(prevData => {
              switch (message.type) {
                case 'pain_assessment':
                  setLatestUpdate('New pain assessment recorded');
                  return {
                    ...prevData,
                    painAssessments: [...prevData.painAssessments, newEntry as PainAssessment],
                  };
                case 'sleep_quality':
                  setLatestUpdate('Sleep quality logged');
                  return {
                    ...prevData,
                    sleepQuality: [...prevData.sleepQuality, newEntry as SleepQuality],
                  };
                case 'mood_assessment':
                  setLatestUpdate('Mood assessment updated');
                  return {
                    ...prevData,
                    moodAssessments: [...prevData.moodAssessments, newEntry as MoodAssessment],
                  };
                default:
                  return prevData;
              }
            });

            // Clear the update message after 3 seconds
            setTimeout(() => setLatestUpdate(''), 3000);
          }
        } catch (error) {
          console.error('Failed to parse agent message:', error);
        }
      };

      // Set up data listener for agent messages
      room.on('dataReceived', handleDataReceived);
      
      // Return cleanup function
      return () => {
        room.off('dataReceived', handleDataReceived);
      };
    }
    
    // If room is already connected, set up listeners and return cleanup
    if (room.state === 'connected') {
      return setupDataListeners();
    }
  }, [room]);

  // Get latest and previous values for trend comparison
  const latestPain = trackingData.painAssessments[trackingData.painAssessments.length - 1];
  const previousPain = trackingData.painAssessments[trackingData.painAssessments.length - 2];
  
  const latestSleep = trackingData.sleepQuality[trackingData.sleepQuality.length - 1];
  const previousSleep = trackingData.sleepQuality[trackingData.sleepQuality.length - 2];
  
  const latestMood = trackingData.moodAssessments[trackingData.moodAssessments.length - 1];
  const previousMood = trackingData.moodAssessments[trackingData.moodAssessments.length - 2];

  // Demo data function for testing
  const addDemoData = () => {
    const now = new Date();
    const timestamp = Date.now();
    const demoData: TrackingData = {
      painAssessments: [
        {
          id: `demo-pain-${timestamp}-1`,
          timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
          painLevel: 6,
          location: 'lower back',
          quality: 'dull aching',
          triggers: 'sitting too long',
          copingStrategies: 'heat therapy',
        },
        {
          id: `demo-pain-${timestamp}-2`,
          timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000),
          painLevel: 4,
          location: 'neck',
          quality: 'sharp',
          triggers: 'stress',
          copingStrategies: 'breathing exercises',
        },
      ],
      sleepQuality: [
        {
          id: `demo-sleep-${timestamp}-1`,
          timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
          sleepQuality: 6,
          hoursSlept: 7.5,
          sleepOnsetMinutes: 30,
          wakeUps: 2,
          sleepFactors: 'pain flare',
        },
        {
          id: `demo-sleep-${timestamp}-2`,
          timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000),
          sleepQuality: 8,
          hoursSlept: 8,
          sleepOnsetMinutes: 15,
          wakeUps: 1,
          sleepFactors: 'good sleep hygiene',
        },
      ],
      moodAssessments: [
        {
          id: `demo-mood-${timestamp}-1`,
          timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
          moodRating: 5,
          energyLevel: 4,
          dailyActivitiesCompletion: 6,
          socialEngagement: 3,
          emotionalCoping: 'journaling',
        },
        {
          id: `demo-mood-${timestamp}-2`,
          timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000),
          moodRating: 7,
          energyLevel: 6,
          dailyActivitiesCompletion: 8,
          socialEngagement: 7,
          emotionalCoping: 'mindfulness',
        },
      ],
    };

    setTrackingData(prevData => ({
      painAssessments: [...prevData.painAssessments, ...demoData.painAssessments],
      sleepQuality: [...prevData.sleepQuality, ...demoData.sleepQuality],
      moodAssessments: [...prevData.moodAssessments, ...demoData.moodAssessments],
    }));
  };

  const clearData = () => {
    setTrackingData({
      painAssessments: [],
      sleepQuality: [],
      moodAssessments: [],
    });
    localStorage.removeItem('therapist-tracking-data');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Health Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your chronic pain, sleep quality, and mood patterns</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Period Selector */}
            <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
              <Calendar className="w-4 h-4 text-gray-400 ml-2" />
              {(['7d', '30d', '90d'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    selectedPeriod === period
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={addDemoData}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
              >
                Add Demo Data
              </button>
              <button
                onClick={clearData}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>

        {/* Current Metrics Cards */}
        <MetricCards
          latestPain={latestPain}
          latestSleep={latestSleep}
          latestMood={latestMood}
          previousPain={previousPain}
          previousSleep={previousSleep}
          previousMood={previousMood}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Trend Charts */}
          <div className="lg:col-span-1">
            <TrendCharts 
              trackingData={trackingData}
              selectedPeriod={selectedPeriod}
            />
          </div>
          
          {/* Right Column: Live Updates Feed */}
          <div className="lg:col-span-1">
            <LiveUpdatesFeed
              latestPain={latestPain}
              latestSleep={latestSleep}
              latestMood={latestMood}
              newUpdateMessage={latestUpdate}
            />
          </div>
        </div>

        {/* Session Status */}
        {!sessionStarted && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Ready to Start Your Therapy Session
            </h3>
            <p className="text-blue-700">
              Click the microphone in the voice bar above to begin talking with your AI therapist. 
              Your health metrics will be tracked and displayed here in real-time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
