import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

import { weatherAgent } from './agents';
import { climbingCoachAgent } from './agents';

export const mastra = new Mastra({
  agents: { weatherAgent, climbingCoachAgent },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
