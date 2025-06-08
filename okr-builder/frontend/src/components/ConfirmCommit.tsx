import { Box, Button, Typography } from '@mui/material';

interface ConfirmCommitProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmCommit({ onConfirm, onCancel }: ConfirmCommitProps) {
  return (
    <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
      <Typography>Are you sure you want to commit these OKRs?</Typography>
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button variant="contained" color="primary" onClick={onConfirm}>
          Yes
        </Button>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          No
        </Button>
      </Box>
    </Box>
  );
}