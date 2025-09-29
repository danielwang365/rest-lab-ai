'use client';

import React from 'react';
import { Activity, Brain, Moon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { format } from 'date-fns';
import type { PainAssessment, SleepQuality, MoodAssessment } from '@/lib/tracking-types';

interface MetricCardsProps {
  latestPain?: PainAssessment;
  latestSleep?: SleepQuality;
  latestMood?: MoodAssessment;
  previousPain?: PainAssessment;
  previousSleep?: SleepQuality;
  previousMood?: MoodAssessment;
}

export function MetricCards({
  latestPain,
  latestSleep,
  latestMood,
  previousPain,
  previousSleep,
  previousMood,
}: MetricCardsProps) {
  
  const getTrendIcon = (current?: number, previous?: number) => {
    if (!current || !previous) return Minus;
    if (current > previous) return TrendingUp;
    if (current < previous) return TrendingDown;
    return Minus;
  };

  const getTrendColor = (current?: number, previous?: number, isInverted = false) => {
    if (!current || !previous) return 'text-gray-400';
    
    const isImproving = isInverted ? current < previous : current > previous;
    const isWorsening = isInverted ? current > previous : current < previous;
    
    if (isImproving) return 'text-green-500';
    if (isWorsening) return 'text-red-500';
    return 'text-gray-400';
  };

  const getTrendText = (current?: number, previous?: number, isInverted = false) => {
    if (!current || !previous) return 'No trend';
    
    const diff = Math.abs(current - previous);
    const isImproving = isInverted ? current < previous : current > previous;
    const isWorsening = isInverted ? current > previous : current < previous;
    
    if (isImproving) return `↑${diff} better`;
    if (isWorsening) return `↓${diff} worse`;
    return 'No change';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      
      {/* Pain Card */}
      <div className="bg-white rounded-xl shadow-lg border-l-4 border-red-500 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-full">
              <Activity className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Pain Level</h3>
              <p className="text-sm text-gray-500">Current assessment</p>
            </div>
          </div>
          
          {/* Trend Indicator */}
          <div className={`flex items-center space-x-1 ${getTrendColor(latestPain?.painLevel, previousPain?.painLevel, true)}`}>
            {React.createElement(getTrendIcon(latestPain?.painLevel, previousPain?.painLevel), { className: 'w-4 h-4' })}
            <span className="text-xs font-medium">
              {getTrendText(latestPain?.painLevel, previousPain?.painLevel, true)}
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-red-600">
              {latestPain?.painLevel || '-'}
            </span>
            <span className="text-xl text-gray-400">/10</span>
          </div>
          
          {latestPain && (
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Location:</span> {latestPain.location}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Quality:</span> {latestPain.quality}
              </p>
              {latestPain.triggers && (
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Triggers:</span> {latestPain.triggers}
                </p>
              )}
            </div>
          )}
        </div>
        
        {latestPain && (
          <div className="text-xs text-gray-400">
            Last updated: {format(latestPain.timestamp, 'MMM dd, HH:mm')}
          </div>
        )}
      </div>

      {/* Sleep Card */}
      <div className="bg-white rounded-xl shadow-lg border-l-4 border-blue-500 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Moon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Sleep Quality</h3>
              <p className="text-sm text-gray-500">Last night's rest</p>
            </div>
          </div>
          
          {/* Trend Indicator */}
          <div className={`flex items-center space-x-1 ${getTrendColor(latestSleep?.sleepQuality, previousSleep?.sleepQuality)}`}>
            {React.createElement(getTrendIcon(latestSleep?.sleepQuality, previousSleep?.sleepQuality), { className: 'w-4 h-4' })}
            <span className="text-xs font-medium">
              {getTrendText(latestSleep?.sleepQuality, previousSleep?.sleepQuality)}
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-blue-600">
              {latestSleep?.sleepQuality || '-'}
            </span>
            <span className="text-xl text-gray-400">/10</span>
          </div>
          
          {latestSleep && (
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Duration:</span> {latestSleep.hoursSlept}h
              </p>
              {latestSleep.wakeUps !== undefined && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Wake-ups:</span> {latestSleep.wakeUps}
                </p>
              )}
              {latestSleep.sleepFactors && (
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Factors:</span> {latestSleep.sleepFactors}
                </p>
              )}
            </div>
          )}
        </div>
        
        {latestSleep && (
          <div className="text-xs text-gray-400">
            Last updated: {format(latestSleep.timestamp, 'MMM dd, HH:mm')}
          </div>
        )}
      </div>

      {/* Mood Card */}
      <div className="bg-white rounded-xl shadow-lg border-l-4 border-green-500 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-full">
              <Brain className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Mood & Energy</h3>
              <p className="text-sm text-gray-500">Current wellbeing</p>
            </div>
          </div>
          
          {/* Trend Indicator */}
          <div className={`flex items-center space-x-1 ${getTrendColor(latestMood?.moodRating, previousMood?.moodRating)}`}>
            {React.createElement(getTrendIcon(latestMood?.moodRating, previousMood?.moodRating), { className: 'w-4 h-4' })}
            <span className="text-xs font-medium">
              {getTrendText(latestMood?.moodRating, previousMood?.moodRating)}
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-green-600">
              {latestMood?.moodRating || '-'}
            </span>
            <span className="text-xl text-gray-400">/10</span>
          </div>
          
          {latestMood && (
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Energy:</span> {latestMood.energyLevel}/10
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Activities:</span> {latestMood.dailyActivitiesCompletion}/10
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Social:</span> {latestMood.socialEngagement}/10
              </p>
              {latestMood.emotionalCoping && (
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Coping:</span> {latestMood.emotionalCoping}
                </p>
              )}
            </div>
          )}
        </div>
        
        {latestMood && (
          <div className="text-xs text-gray-400">
            Last updated: {format(latestMood.timestamp, 'MMM dd, HH:mm')}
          </div>
        )}
      </div>
    </div>
  );
}
