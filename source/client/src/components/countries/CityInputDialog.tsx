import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";

interface CityInputDialogProps {
  open: boolean;
  onClose: () => void;
  onAddCity: (cityName: string) => void;
}

const CityInputDialog: React.FC<CityInputDialogProps> = ({
  open,
  onClose,
  onAddCity,
}) => {
  const [cityName, setCityName] = useState("");

  // Adds the city if valid, clears input, closes dialog.
  const handleAddCity = () => {
    if (cityName.trim()) {
      onAddCity(cityName);
      setCityName("");
      onClose();
    } else {
      alert("City name cannot be empty");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Enter a new city name</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="City Name"
          type="text"
          fullWidth
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAddCity} color="secondary">
          Add City
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CityInputDialog;
