// DeleteDialog.tsx
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

interface CancelDialogProps {
  open: boolean;
  onClose: () => void;
  onCancele: () => void; // Triggers the cancellation action.
}

const CancelDialog: React.FC<CancelDialogProps> = ({
  open,
  onClose,
  onCancele,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        <p>Do you really want to cancel editing this country?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          No
        </Button>
        <Button onClick={onCancele} color="secondary">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelDialog;
