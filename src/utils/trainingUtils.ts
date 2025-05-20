import type { ClimberProfile, Exercise, TrainingSession, TrainingDay, TrainingWeek, GAConfig, ExerciseFactory, ProgressionCalculator } from '../types/training';

export class ClimbingExerciseFactory implements ExerciseFactory {
  constructor(private profile: ClimberProfile) {}

  createExercise(name: string, sets: number, reps: number, intensity: number, rest: number, notes?: string): Exercise {
    return {
      name,
      sets,
      reps,
      intensity,
      rest,
      notes,
    };
  }

  createSession(type: string, exercises: Exercise[], duration: number, intensity: number, focus: string): TrainingSession {
    return {
      type,
      exercises,
      duration,
      intensity,
      focus,
    };
  }

  createDay(isRest: boolean, sessions: TrainingSession[]): TrainingDay {
    return {
      isRest,
      sessions,
    };
  }

  createWeek(weekNumber: number, focus: string, days: TrainingDay[]): TrainingWeek {
    return {
      weekNumber,
      focus,
      days,
    };
  }

  createWarmup(options: { description?: string } = {}): TrainingSession {
    const exercises: Exercise[] = [
      this.createExercise('Light Cardio', 1, 5, 0.3, 0, '5 minutes of light jogging or jumping rope'),
      this.createExercise('Arm Circles', 2, 10, 0.3, 30, 'Forward and backward'),
      this.createExercise('Shoulder Mobility', 2, 10, 0.3, 30, 'Arm swings and rotations'),
      this.createExercise('Wrist Mobility', 2, 10, 0.3, 30, 'Wrist circles and extensions'),
      this.createExercise('Finger Mobility', 2, 10, 0.3, 30, 'Finger extensions and curls'),
    ];

    return this.createSession(
      'Warm-up',
      exercises,
      15,
      0.3,
      'Mobility and Activation'
    );
  }

  createFingerboard(options: { sets?: number; intensity?: number; duration?: number } = {}): TrainingSession {
    const sets = options.sets || 3;
    const intensity = options.intensity || 0.8;
    const duration = options.duration || 10;

    const exercises: Exercise[] = [
      this.createExercise(
        'Hangboard',
        sets,
        duration,
        intensity,
        180,
        '20mm edge, full crimp'
      ),
    ];

    return this.createSession(
      'Fingerboard',
      exercises,
      sets * (duration + 180) / 60,
      intensity,
      'Strength'
    );
  }

  createBoulderProject(options: { moveCount?: number; intensity?: number } = {}): TrainingSession {
    const moveCount = options.moveCount || 4;
    const intensity = options.intensity || 0.9;

    const exercises: Exercise[] = [
      this.createExercise(
        'Project Attempts',
        4,
        moveCount,
        intensity,
        300,
        'Work on specific moves or sequences'
      ),
    ];

    return this.createSession(
      'Boulder Project',
      exercises,
      60,
      intensity,
      'Power'
    );
  }

  createBoulderFlash(options: { intensity?: number } = {}): TrainingSession {
    const intensity = options.intensity || 0.7;

    const exercises: Exercise[] = [
      this.createExercise(
        'Flash Attempts',
        5,
        1,
        intensity,
        180,
        'One attempt per problem'
      ),
    ];

    return this.createSession(
      'Boulder Flash',
      exercises,
      45,
      intensity,
      'Technique'
    );
  }

  createTechnicalBoulder(options: { duration?: number; intensity?: number } = {}): TrainingSession {
    const duration = options.duration || 45;
    const intensity = options.intensity || 0.6;

    const exercises: Exercise[] = [
      this.createExercise(
        'Technical Drills',
        3,
        15,
        intensity,
        60,
        'Focus on perfect form and technique'
      ),
    ];

    return this.createSession(
      'Technical Boulder',
      exercises,
      duration,
      intensity,
      'Technique'
    );
  }

  createGeneralFitness(options: { sets?: number; duration?: number } = {}): TrainingSession {
    const sets = options.sets || 3;
    const duration = options.duration || 30;

    const exercises: Exercise[] = [
      this.createExercise('Pull-ups', sets, 8, 0.7, 120),
      this.createExercise('Push-ups', sets, 12, 0.7, 120),
      this.createExercise('Core Circuit', sets, 1, 0.7, 60, 'Plank, side plank, hollow hold'),
    ];

    return this.createSession(
      'General Fitness',
      exercises,
      duration,
      0.7,
      'Strength'
    );
  }

  createEndurance(options: { duration?: number } = {}): TrainingSession {
    const duration = options.duration || 30;

    const exercises: Exercise[] = [
      this.createExercise(
        'Endurance Circuit',
        3,
        1,
        0.5,
        60,
        'Continuous climbing with minimal rest'
      ),
    ];

    return this.createSession(
      'Endurance',
      exercises,
      duration,
      0.5,
      'Endurance'
    );
  }

  createAssessment(options: { duration?: number } = {}): TrainingSession {
    const duration = options.duration || 60;

    const exercises: Exercise[] = [
      this.createExercise('Max Hang Test', 3, 1, 1.0, 300, '20mm edge, measure time'),
      this.createExercise('Pull-up Test', 1, 1, 1.0, 0, 'Max reps'),
      this.createExercise('Boulder Test', 5, 1, 1.0, 300, 'Attempt max grade'),
    ];

    return this.createSession(
      'Assessment',
      exercises,
      duration,
      1.0,
      'Testing'
    );
  }
}

export class ClimbingProgressionCalculator implements ProgressionCalculator {
  constructor(private profile: ClimberProfile) {}

  calculateVolumeProgression(): number[] {
    const baseVolume = this.profile.trainingDays * 2; // 2 sessions per training day
    return [1, 1.1, 1.2, 1.3, 0.7, 0.5].map(multiplier => baseVolume * multiplier);
  }

  calculateIntensityProgression(): number[] {
    const baseIntensity = this.profile.level === 'beginner' ? 0.6 : 
                         this.profile.level === 'intermediate' ? 0.7 : 0.8;
    return [1, 1.05, 1.1, 1.15, 0.8, 0.6].map(multiplier => baseIntensity * multiplier);
  }

  calculateProgressiveOverload(weekNumber: number) {
    if (!Number.isInteger(weekNumber) || weekNumber < 1 || weekNumber > 6) {
      throw new Error("Invalid weekNumber: must be an integer between 1 and 6.");
    }

    const progressions = {
      fingerboard: {
        sets: [3, 3, 4, 5],
        intensity: [95, 97, 100, 100] // percentage
      },
      projects: {
        moveCount: [6, 5, 4, 3], // approximate move count
        intensity: [90, 93, 96, 100] // percentage of max difficulty
      },
      volume: {
        multiplier: [1.0, 1.1, 1.15, 1.2] // base volume multiplier
      }
    };

    // Return the appropriate progression based on week
    if (weekNumber >= 1 && weekNumber <= 4) {
      const index = weekNumber - 1;
      return {
        fingerboard: {
          sets: progressions.fingerboard.sets[index],
          intensity: progressions.fingerboard.intensity[index]
        },
        projects: {
          moveCount: progressions.projects.moveCount[index],
          intensity: progressions.projects.intensity[index]
        },
        volume: {
          multiplier: progressions.volume.multiplier[index]
        }
      };
    }

    // For deload week
    if (weekNumber === 5) {
      return {
        fingerboard: {
          sets: Math.floor(progressions.fingerboard.sets[3] * 0.5),
          intensity: Math.floor(progressions.fingerboard.intensity[3] * 0.5)
        },
        projects: {
          moveCount: Math.floor(progressions.projects.moveCount[0] * 1.5), // Easier moves
          intensity: 50
        },
        volume: {
          multiplier: 0.5
        }
      };
    }

    // For assessment week
    if (weekNumber === 6) {
      return {
        fingerboard: {
          sets: 2,
          intensity: 80
        },
        projects: {
          moveCount: 8, // Much easier moves
          intensity: 70
        },
        volume: {
          multiplier: 0.3
        }
      };
    }

    return {
      fingerboard: { sets: 3, intensity: 80 },
      projects: { moveCount: 6, intensity: 80 },
      volume: { multiplier: 1.0 }
    };
    // The existing logic for weeks 1-6 remains unchanged.
    // The default return at the end of the function will now only be reached if weekNumber is valid but not 1-6,
    // however, the new validation ensures this path is never taken.
    // For clarity, we could remove the final default return, but it's harmless.
  }
}

/**
 * Generates a structured, template 6-week climbing training cycle.
 * This class provides a predefined progression suitable for general improvement.
 * For highly specific needs or advanced periodization, further customization
 * or a different generation approach might be necessary.
 */
export class OptimizedSixWeekCycle {
  private weeks: TrainingWeek[] = [];

  constructor(private profile: ClimberProfile) {}

  /**
   * Generates the complete 6-week training cycle.
   * It iterates through each week, determines focus, volume, and intensity,
   * and populates training days with predefined sessions.
   * @returns An object containing the array of TrainingWeek.
   */
  generateFullCycle(): { weeks: TrainingWeek[] } {
    const exerciseFactory = new ClimbingExerciseFactory(this.profile);
    const progression = new ClimbingProgressionCalculator(this.profile);

    // Generate each week
    for (let week = 1; week <= 6; week++) {
      const weekFocus = this.getWeekFocus(week);
      const weekVolume = progression.calculateVolumeProgression()[week - 1];
      const weekIntensity = progression.calculateIntensityProgression()[week - 1];

      const days: TrainingDay[] = [];
      for (let day = 0; day < 7; day++) {
        if (day < this.profile.trainingDays) {
          const sessions = this.generateSessionsForDay(week, day, weekVolume, weekIntensity, exerciseFactory);
          days.push(exerciseFactory.createDay(false, sessions));
        } else {
          days.push(exerciseFactory.createDay(true, []));
        }
      }

      this.weeks.push(exerciseFactory.createWeek(week, weekFocus, days));
    }

    return { weeks: this.weeks };
  }

  private getWeekFocus(week: number): string {
    const focuses = [
      'Technique and Fundamentals',
      'Strength and Power',
      'Endurance and Stamina',
      'Peak Performance',
      'Deload and Recovery',
      'Assessment and Planning',
    ];
    return focuses[week - 1];
  }

  /**
   * Generates training sessions for a specific day within a week.
   * 
   * NOTE: The exercises and session structure defined in this method are currently
   * predefined to create a typical 6-week climbing training cycle. This serves as a
   * general template.
   * 
   * Rationale:
   * - Morning sessions (weeks 1-4): Typically focus on strength components like
   *   fingerboarding and pull-ups, which are foundational for climbing performance.
   *   These are often best done when fresh.
   * - Afternoon sessions: Focus on actual climbing, incorporating bouldering for
   *   power and intensity, and technique drills for skill refinement.
   * 
   * This structure is a template and might need adjustment for individual needs,
   * specific goals not fully captured by the ClimberProfile (e.g., very specific
   * project requirements), or if different training philosophies are preferred.
   * The intensity and volume are scaled by the `progression` calculator, but the
   * choice of exercises themselves is fixed here.
   * 
   * @param week The current week number (1-6).
   * @param day The current day number within the week.
   * @param volume The calculated training volume for the session.
   * @param intensity The calculated training intensity for the session.
   * @param factory The exercise factory to create session components.
   * @returns An array of TrainingSession objects for the given day.
   */
  private generateSessionsForDay(
    week: number,
    day: number,
    volume: number,
    intensity: number,
    factory: ClimbingExerciseFactory
  ): TrainingSession[] {
    const sessions: TrainingSession[] = [];

    // Morning session
    if (week <= 4) {
      sessions.push(
        factory.createSession(
          'Morning Training',
          [
            factory.createExercise('Fingerboard', 3, 10, intensity, 120),
            factory.createExercise('Pull-ups', 3, 8, intensity, 90),
          ],
          60,
          intensity,
          'Strength'
        )
      );
    }

    // Afternoon session
    sessions.push(
      factory.createSession(
        'Climbing Session',
        [
          factory.createExercise('Bouldering', 4, 4, intensity, 180),
          factory.createExercise('Technique Drills', 3, 15, 0.7, 60),
        ],
        90,
        intensity,
        'Technique'
      )
    );

    return sessions;
  }

  getInjuryModifications(): string[] {
    if (this.profile.injuries === 'None') return [];

    // These are general guidelines for modifying training with injuries.
    // For specific injuries or persistent pain, it is highly recommended
    // to consult a physical therapist or medical professional for tailored advice.
    return [
      'Reduce intensity by 20%',
      'Increase rest periods between exercises',
      'Focus on proper form and technique',
      'Avoid exercises that aggravate injuries',
      'Include specific rehabilitation exercises (if known and appropriate)',
    ];
  }
} 