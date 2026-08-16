import {
  useEffect,
  useState,
} from "react";

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

const MerchantDialog = ({
  open,
  mode = "add",
  merchant = null,
  existingMerchants = [],
  isSubmitting = false,
  apiError = "",
  onClose,
  onSubmit,
}) => {
  const isEditMode =
    mode === "edit";

  const [formData, setFormData] =
    useState({
      mid: "",
      tid: "",
    });

  const [errors, setErrors] =
    useState({});

  /*
   * RESET / POPULATE FORM
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    if (
      isEditMode &&
      merchant
    ) {
      setFormData({
        mid: merchant.mid || "",
        tid: merchant.tid || "",
      });
    } else {
      setFormData({
        mid: "",
        tid: "",
      });
    }

    setErrors({});
  }, [
    open,
    isEditMode,
    merchant,
  ]);

  /*
   * INPUT CHANGE
   */
  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    /*
     * MID/TID are usually
     * easier to manage uppercase.
     */
    const sanitizedValue =
      value
        .replace(/\s/g, "")
        .toUpperCase();

    setFormData(
      (previous) => ({
        ...previous,

        [name]:
          sanitizedValue,
      })
    );

    if (errors[name]) {
      setErrors(
        (previous) => ({
          ...previous,

          [name]: "",
        })
      );
    }
  };

  /*
   * VALIDATION
   */
  const validate = () => {
    const newErrors = {};

    const mid =
      formData.mid.trim();

    const tid =
      formData.tid.trim();

    /*
     * MID
     */
    if (!mid) {
      newErrors.mid =
        "MID is required.";
    } else if (
      mid.length < 3
    ) {
      newErrors.mid =
        "MID must contain at least 3 characters.";
    } else if (
      mid.length > 50
    ) {
      newErrors.mid =
        "MID cannot exceed 50 characters.";
    }

    /*
     * TID
     */
    if (!tid) {
      newErrors.tid =
        "TID is required.";
    } else if (
      tid.length < 3
    ) {
      newErrors.tid =
        "TID must contain at least 3 characters.";
    } else if (
      tid.length > 50
    ) {
      newErrors.tid =
        "TID cannot exceed 50 characters.";
    }

    /*
     * Duplicate MID
     */
    if (
      mid &&
      existingMerchants.some(
        (item) =>
          item.id !==
            merchant?.id &&
          item.mid
            .toLowerCase() ===
            mid.toLowerCase()
      )
    ) {
      newErrors.mid =
        "This MID already exists.";
    }

    /*
     * Duplicate TID
     */
    if (
      tid &&
      existingMerchants.some(
        (item) =>
          item.id !==
            merchant?.id &&
          item.tid
            .toLowerCase() ===
            tid.toLowerCase()
      )
    ) {
      newErrors.tid =
        "This TID already exists.";
    }

    setErrors(newErrors);

    return (
      Object.keys(
        newErrors
      ).length === 0
    );
  };

  /*
   * SUBMIT
   */
  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (!validate()) {
        return;
      }

      await onSubmit({
        mid:
          formData.mid.trim(),

        tid:
          formData.tid.trim(),
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
            "0 24px 60px rgba(16,24,40,0.18)",
        },
      }}
    >
      {/* HEADER */}

      <DialogTitle
        sx={{
          px: 3,

          pt: 3,

          pb: 1.5,

          display: "flex",

          alignItems:
            "flex-start",
        }}
      >
        <Box>
          <Typography
            component="span"
            sx={{
              color:
                "#101828",

              fontSize: 22,

              fontWeight: 750,
            }}
          >
            {isEditMode
              ? "Edit Merchant"
              : "Create Merchant"}
          </Typography>

          <Typography
            sx={{
              mt: 0.5,

              color:
                "#667085",

              fontSize: 13,
            }}
          >
            {isEditMode
              ? "Update merchant MID and TID."
              : "Enter MID and TID to create a merchant."}
          </Typography>
        </Box>

        <IconButton
          onClick={
            handleClose
          }
          disabled={
            isSubmitting
          }
          aria-label="Close"
          sx={{
            ml: "auto",

            mt: -0.5,

            color:
              "#667085",

            fontSize: 27,
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
          onSubmit={
            handleSubmit
          }
          noValidate
        >
          {/* MID */}

          <Box sx={{ mt: 1 }}>
            <Typography
              sx={{
                mb: 1,

                color:
                  "#344054",

                fontSize: 14,

                fontWeight: 700,
              }}
            >
              MID *
            </Typography>

            <TextField
              fullWidth
              name="mid"
              value={
                formData.mid
              }
              onChange={
                handleChange
              }
              placeholder="e.g. MID100001"
              error={Boolean(
                errors.mid
              )}
              helperText={
                errors.mid
              }
              disabled={
                isSubmitting
              }
              autoFocus
              inputProps={{
                maxLength: 50,
              }}
              sx={{
                "& .MuiOutlinedInput-root":
                  {
                    minHeight:
                      52,

                    borderRadius:
                      2,

                    "&.Mui-focused fieldset":
                      {
                        borderColor:
                          "#f23a17",
                      },
                  },

                "& .MuiFormHelperText-root":
                  {
                    mx: 0,
                  },
              }}
            />
          </Box>

          {/* TID */}

          <Box sx={{ mt: 2.2 }}>
            <Typography
              sx={{
                mb: 1,

                color:
                  "#344054",

                fontSize: 14,

                fontWeight: 700,
              }}
            >
              TID *
            </Typography>

            <TextField
              fullWidth
              name="tid"
              value={
                formData.tid
              }
              onChange={
                handleChange
              }
              placeholder="e.g. TID200001"
              error={Boolean(
                errors.tid
              )}
              helperText={
                errors.tid
              }
              disabled={
                isSubmitting
              }
              inputProps={{
                maxLength: 50,
              }}
              sx={{
                "& .MuiOutlinedInput-root":
                  {
                    minHeight:
                      52,

                    borderRadius:
                      2,

                    "&.Mui-focused fieldset":
                      {
                        borderColor:
                          "#f23a17",
                      },
                  },

                "& .MuiFormHelperText-root":
                  {
                    mx: 0,
                  },
              }}
            />
          </Box>

          {/* API ERROR */}

          {apiError && (
            <Box
              role="alert"
              sx={{
                mt: 2.5,

                p: 1.5,

                color:
                  "#b42318",

                border:
                  "1px solid #fecdca",

                borderRadius:
                  2,

                backgroundColor:
                  "#fef3f2",

                fontSize: 14,
              }}
            >
              {apiError}
            </Box>
          )}

          {/* BUTTONS */}

          <Box
            sx={{
              mt: 4,

              display:
                "flex",

              justifyContent:
                "flex-end",

              gap: 1.5,
            }}
          >
            <Button
              type="button"
              variant="outlined"
              onClick={
                handleClose
              }
              disabled={
                isSubmitting
              }
              sx={{
                minWidth:
                  100,

                minHeight:
                  44,

                borderRadius:
                  2,

                borderColor:
                  "#d0d5dd",

                color:
                  "#344054",

                textTransform:
                  "none",

                fontWeight:
                  650,
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={
                isSubmitting
              }
              sx={{
                minWidth:
                  145,

                minHeight:
                  44,

                borderRadius:
                  2,

                backgroundColor:
                  "#f23a17",

                boxShadow:
                  "none",

                textTransform:
                  "none",

                fontWeight:
                  700,

                "&:hover": {
                  backgroundColor:
                    "#d92d12",

                  boxShadow:
                    "none",
                },
              }}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress
                    size={18}
                    sx={{
                      mr: 1,

                      color:
                        "#ffffff",
                    }}
                  />

                  Saving...
                </>
              ) : isEditMode ? (
                "Update Merchant"
              ) : (
                "Create Merchant"
              )}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MerchantDialog;