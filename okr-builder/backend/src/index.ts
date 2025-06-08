import express, { Request, Response } from 'express';
import cors from 'cors';
import { CopilotRuntime, copilotRuntimeNodeHttpEndpoint, OpenAIAdapter } from '@copilotkit/runtime';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { HumanMessage } from '@langchain/core/messages';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Frontend URLs
  credentials: true
}));
app.use(express.json());

// CopilotKit endpoint
app.all('/api/copilotkit', (req, res) => {
  const handler = copilotRuntimeNodeHttpEndpoint({
    runtime: new CopilotRuntime(),
    serviceAdapter: new OpenAIAdapter({ openai: new OpenAI() }),
    endpoint: '/api/copilotkit',
  });
  return handler(req, res);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`🚀 OKR Builder backend running on port ${port}`);
  console.log(`✅ Health check available at http://localhost:${port}/health`);
});