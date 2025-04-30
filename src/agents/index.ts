import { Agent } from '@mastra/core';
import { openai } from '@ai-sdk/openai';
import { OpenAIVoice } from '@mastra/voice-openai';
import { climbingAssessmentTool } from '../tools';
import { SummarizationMetric } from '@mastra/evals/llm';
import {
  ContentSimilarityMetric,
  ToneConsistencyMetric
} from '@mastra/evals/nlp';
import { coachPrompt } from '../prompts/coach.prompt';

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
  instructions: coachPrompt
}); 