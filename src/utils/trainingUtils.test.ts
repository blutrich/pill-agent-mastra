import { ClimbingProgressionCalculator } from './trainingUtils';
import type { ClimberProfile } from '../types/training';

describe('ClimbingProgressionCalculator.calculateProgressiveOverload', () => {
  // Mock ClimberProfile. The specific values don't affect calculateProgressiveOverload's logic directly,
  // as it's based on weekNumber, but an instance is needed for the constructor.
  const mockProfile: ClimberProfile = {
    level: 'intermediate',
    experience: 3, // years
    goals: 'strength, technique',
    injuries: 'None',
    bodyWeight: 70, // kg
    height: 175, // cm
    sleepQuality: 7, // 1-10
    energyLevel: 8, // 1-10
    trainingDays: 3, // per week
    preferredTrainingTimes: ['evening'],
    availableEquipment: ['fingerboard', 'pullup bar', 'bouldering wall'],
    previousInjuries: [],
    currentLimitations: [],
    availableDays: [true, false, true, false, true, false, false], // Sun-Sat
    sessionLength: 2, // hours
    hasEquipment: (equipment: string) => mockProfile.availableEquipment.includes(equipment),
  };

  const calculator = new ClimbingProgressionCalculator(mockProfile);

  // Test cases for valid week numbers
  describe('Valid weekNumber inputs', () => {
    it('should return correct progression for Week 1', () => {
      const progression = calculator.calculateProgressiveOverload(1);
      expect(progression).toEqual({
        fingerboard: { sets: 3, intensity: 95 },
        projects: { moveCount: 6, intensity: 90 },
        volume: { multiplier: 1.0 },
      });
    });

    it('should return correct progression for Week 2', () => {
      const progression = calculator.calculateProgressiveOverload(2);
      expect(progression).toEqual({
        fingerboard: { sets: 3, intensity: 97 },
        projects: { moveCount: 5, intensity: 93 },
        volume: { multiplier: 1.1 },
      });
    });

    it('should return correct progression for Week 3', () => {
      const progression = calculator.calculateProgressiveOverload(3);
      expect(progression).toEqual({
        fingerboard: { sets: 4, intensity: 100 },
        projects: { moveCount: 4, intensity: 96 },
        volume: { multiplier: 1.15 },
      });
    });

    it('should return correct progression for Week 4', () => {
      const progression = calculator.calculateProgressiveOverload(4);
      expect(progression).toEqual({
        fingerboard: { sets: 5, intensity: 100 },
        projects: { moveCount: 3, intensity: 100 },
        volume: { multiplier: 1.2 },
      });
    });

    it('should return correct progression for Week 5 (Deload)', () => {
      const progression = calculator.calculateProgressiveOverload(5);
      expect(progression).toEqual({
        fingerboard: {
          sets: Math.floor(5 * 0.5), // Based on week 4 sets
          intensity: Math.floor(100 * 0.5), // Based on week 4 intensity
        },
        projects: {
          moveCount: Math.floor(6 * 1.5), // Based on week 1 moveCount
          intensity: 50,
        },
        volume: { multiplier: 0.5 },
      });
    });

    it('should return correct progression for Week 6 (Assessment)', () => {
      const progression = calculator.calculateProgressiveOverload(6);
      expect(progression).toEqual({
        fingerboard: { sets: 2, intensity: 80 },
        projects: { moveCount: 8, intensity: 70 },
        volume: { multiplier: 0.3 },
      });
    });
  });

  // Test cases for invalid week numbers
  describe('Invalid weekNumber inputs', () => {
    const expectedError = 'Invalid weekNumber: must be an integer between 1 and 6.';

    it('should throw an error for weekNumber 0', () => {
      expect(() => calculator.calculateProgressiveOverload(0)).toThrow(expectedError);
    });

    it('should throw an error for weekNumber -1', () => {
      expect(() => calculator.calculateProgressiveOverload(-1)).toThrow(expectedError);
    });

    it('should throw an error for weekNumber 7', () => {
      expect(() => calculator.calculateProgressiveOverload(7)).toThrow(expectedError);
    });

    it('should throw an error for non-integer weekNumber 1.5', () => {
      expect(() => calculator.calculateProgressiveOverload(1.5)).toThrow(expectedError);
    });

    // TypeScript's static typing should prevent non-numeric types from being passed.
    // However, if the function were called from JavaScript, this test would be relevant.
    // We can cast to 'any' to bypass TypeScript's compile-time check for this test.
    it('should throw an error for non-numeric weekNumber (e.g., "abc")', () => {
      expect(() => calculator.calculateProgressiveOverload('abc' as any)).toThrow(expectedError);
    });
     it('should throw an error for null weekNumber', () => {
      expect(() => calculator.calculateProgressiveOverload(null as any)).toThrow(expectedError);
    });
    it('should throw an error for undefined weekNumber', () => {
      expect(() => calculator.calculateProgressiveOverload(undefined as any)).toThrow(expectedError);
    });
  });
});
