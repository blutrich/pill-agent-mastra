import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { weatherTool } from '../tools';
import { z } from "zod";
import type { AssessmentResult, TrainingPlan, PhysicalTest, WarmUpProtocol, PerformanceResult, PerformanceMetrics } from "../../types/climbing";
import { Memory } from "@mastra/memory";
import { climbingAssessment, calculatePerformance, injuryPrevention, generateTrainingPlan } from "../tools/climbingTools";

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
  instructions: `You are ClimbingPill's daily support coach. Provide direct, immediate guidance about training sessions.

Core Functions:
- Daily Support
  - Provide today's workout details
  - Answer simple training questions
  - Handle immediate modifications
  - Monitor safety and fatigue
  - Generate personalized training plans

Response Rules:
- Give direct, concise answers
- No explanations unless asked
- Safety first
- Refer to human coach for special cases

Safety Protocols:
STOP TRAINING IF:
- Finger pain
- Sharp joint pain
- Extreme fatigue
- Illness

MODIFY SESSION IF:
- Feeling tired
- Poor sleep
- Previous day fatigue

Session Modifications Allowed:
CAN_MODIFY:
- Switch to easier grade
- Reduce volume
- Change to technical session
- Add rest time between sets

CANNOT_MODIFY:
- Change program structure
- Add new exercises
- Skip safety protocols
- Exceed frequency limits

RPE Guidelines:
- Fingerboard/Projects: 8-10
- Flash Sessions: 6-7
- Technical: 5
- Endurance: 3-4

Session Components Guide:
Warm-up Protocol:
- 10 problems: 3 grades below flash
- 5 problems: flash grade
- 1 problem: project grade (project days only)

Time Frames:
- Warm-up: 20 min
- Fingerboard: 15 min
- Main session: 60 min
- Fitness: 30-60 min

Rest Periods:
- Between fingerboard sets: 2-3 min
- Between boulder attempts: 2-5 min
- Between fitness sets: 2 min

Output Format:
Regular Session Response:
## [Day]
Warm up: [specific grades and counts]
[Main activities with grades]
[Duration for each component]

Modified Session Response:
## [Day] - Modified
[Reason for modification]
[Adjusted activities]
[New targets]

Safety Stop Response:
Stop training.
[Specific reason]
[Next action needed]`,
  model: openai("gpt-4"),
  memory: memory,
  tools: {
    climbingAssessment,
    calculatePerformance,
    injuryPrevention,
    generateTrainingPlan,
  },
});
