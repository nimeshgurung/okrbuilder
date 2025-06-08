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
import type { Objective as BaseObjective, KeyResult } from '@shared/types';
import KeyResultItem from './KeyResultItem';

type ObjectiveWithStatus = BaseObjective & {
  status: 'draft' | 'committed';
};

interface ObjectiveCardProps {
  objective: ObjectiveWithStatus;
  onUpdate: (objective: ObjectiveWithStatus) => void;
  onDelete: (objectiveId: string) => void;
  onCommit: (objectiveId: string) => void;
}

export default function ObjectiveCard({
  objective,
  onUpdate,
  onDelete,
  onCommit,
}: ObjectiveCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editSummary, setEditSummary] = useState(objective.summary);
  const [expanded, setExpanded] = useState(false);

  if (!objective) {
    return null;
  }

  const handleSave = () => {
    const updatedObjective: ObjectiveWithStatus = {
      ...objective,
      summary: editSummary,
    };
    onUpdate(updatedObjective);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditSummary(objective.summary);
    setIsEditing(false);
  };

  const addKeyResult = () => {
    const newKeyResult: KeyResult = {
      id: `${objective.id}-${Date.now()}`,
      summary: 'New key result',
      actualProgress: {
        progress: 0,
        percent: 0,
        total: 100,
      },
      target: 100,
      units: '%',
    };

    const updatedObjective: ObjectiveWithStatus = {
      ...objective,
      keyResults: [...objective.keyResults, newKeyResult]
    };
    onUpdate(updatedObjective);
  };

  const updateKeyResult = (updatedKeyResult: KeyResult) => {
    const updatedObjective: ObjectiveWithStatus = {
      ...objective,
      keyResults: objective.keyResults.map(kr =>
        kr.id === updatedKeyResult.id ? updatedKeyResult : kr
      )
    };
    onUpdate(updatedObjective);
  };

  const deleteKeyResult = (keyResultId: string) => {
    const updatedObjective: ObjectiveWithStatus = {
      ...objective,
      keyResults: objective.keyResults.filter(kr => kr.id !== keyResultId)
    };
    onUpdate(updatedObjective);
  };

  const objectiveProgress =
    objective.keyResults.length > 0
      ? objective.keyResults.reduce((sum, kr) => {
          const progress = kr.actualProgress?.progress || 0;
          const target = kr.target || 0;
          const krProgress = target > 0 ? (progress / target) * 100 : 0;
          return sum + krProgress;
        }, 0) / objective.keyResults.length
      : 0;

  return (
    <Card elevation={2} sx={{ height: 'fit-content' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box flex={1}>
            {isEditing ? (
              <TextField
                fullWidth
                variant="outlined"
                value={editSummary}
                onChange={(e) => setEditSummary(e.target.value)}
                sx={{ mb: 1 }}
                size="small"
              />
            ) : (
              <Typography variant="h6" component="h2" gutterBottom>
                {objective.summary}
              </Typography>
            )}
          </Box>
          <Box display="flex" gap={1}>
            <Chip
              label={objective.status}
              size="small"
              color={objective.status === 'committed' ? 'success' : 'default'}
              sx={{ textTransform: 'capitalize' }}
            />
            <Chip
              label={`${Math.round(objectiveProgress)}%`}
              color={objectiveProgress >= 75 ? 'success' : objectiveProgress >= 50 ? 'warning' : 'default'}
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
            value={editSummary}
            onChange={(e) => setEditSummary(e.target.value)}
            sx={{ mb: 2 }}
            size="small"
          />
        ) : (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {objective.summary}
          </Typography>
        )}

        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={objectiveProgress}
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
            {objective.status === 'draft' && (
              <Button size="small" onClick={() => onCommit(objective.id)}>
                Commit
              </Button>
            )}
          </>
        )}
      </CardActions>
    </Card>
  );
}