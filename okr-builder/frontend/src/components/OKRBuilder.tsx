import {
  Container,
  Typography,
  Box,
  Paper,
  Stack,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import {
  useCoAgent,
  useCopilotAction,
  useCopilotChat,
} from '@copilotkit/react-core';
import { useCopilotChatSuggestions } from '@copilotkit/react-ui';
import type { Objective, OKRAgentState } from '@shared/types';
import { INITIAL_STATE } from '@shared/initial-state';
import { ObjectiveCard } from './index';
import { Role, TextMessage } from '@copilotkit/runtime-client-gql';
import { useEffect, useRef } from 'react';

export default function OKRBuilder() {
  const { state, setState } = useCoAgent<OKRAgentState>({
    name: 'okr_agent',
    initialState: INITIAL_STATE,
  });
  const { appendMessage } = useCopilotChat();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    appendMessage(
      new TextMessage({
        content: `The user has updated the OKRs. The new state is: ${JSON.stringify(
          state,
          null,
          2,
        )}`,
        role: Role.System,
      }),
      {
        followUp: false,
      },
    );
  }, [state, appendMessage]);

  const objectiveParameter = {
    name: 'objective',
    type: 'object' as const,
    description: 'The objective object.',
    attributes: [
      { name: 'id', type: 'string' as const, description: 'The objective ID.' },
      { name: 'title', type: 'string' as const, description: 'The objective title.' },
      { name: 'description', type: 'string' as const, description: 'The objective description.' },
      {
        name: 'keyResults',
        type: 'object[]' as const,
        description: 'The key results of the objective.',
        attributes: [
          { name: 'id', type: 'string' as const },
          { name: 'description', type: 'string' as const },
          { name: 'progress', type: 'number' as const },
          { name: 'target', type: 'number' as const },
          { name: 'unit', type: 'string' as const },
          { name: 'isCompleted', type: 'boolean' as const },
        ],
      },
    ],
  };

  useCopilotAction({
    name: 'addObjective',
    description: 'Add an objective to the OKR list.',
    parameters: [objectiveParameter],
    handler: async (args) => {
      const { objective } = args as unknown as { objective: Objective };

      const newObjective: Objective = {
        ...objective,
        id: Date.now().toString(),
        quarter: state.currentQuarter,
        progress: 0,
        isCompleted: false,
        keyResults: objective.keyResults || [],
      };
      setState((prevState) => {
        if (!prevState) return INITIAL_STATE;
        return {
          ...prevState,
          objectives: [...prevState.objectives, newObjective],
          lastUpdated: new Date().toISOString(),
        };
      });
      return newObjective;
    },
    render: ({ status, result, args }) => {
      if (status === 'inProgress') {
        const { objective } = args as unknown as { objective: Objective };
        return (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
            <CircularProgress size={20} />
            <Typography>Adding objective: "{objective?.title || 'New Objective'}"...</Typography>
          </Box>
        );
      }
      if (status === 'complete') {
        return (
          <Box sx={{ maxWidth: 600, mt: 2 }}>
            <ObjectiveCard
              objectiveId={result.id}
              onUpdate={updateObjective}
              onDelete={deleteObjective}
            />
          </Box>
        );
      }
      return <></>;
    },
  });

  useCopilotAction({
    name: 'updateObjective',
    description: 'Update an objective in the OKR list.',
    parameters: [objectiveParameter],
    handler: async (args) => {
      const { objective } = args as unknown as { objective: Objective };
      updateObjective(objective);
      return objective;
    },
    render: ({ status, result }) => {
      if (status === 'inProgress') {
        return <Typography sx={{ mt: 2 }}>Updating objective...</Typography>;
      }
      if (status === 'complete' && result) {
        return (
          <Box sx={{ maxWidth: 600, mt: 2 }}>
            <ObjectiveCard
              objectiveId={result.id}
              onUpdate={updateObjective}
              onDelete={deleteObjective}
            />
          </Box>
        );
      }
      return <></>;
    },
  });

  useCopilotAction({
    name: 'deleteObjective',
    description: 'Delete an objective from the OKR list.',
    parameters: [
      {
        name: 'objectiveId',
        type: 'string',
        description: 'The ID of the objective to delete.',
      },
    ],
    handler: async (args) => {
      const { objectiveId } = args as unknown as { objectiveId: string };
      deleteObjective(objectiveId);
    },
    render: ({ args }) => {
      const { objectiveId } = args as unknown as { objectiveId: string };
      return (
        <Typography sx={{ mt: 2 }}>
          Objective with ID {objectiveId} has been deleted.
        </Typography>
      );
    },
  });

  useCopilotChatSuggestions(
    {
      instructions: `
      Suggest actions for creating and managing OKRs.
      The user can create a new objective, ask for key results for an existing objective, or ask for a summary of progress.

      Here is the current state of the OKRs:
      ${JSON.stringify(state, null, 2)}
    `,
    },
    [state],
  );

  const addObjective = () => {
    const newObjective: Objective = {
      id: Date.now().toString(),
      title: 'New Objective',
      description: 'Click to edit this objective',
      quarter: state.currentQuarter,
      progress: 0,
      isCompleted: false,
      keyResults: [],
    };

    setState((prevState) => {
      if (!prevState) return INITIAL_STATE;
      return {
        ...prevState,
        objectives: [...prevState.objectives, newObjective],
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  const updateObjective = (updatedObjective: Objective) => {
    setState((prevState) => {
      if (!prevState) return INITIAL_STATE;
      return {
        ...prevState,
        objectives: prevState.objectives.map((obj) =>
          obj.id === updatedObjective.id ? updatedObjective : obj,
        ),
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  const deleteObjective = (objectiveId: string) => {
    setState((prevState) => {
      if (!prevState) return INITIAL_STATE;
      return {
        ...prevState,
        objectives: prevState.objectives.filter(
          (obj) => obj.id !== objectiveId,
        ),
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <Typography variant="h3" component="h1" gutterBottom>
                OKR Builder
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {state.currentQuarter}
              </Typography>
            </div>
            <IconButton
              color="primary"
              aria-label="add objective"
              onClick={addObjective}
              size="large"
            >
              <AddIcon fontSize="inherit" />
            </IconButton>
          </Box>
        </Paper>

        <Stack spacing={3}>
          {state.objectives.map((objective) => (
            <Box key={objective.id} sx={{ maxWidth: 600 }}>
              <ObjectiveCard
                objectiveId={objective.id}
                onUpdate={updateObjective}
                onDelete={deleteObjective}
              />
            </Box>
          ))}
        </Stack>
      </Box>
    </Container>
  );
}