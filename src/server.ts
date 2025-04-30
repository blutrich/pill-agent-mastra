import { Mastra } from '@mastra/core';
import { registerApiRoute } from '@mastra/core/server';
import type { Handler } from 'hono';
import { RuntimeContext } from '@mastra/core/runtime-context';
import { onboardingWorkflow } from './workflows';
import { climbingCoachAgent } from './agents';
import { Memory } from '@mastra/memory';

// Create a runtime context
const runtimeContext = new RuntimeContext([
  ['environment', process.env.NODE_ENV || 'development'],
  ['version', '1.0.0'],
  ['serviceName', 'climbing-pill-agent']
]);

// Create memory instance
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

// Create Mastra instance with the workflow and agent
export const mastra = new Mastra({
  workflows: {
    climberOnboarding: onboardingWorkflow
  },
  agents: {
    climbingCoach: climbingCoachAgent
  },
  memory,
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 4114
  }
});

// Register API routes
registerApiRoute('/api/health', {
  method: 'GET',
  handler: (async (c) => {
    return c.json({ status: 'ok' });
  }) as Handler,
  middleware: [
    async (c, next) => {
      c.set('mastra', mastra);
      await next();
    }
  ]
});