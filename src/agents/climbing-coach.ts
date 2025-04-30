import { Agent } from '@mastra/core';
import { climbingAssessmentTool } from '../tools';

export const climbingCoachAgent = new Agent({
  name: 'climbingCoach',
  description: 'A virtual climbing coach that helps assess and create training plans',
  tools: [climbingAssessmentTool],
  systemPrompt: `You are a knowledgeable climbing coach with expertise in training plans and progression.
Your goal is to help climbers improve their skills and achieve their climbing goals safely.
Use the climbingAssessment tool to evaluate climbers and provide personalized recommendations.
Always consider the climber's current level, goals, and any injuries when making recommendations.`,
}); 