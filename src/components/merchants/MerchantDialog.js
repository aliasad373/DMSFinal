import {
  useEffect,
  useMemo,
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

import { getBanks } from "../../api/bankApi";
import apiClient from "../../api/apiClient";

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
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    merchantName: "",
    mid: "",
    tid: "",
  });

  const [errors, setErrors] = useState({});

  const [step, setStep] = useState(1);

  const [banks, setBanks] = useState([]);

  // Multiple banks can be selected
  const [selectedBanks, setSelectedBanks] =
    useState([]);

  const [banksLoading, setBanksLoading] =
    useState(false);

  const [banksError, setBanksError] =
    useState("");

  const [bankSearch, setBankSearch] =
    useState("");

  // Available cards for each bank
  const [bankCards, setBankCards] =
    useState({});

  /*
   * RESET / POPULATE FORM
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    if (isEditMode && merchant) {
      setFormData({
        merchantName:
          merchant.merchantName || "",
        mid: merchant.mid || "",
        tid: merchant.tid || "",
      });
    } else {
      setFormData({
        merchantName: "",
        mid: "",
        tid: "",
      });
    }

    setErrors({});
    setStep(1);
    setBanks([]);
    setSelectedBanks([]);
    setBanksError("");
    setBankSearch("");
    setBankCards({});
  }, [
    open,
    isEditMode,
    merchant,
  ]);

  /*
   * INPUT CHANGE
   */
  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    let sanitizedValue = value;

    /*
     * MID / TID
     *
     * Remove spaces and convert
     * them to uppercase.
     */
    if (
      name === "mid" ||
      name === "tid"
    ) {
      sanitizedValue = value
        .replace(/\s/g, "")
        .toUpperCase();
    }

    setFormData((previous) => ({
      ...previous,
      [name]: sanitizedValue,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  /*
   * VALIDATION
   */
  const validate = () => {
    const newErrors = {};

    const merchantName =
      formData.merchantName.trim();

    const mid =
      formData.mid.trim();

    const tid =
      formData.tid.trim();

    /*
     * MERCHANT NAME
     */
    if (!merchantName) {
      newErrors.merchantName =
        "Merchant name is required.";
    } else if (
      merchantName.length < 2
    ) {
      newErrors.merchantName =
        "Merchant name must contain at least 2 characters.";
    } else if (
      merchantName.length > 100
    ) {
      newErrors.merchantName =
        "Merchant name cannot exceed 100 characters.";
    }

    /*
     * MID
     */
    if (!mid) {
      newErrors.mid =
        "MID is required.";
    } else if (mid.length < 3) {
      newErrors.mid =
        "MID must contain at least 3 characters.";
    } else if (mid.length > 50) {
      newErrors.mid =
        "MID cannot exceed 50 characters.";
    }

    /*
     * TID
     */
    if (!tid) {
      newErrors.tid =
        "TID is required.";
    } else if (tid.length < 3) {
      newErrors.tid =
        "TID must contain at least 3 characters.";
    } else if (tid.length > 50) {
      newErrors.tid =
        "TID cannot exceed 50 characters.";
    }

    /*
     * DUPLICATE MID
     */
    if (
      mid &&
      existingMerchants.some(
        (item) =>
          item.id !== merchant?.id &&
          item.mid?.toLowerCase() ===
            mid.toLowerCase()
      )
    ) {
      newErrors.mid =
        "This MID already exists.";
    }

    /*
     * DUPLICATE TID
     */
    if (
      tid &&
      existingMerchants.some(
        (item) =>
          item.id !== merchant?.id &&
          item.tid?.toLowerCase() ===
            tid.toLowerCase()
      )
    ) {
      newErrors.tid =
        "This TID already exists.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  /*
   * LOAD CARDS FOR A BANK
   */
  const loadBankCards = async (bankId) => {
    try {
      const response =
        await apiClient.get(
          `/banks/bank-cards/${bankId}`
        );

      console.log(
        `CARDS FOR BANK ${bankId}:`,
        response.data
      );

      const cards =
        Array.isArray(response.data)
          ? response.data
          : response.data?.cards ||
            response.data?.data?.cards ||
            response.data?.data ||
            [];

      setBankCards((previous) => ({
        ...previous,
        [bankId]: Array.isArray(cards)
          ? cards
          : [],
      }));
    } catch (error) {
      console.error(
        `LOAD CARDS ERROR FOR BANK ${bankId}:`,
        error
      );

      setBankCards((previous) => ({
        ...previous,
        [bankId]: [],
      }));
    }
  };

  /*
   * LOAD BANKS
   */
  const handleNext = async () => {
    if (!validate()) {
      return;
    }

    try {
      setBanksLoading(true);
      setBanksError("");

      const response = await getBanks();

      console.log(
        "BANKS RESPONSE:",
        response
      );

      /*
       * Backend response:
       *
       * {
       *   isSuccess: true,
       *   totalBanks: 51,
       *   banks: [...]
       * }
       */
      const bankList =
        Array.isArray(response)
          ? response
          : response?.banks ||
            response?.data?.banks ||
            response?.data ||
            [];

      const normalizedBanks =
        Array.isArray(bankList)
          ? bankList
          : [];

      setBanks(normalizedBanks);

      // No bank is selected automatically
      setSelectedBanks([]);

      // Reset cards
      setBankCards({});

      setStep(2);

      /*
       * Load available cards for
       * every bank.
       */
      normalizedBanks.forEach(
        (bank) => {
          loadBankCards(
            bank.bank_id
          );
        }
      );
    } catch (error) {
      console.error(
        "LOAD BANKS ERROR:",
        error
      );

      setBanksError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load banks."
      );
    } finally {
      setBanksLoading(false);
    }
  };

  /*
   * BANK SEARCH
   */
  const filteredBanks = useMemo(() => {
    const search =
      bankSearch
        .trim()
        .toLowerCase();

    if (!search) {
      return banks;
    }

    return banks.filter((bank) =>
      bank.bank_name
        ?.toLowerCase()
        .includes(search)
    );
  }, [
    banks,
    bankSearch,
  ]);

  /*
   * BANK LOGO URL
   */
  const getBankLogoUrl = (logo) => {
    if (!logo) {
      return "";
    }

    if (
      logo.startsWith("http://") ||
      logo.startsWith("https://")
    ) {
      return logo;
    }

    const baseURL =
      apiClient.defaults?.baseURL ||
      "";

    return `${baseURL.replace(
      /\/api\/?$/,
      ""
    )}${logo.startsWith("/")
      ? logo
      : `/${logo}`}`;
  };

  /*
   * FINAL SUBMIT
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    /*
     * EDIT MODE
     */
    if (isEditMode) {
      if (!validate()) {
        return;
      }

      await onSubmit({
        merchantName:
          formData.merchantName.trim(),

        mid:
          formData.mid.trim(),

        tid:
          formData.tid.trim(),
      });

      return;
    }

    /*
     * ADD MODE - STEP 1
     */
    if (step === 1) {
      await handleNext();
      return;
    }

    /*
     * ADD MODE - STEP 2
     *
     * At least one bank must
     * be manually selected.
     */
    if (selectedBanks.length === 0) {
      setBanksError(
        "Please select at least one bank."
      );
      return;
    }

    /*
     * FINAL PAYLOAD
     *
     * Example:
     *
     * bankIds: [1, 4, 7]
     */
    await onSubmit({
      merchantName:
        formData.merchantName.trim(),

      mid:
        formData.mid.trim(),

      tid:
        formData.tid.trim(),

      bankIds: selectedBanks.map(
        (bank) => bank.bank_id
      ),
    });
  };

  /*
   * BACK TO STEP 1
   */
  const handleBack = () => {
    if (
      !isSubmitting &&
      !banksLoading
    ) {
      setBanksError("");
      setBankSearch("");

      // Clear selected banks when going back
      setSelectedBanks([]);

      setStep(1);
    }
  };

  /*
   * SELECT / DESELECT BANK
   *
   * Multiple banks are supported.
   */
  const handleBankSelect = (bank) => {
    setBanksError("");

    setSelectedBanks((previous) => {
      const alreadySelected =
        previous.some(
          (item) =>
            item.bank_id ===
            bank.bank_id
        );

      /*
       * If already selected,
       * clicking again deselects it.
       */
      if (alreadySelected) {
        return previous.filter(
          (item) =>
            item.bank_id !==
            bank.bank_id
        );
      }

      /*
       * Otherwise add the bank
       * to selected banks.
       */
      return [
        ...previous,
        bank,
      ];
    });
  };

  /*
   * CLOSE
   */
  const handleClose = () => {
    if (
      !isSubmitting &&
      !banksLoading
    ) {
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
          alignItems: "flex-start",
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
              ? "Edit Merchant"
              : "Create Merchant"}
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              color: "#667085",
              fontSize: 13,
            }}
          >
            {isEditMode
              ? "Update merchant name, MID and TID."
              : step === 1
              ? "Enter merchant name, MID and TID to create a merchant."
              : "Select one or more banks for this merchant."}
          </Typography>
        </Box>

        <IconButton
          onClick={handleClose}
          disabled={
            isSubmitting ||
            banksLoading
          }
          aria-label="Close"
          sx={{
            ml: "auto",
            mt: -0.5,
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
          {/* ================= STEP 1 ================= */}

          {(step === 1 ||
            isEditMode) && (
            <>
              {/* MERCHANT NAME */}

              <Box sx={{ mt: 1 }}>
                <Typography
                  sx={{
                    mb: 1,
                    color: "#344054",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  Merchant Name *
                </Typography>

                <TextField
                  fullWidth
                  name="merchantName"
                  value={
                    formData.merchantName
                  }
                  onChange={handleChange}
                  placeholder="e.g. Cheezious Bahria Town"
                  error={Boolean(
                    errors.merchantName
                  )}
                  helperText={
                    errors.merchantName
                  }
                  disabled={isSubmitting}
                  autoFocus
                  inputProps={{
                    maxLength: 100,
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

              {/* MID */}

              <Box sx={{ mt: 2.2 }}>
                <Typography
                  sx={{
                    mb: 1,
                    color: "#344054",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  MID *
                </Typography>

                <TextField
                  fullWidth
                  name="mid"
                  value={formData.mid}
                  onChange={handleChange}
                  placeholder="e.g. MID100001"
                  error={Boolean(
                    errors.mid
                  )}
                  helperText={
                    errors.mid
                  }
                  disabled={isSubmitting}
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

              {/* TID */}

              <Box sx={{ mt: 2.2 }}>
                <Typography
                  sx={{
                    mb: 1,
                    color: "#344054",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  TID *
                </Typography>

                <TextField
                  fullWidth
                  name="tid"
                  value={formData.tid}
                  onChange={handleChange}
                  placeholder="e.g. TID200001"
                  error={Boolean(
                    errors.tid
                  )}
                  helperText={
                    errors.tid
                  }
                  disabled={isSubmitting}
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
            </>
          )}

          {/* ================= STEP 2 ================= */}

          {!isEditMode &&
            step === 2 && (
              <Box sx={{ mt: 1 }}>
                <Typography
                  sx={{
                    mb: 1.5,
                    color: "#344054",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  Select Banks *
                </Typography>

                {/* BANK SEARCH */}

                <TextField
                  fullWidth
                  value={bankSearch}
                  onChange={(event) =>
                    setBankSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search bank..."
                  size="small"
                  disabled={
                    banksLoading
                  }
                  sx={{
                    mb: 2,

                    "& .MuiOutlinedInput-root":
                      {
                        minHeight: 48,
                        borderRadius: 2,

                        "&.Mui-focused fieldset":
                          {
                            borderColor:
                              "#f23a17",
                          },
                      },
                  }}
                />

                {/* LOADING */}

                {banksLoading ? (
                  <Box
                    sx={{
                      minHeight: 180,
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      flexDirection:
                        "column",
                      gap: 1.5,
                    }}
                  >
                    <CircularProgress
                      size={28}
                      sx={{
                        color:
                          "#f23a17",
                      }}
                    />

                    <Typography
                      sx={{
                        color:
                          "#667085",
                        fontSize: 14,
                      }}
                    >
                      Loading banks...
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      maxHeight: 360,
                      overflowY: "auto",
                      pr: 0.5,
                    }}
                  >
                    {filteredBanks.length ===
                    0 ? (
                      <Box
                        sx={{
                          p: 2,
                          border:
                            "1px solid #eaecf0",
                          borderRadius: 2,
                          textAlign:
                            "center",
                        }}
                      >
                        <Typography
                          sx={{
                            color:
                              "#667085",
                            fontSize: 14,
                          }}
                        >
                          {bankSearch
                            ? "No matching banks found."
                            : "No banks found."}
                        </Typography>
                      </Box>
                    ) : (
                      filteredBanks.map(
                        (bank) => {
                          /*
                           * Backend fields:
                           *
                           * bank_id
                           * bank_name
                           * logo
                           */

                          const isSelected =
                            selectedBanks.some(
                              (item) =>
                                item.bank_id ===
                                bank.bank_id
                            );

                          const logoUrl =
                            getBankLogoUrl(
                              bank.logo
                            );

                          const cards =
                            bankCards[
                              bank.bank_id
                            ] || [];

                          return (
                            <Box
                              key={
                                bank.bank_id
                              }
                              onClick={() =>
                                handleBankSelect(
                                  bank
                                )
                              }
                              sx={{
                                mb: 1,
                                p: 1.5,
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                cursor:
                                  "pointer",

                                border:
                                  isSelected
                                    ? "1px solid #f23a17"
                                    : "1px solid #eaecf0",

                                borderRadius:
                                  2,

                                backgroundColor:
                                  isSelected
                                    ? "#fff7f5"
                                    : "#ffffff",

                                transition:
                                  "all 0.2s ease",

                                "&:hover":
                                  {
                                    borderColor:
                                      "#f23a17",
                                  },
                              }}
                            >
                              {/* BANK LOGO */}

                              {logoUrl ? (
                                <Box
                                  component="img"
                                  src={
                                    logoUrl
                                  }
                                  alt={
                                    bank.bank_name ||
                                    "Bank logo"
                                  }
                                  onError={(
                                    event
                                  ) => {
                                    event.currentTarget.style.display =
                                      "none";
                                  }}
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    objectFit:
                                      "contain",
                                    mr: 1.5,
                                    flexShrink:
                                      0,
                                  }}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    mr: 1.5,
                                    flexShrink:
                                      0,
                                    borderRadius:
                                      1.5,
                                    backgroundColor:
                                      "#f2f4f7",
                                    display:
                                      "flex",
                                    alignItems:
                                      "center",
                                    justifyContent:
                                      "center",
                                    color:
                                      "#667085",
                                    fontSize: 16,
                                    fontWeight:
                                      700,
                                  }}
                                >
                                  {bank.bank_name
                                    ?.charAt(
                                      0
                                    )
                                    ?.toUpperCase()}
                                </Box>
                              )}

                              {/* BANK NAME */}

                              <Box
                                sx={{
                                  flex: 1,
                                  minWidth: 0,
                                }}
                              >
                                <Typography
                                  sx={{
                                    color:
                                      "#101828",
                                    fontSize: 14,
                                    fontWeight:
                                      650,
                                    overflow:
                                      "hidden",
                                    textOverflow:
                                      "ellipsis",
                                    whiteSpace:
                                      "nowrap",
                                  }}
                                >
                                  {
                                    bank.bank_name
                                  }
                                </Typography>

                                {/* AVAILABLE CARDS */}

                                <Typography
                                  sx={{
                                    mt: 0.4,
                                    color:
                                      "#667085",
                                    fontSize: 12,
                                    fontWeight:
                                      500,
                                  }}
                                >
                                  Available Cards:{" "}
                                  {
                                    cards.length
                                  }
                                </Typography>

                                {cards.length >
                                  0 && (
                                  <Box
                                    sx={{
                                      mt: 0.8,
                                      display:
                                        "flex",
                                      flexWrap:
                                        "wrap",
                                      gap: 0.6,
                                    }}
                                  >
                                    {cards.map(
                                      (
                                        card,
                                        index
                                      ) => {
                                        const cardName =
                                          card.card_name ||
                                          card.cardName ||
                                          card.name ||
                                          card.card_type ||
                                          card.cardType ||
                                          `Card ${index + 1}`;

                                        return (
                                          <Box
                                            key={
                                              card.card_id ||
                                              card.cardId ||
                                              card.id ||
                                              index
                                            }
                                            sx={{
                                              px: 1,
                                              py: 0.4,
                                              border:
                                                "1px solid #eaecf0",
                                              borderRadius:
                                                1,
                                              backgroundColor:
                                                "#f9fafb",
                                            }}
                                          >
                                            <Typography
                                              sx={{
                                                color:
                                                  "#344054",
                                                fontSize: 11,
                                                fontWeight:
                                                  600,
                                              }}
                                            >
                                              {
                                                cardName
                                              }
                                            </Typography>
                                          </Box>
                                        );
                                      }
                                    )}
                                  </Box>
                                )}
                              </Box>

                              {/* CHECK INDICATOR */}

                              <Box
                                sx={{
                                  width: 20,
                                  height: 20,
                                  borderRadius:
                                    "50%",
                                  flexShrink:
                                    0,

                                  border:
                                    isSelected
                                      ? "6px solid #f23a17"
                                      : "2px solid #d0d5dd",
                                }}
                              />
                            </Box>
                          );
                        }
                      )
                    )}
                  </Box>
                )}

                {/* SELECTED BANK COUNT */}

                {selectedBanks.length >
                  0 && (
                  <Typography
                    sx={{
                      mt: 2,
                      color: "#101828",
                      fontSize: 14,
                      fontWeight: 650,
                    }}
                  >
                    Selected Banks:{" "}
                    {selectedBanks.length}
                  </Typography>
                )}
              </Box>
            )}

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

          {/* BANK ERROR */}

          {banksError && (
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
              {banksError}
            </Box>
          )}

          {/* BUTTONS */}

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent:
                "flex-end",
              gap: 1.5,
            }}
          >
            <Button
              type="button"
              variant="outlined"
              onClick={
                step === 2 &&
                !isEditMode
                  ? handleBack
                  : handleClose
              }
              disabled={
                isSubmitting ||
                banksLoading
              }
              sx={{
                minWidth: 100,
                minHeight: 44,
                borderRadius: 2,
                borderColor:
                  "#d0d5dd",
                color: "#344054",
                textTransform:
                  "none",
                fontWeight: 650,
              }}
            >
              {step === 2 &&
              !isEditMode
                ? "Back"
                : "Cancel"}
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={
                isSubmitting ||
                banksLoading
              }
              sx={{
                minWidth: 145,
                minHeight: 44,
                borderRadius: 2,
                backgroundColor:
                  "#f23a17",
                boxShadow: "none",
                textTransform:
                  "none",
                fontWeight: 700,

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
              ) : step === 1 ? (
                "Next"
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