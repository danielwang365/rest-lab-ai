// Simple tracking data types for the therapist agent

export interface PainAssessment {
  id: string;
  timestamp: Date;
  painLevel: number;
  location: string;
  quality: string;
  triggers?: string;
  copingStrategies?: string;
}

export interface SleepQuality {
  id: string;
  timestamp: Date;
  sleepQuality: number;
  hoursSlept: number;
  sleepOnsetMinutes?: number;
  wakeUps?: number;
  sleepFactors?: string;
}

export interface MoodAssessment {
  id: string;
  timestamp: Date;
  moodRating: number;
  energyLevel: number;
  dailyActivitiesCompletion: number;
  socialEngagement: number;
  emotionalCoping?: string;
}

export interface TrackingData {
  painAssessments: PainAssessment[];
  sleepQuality: SleepQuality[];
  moodAssessments: MoodAssessment[];
}

export interface AgentTrackingMessage {
  type: 'pain_assessment' | 'sleep_quality' | 'mood_assessment';
  data: any;
}
