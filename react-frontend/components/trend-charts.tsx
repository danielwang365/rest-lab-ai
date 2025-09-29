'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import type { TrackingData } from '@/lib/tracking-types';

interface TrendChartsProps {
  trackingData: TrackingData;
  selectedPeriod: '7d' | '30d' | '90d';
}

export function TrendCharts({ trackingData, selectedPeriod }: TrendChartsProps) {
  
  // Prepare chart data
  const prepareChartData = () => {
    const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90;
    const chartData = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i));
      const dateStr = format(date, 'MM/dd');
      const fullDate = format(date, 'MMM dd, yyyy');
      
      // Find entries for this day
      const dayPain = trackingData.painAssessments.filter(
        p => format(new Date(p.timestamp), 'MM/dd') === dateStr
      );
      const daySleep = trackingData.sleepQuality.filter(
        s => format(new Date(s.timestamp), 'MM/dd') === dateStr
      );
      const dayMood = trackingData.moodAssessments.filter(
        m => format(new Date(m.timestamp), 'MM/dd') === dateStr
      );
      
      // Calculate averages for the day
      const avgPain = dayPain.length > 0 
        ? dayPain.reduce((sum, p) => sum + p.painLevel, 0) / dayPain.length 
        : null;
      const avgSleep = daySleep.length > 0 
        ? daySleep.reduce((sum, s) => sum + s.sleepQuality, 0) / daySleep.length 
        : null;
      const avgMood = dayMood.length > 0 
        ? dayMood.reduce((sum, m) => sum + m.moodRating, 0) / dayMood.length 
        : null;
      
      chartData.push({
        date: dateStr,
        fullDate,
        pain: avgPain ? Math.round(avgPain * 10) / 10 : null,
        sleep: avgSleep ? Math.round(avgSleep * 10) / 10 : null,
        mood: avgMood ? Math.round(avgMood * 10) / 10 : null,
        painCount: dayPain.length,
        sleepCount: daySleep.length,
        moodCount: dayMood.length,
      });
    }
    
    return chartData;
  };

  const chartData = prepareChartData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800 mb-2">{data.fullDate}</p>
          {payload.map((entry: any, index: number) => {
            if (entry.value === null) return null;
            
            const colors = {
              pain: '#ef4444',
              sleep: '#3b82f6',
              mood: '#10b981'
            };
            
            const labels = {
              pain: 'Pain Level',
              sleep: 'Sleep Quality',
              mood: 'Mood Rating'
            };
            
            return (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: colors[entry.dataKey as keyof typeof colors] }}
                />
                <span className="text-sm text-gray-600">
                  {labels[entry.dataKey as keyof typeof labels]}: {entry.value}/10
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Health Trends</h3>
          <p className="text-sm text-gray-500">Track your progress over time</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Legend */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Pain</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Sleep</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Mood</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="date" 
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              domain={[0, 10]} 
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Pain Line */}
            <Line
              type="monotone"
              dataKey="pain"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: '#ef4444', strokeWidth: 2 }}
              connectNulls={false}
            />
            
            {/* Sleep Line */}
            <Line
              type="monotone"
              dataKey="sleep"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 2 }}
              connectNulls={false}
            />
            
            {/* Mood Line */}
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: '#10b981', strokeWidth: 2 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {trackingData.painAssessments.length}
          </div>
          <div className="text-sm text-gray-500">Pain assessments</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {trackingData.sleepQuality.length}
          </div>
          <div className="text-sm text-gray-500">Sleep entries</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {trackingData.moodAssessments.length}
          </div>
          <div className="text-sm text-gray-500">Mood assessments</div>
        </div>
      </div>
    </div>
  );
}
