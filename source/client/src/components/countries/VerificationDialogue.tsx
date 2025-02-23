import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

interface CancelDialogProps {
  dialogFor: "edit" | "delete" | "add";
  open: boolean; // A boolean value that controls whether the dialog is visible or not.
  onClose: () => void; // A function that closes the dialog when triggered.
  onCancele?: () => void; // A function triggered when the user clicks "Yes" to cancel an action like editing or adding. Default is an empty function.
  onDelete?: (id: string) => void; // A function triggered when the user confirms to delete a country. This takes an id (countryId) to delete the specific country. Default is an empty function.
  countryId?: string; // The ID of the country being edited, added, or deleted. Used to delete a specific country when the dialog confirms the deletion.
}

const VerificationDialog: React.FC<CancelDialogProps> = ({
  dialogFor,
  open,
  onClose,
  onCancele = () => {},
  onDelete = () => {},
  countryId = "",
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        <p>
          Do you really want to
          {dialogFor === "delete"
            ? " delete "
            : ` cancel ${dialogFor === "edit" ? "editing" : "adding"} `}
          this country?
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          No
        </Button>
        <Button
          onClick={() => {
            if (dialogFor === "delete") {
              onDelete(countryId);
            } else {
              onCancele();
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

export default VerificationDialog;
