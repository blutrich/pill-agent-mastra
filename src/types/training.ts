export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  intensity: number;
  rest: number;
  notes?: string;
}

export interface TrainingSession {
  type: string;
  exercises: Exercise[];
  duration: number;
  intensity: number;
  focus: string;
}

export interface TrainingDay {
  isRest: boolean;
  sessions: TrainingSession[];
}

export interface TrainingWeek {
  weekNumber: number;
  focus: string;
  days: TrainingDay[];
}

export interface TrainingPlan {
  weeks: TrainingWeek[];
  summary: {
    totalWeeks: number;
    totalSessions: number;
    focusAreas: string[];
    progression: {
      volume: number[];
      intensity: number[];
    };
  };
  recommendations: {
    warmup: string;
    cooldown: string;
    nutrition: string;
    recovery: string;
    modifications: string[];
  };
}

export interface ClimberProfile {
  level: string;
  experience: number;
  goals: string;
  injuries: string;
  bodyWeight: number;
  height: number;
  sleepQuality: number;
  energyLevel: number;
  trainingDays: number;
  preferredTrainingTimes: string[];
  availableEquipment: string[];
  previousInjuries?: string[];
  currentLimitations?: string[];
  availableDays: boolean[];
  sessionLength: number;
  hasEquipment: (equipment: string) => boolean;
}

export interface GAConfig {
  populationSize: number;
  maxGenerations: number;
  mutationRate: number;
  crossoverRate: number;
  elitismCount: number;
  fitnessThreshold: number;
  maxGenerationsWithoutImprovement: number;
  maxExecutionTimeMs: number;
  loggingEnabled: boolean;
  adaptiveOptimization: boolean;
}

export interface ExerciseFactory {
  createExercise: (name: string, sets: number, reps: number, intensity: number, rest: number, notes?: string) => Exercise;
  createSession: (type: string, exercises: Exercise[], duration: number, intensity: number, focus: string) => TrainingSession;
  createDay: (isRest: boolean, sessions: TrainingSession[]) => TrainingDay;
  createWeek: (weekNumber: number, focus: string, days: TrainingDay[]) => TrainingWeek;
  createWarmup: (options?: any) => TrainingSession;
  createFingerboard: (options?: any) => TrainingSession;
  createBoulderProject: (options?: any) => TrainingSession;
  createBoulderFlash: (options?: any) => TrainingSession;
  createTechnicalBoulder: (options?: any) => TrainingSession;
  createGeneralFitness: (options?: any) => TrainingSession;
  createEndurance: (options?: any) => TrainingSession;
  createAssessment: (options?: any) => TrainingSession;
}

export interface ProgressionCalculator {
  calculateVolumeProgression: () => number[];
  calculateIntensityProgression: () => number[];
  calculateProgressiveOverload: (weekNumber: number) => {
    fingerboard: { sets: number; intensity: number };
    projects: { moveCount: number; intensity: number };
    volume: { multiplier: number };
  };
} 