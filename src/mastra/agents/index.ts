import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { weatherTool } from '../tools';
import { z } from "zod";
import type { AssessmentResult, TrainingPlan, PhysicalTest, WarmUpProtocol, PerformanceResult, PerformanceMetrics } from "../../types/climbing";
import { Memory } from "@mastra/memory";
import { climbingAssessment, calculatePerformance, injuryPrevention, generateTrainingPlan } from "../tools/climbingTools";
import { coachPrompt } from '../../prompts/coach.prompt';

// Initialize memory
const memory = new Memory();

// Define schemas for our tools
const assessmentSchema = z.object({
  climberLevel: z.string(),
  experience: z.number(),
  goals: z.string(),
  injuries: z.array(z.string()).optional(),
  bodyWeight: z.number(),
  height: z.number(),
  sleepQuality: z.number().min(1).max(10),
  energyLevel: z.number().min(1).max(10),
  testingConditions: z.string(),
});

const trainingPlanSchema = z.object({
  level: z.string(),
  goals: z.string(),
  schedule: z.object({
    weeklySessions: z.number(),
    sessionDuration: z.number(),
  }),
});

const performanceSchema = z.object({
  fingerStrength: z.number(),
  pullUps: z.number(),
  toeToBar: z.number(),
  pushUps: z.number(),
  legSpread: z.number(),
  bodyWeight: z.number(),
  height: z.number(),
});

export const weatherAgent = new Agent({
  name: 'Weather Agent',
  instructions: `
      You are a helpful weather assistant that provides accurate weather information.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If the location name isn't in English, please translate it
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative

      Use the weatherTool to fetch current weather data.
`,
  model: openai('gpt-4o'),
  tools: { weatherTool },
});

export const climbingCoachAgent = new Agent({
  name: "ClimbingPill Daily Coach",
  instructions: coachPrompt,
  model: openai("gpt-4"),
  memory: memory,
  tools: {
    climbingAssessment,
    calculatePerformance,
    injuryPrevention,
    generateTrainingPlan,
  },
});
