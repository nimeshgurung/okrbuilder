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
import type { Objective as BaseObjective } from '@shared/types';
import { ObjectiveCard, ConfirmCommit } from './index';
import { Role, TextMessage } from '@copilotkit/runtime-client-gql';
import { useEffect, useRef, useState } from 'react';

type ObjectiveWithStatus = BaseObjective & {
  status: 'draft' | 'committed';
};

export default function OKRBuilder() {
  const { state, setState } = useCoAgent<ObjectiveWithStatus[]>({
    name: 'okr_agent',
    initialState: [],
  });
  const { appendMessage } = useCopilotChat();
  const isFirstRender = useRef(true);
  const [objectiveToCommit, setObjectiveToCommit] = useState<ObjectiveWithStatus | null>(null);

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
      { name: 'summary', type: 'string' as const, description: 'The objective summary.' },
      {
        name: 'keyResults',
        type: 'object[]' as const,
        description: 'The key results of the objective.',
        attributes: [
          { name: 'id', type: 'string' as const },
          { name: 'summary', type: 'string' as const },
          { name: 'progress', type: 'number' as const },
          { name: 'target', type: 'number' as const },
          { name: 'units', type: 'string' as const },
        ],
      },
    ],
  };

  useCopilotAction({
    name: 'addObjective',
    description: 'Add an objective to the OKR list.',
    parameters: [objectiveParameter],
    handler: async (args) => {
      const { objective } = args as unknown as { objective: BaseObjective };

      const newObjective: ObjectiveWithStatus = {
        ...objective,
        id: Date.now().toString(),
        keyResults: objective.keyResults || [],
        status: 'draft',
      };
      setState((prevState) => {
        if (!prevState) return [newObjective];
        return [...prevState, newObjective];
      });
      return newObjective;
    },
    render: ({ status, result, args }) => {
      if (status === 'inProgress') {
        const { objective } = args as unknown as { objective: BaseObjective };
        return (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
            <CircularProgress size={20} />
            <Typography>Adding objective: "{objective?.summary || 'New Objective'}"...</Typography>
          </Box>
        );
      }
      if (status === 'complete') {
        const currentObjective = state.find((o) => o.id === result.id);
        if (!currentObjective) return <></>;
        return (
          <Box sx={{ maxWidth: 600, mt: 2 }}>
            <ObjectiveCard
              objective={currentObjective}
              onUpdate={updateObjective}
              onDelete={deleteObjective}
              onCommit={() => setObjectiveToCommit(currentObjective)}
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
      const { objective } = args as unknown as { objective: BaseObjective };
      updateObjective(objective as ObjectiveWithStatus);
      return objective;
    },
    render: ({ status, result }) => {
      if (status === 'inProgress') {
        return <Typography sx={{ mt: 2 }}>Updating objective...</Typography>;
      }
      if (status === 'complete' && result) {
        const currentObjective = state.find((o) => o.id === (result as BaseObjective).id);
        if (!currentObjective) return <></>;
        return (
          <Box sx={{ maxWidth: 600, mt: 2 }}>
            <ObjectiveCard
              objective={currentObjective}
              onUpdate={updateObjective}
              onDelete={deleteObjective}
              onCommit={() => setObjectiveToCommit(currentObjective)}
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

  useCopilotAction({
    name: 'showOKRCommitConfirmation',
    description: `
    This action displays a confirmation dialog to commit an OKR.
    IMPORTANT: This action does NOT automatically commit the OKR.
    It only shows a confirmation dialog to the user.

    To determine if an OKR was actually committed:
    1. Check if the objective exists in state
    2. Check if its status is 'committed'
    3. Only then confirm the commit was successful

    Example:
    - User says "commit the OKR" -> Show confirmation dialog
    - User clicks confirm -> Status changes to 'committed'
    - Only NOW can you confirm "The OKR has been committed"
    `,
    parameters: [
      {
        name: 'objectiveId',
        type: 'string',
        description: 'The ID of the objective to potentially commit.',
      },
    ],
    render: (props) => {
      switch (props.status) {
        case 'complete': {
          const { args } = props as unknown as {
            args: { objectiveId: string };
          };
          const objective = state?.find((o) => o.id === args.objectiveId);
          if (!objective) return <></>;
          return (
            <ConfirmCommit
              onConfirm={() => {
                setState((prev) =>
                  (prev || []).map((o) =>
                    o.id === args.objectiveId ? { ...o, status: 'committed' } : o,
                  ),
                );
              }}
              onCancel={() => {
                // Trigger a re-render to dismiss the action's UI
                setState((prev) => [...(prev || [])]);
              }}
            />
          );
        }
        default:
          return <></>;
      }
    },
  });

  useCopilotChatSuggestions(
    {
      instructions: `
      I'm here to help you refine and enhance your Key Results. Looking at your objectives, I can suggest:
      1. Additional specific, measurable key results that align with each objective
      2. Ways to improve existing key result descriptions to be more actionable and measurable
      3. Adjustments to make your key results more ambitious yet achievable
      4. Better metrics and units to track progress effectively

      Remember, great key results should be quantifiable and time-bound. Let me help you strengthen them.

      It's VITAL and IMPORTANT that after any modifications to Key Results, I'll update the OKR state to reflect changes.
      I'll keep you informed of the latest state in a clear, user-friendly way. Here's your current OKR state:
      ${JSON.stringify(
        state.map((o) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const {  status, ...rest } = o;
          return rest;
        }),
        null,
        2,
      )}
    `,
    },
    [state],
  );

  const addObjective = () => {
    const newObjective: ObjectiveWithStatus = {
      id: Date.now().toString(),
      summary: 'New Objective',
      keyResults: [],
      status: 'draft',
    };
    setState((prevState) => [...(prevState || []), newObjective]);
  };

  const updateObjective = (updatedObjective: ObjectiveWithStatus) => {
    setState((prevState) =>
      (prevState || []).map((o) => (o.id === updatedObjective.id ? updatedObjective : o)),
    );
  };

  const deleteObjective = (objectiveId: string) => {
    setState((prevState) => (prevState || []).filter((o) => o.id !== objectiveId));
  };

  const handleConfirmCommit = () => {
    if (objectiveToCommit) {
      const updatedObjective: ObjectiveWithStatus = {
        ...objectiveToCommit,
        status: 'committed',
      };
      updateObjective(updatedObjective);
      setObjectiveToCommit(null);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, position: 'relative' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            My OKRs
          </Typography>
          <IconButton
            color="primary"
            aria-label="add objective"
            onClick={addObjective}
          >
            <AddIcon />
          </IconButton>
        </Box>
        <Stack spacing={3}>
          {state?.map((objective) => (
            <ObjectiveCard
              key={objective.id}
              objective={objective}
              onUpdate={updateObjective}
              onDelete={deleteObjective}
              onCommit={() => setObjectiveToCommit(objective)}
            />
          ))}
        </Stack>
        {objectiveToCommit && (
          <ConfirmCommit
            onConfirm={handleConfirmCommit}
            onCancel={() => setObjectiveToCommit(null)}
          />
        )}
      </Paper>
    </Container>
  );
}