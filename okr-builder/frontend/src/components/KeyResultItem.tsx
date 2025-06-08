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
import type { KeyResult } from '@shared/types';

interface KeyResultItemProps {
  keyResult: KeyResult;
  onUpdate: (keyResult: KeyResult) => void;
  onDelete: (keyResultId: string) => void;
}

export default function KeyResultItem({ keyResult, onUpdate, onDelete }: KeyResultItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState(keyResult.description);
  const [editProgress, setEditProgress] = useState(keyResult.progress);
  const [editTarget, setEditTarget] = useState(keyResult.target);
  const [editUnit, setEditUnit] = useState(keyResult.unit);

  const handleSave = () => {
    const updatedKeyResult: KeyResult = {
      ...keyResult,
      description: editDescription,
      progress: editProgress,
      target: editTarget,
      unit: editUnit,
      isCompleted: editProgress >= editTarget
    };
    onUpdate(updatedKeyResult);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditDescription(keyResult.description);
    setEditProgress(keyResult.progress);
    setEditTarget(keyResult.target);
    setEditUnit(keyResult.unit);
    setIsEditing(false);
  };

  const progressPercentage = Math.min((keyResult.progress / keyResult.target) * 100, 100);

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
            label="Description"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
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
              label="Unit"
              value={editUnit}
              onChange={(e) => setEditUnit(e.target.value)}
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
              primary={keyResult.description}
              secondary={
                <Box sx={{ mt: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="caption">
                      {keyResult.progress} / {keyResult.target} {keyResult.unit}
                    </Typography>
                    <Chip
                      label={`${Math.round(progressPercentage)}%`}
                      size="small"
                      color={keyResult.isCompleted ? 'success' : progressPercentage >= 75 ? 'warning' : 'default'}
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