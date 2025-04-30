import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

// Ensure required environment variables are set
const requiredEnvVars = ['OPENAI_API_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: ${envVar} environment variable is required`);
    process.exit(1);
  }
}

// Create necessary directories
const dirs = ['dist', 'data/memory'];
for (const dir of dirs) {
  const dirPath = path.join(process.cwd(), dir);
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

// Build the application
console.log('Building the application...');
try {
  execSync('pnpm build', { stdio: 'inherit' });
} catch (error) {
  console.error('Error building the application:', error);
  process.exit(1);
}

// Start the server
console.log('Starting the server...');
try {
  execSync('pnpm start', { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting the server:', error);
  process.exit(1);
} 