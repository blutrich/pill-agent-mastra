import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { climbingCoachAgent } from '../agents';
import { Memory } from '@mastra/memory';

// Create memory instance for the Mastra export
const memory = new Memory({
  options: {
    lastMessages: 20,
    workingMemory: {
      enabled: true,
      template: `
# Climber Profile
- Experience Level:
- Current Grades:
  - Sport:
  - Boulder:
- Training Frequency:
- Goals:
- Injuries:
- Progress Notes:
`,
      use: 'tool-call'
    }
  }
});

// Create and export the Mastra instance with the climbing coach agent
export const mastra = new Mastra({
  agents: { 
    climbingCoach: climbingCoachAgent 
  },
  logger: createLogger({
    name: 'ClimbingPill Coach',
    level: 'info',
  }),
  memory
});
