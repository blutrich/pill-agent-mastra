export type ClimbingGrade = {
  level: string;
  description: string;
  typicalCharacteristics: string[];
};

export type WarmUpProtocol = {
  general: {
    duration: number;
    activities: string[];
  };
  specific: {
    pullUps: {
      sets: number;
      reps: number;
    };
    hangs: {
      sets: number;
      duration: number;
      edgeSize: number;
    };
    boulderProblems: number;
  };
};

export type PhysicalTest = {
  name: string;
  result: number;
  ratio: number;
  notes?: string;
  equipment: string[];
  protocol: string[];
  commonErrors: string[];
};

export interface AssessmentResult {
  date: string;
  time: string;
  sleepQuality: number;
  energyLevel: number;
  physicalIssues: string[] | undefined;
  testingConditions: string;
  fitnessScore: number;
  focusAreas: string[];
  warmUp: {
    general: {
      duration: number;
      activities: string[];
    };
    specific: {
      pullUps: {
        sets: number;
        reps: number;
      };
      hangs: {
        sets: number;
        duration: number;
        edgeSize: number;
      };
      boulderProblems: number;
    };
  };
  physicalTests: {
    fingerStrength: {
      bodyWeight: number;
      addedWeight: number;
      totalWeight: number;
      ratio: number;
      equipment: string[];
      protocol: string[];
      commonErrors: string[];
    };
    pullUps: {
      name: string;
      result: number;
      ratio: number;
      notes: string;
      equipment: string[];
      protocol: string[];
      commonErrors: string[];
    };
    toeToBar: {
      name: string;
      result: number;
      ratio: number;
      notes: string;
      equipment: string[];
      protocol: string[];
      commonErrors: string[];
    };
    pushUps: {
      name: string;
      result: number;
      ratio: number;
      notes: string;
      equipment: string[];
      protocol: string[];
      commonErrors: string[];
    };
    legFlexibility: {
      distance: number;
      ratio: number;
      equipment: string[];
      protocol: string[];
      commonErrors: string[];
    };
  };
  boulderGrade: {
    attemptedGrade: string;
    problemsAttempted: number;
    problemsCompleted: number;
    successRate: number;
    determinedGrade: string;
    protocol: string[];
  };
  safety: {
    stopped: boolean;
    notes: string[];
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

export type TrainingPlan = {
  weeklySchedule: {
    day: string;
    focus: string;
    exercises: {
      name: string;
      sets: number;
      reps: string;
      notes: string;
    }[];
  }[];
  progression: {
    currentPhase: string;
    nextMilestone: string;
    estimatedTimeToNext: string;
  };
};

export interface PerformanceMetrics {
  fingerStrength: {
    raw: number;
    normalized: number;
  };
  pullUps: {
    raw: number;
    normalized: number;
  };
  toeToBar: {
    raw: number;
    normalized: number;
  };
  pushUps: {
    raw: number;
    normalized: number;
  };
  legSpread: {
    raw: number;
    normalized: number;
  };
  legFlexibility: {
    raw: number;
    normalized: number;
  };
  bodyWeight: number;
  height: number;
}

export interface PerformanceResult {
  compositeScore: number;
  predictedGrade: string;
  gradeRange: {
    min: number;
    max: number;
  };
  metrics: PerformanceMetrics;
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  trainingPlan: {
    fingerboard: {
      objective: string;
      training: string;
      rest: string;
      difficulty: number;
    };
    generalFitness: {
      objective: string;
      training: string;
      difficulty: number;
    };
    boulderingProjects: {
      objective: string;
      training: string;
      difficulty: number;
    };
    boulderFlash: {
      objective: string;
      training: string;
      difficulty: number;
    };
    boulderTech: {
      objective: string;
      training: string;
      difficulty: number;
    };
    aerobicCapacity: {
      objective: string;
      training: string;
      difficulty: number;
    };
  };
}

export interface InjuryRiskFactors {
  fingerInjury: number;
  shoulderInjury: number;
  elbowInjury: number;
  wristInjury: number;
  backInjury: number;
}

export interface InjuryPreventionResult {
  riskScore: number;
  riskCategory: 'low' | 'medium' | 'high';
  probabilities: InjuryRiskFactors;
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  modificationPlan: {
    training: {
      volume: string;
      intensity: string;
      technique: string;
    };
    recovery: {
      rest: string;
      nutrition: string;
      mobility: string;
    };
    prevention: {
      warmup: string;
      cooldown: string;
      exercises: string[];
    };
  };
} 