// Fix: Import TranslationKey to resolve type error.
import { TranslationKey } from './i18n';

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
}

export interface Reflection {
  date: string;
  entry: string;
  feedback?: string; // Optional since AI is being removed
}

export interface Tracker {
  id: string;
  name: string;
  startDate: string;
  dailyCost: number;
  addictionType: string;
  isActive: boolean;
}

export interface Challenge {
  id: string;
  text: string;
  completed: boolean;
  points: number;
  category: 'health' | 'mind' | 'social';
}

export enum Mood {
  Great = 'great',
  Good = 'good',
  Okay = 'okay',
  Bad = 'bad',
  Awful = 'awful',
}

export interface MoodLog {
  date: string;
  mood: Mood;
}

export interface Habit {
  id:string;
  name: string;
  completedDates: string[];
}

export type AchievementID = 
  | 'oneDay' 
  | 'oneWeek' 
  | 'thirtyDays' 
  | 'ninetyDays'
  | 'oneYear'
  | 'oneGoal' 
  | 'tenGoals' 
  | '25Goals'
  | 'firstReflection'
  | 'moodStreak';

export interface Achievement {
  id: AchievementID;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  check: (sobrietyDays: number, goalsCompleted: number, reflections?: number, moodStreak?: number) => boolean;
}

export interface CravingLog {
  id: string;
  date: string;
  time: string;
  intensity: number; // 1 to 10
  trigger: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood?: Mood;
}

export type Theme = 'light' | 'dark' | 'system';