import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

import { climbingCoachAgent } from '../agents';

export const mastra = new Mastra({
  agents: { climbingCoachAgent },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
