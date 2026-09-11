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
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";

const CardDialog = ({
  open,
  mode = "add",
  card = null,
  isSubmitting = false,
  apiError = "",
  onClose,
  onSubmit,
}) => {
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    type: "Debit",
    scheme: "",
    bin: "",
    category: "",
    customCategory: "",
    discountPercentage: "",
    capValue: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) {
      return;
    }

    if (isEditMode && card) {
      const isDefaultCategory = [
        "Silver",
        "Gold",
        "Platinum",
      ].includes(card.category);

      setFormData({
        type: card.type || "Debit",

        scheme: card.scheme || "",

        bin: card.bin || "",

        category: isDefaultCategory
          ? card.category
          : "Other",

        customCategory: isDefaultCategory
          ? ""
          : card.customCategory || card.category || "",

        discountPercentage:
          card.discountPercentage !== undefined &&
          card.discountPercentage !== null
            ? card.discountPercentage.toString()
            : "",

        capValue:
          card.capValue !== undefined &&
          card.capValue !== null
            ? card.capValue.toString()
            : "",
      });
    } else {
      setFormData({
        type: "Debit",
        scheme: "",
        bin: "",
        category: "",
        customCategory: "",
        discountPercentage: "",
        capValue: "",
      });
    }

    setErrors({});
  }, [open, isEditMode, card]);

  

  const handleChange = (event) => {
    const { name, value } = event.target;

    let updatedValue = value;

    // Allow digits only for BIN
    if (name === "bin") {
      updatedValue = value
        .replace(/\D/g, "")
        .slice(0, 8);
    }

    setFormData((previous) => {
      const updated = {
        ...previous,
        [name]: updatedValue,
      };

      if (
        name === "category" &&
        updatedValue !== "Other"
      ) {
        updated.customCategory = "";
      }

      return updated;
    });

    setErrors((previous) => {
      const updatedErrors = {
        ...previous,
      };

      if (updatedErrors[name]) {
        updatedErrors[name] = "";
      }

      if (
        name === "category" &&
        updatedValue !== "Other"
      ) {
        updatedErrors.customCategory = "";
      }

      return updatedErrors;
    });
  };

  const validate = () => {
    const newErrors = {};

    /*
     * CARD TYPE
     */
    if (
      formData.type !== "Debit" &&
      formData.type !== "Credit"
    ) {
      newErrors.type =
        "Please select Debit or Credit.";
    }

    /*
     * CARD SCHEME
     */
    if (!formData.scheme) {
      newErrors.scheme =
        "Card scheme is required.";
    }

    /*
     * BIN
     */
    const bin = formData.bin.trim();

    if (!bin) {
      newErrors.bin =
        "BIN is required.";
    } else if (!/^\d{6,8}$/.test(bin)) {
      newErrors.bin =
        "BIN must contain 6 to 8 digits.";
    }

    /*
     * CATEGORY
     */
    if (!formData.category) {
      newErrors.category =
        "Card category is required.";
    }

    /*
     * CUSTOM CATEGORY
     */
    if (formData.category === "Other") {
      const customCategory =
        formData.customCategory.trim();

      if (!customCategory) {
        newErrors.customCategory =
          "Please enter the card category.";
      } else if (customCategory.length < 2) {
        newErrors.customCategory =
          "Category must contain at least 2 characters.";
      } else if (customCategory.length > 50) {
        newErrors.customCategory =
          "Category cannot exceed 50 characters.";
      }
    }

    /*
     * DISCOUNT
     */
    const discount = Number(
      formData.discountPercentage
    );

    if (
      formData.discountPercentage === ""
    ) {
      newErrors.discountPercentage =
        "Discount percentage is required.";
    } else if (
      Number.isNaN(discount)
    ) {
      newErrors.discountPercentage =
        "Enter a valid discount percentage.";
    } else if (
      discount <= 0 ||
      discount > 100
    ) {
      newErrors.discountPercentage =
        "Discount must be between 1 and 100.";
    }

    /*
     * CAP VALUE
     */
    const capValue = Number(
      formData.capValue
    );

    if (formData.capValue === "") {
      newErrors.capValue =
        "Cap value is required.";
    } else if (
      Number.isNaN(capValue)
    ) {
      newErrors.capValue =
        "Enter a valid cap value.";
    } else if (capValue <= 0) {
      newErrors.capValue =
        "Cap value must be greater than zero.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const finalCategory =
      formData.category === "Other"
        ? formData.customCategory.trim()
        : formData.category;

    await onSubmit({
      type: formData.type,

      scheme: formData.scheme,

      bin: formData.bin.trim(),

      category: finalCategory,

      categoryType: formData.category,

      customCategory:
        formData.category === "Other"
          ? formData.customCategory.trim()
          : "",

      discountPercentage: Number(
        formData.discountPercentage
      ),

      capValue: Number(
        formData.capValue
      ),
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
      maxWidth="sm"
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
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            component="span"
            sx={{
              color: "#101828",

              fontSize: 22,

              fontWeight: 750,
            }}
          >
            {isEditMode
              ? "Edit Card"
              : "Add Card"}
          </Typography>

          <Typography
            sx={{
              mt: 0.4,

              color: "#667085",

              fontSize: 13,
            }}
          >
            Configure card type, scheme, BIN,
            category and discount settings.
          </Typography>
        </Box>

        <IconButton
          onClick={handleClose}
          disabled={isSubmitting}
          aria-label="Close dialog"
          sx={{
            ml: "auto",

            width: 38,
            height: 38,

            color: "#667085",

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
          onSubmit={handleSubmit}
          noValidate
        >
          {/* CARD TYPE */}

          <FormControl
            error={Boolean(errors.type)}
            sx={{
              width: "100%",
              mt: 1,
            }}
          >
            <FormLabel
              sx={{
                mb: 0.8,

                color:
                  "#344054 !important",

                fontSize: 14,

                fontWeight: 700,
              }}
            >
              Card Type *
            </FormLabel>

            <RadioGroup
              row
              name="type"
              value={formData.type}
              onChange={handleChange}
              sx={{
                gap: 3,
              }}
            >
              <FormControlLabel
                value="Debit"
                label="Debit"
                control={
                  <Radio
                    sx={{
                      color: "#98a2b3",

                      "&.Mui-checked": {
                        color:
                          "#f23a17",
                      },
                    }}
                  />
                }
              />

              <FormControlLabel
                value="Credit"
                label="Credit"
                control={
                  <Radio
                    sx={{
                      color: "#98a2b3",

                      "&.Mui-checked": {
                        color:
                          "#f23a17",
                      },
                    }}
                  />
                }
              />
            </RadioGroup>

            {errors.type && (
              <Typography
                sx={{
                  mt: 0.3,

                  color: "#d92d20",

                  fontSize: 12,
                }}
              >
                {errors.type}
              </Typography>
            )}
          </FormControl>

          {/* SCHEME */}

          <Box sx={{ mt: 2.2 }}>
            <Typography
              sx={{
                mb: 1,

                color: "#344054",

                fontSize: 14,

                fontWeight: 700,
              }}
            >
              Card Scheme *
            </Typography>

            <TextField
              select
              fullWidth
              name="scheme"
              value={formData.scheme}
              onChange={handleChange}
              error={Boolean(errors.scheme)}
              helperText={errors.scheme}
              SelectProps={{
                displayEmpty: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root":
                  {
                    minHeight: 52,

                    borderRadius: 2,

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
            >
              <MenuItem value="">
                Select card scheme
              </MenuItem>

              <MenuItem value="Visa">
                Visa
              </MenuItem>

              <MenuItem value="Mastercard">
                Mastercard
              </MenuItem>

              <MenuItem value="Paypak">
                PayPak
              </MenuItem>

              <MenuItem value="Unionpay">
                UnionPay
              </MenuItem>
            </TextField>
          </Box>

          {/* BIN */}

          <Box sx={{ mt: 2.2 }}>
            <Typography
              sx={{
                mb: 1,

                color: "#344054",

                fontSize: 14,

                fontWeight: 700,
              }}
            >
              BIN *
            </Typography>

            <TextField
              fullWidth
              name="bin"
              value={formData.bin}
              onChange={handleChange}
              placeholder="e.g. 489123"
              error={Boolean(errors.bin)}
              helperText={
                errors.bin ||
                "Enter the 6 to 8 digit card BIN."
              }
              inputProps={{
                maxLength: 8,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              sx={{
                "& .MuiOutlinedInput-root":
                  {
                    minHeight: 52,

                    borderRadius: 2,

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

          {/* CATEGORY */}

          <Box sx={{ mt: 2.2 }}>
            <Typography
              sx={{
                mb: 1,

                color: "#344054",

                fontSize: 14,

                fontWeight: 700,
              }}
            >
              Card Category *
            </Typography>

            <TextField
              select
              fullWidth
              name="category"
              value={formData.category}
              onChange={handleChange}
              error={Boolean(
                errors.category
              )}
              helperText={
                errors.category
              }
              SelectProps={{
                displayEmpty: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root":
                  {
                    minHeight: 52,

                    borderRadius: 2,

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
            >
              <MenuItem value="">
                Select card category
              </MenuItem>

              <MenuItem value="Silver">
                Silver
              </MenuItem>

              <MenuItem value="Gold">
                Gold
              </MenuItem>

              <MenuItem value="Platinum">
                Platinum
              </MenuItem>

              <MenuItem value="Other">
                Other
              </MenuItem>
            </TextField>
          </Box>

          {/* OTHER CATEGORY */}

          {formData.category ===
            "Other" && (
            <Box sx={{ mt: 2 }}>
              <Typography
                sx={{
                  mb: 1,

                  color: "#344054",

                  fontSize: 14,

                  fontWeight: 700,
                }}
              >
                Other Category *
              </Typography>

              <TextField
                fullWidth
                name="customCategory"
                value={
                  formData.customCategory
                }
                onChange={handleChange}
                placeholder="e.g. Signature, Classic, Infinite"
                error={Boolean(
                  errors.customCategory
                )}
                helperText={
                  errors.customCategory ||
                  "Enter the custom card category."
                }
                inputProps={{
                  maxLength: 50,
                }}
                sx={{
                  "& .MuiOutlinedInput-root":
                    {
                      minHeight: 52,

                      borderRadius: 2,

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
          )}

          {/* DISCOUNT AND CAP */}

          <Box
            sx={{
              mt: 2.2,

              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",

                sm: "repeat(2, minmax(0, 1fr))",
              },

              gap: 2,
            }}
          >
            {/* DISCOUNT */}

            <Box>
              <Typography
                sx={{
                  mb: 1,

                  color: "#344054",

                  fontSize: 14,

                  fontWeight: 700,
                }}
              >
                Discount Percentage *
              </Typography>

              <TextField
                fullWidth
                type="number"
                name="discountPercentage"
                value={
                  formData.discountPercentage
                }
                onChange={handleChange}
                placeholder="e.g. 15"
                error={Boolean(
                  errors.discountPercentage
                )}
                helperText={
                  errors.discountPercentage
                }
                inputProps={{
                  min: 1,

                  max: 100,

                  step: "0.01",
                }}
                InputProps={{
                  endAdornment: (
                    <Typography
                      sx={{
                        ml: 1,

                        color:
                          "#667085",

                        fontWeight:
                          600,
                      }}
                    >
                      %
                    </Typography>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root":
                    {
                      minHeight: 52,

                      borderRadius: 2,

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

            {/* CAP VALUE */}

            <Box>
              <Typography
                sx={{
                  mb: 1,

                  color: "#344054",

                  fontSize: 14,

                  fontWeight: 700,
                }}
              >
                Cap Value *
              </Typography>

              <TextField
                fullWidth
                type="number"
                name="capValue"
                value={
                  formData.capValue
                }
                onChange={handleChange}
                placeholder="e.g. 1000"
                error={Boolean(
                  errors.capValue
                )}
                helperText={
                  errors.capValue
                }
                inputProps={{
                  min: 1,

                  step: "1",
                }}
                InputProps={{
                  startAdornment: (
                    <Typography
                      sx={{
                        mr: 1,

                        color:
                          "#667085",

                        fontSize: 13,

                        fontWeight:
                          600,
                      }}
                    >
                      PKR
                    </Typography>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root":
                    {
                      minHeight: 52,

                      borderRadius: 2,

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
          </Box>

          {/* API ERROR */}

          {apiError && (
            <Box
              role="alert"
              sx={{
                mt: 2.5,

                p: 1.5,

                color: "#b42318",

                border:
                  "1px solid #fecdca",

                borderRadius: 2,

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

              display: "flex",

              flexDirection: {
                xs: "column-reverse",
                sm: "row",
              },

              justifyContent:
                "flex-end",

              gap: 1.5,
            }}
          >
            <Button
              type="button"
              variant="outlined"
              onClick={handleClose}
              disabled={isSubmitting}
              sx={{
                minWidth: 110,

                minHeight: 46,

                borderRadius: 2,

                borderColor:
                  "#d0d5dd",

                color: "#344054",

                textTransform: "none",

                fontWeight: 650,

                "&:hover": {
                  borderColor:
                    "#98a2b3",

                  backgroundColor:
                    "#f9fafb",
                },
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                minWidth: 140,

                minHeight: 46,

                borderRadius: 2,

                backgroundColor:
                  "#f23a17",

                boxShadow: "none",

                textTransform: "none",

                fontWeight: 700,

                "&:hover": {
                  backgroundColor:
                    "#d92d12",

                  boxShadow: "none",
                },
              }}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress
                    size={18}
                    thickness={5}
                    sx={{
                      mr: 1,

                      color:
                        "#ffffff",
                    }}
                  />

                  Saving...
                </>
              ) : isEditMode ? (
                "Update Card"
              ) : (
                "Save Card"
              )}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CardDialog;