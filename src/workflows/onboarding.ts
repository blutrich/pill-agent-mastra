import { Step, Workflow } from '@mastra/core';
import { z } from 'zod';

// Define the schemas for climber information
const climberInfoSchema = z.object({
  name: z.string(),
  age: z.number(),
  experience: z.enum(['beginner', 'intermediate', 'advanced']),
  preferredGrades: z.object({
    sport: z.string().optional(),
    boulder: z.string().optional(),
  }),
  trainingDaysPerWeek: z.number().min(1).max(7),
  goals: z.array(z.string()),
  injuries: z.array(z.string()).optional(),
});

// Step 1: Collect basic information
const collectBasicInfo = new Step({
  id: 'collectBasicInfo',
  outputSchema: z.object({
    name: z.string(),
    age: z.number(),
    experience: z.enum(['beginner', 'intermediate', 'advanced']),
  }),
  execute: async ({ context }) => {
    const { name, age, experience } = context.triggerData;
    return { name, age, experience };
  },
});

// Step 2: Collect climbing preferences
const collectClimbingPreferences = new Step({
  id: 'collectClimbingPreferences',
  outputSchema: z.object({
    preferredGrades: z.object({
      sport: z.string().optional(),
      boulder: z.string().optional(),
    }),
    trainingDaysPerWeek: z.number(),
  }),
  execute: async ({ context }) => {
    const { preferredGrades, trainingDaysPerWeek } = context.triggerData;
    return { preferredGrades, trainingDaysPerWeek };
  },
});

// Step 3: Collect goals and injuries
const collectGoalsAndInjuries = new Step({
  id: 'collectGoalsAndInjuries',
  outputSchema: z.object({
    goals: z.array(z.string()),
    injuries: z.array(z.string()).optional(),
  }),
  execute: async ({ context }) => {
    const { goals, injuries } = context.triggerData;
    return { goals, injuries };
  },
});

// Step 4: Generate initial assessment
const generateInitialAssessment = new Step({
  id: 'generateInitialAssessment',
  outputSchema: z.object({
    assessment: z.string(),
    recommendedPlan: z.string(),
  }),
  execute: async ({ context }) => {
    // Check step status and get outputs
    const basicInfoStep = context.steps.collectBasicInfo;
    const preferencesStep = context.steps.collectClimbingPreferences;
    const goalsAndInjuriesStep = context.steps.collectGoalsAndInjuries;

    if (
      basicInfoStep.status !== 'success' ||
      preferencesStep.status !== 'success' ||
      goalsAndInjuriesStep.status !== 'success'
    ) {
      throw new Error('Previous steps must complete successfully');
    }

    const basicInfo = basicInfoStep.output;
    const preferences = preferencesStep.output;
    const goalsAndInjuries = goalsAndInjuriesStep.output;

    return {
      assessment: `Initial assessment for ${basicInfo.name}: ${basicInfo.experience} climber, training ${preferences.trainingDaysPerWeek} days per week`,
      recommendedPlan: 'Custom training plan will be generated based on your profile.',
    };
  },
});

// Create the onboarding workflow
export const onboardingWorkflow = new Workflow({
  name: 'climberOnboarding',
  triggerSchema: climberInfoSchema,
});

// Define the workflow steps
onboardingWorkflow
  .step(collectBasicInfo)
  .then(collectClimbingPreferences)
  .then(collectGoalsAndInjuries)
  .then(generateInitialAssessment)
  .commit(); 