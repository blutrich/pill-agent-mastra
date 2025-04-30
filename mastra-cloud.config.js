module.exports = {
  // Project name for Mastra Cloud
  name: 'climbing-coach-agent',
  
  // Path to the Mastra application
  projectPath: './',
  
  // Build settings
  build: {
    command: 'pnpm build',
    outputDir: 'dist'
  },
  
  // Environment variables required for deployment
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
  },
  
  // Set up memory storage to use Mastra Cloud
  memory: {
    type: 'cloud'
  }
}; 