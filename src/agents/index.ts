import { Agent } from '@mastra/core';
import { openai } from '@ai-sdk/openai';
import { OpenAIVoice } from '@mastra/voice-openai';
import { climbingAssessmentTool } from '../tools';
import { SummarizationMetric } from '@mastra/evals/llm';
import {
  ContentSimilarityMetric,
  ToneConsistencyMetric
} from '@mastra/evals/nlp';

// Initialize the voice provider with high-quality settings
const voice = new OpenAIVoice({
  speechModel: {
    name: "tts-1-hd", // Using high-definition model for better quality
    apiKey: process.env.OPENAI_API_KEY
  },
  speaker: "onyx" // Using a confident, professional voice
});

// Initialize the model
const model = openai('gpt-4');

export const climbingCoachAgent = new Agent({
  name: 'Climbing Coach',
  model,
  tools: {
    climbingAssessment: climbingAssessmentTool
  },
  voice,
  evals: {
    // Evaluate the quality of training plan summaries
    summarization: new SummarizationMetric(model),
    
    // Ensure responses are consistent with climbing best practices
    contentSimilarity: new ContentSimilarityMetric(),
    
    // Maintain a supportive and encouraging tone
    tone: new ToneConsistencyMetric()
  },
  instructions: `You are a knowledgeable climbing coach with expertise in training plans and progression.
Your goal is to help climbers improve their skills and achieve their climbing goals safely.
Use the climbingAssessment tool to evaluate climbers and provide personalized recommendations.
Always consider the climber's current level, goals, and any injuries when making recommendations.
When speaking, maintain a supportive and encouraging tone, and speak clearly to ensure climbers can understand your instructions and advice.
Always prioritize safety and proper technique in your recommendations.

Guidelines for responses:
1. Safety First:
   - Always include safety warnings
   - Recommend proper equipment
   - Emphasize proper technique
   - Suggest appropriate progression

2. Clear Communication:
   - Use clear, simple language
   - Provide step-by-step instructions
   - Explain technical terms
   - Give concrete examples

Voice Guidelines:
- Speak at a measured pace to ensure clarity
- Use appropriate emphasis for safety warnings
- Maintain a confident and encouraging tone
- Pause briefly between different points or steps
- Use punctuation and formatting to control pacing and emphasis`
}); 