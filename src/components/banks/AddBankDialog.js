import { useEffect, useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

const AddBankDialog = ({
  open,
  mode = "add",
  bank = null,
  existingBanks = [],
  isSubmitting = false,
  apiError = "",
  onClose,
  onSubmit,
}) => {
  const [bankName, setBankName] = useState("");
  const [bankNameError, setBankNameError] =
    useState("");

  const isEditMode = mode === "edit";

  useEffect(() => {
    if (open) {
      setBankName(
        isEditMode && bank ? bank.name : ""
      );

      setBankNameError("");
    }
  }, [open, bank, isEditMode]);

  const validateBankName = () => {
    const trimmedName = bankName.trim();

    if (!trimmedName) {
      setBankNameError("Bank name is required.");
      return false;
    }

    if (trimmedName.length < 2) {
      setBankNameError(
        "Bank name must contain at least 2 characters."
      );

      return false;
    }

    if (trimmedName.length > 100) {
      setBankNameError(
        "Bank name cannot exceed 100 characters."
      );

      return false;
    }

    const duplicateBank = existingBanks.some(
      (existingBank) =>
        existingBank.id !== bank?.id &&
        existingBank.name.trim().toLowerCase() ===
          trimmedName.toLowerCase()
    );

    if (duplicateBank) {
      setBankNameError(
        "A bank with this name already exists."
      );

      return false;
    }

    setBankNameError("");

    return true;
  };

  const handleChange = (event) => {
    setBankName(event.target.value);

    if (bankNameError) {
      setBankNameError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateBankName()) {
      return;
    }

    await onSubmit({
      name: bankName.trim(),
    });
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow:
            "0 24px 60px rgba(16, 24, 40, 0.18)",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          pt: 3,
          pb: 1.5,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          component="span"
          sx={{
            fontSize: 22,
            fontWeight: 750,
            color: "#101828",
          }}
        >
          {isEditMode ? "Edit Bank" : "Add Bank"}
        </Typography>

        <IconButton
          onClick={handleClose}
          disabled={isSubmitting}
          sx={{
            ml: "auto",
            width: 38,
            height: 38,
            color: "#667085",
            fontSize: 26,
          }}
        >
          ×
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          px: 3,
          pb: 3,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
        >
          <Typography
            component="label"
            htmlFor="bank-name"
            sx={{
              display: "block",
              mb: 1,
              fontSize: 14,
              fontWeight: 650,
              color: "#344054",
            }}
          >
            Bank Name{" "}
            <Box
              component="span"
              sx={{
                color: "#f23a17",
              }}
            >
              *
            </Box>
          </Typography>

          <TextField
            id="bank-name"
            value={bankName}
            onChange={handleChange}
            placeholder="Enter bank name"
            error={Boolean(bankNameError)}
            helperText={
              bankNameError ||
              "Bank name must be between 2 and 100 characters."
            }
            disabled={isSubmitting}
            fullWidth
            autoFocus
            inputProps={{
              maxLength: 100,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                minHeight: 52,
                borderRadius: 2,

                "&.Mui-focused fieldset": {
                  borderColor: "#f23a17",
                },
              },

              "& .MuiFormHelperText-root": {
                mx: 0,
              },
            }}
          />

          {apiError && (
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: 2,
                border: "1px solid #fecdca",
                backgroundColor: "#fef3f2",
                color: "#b42318",
                fontSize: 14,
              }}
            >
              {apiError}
            </Box>
          )}

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "flex-end",
              gap: 1.5,
            }}
          >
            <Button
              type="button"
              variant="outlined"
              onClick={handleClose}
              disabled={isSubmitting}
              sx={{
                minWidth: 100,
                minHeight: 44,
                color: "#344054",
                borderColor: "#d0d5dd",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 650,
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                minWidth: 120,
                minHeight: 44,
                borderRadius: 2,
                backgroundColor: "#f23a17",
                boxShadow: "none",
                textTransform: "none",
                fontWeight: 700,

                "&:hover": {
                  backgroundColor: "#d92d12",
                  boxShadow: "none",
                },
              }}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress
                    size={18}
                    sx={{
                      mr: 1,
                      color: "#ffffff",
                    }}
                  />

                  Saving...
                </>
              ) : isEditMode ? (
                "Update Bank"
              ) : (
                "Save Bank"
              )}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddBankDialog;