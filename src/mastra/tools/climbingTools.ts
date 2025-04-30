import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import type { AssessmentResult, PerformanceResult, InjuryPreventionResult, InjuryRiskFactors } from "../../types/climbing";
import type { ClimberProfile, TrainingPlan, TrainingWeek, TrainingDay, TrainingSession, Exercise } from "../../types/training";
import { ClimbingExerciseFactory, ClimbingProgressionCalculator, OptimizedSixWeekCycle } from "../../utils/trainingUtils";

// Assessment Tool
export const climbingAssessment = createTool({
  id: "climbingAssessment",
  description: "Performs a comprehensive climbing assessment following the ClimbingPill protocol",
  inputSchema: z.object({
    climberLevel: z.string(),
    experience: z.number(),
    goals: z.string(),
    injuries: z.array(z.string()).optional(),
    bodyWeight: z.number(),
    height: z.number(),
    sleepQuality: z.number().min(1).max(10),
    energyLevel: z.number().min(1).max(10),
    testingConditions: z.string(),
    preferences: z.object({
      preferredClimbingStyle: z.enum(['bouldering', 'sport', 'trad', 'mixed']),
      preferredTrainingTimes: z.array(z.string()),
      availableEquipment: z.array(z.string()),
      trainingDaysPerWeek: z.number().min(1).max(7),
      sessionDuration: z.number().min(30).max(240),
      previousInjuries: z.array(z.string()).optional(),
      currentLimitations: z.array(z.string()).optional(),
      dietaryRestrictions: z.array(z.string()).optional(),
      sleepSchedule: z.object({
        averageHours: z.number().min(4).max(12),
        quality: z.number().min(1).max(10),
        consistency: z.number().min(1).max(10),
      }),
      recoveryPractices: z.array(z.string()).optional(),
      stressLevel: z.number().min(1).max(10),
      workLifeBalance: z.number().min(1).max(10),
    }),
    metrics: z.object({
      fingerStrength: z.object({
        maxHang: z.number(),
        edgeSize: z.number(),
        duration: z.number(),
      }),
      pullUps: z.number(),
      toeToBar: z.number(),
      pushUps: z.number(),
      legSpread: z.number(),
      coreStrength: z.number().min(1).max(10),
      flexibility: z.object({
        shoulders: z.number().min(1).max(10),
        hips: z.number().min(1).max(10),
        hamstrings: z.number().min(1).max(10),
      }),
      endurance: z.object({
        boulder: z.number().min(1).max(10),
        route: z.number().min(1).max(10),
      }),
      technique: z.object({
        footwork: z.number().min(1).max(10),
        bodyPosition: z.number().min(1).max(10),
        movementEfficiency: z.number().min(1).max(10),
      }),
    }),
  }),
  execute: async ({ context }) => {
    const {
      climberLevel,
      experience,
      goals,
      injuries,
      bodyWeight,
      height,
      sleepQuality,
      energyLevel,
      testingConditions,
      preferences,
      metrics,
    } = context;

    // Calculate overall fitness score
    const fitnessScore = calculateFitnessScore(metrics, bodyWeight, height);

    // Determine training focus areas
    const focusAreas = determineFocusAreas(metrics, goals);

    // Generate personalized recommendations
    const recommendations = generateRecommendations(metrics, preferences, injuries);

    // Create assessment result
    const assessment: AssessmentResult = {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toISOString().split('T')[1].split('.')[0],
      sleepQuality,
      energyLevel,
      physicalIssues: injuries,
      testingConditions,
      fitnessScore,
      focusAreas,
      
      warmUp: {
        general: {
          duration: 15,
          activities: [
            "Light jogging or jumping rope",
            "Arm circles and shoulder mobility",
            "Wrist and finger mobility"
          ]
        },
        specific: {
          pullUps: {
            sets: 3,
            reps: 2
          },
          hangs: {
            sets: 3,
            duration: 5,
            edgeSize: 20
          },
          boulderProblems: 5
        }
      },
      
      physicalTests: {
        fingerStrength: {
          bodyWeight,
          addedWeight: metrics.fingerStrength.maxHang - bodyWeight,
          totalWeight: metrics.fingerStrength.maxHang,
          ratio: metrics.fingerStrength.maxHang / bodyWeight,
          equipment: [
            `${metrics.fingerStrength.edgeSize}mm edge hangboard`,
            "Weight vest/belt",
            "Additional weights",
            "Timer"
          ],
          protocol: [
            "Start with body weight",
            "Add weight in 2.5kg increments",
            "Goal: Find weight for 10-second hang",
            "Rest 3-5 minutes between attempts",
            "Stop when you can't complete 10 seconds"
          ],
          commonErrors: [
            "Not warming up enough",
            "Adding weight too quickly",
            "Inconsistent hand position",
            "Not timing accurately"
          ]
        },
        pullUps: {
          name: "Maximum Pull-Ups",
          result: metrics.pullUps,
          ratio: metrics.pullUps / bodyWeight,
          notes: "Start from dead hang, pull chin over bar, return to dead hang",
          equipment: ["Pull-up bar", "Counter/spotter"],
          protocol: [
            "Start from dead hang",
            "Pull chin over bar",
            "Return to dead hang",
            "Continue until failure",
            "Only count full range reps"
          ],
          commonErrors: [
            "Incomplete range of motion",
            "Too fast execution",
            "Not maintaining form",
            "Counting partial reps"
          ]
        },
        toeToBar: {
          name: "Maximum Toe-to-Bar",
          result: metrics.toeToBar,
          ratio: metrics.toeToBar / bodyWeight,
          notes: "Hang from bar, touch toes to bar, return to start",
          equipment: ["Pull-up bar", "Counter/spotter"],
          protocol: [
            "Hang from bar",
            "Touch toes to bar",
            "Return to start",
            "Continue until failure",
            "Only count full touches"
          ],
          commonErrors: [
            "Swinging for momentum",
            "Partial touches",
            "Not returning to dead hang",
            "Using momentum"
          ]
        },
        pushUps: {
          name: "Maximum Push-Ups",
          result: metrics.pushUps,
          ratio: metrics.pushUps / bodyWeight,
          notes: "Start in plank position, lower chest to ground, push back up",
          equipment: ["Flat surface", "Counter/spotter"],
          protocol: [
            "Start in plank position",
            "Lower chest to ground",
            "Push back up",
            "Continue until failure",
            "Only count full range reps"
          ],
          commonErrors: [
            "Incomplete range of motion",
            "Too fast execution",
            "Not maintaining form",
            "Counting partial reps"
          ]
        },
        legFlexibility: {
          distance: metrics.legSpread,
          ratio: metrics.legSpread / height,
          equipment: ["Measuring tape", "Flat wall", "Yoga mat"],
          protocol: [
            "Face wall",
            "Slide into side splits",
            "Keep hips square",
            "Measure distance between crotch and ground"
          ],
          commonErrors: [
            "Not keeping hips square",
            "Forcing the position",
            "Inaccurate measurement",
            "Not warming up properly"
          ]
        }
      },
      
      boulderGrade: {
        attemptedGrade: climberLevel,
        problemsAttempted: 10,
        problemsCompleted: 0,
        successRate: 0,
        determinedGrade: climberLevel,
        protocol: [
          "After physical tests, rest 30 minutes",
          "Start 3 grades below expected level",
          "Try 10 different boulders",
          "Record success rate",
          "Move up or down grades until you find level where you can complete 8/10 problems"
        ]
      },
      
      safety: {
        stopped: false,
        notes: [
          "Quality over quantity",
          "Rest between tests",
          "Stay hydrated",
          "Don't max out if injured",
          "Record all details"
        ]
      },
      
      recommendations: {
        immediate: [
          "Complete the full assessment protocol",
          "Record all measurements accurately",
          "Calculate ratios and success rates",
        ],
        shortTerm: [
          "Focus on areas with lowest ratios",
          "Work on technique for boulder problems",
          "Develop a consistent training schedule",
        ],
        longTerm: [
          "Set specific grade goals",
          "Track progress and adjust training accordingly",
          "Regular reassessment every 6 weeks",
        ],
      },
    };

    return assessment;
  },
});

// Helper functions
function calculateFitnessScore(metrics: any, bodyWeight: number, height: number): number {
  // Calculate normalized scores for each metric
  const normalizedScores = {
    fingerStrength: metrics.fingerStrength.maxHang / bodyWeight,
    pullUps: metrics.pullUps / bodyWeight,
    toeToBar: metrics.toeToBar / bodyWeight,
    pushUps: metrics.pushUps / bodyWeight,
    legSpread: metrics.legSpread / height,
    coreStrength: metrics.coreStrength / 10,
    flexibility: (metrics.flexibility.shoulders + metrics.flexibility.hips + metrics.flexibility.hamstrings) / 30,
    endurance: (metrics.endurance.boulder + metrics.endurance.route) / 20,
    technique: (metrics.technique.footwork + metrics.technique.bodyPosition + metrics.technique.movementEfficiency) / 30,
  };

  // Calculate weighted average
  const weights = {
    fingerStrength: 0.25,
    pullUps: 0.15,
    toeToBar: 0.10,
    pushUps: 0.10,
    legSpread: 0.05,
    coreStrength: 0.10,
    flexibility: 0.05,
    endurance: 0.10,
    technique: 0.10,
  };

  return Object.entries(normalizedScores).reduce(
    (score, [key, value]) => score + value * weights[key as keyof typeof weights],
    0
  );
}

function determineFocusAreas(metrics: any, goals: string): string[] {
  const focusAreas: string[] = [];
  const thresholds = {
    fingerStrength: 1.5,
    pullUps: 0.1,
    toeToBar: 0.08,
    pushUps: 0.15,
    legSpread: 0.8,
    coreStrength: 7,
    flexibility: 0.7,
    endurance: 0.7,
    technique: 0.7,
  };

  // Check each metric against thresholds
  if (metrics.fingerStrength.maxHang / metrics.bodyWeight < thresholds.fingerStrength) {
    focusAreas.push('Finger Strength');
  }
  if (metrics.pullUps / metrics.bodyWeight < thresholds.pullUps) {
    focusAreas.push('Upper Body Strength');
  }
  if (metrics.toeToBar / metrics.bodyWeight < thresholds.toeToBar) {
    focusAreas.push('Core Strength');
  }
  if (metrics.pushUps / metrics.bodyWeight < thresholds.pushUps) {
    focusAreas.push('Pushing Strength');
  }
  if (metrics.legSpread / metrics.height < thresholds.legSpread) {
    focusAreas.push('Flexibility');
  }
  if (metrics.coreStrength < thresholds.coreStrength) {
    focusAreas.push('Core Stability');
  }
  if ((metrics.flexibility.shoulders + metrics.flexibility.hips + metrics.flexibility.hamstrings) / 3 < thresholds.flexibility) {
    focusAreas.push('Mobility');
  }
  if ((metrics.endurance.boulder + metrics.endurance.route) / 2 < thresholds.endurance) {
    focusAreas.push('Endurance');
  }
  if ((metrics.technique.footwork + metrics.technique.bodyPosition + metrics.technique.movementEfficiency) / 3 < thresholds.technique) {
    focusAreas.push('Technique');
  }

  // Add goal-specific focus areas
  if (goals.toLowerCase().includes('strength')) {
    focusAreas.push('Strength Development');
  }
  if (goals.toLowerCase().includes('endurance')) {
    focusAreas.push('Endurance Training');
  }
  if (goals.toLowerCase().includes('technique')) {
    focusAreas.push('Technical Skills');
  }

  return [...new Set(focusAreas)]; // Remove duplicates
}

function generateRecommendations(metrics: any, preferences: any, injuries: string[] | undefined): string[] {
  const recommendations: string[] = [];

  // Add injury-specific recommendations
  if (injuries && injuries.length > 0) {
    recommendations.push(
      "Focus on injury prevention and rehabilitation",
      "Modify exercises to avoid aggravating injuries",
      "Include specific rehabilitation exercises"
    );
  }

  // Add preference-based recommendations
  if (preferences.preferredClimbingStyle === 'bouldering') {
    recommendations.push(
      "Focus on power and strength development",
      "Include more boulder-specific training"
    );
  } else if (preferences.preferredClimbingStyle === 'sport') {
    recommendations.push(
      "Focus on endurance and route-specific training",
      "Include more endurance work"
    );
  }

  // Add recovery recommendations based on sleep and stress
  if (preferences.sleepSchedule.quality < 7) {
    recommendations.push(
      "Improve sleep quality and consistency",
      "Consider sleep hygiene practices"
    );
  }
  if (preferences.stressLevel > 7) {
    recommendations.push(
      "Include stress management techniques",
      "Focus on recovery and relaxation"
    );
  }

  return recommendations;
}

// Performance Calculation Tool
export const calculatePerformance = createTool({
  id: "calculatePerformance",
  description: "Calculates climbing performance metrics and predicts grade",
  inputSchema: z.object({
    fingerStrength: z.number(),
    pullUps: z.number(),
    toeToBar: z.number(),
    pushUps: z.number(),
    legSpread: z.number(),
    bodyWeight: z.number(),
    height: z.number(),
  }),
  execute: async ({ context }) => {
    const {
      fingerStrength,
      pullUps,
      toeToBar,
      pushUps,
      legSpread,
      bodyWeight,
      height,
    } = context;

    // Normalize metrics
    const metrics = {
      fingerStrength: {
        raw: fingerStrength,
        normalized: (fingerStrength + bodyWeight) / bodyWeight,
      },
      pullUps: {
        raw: pullUps,
        normalized: pullUps / bodyWeight,
      },
      toeToBar: {
        raw: toeToBar,
        normalized: toeToBar / bodyWeight,
      },
      pushUps: {
        raw: pushUps,
        normalized: pushUps / bodyWeight,
      },
      legSpread: {
        raw: legSpread,
        normalized: legSpread / height,
      },
      bodyWeight,
      height,
    };

    // Calculate composite score
    const compositeScore = 
      (0.45 * metrics.fingerStrength.normalized) +
      (0.20 * metrics.pullUps.normalized) +
      (0.10 * metrics.pushUps.normalized) +
      (0.15 * metrics.toeToBar.normalized) +
      (0.10 * metrics.legSpread.normalized);

    // Determine grade based on composite score
    let predictedGrade = "V4";
    let gradeRange = { min: 0, max: 0.65 };

    if (compositeScore > 1.45) {
      predictedGrade = "V12";
      gradeRange = { min: 1.45, max: Infinity };
    } else if (compositeScore >= 1.3) {
      predictedGrade = "V11";
      gradeRange = { min: 1.3, max: 1.45 };
    } else if (compositeScore >= 1.15) {
      predictedGrade = "V10";
      gradeRange = { min: 1.15, max: 1.3 };
    } else if (compositeScore >= 1.05) {
      predictedGrade = "V9";
      gradeRange = { min: 1.05, max: 1.15 };
    } else if (compositeScore >= 0.95) {
      predictedGrade = "V8";
      gradeRange = { min: 0.95, max: 1.05 };
    } else if (compositeScore >= 0.85) {
      predictedGrade = "V7";
      gradeRange = { min: 0.85, max: 0.95 };
    } else if (compositeScore >= 0.75) {
      predictedGrade = "V6";
      gradeRange = { min: 0.75, max: 0.85 };
    } else if (compositeScore >= 0.65) {
      predictedGrade = "V5";
      gradeRange = { min: 0.65, max: 0.75 };
    }

    const result: PerformanceResult = {
      compositeScore,
      predictedGrade,
      gradeRange,
      metrics,
      recommendations: {
        immediate: [
          "Focus on areas with lowest normalized scores",
          "Start with proper warm-up routines",
          "Maintain consistent training schedule",
        ],
        shortTerm: [
          "Work on specific weaknesses identified in metrics",
          "Follow the training plan below",
          "Track progress weekly",
        ],
        longTerm: [
          "Aim for next grade level",
          "Regular reassessment every 6 weeks",
          "Adjust training based on progress",
        ],
      },
      trainingPlan: {
        fingerboard: {
          objective: "Strengthen finger muscles",
          training: "Hang until 2 seconds before failure after about 10 seconds",
          rest: "2-3 minutes between sets",
          difficulty: 9,
        },
        generalFitness: {
          objective: "Increase specific strength for climbing",
          training: "Exercises at 8/10 difficulty",
          difficulty: 8,
        },
        boulderingProjects: {
          objective: "Strengthen and improve motor learning",
          training: "Execute 2-4 consecutive moves",
          difficulty: 9,
        },
        boulderFlash: {
          objective: "Enhance planning and execution",
          training: "2-3 tries to analyze moves after initial failure",
          difficulty: 7,
        },
        boulderTech: {
          objective: "Improve technique and aerobic capacity",
          training: "Solve easy routes in 2-3 different ways",
          difficulty: 5,
        },
        aerobicCapacity: {
          objective: "Improve recovery and reduce injury risk",
          training: "Long sets (3 min climbing, 3 min rest)",
          difficulty: 4,
        },
      },
    };

    return result;
  },
});

// Injury Prevention Tool
export const injuryPrevention = createTool({
  id: "injuryPrevention",
  description: "Assesses injury risk and provides prevention recommendations for climbers",
  inputSchema: z.object({
    gender: z.enum(['female', 'male', 'non-binary']),
    age: z.number(),
    experience: z.number(),
    climbingStyle: z.enum(['bouldering', 'sport', 'trad']),
    crimpGripUsage: z.enum(['never', 'rarely', 'sometimes', 'often']),
    nutrition: z.enum(['balanced', 'low-calorie', 'unstructured']),
    recoveryPractice: z.boolean(),
    previousInjury: z.boolean(),
    trainingVolume: z.number(),
    trainingIntensity: z.number().min(1).max(10),
  }),
  execute: async ({ context }) => {
    const {
      gender,
      age,
      experience,
      climbingStyle,
      crimpGripUsage,
      nutrition,
      recoveryPractice,
      previousInjury,
      trainingVolume,
      trainingIntensity,
    } = context;

    // Calculate risk score
    let riskScore = 0;

    // Gender risk
    riskScore += gender === 'female' ? 2 : gender === 'male' ? 3 : 2;

    // Age risk
    riskScore += age < 20 ? 1 : age > 40 ? 1 : 0;

    // Experience risk
    riskScore += experience < 3 ? 2 : experience > 10 ? 1 : 0;

    // Climbing style risk
    riskScore += climbingStyle === 'bouldering' ? 3 : climbingStyle === 'sport' ? 2 : 1;

    // Crimp grip risk
    riskScore += crimpGripUsage === 'never' ? 0 : 
                 crimpGripUsage === 'rarely' ? 1 :
                 crimpGripUsage === 'sometimes' ? 2 : 4;

    // Nutrition risk
    riskScore += nutrition === 'balanced' ? 0 : 3;

    // Recovery risk
    riskScore += recoveryPractice ? 0 : 4;

    // Previous injury risk
    riskScore += previousInjury ? 3 : 0;

    // Training volume risk
    riskScore += trainingVolume <= 5 ? 0 : trainingVolume <= 10 ? 1 : 2;

    // Training intensity risk
    riskScore += trainingIntensity * 0.5;

    // Normalize risk score
    const normalizedRisk = Math.min(riskScore / 3, 10);
    const riskCategory = normalizedRisk <= 4 ? 'low' : normalizedRisk <= 7 ? 'medium' : 'high';

    // Calculate injury probabilities
    const probabilities = {
      fingerInjury: 10 + (gender === 'male' ? 5 : 0) + (crimpGripUsage === 'often' ? 8 : 0) + (climbingStyle === 'bouldering' ? 3 : 0),
      shoulderInjury: 8 + (gender === 'female' ? 5 : 0) + (!recoveryPractice ? 3 : 0),
      elbowInjury: 5 + (trainingIntensity > 7 ? 3 : 0) + (trainingVolume > 10 ? 2 : 0),
      wristInjury: 4 + (crimpGripUsage === 'often' ? 4 : 0) + (climbingStyle === 'bouldering' ? 2 : 0),
      backInjury: 3 + (age > 40 ? 2 : 0) + (!recoveryPractice ? 3 : 0),
    };

    const result: InjuryPreventionResult = {
      riskScore: normalizedRisk,
      riskCategory,
      probabilities,
      recommendations: {
        immediate: [
          "Implement proper warm-up routine before each session",
          "Focus on technique over intensity",
          "Ensure adequate rest between sessions",
        ],
        shortTerm: [
          "Adjust training volume based on recovery",
          "Incorporate injury prevention exercises",
          "Monitor and address any pain or discomfort",
        ],
        longTerm: [
          "Develop a balanced training program",
          "Build strength gradually",
          "Maintain consistent recovery practices",
        ],
      },
      modificationPlan: {
        training: {
          volume: `Adjust weekly volume to ${trainingVolume <= 5 ? 'maintain' : 'reduce'} current levels`,
          intensity: `Keep intensity at ${trainingIntensity <= 7 ? 'current' : 'reduced'} levels`,
          technique: "Focus on open hand grips and proper body positioning",
        },
        recovery: {
          rest: "Implement 48-hour rest between intense sessions",
          nutrition: "Ensure adequate protein and hydration",
          mobility: "Include daily mobility exercises",
        },
        prevention: {
          warmup: "15-minute dynamic warm-up before climbing",
          cooldown: "10-minute cool-down with stretching",
          exercises: [
            "Finger extensor exercises",
            "Shoulder stability work",
            "Core strengthening",
            "Hip mobility drills",
          ],
        },
      },
    };

    return result;
  },
});

// Training Plan Generator Tool
export const generateTrainingPlan = createTool({
  id: "generateTrainingPlan",
  description: "Generates an optimized 6-week climbing training plan using genetic algorithm optimization",
  inputSchema: z.object({
    climberProfile: z.object({
      level: z.string(),
      experience: z.number(),
      goals: z.string(),
      injuries: z.string(),
      bodyWeight: z.number(),
      height: z.number(),
      sleepQuality: z.number().min(1).max(10),
      energyLevel: z.number().min(1).max(10),
      trainingDays: z.number().min(1).max(7),
      preferredTrainingTimes: z.array(z.string()),
      availableEquipment: z.array(z.string()),
      previousInjuries: z.array(z.string()).optional(),
      currentLimitations: z.array(z.string()).optional(),
    }),
  }),
  execute: async ({ context }) => {
    const { climberProfile } = context;

    // Create a complete climber profile with all required fields
    const completeProfile: ClimberProfile = {
      ...climberProfile,
      availableDays: Array(7).fill(false).map((_, i) => i < climberProfile.trainingDays),
      sessionLength: 120, // 2 hours per session
      hasEquipment: (equipment: string) => climberProfile.availableEquipment.includes(equipment),
    };

    // Create exercise factory and progression calculator
    const exerciseFactory = new ClimbingExerciseFactory(completeProfile);
    const progression = new ClimbingProgressionCalculator(completeProfile);

    // Create the 6-week cycle generator with default configuration
    const cycleGenerator = new OptimizedSixWeekCycle(completeProfile);
    
    // Generate the full cycle
    const cycle = cycleGenerator.generateFullCycle();

    // Convert to structured output
    const trainingPlan = {
      weeks: cycle.weeks.map((week: TrainingWeek, index: number) => ({
        weekNumber: index + 1,
        focus: week.focus,
        days: week.days.map((day: TrainingDay) => ({
          isRest: day.isRest,
          sessions: day.sessions.map((session: TrainingSession) => ({
            type: session.type,
            exercises: session.exercises.map((exercise: Exercise) => ({
              name: exercise.name,
              sets: exercise.sets,
              reps: exercise.reps,
              intensity: exercise.intensity,
              rest: exercise.rest,
              notes: exercise.notes,
            })),
            duration: session.duration,
            intensity: session.intensity,
            focus: session.focus,
          })),
        })),
      })),
      summary: {
        totalWeeks: cycle.weeks.length,
        totalSessions: cycle.weeks.reduce((sum: number, week: TrainingWeek) => 
          sum + week.days.reduce((daySum: number, day: TrainingDay) => 
            daySum + (day.isRest ? 0 : day.sessions.length), 0), 0),
        focusAreas: cycle.weeks.map((week: TrainingWeek) => week.focus),
        progression: {
          volume: progression.calculateVolumeProgression(),
          intensity: progression.calculateIntensityProgression(),
        },
      },
      recommendations: {
        warmup: "15-minute dynamic warm-up before each session",
        cooldown: "10-minute cool-down with stretching",
        nutrition: "Ensure adequate protein intake and hydration",
        recovery: "48-hour rest between intense sessions",
        modifications: completeProfile.injuries !== "None" ? 
          cycleGenerator.getInjuryModifications() : [],
      },
    };

    return trainingPlan;
  },
}); 