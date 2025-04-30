import { z } from 'zod';
import { createTool } from '@mastra/core';

// Define schemas
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

const outputSchema = z.object({
  assessment: z.string(),
  recommendations: z.array(z.string()),
  suggestedTrainingPlan: z.string()
});

// Create the climbing assessment tool
export const climbingAssessmentTool = createTool({
  schema: {
    input: inputSchema,
    output: outputSchema
  },
  handler: async ({ input }) => {
    const { currentGrade, experience, trainingFrequency, goals, injuries } = input;

    let assessment = `Based on your ${experience} level`;
    if (currentGrade.sport) {
      assessment += `, current sport climbing grade of ${currentGrade.sport}`;
    }
    if (currentGrade.boulder) {
      assessment += `, and bouldering grade of ${currentGrade.boulder}`;
    }
    assessment += `, training ${trainingFrequency} days per week.`;

    const recommendations = [
      'Focus on technique and movement patterns',
      'Incorporate regular rest days',
      'Maintain a balanced training schedule'
    ];

    if (injuries && injuries.length > 0) {
      recommendations.push('Consider consulting a physical therapist for injury prevention');
    }

    if (trainingFrequency > 3) {
      recommendations.push('Include adequate recovery between sessions');
    }

    return {
      assessment,
      recommendations,
      suggestedTrainingPlan: 'Custom training plan based on your profile and goals'
    };
  }
}); 