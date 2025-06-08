# OKR Builder Backend

A powerful Node.js/Express backend for the OKR Builder application, featuring AI-powered OKR coaching with LangGraph and CopilotKit integration.

## Features

- 🤖 **AI-Powered OKR Coach**: Expert guidance using OpenAI GPT-4
- 🔄 **Real-time State Management**: Synchronized OKR state across frontend and backend
- 🛠️ **LangGraph Integration**: Advanced agent workflows for complex OKR operations
- 🚀 **CopilotKit Ready**: Seamless integration with CopilotKit for enhanced UI experiences
- 📊 **RESTful API**: Complete CRUD operations for OKRs and Key Results
- 💬 **Chat Interface**: Conversational AI for OKR guidance and management

## Architecture

```
backend/
├── src/
│   ├── index.ts              # Main Express server
│   ├── okr-agent.ts          # LangGraph agent implementation
│   └── copilot-integration.ts # CopilotKit integration module
├── package.json
└── README.md
```

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
# Create .env file
OPENAI_API_KEY=your_openai_api_key_here
PORT=4000
```

3. **Start the development server:**
```bash
npm run dev
```

## API Endpoints

### Core Endpoints

#### Health Check
```http
GET /health
```
Returns server status and available endpoints.

#### Chat with AI Coach
```http
POST /api/chat
Content-Type: application/json

{
  "message": "Help me create better OKRs for Q2",
  "history": [
    {"role": "user", "content": "Previous message"},
    {"role": "assistant", "content": "Previous response"}
  ]
}
```

### State Management

#### Get Current OKR State
```http
GET /api/state
```

#### Update OKR State
```http
POST /api/state
Content-Type: application/json

{
  "objectives": [...],
  "currentQuarter": "Q2 2024"
}
```

### Objectives Management

#### Create New Objective
```http
POST /api/objectives
Content-Type: application/json

{
  "title": "Increase Revenue Growth",
  "description": "Drive significant revenue expansion through strategic initiatives",
  "quarter": "Q2 2024",
  "keyResults": [
    {
      "description": "Acquire 100 new enterprise customers",
      "target": 100,
      "unit": "customers",
      "progress": 0
    }
  ]
}
```

#### Update Objective
```http
PUT /api/objectives/:id
Content-Type: application/json

{
  "title": "Updated Objective Title",
  "description": "Updated description",
  "progress": 75
}
```

#### Update Key Result Progress
```http
PUT /api/objectives/:objId/key-results/:krId
Content-Type: application/json

{
  "progress": 85
}
```

## LangGraph Agent

The OKR agent is built using LangGraph and provides:

### Tools Available:
- **update_okrs**: Update existing OKRs with modifications
- **create_objective**: Create new objectives with key results
- **update_key_result**: Update progress on specific key results

### Agent Capabilities:
- Intelligent OKR analysis and recommendations
- Progress tracking and calculation
- Best practices guidance
- Conversational coaching interface

### Usage Example:
```typescript
import { createOKRAgent } from './okr-agent';

const agent = createOKRAgent();
const result = await agent.invoke({
  messages: [new HumanMessage("Help me improve my Q2 OKRs")]
});
```

## CopilotKit Integration

The backend includes comprehensive CopilotKit integration for enhanced frontend experiences.

### Features:
- Real-time state synchronization
- Action-based OKR management
- Conversational AI interface
- Frontend-backend state binding

### CopilotKit Actions:
- `updateOKRs`: Update OKR state
- `createObjective`: Create new objectives
- `updateProgress`: Update key result progress

### Usage with Frontend:
```typescript
// Frontend integration
import { useCoAgent } from "@copilotkit/react-core";

const { state, setState } = useCoAgent({
  name: "okr_agent",
  initialState: initialOKRState
});
```

## State Management

The backend maintains a global OKR state that includes:

```typescript
interface OKRAgentState {
  objectives: Objective[];
  currentQuarter: string;
  lastUpdated: string;
}

interface Objective {
  id: string;
  title: string;
  description: string;
  keyResults: KeyResult[];
  progress: number;
  isCompleted: boolean;
  quarter: string;
}

interface KeyResult {
  id: string;
  description: string;
  progress: number;
  target: number;
  unit: string;
  isCompleted: boolean;
}
```

## AI Coach Capabilities

The AI coach provides expert guidance on:

### OKR Best Practices:
- Objectives should be inspirational, qualitative, and time-bound
- Key Results should be measurable, specific, and achievable
- Aim for 3-5 objectives per quarter with 3-4 key results each
- Progress should be updated regularly (weekly/bi-weekly)
- OKRs should be challenging but realistic (70% achievement is good)

### Coaching Features:
- **Strategic Guidance**: Help align OKRs with company goals
- **Progress Analysis**: Analyze current progress and suggest improvements
- **Best Practice Recommendations**: Ensure OKRs follow proven methodologies
- **Conversational Interface**: Natural language interaction for easy use

## Development

### Project Structure:
- `index.ts`: Main Express server with all API endpoints
- `okr-agent.ts`: LangGraph agent implementation with tools and workflows
- `copilot-integration.ts`: CopilotKit integration module

### Key Dependencies:
- **Express**: Web framework
- **LangChain**: AI/ML framework
- **LangGraph**: Agent workflow management
- **CopilotKit**: Frontend-backend AI integration
- **OpenAI**: Language model provider
- **TypeScript**: Type safety

### Development Commands:
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Environment Variables

```bash
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional
PORT=4000
NODE_ENV=development
```

## Error Handling

The backend includes comprehensive error handling:
- Graceful error responses
- Detailed logging
- Type-safe error handling
- Proper HTTP status codes

## CORS Configuration

Configured to work with common frontend development servers:
- `http://localhost:3000` (React/Next.js)
- `http://localhost:5173` (Vite)

## Production Deployment

For production deployment:

1. Set environment variables
2. Build the application
3. Start the server
4. Configure reverse proxy (nginx/Apache)
5. Set up SSL certificates
6. Configure monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.