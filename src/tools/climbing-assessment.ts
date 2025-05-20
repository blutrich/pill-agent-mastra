import { z } from 'zod';
import { Tool, type ToolExecutionContext } from '@mastra/core';

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

type InputType = z.infer<typeof inputSchema>;
type OutputType = z.infer<typeof outputSchema>;

export const climbingAssessmentTool = new Tool<typeof inputSchema, typeof outputSchema>({
  name: 'climbingAssessment',
  description: 'Assesses a climber\'s current level and provides recommendations',
  inputSchema,
  outputSchema,
  execute: async (context: ToolExecutionContext<typeof inputSchema>) => {
    const { currentGrade, experience, trainingFrequency, goals, injuries } = context.input;

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

    let plan = '';

    if (experience === 'beginner') {
      if (trainingFrequency <= 2) {
        plan = "A 2-day/week plan focusing on climbing fundamentals, basic movement, and building a climbing habit. Include a mix of bouldering and top-roping if available. Focus on mileage at an easy grade.";
      } else { // 3+ days
        plan = "A 3-day/week plan focusing on fundamentals, technique practice, and gradual strength building. Ensure adequate rest between climbing days. Consider one day for bouldering, one for routes, and one for light technique work or a climbing class.";
      }
    } else if (experience === 'intermediate') {
      if (trainingFrequency <= 2) {
        plan = "A 2-day/week plan. With limited days, focus on quality sessions. One day could be limit bouldering or a project session, and the other focused on volume/endurance or addressing weaknesses.";
      } else if (trainingFrequency <= 4) { // 3-4 days
        plan = "A 3-4 day/week plan. This allows for a balanced approach. Suggest 1-2 days of bouldering (strength/power), 1 day of route climbing (endurance), and 1 day for targeted training (e.g., fingerboard, campus board if appropriate, or specific weakness training) or outdoor climbing.";
      } else { // 5+ days
        plan = "A 5+ day/week plan requires careful management of intensity and recovery. Suggest 2 days of high-intensity bouldering/projecting, 1-2 days of endurance/volume climbing, and 1-2 days of supplementary training (strength, mobility, antagonist work) or active recovery. Emphasize listening to the body.";
      }
    } else { // advanced
      if (trainingFrequency <= 3) {
        plan = "With limited frequency at an advanced level, each session must be highly focused. Suggest 1-2 days of high-intensity projecting (boulder or sport) and 1 day of targeted training for specific weaknesses or maintenance (e.g., finger strength, power-endurance).";
      } else { // 4+ days
        plan = "A 4+ day/week plan for advanced climbers. Suggest 2 days of limit bouldering/sport projecting, 1-2 days of volume/power-endurance work, and 1-2 days of specific training (fingerboard, campus, conditioning) tailored to goals and weaknesses. Periodization and recovery are critical.";
      }
    }

    let goalSpecificAdvice = '';
    if (goals.includes('strength') || goals.includes('power')) {
      goalSpecificAdvice += " Incorporate strength-focused exercises like bouldering or hangboarding.";
    }
    if (goals.includes('endurance')) {
      goalSpecificAdvice += " Incorporate route climbing or endurance circuits.";
    }
    if (goals.includes('technique')) {
      goalSpecificAdvice += " Dedicate time to drills and mindful climbing.";
    }

    const suggestedTrainingPlan = `Based on your ${experience} experience and training ${trainingFrequency} days a week, a suggested plan is: ${plan}${goalSpecificAdvice.trim() ? ` ${goalSpecificAdvice.trim()}` : ''}`;


    return {
      assessment,
      recommendations,
      suggestedTrainingPlan
    };
  }
}); 