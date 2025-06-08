import { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  Box,
  LinearProgress,
  IconButton,
  Collapse,
  List,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon
} from '@mui/icons-material';
import type { Objective, KeyResult, OKRAgentState } from '@shared/types';
import { useCoAgent } from '@copilotkit/react-core';
import KeyResultItem from './KeyResultItem';

interface ObjectiveCardProps {
  objectiveId: string;
  onUpdate: (objective: Objective) => void;
  onDelete: (objectiveId: string) => void;
}

export default function ObjectiveCard({
  objectiveId,
  onUpdate,
  onDelete,
}: ObjectiveCardProps) {
  const { state } = useCoAgent<OKRAgentState>({
    name: 'okr_agent',
  });

  const objective = state.objectives?.find((o) => o.id === objectiveId) ?? null;

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [expanded, setExpanded] = useState(false);

  useState(() => {
    if (objective) {
      setEditTitle(objective.title);
      setEditDescription(objective.description);
    }
  });

  if (!objective) {
    return null;
  }

  const handleSave = () => {
    const updatedObjective: Objective = {
      ...objective,
      title: editTitle,
      description: editDescription
    };
    onUpdate(updatedObjective);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(objective.title);
    setEditDescription(objective.description);
    setIsEditing(false);
  };

  const addKeyResult = () => {
    const newKeyResult: KeyResult = {
      id: `${objective.id}-${Date.now()}`,
      description: 'New key result',
      progress: 0,
      target: 100,
      unit: '%',
      isCompleted: false
    };

    const updatedObjective: Objective = {
      ...objective,
      keyResults: [...objective.keyResults, newKeyResult]
    };
    onUpdate(updatedObjective);
  };

  const updateKeyResult = (updatedKeyResult: KeyResult) => {
    const updatedObjective: Objective = {
      ...objective,
      keyResults: objective.keyResults.map(kr =>
        kr.id === updatedKeyResult.id ? updatedKeyResult : kr
      )
    };

    // Recalculate objective progress
    const totalProgress = updatedObjective.keyResults.reduce((sum, kr) => {
      const krProgress = Math.min((kr.progress / kr.target) * 100, 100);
      return sum + krProgress;
    }, 0);
    updatedObjective.progress = Math.round(totalProgress / updatedObjective.keyResults.length) || 0;

    onUpdate(updatedObjective);
  };

  const deleteKeyResult = (keyResultId: string) => {
    const updatedObjective: Objective = {
      ...objective,
      keyResults: objective.keyResults.filter(kr => kr.id !== keyResultId)
    };
    onUpdate(updatedObjective);
  };

  return (
    <Card elevation={2} sx={{ height: 'fit-content' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box flex={1}>
            {isEditing ? (
              <TextField
                fullWidth
                variant="outlined"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                sx={{ mb: 1 }}
                size="small"
              />
            ) : (
              <Typography variant="h6" component="h2" gutterBottom>
                {objective.title}
              </Typography>
            )}
          </Box>
          <Box display="flex" gap={1}>
            <Chip
              label={`${objective.progress}%`}
              color={objective.progress >= 75 ? 'success' : objective.progress >= 50 ? 'warning' : 'default'}
              size="small"
            />
          </Box>
        </Box>

        {isEditing ? (
          <TextField
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            sx={{ mb: 2 }}
            size="small"
          />
        ) : (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {objective.description}
          </Typography>
        )}

        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={objective.progress}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            {objective.keyResults.length} Key Results
          </Typography>
          <Button
            size="small"
            startIcon={<ExpandMoreIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Hide' : 'Show'} Key Results
          </Button>
        </Box>

        <Collapse in={expanded}>
          <Box sx={{ mt: 2 }}>
            <List dense>
              {objective.keyResults.map((keyResult) => (
                <KeyResultItem
                  key={keyResult.id}
                  keyResult={keyResult}
                  onUpdate={updateKeyResult}
                  onDelete={deleteKeyResult}
                />
              ))}
            </List>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={addKeyResult}
              sx={{ mt: 1 }}
            >
              Add Key Result
            </Button>
          </Box>
        </Collapse>
      </CardContent>

      <CardActions>
        {isEditing ? (
          <>
            <IconButton size="small" onClick={handleSave} color="primary">
              <SaveIcon />
            </IconButton>
            <IconButton size="small" onClick={handleCancel}>
              <CancelIcon />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton size="small" onClick={() => setIsEditing(true)}>
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(objective.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </CardActions>
    </Card>
  );
}