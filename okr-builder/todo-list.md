Project To-Do List: AI-Powered OKR Builder
Phase 1: Project Scaffolding & Backend Setup
[ ] Create a root project directory named okr-builder.
[ ] Create two subdirectories within okr-builder: frontend and backend.
[ ] Backend: Navigate to the backend directory and initialize a Node.js project (npm init -y).
[ ] Backend: Install dependencies: express, cors, @langchain/openai, @langchain/core, langgraph, @copilotkit/runtime, @copilotkit/shared, typescript, ts-node-dev, and corresponding @types.
[ ] Backend: Create a tsconfig.json file (npx tsc --init).
[ ] Backend: Create backend/src/index.ts and set up a basic Express server with cors middleware.
[ ] Frontend: Navigate to the frontend directory and initialize a React + TypeScript project (e.g., npm create vite@latest . -- --template react-ts).
[ ] Frontend: Install dependencies: @copilotkit/react-core, @copilotkit/react-ui, @copilotkit/runtime-client-gql, tailwindcss, postcss, autoprefixer.
[ ] Frontend: Initialize Tailwind CSS.
Phase 2: Defining Data Structures and State
[ ] Create a shared directory in the project root.
[ ] Create shared/types.ts and define the KeyResult, Objective, and OKRAgentState interfaces.
[ ] Update tsconfig.json in both frontend and backend to allow imports from the shared directory.
[ ] Create shared/initial-state.ts and define the INITIAL_STATE constant.
Phase 3: Building the LangGraph Agent in Node.js
[ ] Backend: In backend/src/index.ts, import CopilotRuntime and create an instance.
[ ] Backend: Set up a POST endpoint at /api/copilotkit to handle requests using copilotRuntime.stream.
[ ] Backend: Create a new file backend/src/okr-agent.ts.
[ ] Backend: In okr-agent.ts, build the LangGraph.js agent structure.
[ ] Backend: Ensure the agent's state management uses the shared OKRAgentState interface.
[ ] Backend: Define a tool named update_okrs using Zod for schema validation.
[ ] Backend: Implement the logic for the update_okrs tool to modify the agent's state.
[ ] Backend: Write a system prompt for the AI, instructing it on its role as an OKR coach and how to use the available tools.
Phase 4: Developing the React Frontend
[ ] Frontend: In the main App.tsx component, wrap the application with the <CopilotKit> provider.
[ ] Frontend: Point the runtimeUrl prop in <CopilotKit> to the backend server (e.g., http://localhost:4000/api/copilotkit).
[ ] Frontend: Create the OKRBuilder.tsx component.
[ ] Frontend: In OKRBuilder.tsx, use the useCoAgent hook and initialize its state with INITIAL_STATE.
[ ] Frontend: Develop the ObjectiveCard.tsx and KeyResultItem.tsx components.
[ ] Frontend: Implement UI controls (inputs, buttons, sliders) for adding, editing, and removing objectives and key results.
[ ] Frontend: Connect UI interactions to the setAgentState function to sync changes with the backend.
[ ] Frontend: Style all new components using Tailwind CSS.
Phase 5: Integration and Final Touches
[ ] In the root package.json, install concurrently.
[ ] Add a script to the root package.json to run both frontend and backend servers simultaneously (e.g., "dev": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\"").
[ ] Run the application and perform end-to-end testing of the bidirectional state synchronization.
[ ] Test that UI changes update the agent's state.
[ ] Test that agent-initiated changes (via chat) update the UI in real-time.
[ ] Frontend: Refine the chat suggestions provided to useCopilotChatSuggestions to be relevant for OKR planning.
[ ] Review the entire application for bugs and finalize the UI/UX.