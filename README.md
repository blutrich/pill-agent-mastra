# Climbing Coach Agent

An AI-powered climbing coach that provides personalized training plans and advice.

## Features

- Personalized climbing assessments
- Voice interaction capabilities
- Safety-focused recommendations
- Clear, step-by-step instructions
- Memory of past interactions

## Prerequisites

- Node.js >= 20.0.0
- pnpm
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd climbingPill-Agent
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file with your configuration:
```env
OPENAI_API_KEY=your_api_key_here
PORT=4114
CORS_ORIGIN=*
LOG_LEVEL=info
```

## Development

Run the development server:
```bash
pnpm dev
```

## Deployment

### Mastra Cloud Deployment (Recommended)

The simplest way to deploy this agent is using Mastra Cloud:

1. Push your code to a GitHub repository.

2. Log in to [Mastra Cloud](https://cloud.mastra.ai).

3. Click "Add new" in the Projects dashboard.

4. Select your repository and click "Import".

5. Configure deployment settings:
   - Project name: `climbing-coach-agent` (or your preferred name)
   - Branch: `main` (or your main branch)
   - Directory: `climbingPill Agent` (the path to your Mastra application)

6. Add the following environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `MEMORY_STORE_TYPE`: Set to `cloud` to use Mastra Cloud's managed storage

7. Click "Deploy" to initiate your first deployment.

After deployment, your agent will be accessible at:
- Project URL: `https://climbing-coach-agent.mastra.cloud`
- Each deployment also gets a unique URL for testing specific versions

### Local Deployment

1. Build the application:
```bash
pnpm build
```

2. Start the server:
```bash
pnpm start
```

### Production Server Deployment

Deploy to production:
```bash
pnpm deploy:prod
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| OPENAI_API_KEY | Your OpenAI API key | Required |
| PORT | Server port | 4114 |
| CORS_ORIGIN | CORS origin | * |
| LOG_LEVEL | Logging level | info |
| NODE_ENV | Environment | development |
| MEMORY_STORE_TYPE | Memory storage type (file/cloud) | file |

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/assess` - Get climbing assessment
- `POST /api/voice` - Voice interaction endpoint

## Memory Storage

The agent's memory is stored based on the MEMORY_STORE_TYPE setting:
- `file`: Stored in the `data/memory` directory (local development)
- `cloud`: Stored in Mastra Cloud's managed storage (when deployed to Mastra Cloud)

## Monitoring

When deployed to Mastra Cloud, you can monitor:
- Agent interactions in the Chat interface
- Detailed logs in the Logs section
- Memory usage and database metrics

## License

ISC 