import { useState } from 'react';
import {
  ListItem,
  ListItemText,
  TextField,
  Box,
  LinearProgress,
  IconButton,
  Typography,

  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import type { KeyResult, Progress } from '@shared/types';

interface KeyResultItemProps {
  keyResult: KeyResult;
  onUpdate: (keyResult: KeyResult) => void;
  onDelete: (keyResultId: string) => void;
}

export default function KeyResultItem({ keyResult, onUpdate, onDelete }: KeyResultItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editSummary, setEditSummary] = useState(keyResult.summary);
  const [editProgress, setEditProgress] = useState(keyResult.actualProgress?.progress);
  const [editTarget, setEditTarget] = useState(keyResult.target);
  const [editUnits, setEditUnits] = useState(keyResult.units);

  const handleSave = () => {
    const updatedKeyResult: KeyResult = {
      ...keyResult,
      summary: editSummary,
      actualProgress: {
        ...keyResult.actualProgress,
        progress: editProgress,
      } as Progress,
      target: editTarget,
      units: editUnits,
    };
    onUpdate(updatedKeyResult);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditSummary(keyResult.summary);
    setEditProgress(keyResult.actualProgress?.progress);
    setEditTarget(keyResult.target);
    setEditUnits(keyResult.units);
    setIsEditing(false);
  };

  const progress = keyResult.actualProgress?.progress || 0;
  const target = keyResult.target || 0;
  const progressPercentage = target > 0 ? Math.min((progress / target) * 100, 100) : 0;
  const isCompleted = progress >= target;

  return (
    <ListItem
      sx={{
        flexDirection: 'column',
        alignItems: 'stretch',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        mb: 1,
        bgcolor: 'background.paper'
      }}
    >
      {isEditing ? (
        <Box sx={{ width: '100%' }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Summary"
            value={editSummary}
            onChange={(e) => setEditSummary(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box display="flex" gap={1} mb={2}>
            <TextField
              variant="outlined"
              size="small"
              label="Progress"
              type="number"
              value={editProgress}
              onChange={(e) => setEditProgress(Number(e.target.value))}
              sx={{ flex: 1 }}
            />
            <TextField
              variant="outlined"
              size="small"
              label="Target"
              type="number"
              value={editTarget}
              onChange={(e) => setEditTarget(Number(e.target.value))}
              sx={{ flex: 1 }}
            />
            <TextField
              variant="outlined"
              size="small"
              label="Units"
              value={editUnits}
              onChange={(e) => setEditUnits(e.target.value)}
              sx={{ flex: 1 }}
            />
          </Box>
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <IconButton size="small" onClick={handleSave} color="primary">
              <SaveIcon />
            </IconButton>
            <IconButton size="small" onClick={handleCancel}>
              <CancelIcon />
            </IconButton>
          </Box>
        </Box>
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" width="100%">
            <ListItemText
              primary={keyResult.summary}
              secondary={
                <Box sx={{ mt: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="caption">
                      {progress} / {target} {keyResult.units}
                    </Typography>
                    <Chip
                      label={`${Math.round(progressPercentage)}%`}
                      size="small"
                      color={isCompleted ? 'success' : progressPercentage >= 75 ? 'warning' : 'default'}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={progressPercentage}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              }
            />
            <Box display="flex" gap={0.5}>
              <IconButton size="small" onClick={() => setIsEditing(true)}>
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onDelete(keyResult.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </>
      )}
    </ListItem>
  );
}