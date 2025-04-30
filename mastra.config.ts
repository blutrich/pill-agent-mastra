import { defineConfig } from 'mastra/config';

export default defineConfig({
  // Server configuration
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 4114,
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  },

  // Environment configuration
  env: {
    NODE_ENV: process.env.NODE_ENV || 'development',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
  },

  // Build configuration
  build: {
    outDir: 'dist',
    minify: true,
    sourcemap: process.env.NODE_ENV === 'development'
  },

  // Logging configuration
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    format: 'json'
  },

  // Memory configuration
  memory: {
    type: process.env.MEMORY_STORE_TYPE || 'file',
    path: './data/memory'
  },
  
  // Add Mastra Cloud compatibility
  cloud: {
    project: 'climbing-coach-agent',
    ignorePaths: ['README.md', 'scripts/', 'data/']
  }
}); 