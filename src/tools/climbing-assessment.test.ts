import { z } from 'zod';
import { climbingAssessmentTool } from './climbing-assessment';

// The tool's input schema, as defined in climbing-assessment.ts
const inputSchema = z.object({
  currentGrade: z.object({
    sport: z.string().optional(),
    boulder: z.string().optional()
  }),
  experience: z.enum(['beginner', 'intermediate', 'advanced']),
  trainingFrequency: z.number().min(1).max(7),
  goals: z.array(z.string()),
  injuries: z.array(z.string()).optional()
});
type InputType = z.infer<typeof inputSchema>;

// The tool's output schema
const outputSchema = z.object({
  assessment: z.string(),
  recommendations: z.array(z.string()),
  suggestedTrainingPlan: z.string()
});
type OutputType = z.infer<typeof outputSchema>;


// Helper function to create input objects
const createTestInput = (
  experience: 'beginner' | 'intermediate' | 'advanced',
  trainingFrequency: number,
  goals: string[],
  currentGrade: { sport?: string; boulder?: string } = { sport: '5.10a', boulder: 'V3' },
  injuries: string[] = []
): InputType => ({
  currentGrade,
  experience,
  trainingFrequency,
  goals,
  injuries,
});

const createMockExecuteArg = (inputData: InputType) => {
  return {
    input: inputData,
    runtimeContext: {
      logger: console,
    },
  };
};


describe('climbingAssessmentTool.execute - suggestedTrainingPlan', () => {
  // --- Beginner Tests ---
  describe('Experience: Beginner', () => {
    it('should generate plan for 2 days/week, focus on fundamentals and technique goal', async () => {
      const testInputData = createTestInput('beginner', 2, ['technique']);
      const executeArg = createMockExecuteArg(testInputData);
      
      if (!climbingAssessmentTool.execute) {
        throw new Error("Execute method is not defined on climbingAssessmentTool");
      }
      const result = await climbingAssessmentTool.execute(executeArg as any) as OutputType;
      
      expect(result.suggestedTrainingPlan).toContain('beginner experience');
      expect(result.suggestedTrainingPlan).toContain('2-day/week plan');
      expect(result.suggestedTrainingPlan).toContain('climbing fundamentals');
      expect(result.suggestedTrainingPlan).toContain('technique');
      expect(result.suggestedTrainingPlan).not.toContain('strength');
    });

    it('should generate plan for 3 days/week, focus on strength and endurance goals', async () => {
      const testInputData = createTestInput('beginner', 3, ['strength', 'endurance']);
      const executeArg = createMockExecuteArg(testInputData);
      if (!climbingAssessmentTool.execute) {
        throw new Error("Execute method is not defined on climbingAssessmentTool");
      }
      const result = await climbingAssessmentTool.execute(executeArg as any) as OutputType;
      expect(result.suggestedTrainingPlan).toContain('beginner experience');
      expect(result.suggestedTrainingPlan).toContain('3-day/week plan');
      expect(result.suggestedTrainingPlan).toContain('gradual strength building');
      expect(result.suggestedTrainingPlan).toContain('strength-focused exercises');
      expect(result.suggestedTrainingPlan).toContain('route climbing or endurance circuits');
    });
  });

  // --- Intermediate Tests ---
  describe('Experience: Intermediate', () => {
    it('should generate plan for 2 days/week, quality sessions, strength goal', async () => {
      const testInputData = createTestInput('intermediate', 2, ['strength']);
      const executeArg = createMockExecuteArg(testInputData);
      if (!climbingAssessmentTool.execute) {
        throw new Error("Execute method is not defined on climbingAssessmentTool");
      }
      const result = await climbingAssessmentTool.execute(executeArg as any) as OutputType;
      expect(result.suggestedTrainingPlan).toContain('intermediate experience');
      expect(result.suggestedTrainingPlan).toContain('2-day/week plan');
      expect(result.suggestedTrainingPlan).toContain('quality sessions');
      expect(result.suggestedTrainingPlan).toContain('strength-focused exercises');
    });

    it('should generate plan for 4 days/week, balanced approach, technique and endurance goals', async () => {
      const testInputData = createTestInput('intermediate', 4, ['technique', 'endurance']);
      const executeArg = createMockExecuteArg(testInputData);
      if (!climbingAssessmentTool.execute) {
        throw new Error("Execute method is not defined on climbingAssessmentTool");
      }
      const result = await climbingAssessmentTool.execute(executeArg as any) as OutputType;
      expect(result.suggestedTrainingPlan).toContain('intermediate experience');
      expect(result.suggestedTrainingPlan).toContain('3-4 day/week plan');
      expect(result.suggestedTrainingPlan).toContain('balanced approach');
      expect(result.suggestedTrainingPlan).toContain('drills and mindful climbing');
      expect(result.suggestedTrainingPlan).toContain('route climbing or endurance circuits');
    });

    it('should generate plan for 5 days/week, careful management, no specific goals (empty array)', async () => {
      const testInputData = createTestInput('intermediate', 5, []);
      const executeArg = createMockExecuteArg(testInputData);
      if (!climbingAssessmentTool.execute) {
        throw new Error("Execute method is not defined on climbingAssessmentTool");
      }
      const result = await climbingAssessmentTool.execute(executeArg as any) as OutputType;
      expect(result.suggestedTrainingPlan).toContain('intermediate experience');
      expect(result.suggestedTrainingPlan).toContain('5+ day/week plan');
      expect(result.suggestedTrainingPlan).toContain('careful management of intensity and recovery');
      expect(result.suggestedTrainingPlan).not.toContain('strength-focused exercises');
      expect(result.suggestedTrainingPlan).not.toContain('route climbing or endurance circuits');
      expect(result.suggestedTrainingPlan).not.toContain('drills and mindful climbing');
    });
  });

  // --- Advanced Tests ---
  describe('Experience: Advanced', () => {
    it('should generate plan for 3 days/week, highly focused, power/strength goal', async () => {
      const testInputData = createTestInput('advanced', 3, ['power', 'strength']);
      const executeArg = createMockExecuteArg(testInputData);
      if (!climbingAssessmentTool.execute) {
        throw new Error("Execute method is not defined on climbingAssessmentTool");
      }
      const result = await climbingAssessmentTool.execute(executeArg as any) as OutputType;
      expect(result.suggestedTrainingPlan).toContain('advanced experience');
      expect(result.suggestedTrainingPlan).toContain('highly focused');
      expect(result.suggestedTrainingPlan).toContain('strength-focused exercises like bouldering or hangboarding');
    });

    it('should generate plan for 5 days/week, periodization, endurance goal', async () => {
      const testInputData = createTestInput('advanced', 5, ['endurance']);
      const executeArg = createMockExecuteArg(testInputData);
      if (!climbingAssessmentTool.execute) {
        throw new Error("Execute method is not defined on climbingAssessmentTool");
      }
      const result = await climbingAssessmentTool.execute(executeArg as any) as OutputType;
      expect(result.suggestedTrainingPlan).toContain('advanced experience');
      expect(result.suggestedTrainingPlan).toContain('4+ day/week plan');
      expect(result.suggestedTrainingPlan).toContain('Periodization and recovery are critical');
      expect(result.suggestedTrainingPlan).toContain('route climbing or endurance circuits');
    });
  });

  // --- Combination and Edge Case Tests ---
  describe('Combinations and Edge Cases', () => {
    it('Beginner, 1 day/week, goals: ["technique"]', async () => {
      const testInputData = createTestInput('beginner', 1, ['technique']);
      const executeArg = createMockExecuteArg(testInputData);
      if (!climbingAssessmentTool.execute) {
        throw new Error("Execute method is not defined on climbingAssessmentTool");
      }
      const result = await climbingAssessmentTool.execute(executeArg as any) as OutputType;
      expect(result.suggestedTrainingPlan).toContain('beginner experience');
      expect(result.suggestedTrainingPlan).toContain('2-day/week plan');
      expect(result.suggestedTrainingPlan).toContain('climbing fundamentals');
      expect(result.suggestedTrainingPlan).toContain('technique');
    });

    it('Intermediate, 7 days/week, goals: ["strength", "endurance", "technique"]', async () => {
      const testInputData = createTestInput('intermediate', 7, ['strength', 'endurance', 'technique']);
      const executeArg = createMockExecuteArg(testInputData);
      if (!climbingAssessmentTool.execute) {
        throw new Error("Execute method is not defined on climbingAssessmentTool");
      }
      const result = await climbingAssessmentTool.execute(executeArg as any) as OutputType;
      expect(result.suggestedTrainingPlan).toContain('intermediate experience');
      expect(result.suggestedTrainingPlan).toContain('5+ day/week plan');
      expect(result.suggestedTrainingPlan).toContain('careful management');
      expect(result.suggestedTrainingPlan).toContain('strength-focused exercises');
      expect(result.suggestedTrainingPlan).toContain('route climbing or endurance circuits');
      expect(result.suggestedTrainingPlan).toContain('drills and mindful climbing');
    });

    it('Advanced, 4 days/week, no goals (empty array)', async () => {
      const testInputData = createTestInput('advanced', 4, []);
      const executeArg = createMockExecuteArg(testInputData);
      if (!climbingAssessmentTool.execute) {
        throw new Error("Execute method is not defined on climbingAssessmentTool");
      }
      const result = await climbingAssessmentTool.execute(executeArg as any) as OutputType;
      expect(result.suggestedTrainingPlan).toContain('advanced experience');
      expect(result.suggestedTrainingPlan).toContain('4+ day/week plan');
      expect(result.suggestedTrainingPlan).toContain('Periodization and recovery are critical');
      expect(result.suggestedTrainingPlan).not.toContain('strength-focused exercises');
      expect(result.suggestedTrainingPlan).not.toContain('route climbing or endurance circuits');
      expect(result.suggestedTrainingPlan).not.toContain('drills and mindful climbing');
    });
  });
});
