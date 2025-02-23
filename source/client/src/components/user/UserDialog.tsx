// DeleteDialog.tsx
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

interface CancelDialogProps {
  dialogFor: "logOut"; // Determines the action for confirmation
  open: boolean;
  onClose: () => void; // Closes the dialog when triggered.
  onOK?: () => void; // Handles the "Yes" action (default: no operation).
}

const userDialog: React.FC<CancelDialogProps> = ({
  dialogFor,
  open,
  onClose,
  onOK = () => {},
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        <p>
          Do you really want to
          {dialogFor === "logOut" ? " logout " : ` `}
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          No
        </Button>
        <Button
          onClick={() => {
            if (dialogFor === "logOut") {
              onOK();
            }
          }}
          color="secondary"
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default userDialog;
