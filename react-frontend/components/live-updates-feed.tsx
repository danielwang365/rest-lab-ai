'use client';

import { useState, useEffect } from 'react';
import { Activity, Brain, Moon, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import type { PainAssessment, SleepQuality, MoodAssessment } from '@/lib/tracking-types';

interface LiveUpdate {
  id: string;
  type: 'pain_assessment' | 'sleep_quality' | 'mood_assessment';
  data: PainAssessment | SleepQuality | MoodAssessment;
  timestamp: Date;
  isNew: boolean;
}

interface LiveUpdatesFeedProps {
  latestPain?: PainAssessment;
  latestSleep?: SleepQuality;
  latestMood?: MoodAssessment;
  newUpdateMessage?: string;
}

export function LiveUpdatesFeed({ 
  latestPain, 
  latestSleep, 
  latestMood,
  newUpdateMessage 
}: LiveUpdatesFeedProps) {
  const [updates, setUpdates] = useState<LiveUpdate[]>([]);
  const [showNewUpdate, setShowNewUpdate] = useState(false);

  // Add new updates when data changes
  useEffect(() => {
    const newUpdates: LiveUpdate[] = [];

    if (latestPain) {
      const existingPain = updates.find(u => u.type === 'pain_assessment' && u.data.id === latestPain.id);
      if (!existingPain) {
        newUpdates.push({
          id: `pain-${latestPain.id}`,
          type: 'pain_assessment',
          data: latestPain,
          timestamp: latestPain.timestamp,
          isNew: true,
        });
      }
    }

    if (latestSleep) {
      const existingSleep = updates.find(u => u.type === 'sleep_quality' && u.data.id === latestSleep.id);
      if (!existingSleep) {
        newUpdates.push({
          id: `sleep-${latestSleep.id}`,
          type: 'sleep_quality',
          data: latestSleep,
          timestamp: latestSleep.timestamp,
          isNew: true,
        });
      }
    }

    if (latestMood) {
      const existingMood = updates.find(u => u.type === 'mood_assessment' && u.data.id === latestMood.id);
      if (!existingMood) {
        newUpdates.push({
          id: `mood-${latestMood.id}`,
          type: 'mood_assessment',
          data: latestMood,
          timestamp: latestMood.timestamp,
          isNew: true,
        });
      }
    }

    if (newUpdates.length > 0) {
      setUpdates(prev => [...newUpdates, ...prev].slice(0, 10)); // Keep last 10 updates
      setShowNewUpdate(true);
      
      // Remove "new" flag after animation
      setTimeout(() => {
        setUpdates(prev => prev.map(u => ({ ...u, isNew: false })));
        setShowNewUpdate(false);
      }, 3000);
    }
  }, [latestPain, latestSleep, latestMood]);

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'pain_assessment':
        return Activity;
      case 'sleep_quality':
        return Moon;
      case 'mood_assessment':
        return Brain;
      default:
        return CheckCircle;
    }
  };

  const getUpdateColor = (type: string) => {
    switch (type) {
      case 'pain_assessment':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'sleep_quality':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'mood_assessment':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUpdateTitle = (type: string) => {
    switch (type) {
      case 'pain_assessment':
        return 'Pain Assessment Recorded';
      case 'sleep_quality':
        return 'Sleep Quality Logged';
      case 'mood_assessment':
        return 'Mood Assessment Updated';
      default:
        return 'Update Recorded';
    }
  };

  const renderUpdateContent = (update: LiveUpdate) => {
    switch (update.type) {
      case 'pain_assessment':
        const pain = update.data as PainAssessment;
        return (
          <div>
            <p className="font-medium text-gray-800">
              Level {pain.painLevel}/10 - {pain.location}
            </p>
            <p className="text-sm text-gray-600">{pain.quality}</p>
            {pain.triggers && (
              <p className="text-xs text-gray-500 mt-1">Triggers: {pain.triggers}</p>
            )}
          </div>
        );
      
      case 'sleep_quality':
        const sleep = update.data as SleepQuality;
        return (
          <div>
            <p className="font-medium text-gray-800">
              Quality {sleep.sleepQuality}/10 - {sleep.hoursSlept}h sleep
            </p>
            {sleep.wakeUps !== undefined && (
              <p className="text-sm text-gray-600">{sleep.wakeUps} wake-ups</p>
            )}
            {sleep.sleepFactors && (
              <p className="text-xs text-gray-500 mt-1">Factors: {sleep.sleepFactors}</p>
            )}
          </div>
        );
      
      case 'mood_assessment':
        const mood = update.data as MoodAssessment;
        return (
          <div>
            <p className="font-medium text-gray-800">
              Mood {mood.moodRating}/10, Energy {mood.energyLevel}/10
            </p>
            <p className="text-sm text-gray-600">
              Activities: {mood.dailyActivitiesCompletion}/10, Social: {mood.socialEngagement}/10
            </p>
            {mood.emotionalCoping && (
              <p className="text-xs text-gray-500 mt-1">Coping: {mood.emotionalCoping}</p>
            )}
          </div>
        );
      
      default:
        return <p>Update recorded</p>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Recent Updates</h3>
          <p className="text-sm text-gray-500">Live tracking from your therapy sessions</p>
        </div>
        
        {showNewUpdate && newUpdateMessage && (
          <div className="animate-pulse bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            ✨ {newUpdateMessage}
          </div>
        )}
      </div>

      {updates.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No updates yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Start a therapy session to begin tracking your health metrics
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {updates.map((update) => {
            const Icon = getUpdateIcon(update.type);
            const colorClasses = getUpdateColor(update.type);
            
            return (
              <div
                key={update.id}
                className={`
                  border rounded-lg p-4 transition-all duration-300
                  ${update.isNew 
                    ? 'animate-slideInRight border-l-4 shadow-md' 
                    : 'border-gray-200'
                  }
                  ${update.isNew ? colorClasses : 'bg-white'}
                `}
              >
                <div className="flex items-start space-x-3">
                  <div className={`
                    p-2 rounded-full flex-shrink-0
                    ${update.isNew 
                      ? 'bg-white shadow-sm' 
                      : 'bg-gray-100'
                    }
                  `}>
                    <Icon className={`w-4 h-4 ${
                      update.isNew 
                        ? update.type === 'pain_assessment' ? 'text-red-600' :
                          update.type === 'sleep_quality' ? 'text-blue-600' :
                          'text-green-600'
                        : 'text-gray-500'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`text-sm font-medium ${
                        update.isNew ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {getUpdateTitle(update.type)}
                      </h4>
                      <span className="text-xs text-gray-400">
                        {format(update.timestamp, 'HH:mm')}
                      </span>
                    </div>
                    
                    {renderUpdateContent(update)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Add custom animation to globals.css
const slideInRightKeyframes = `
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slideInRight {
  animation: slideInRight 0.5s ease-out;
}
`;
