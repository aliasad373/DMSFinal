import { useEffect, useMemo, useState } from "react";

import {
  CheckCircleOutlined,
  DeleteOutlineOutlined,
  EditOutlined,
  PauseCircleOutlineOutlined,
  SearchOutlined,
  StorefrontOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  Chip,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";

import MerchantDialog from "../components/merchants/MerchantDialog";
import DeleteMerchantDialog from "../components/merchants/DeleteMerchantDialog";

import {
  createMerchant,
  deleteMerchant,
  getMerchantBanks,
  getMerchants,
  updateMerchant,
  updateMerchantBanks,
} from "../api/merchantApi";

import { getBanks } from "../api/bankApi";

import apiClient from "../api/apiClient";

const MerchantsPage = () => {
  /*
   * DATA
   */
  const [merchants, setMerchants] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] = useState("");

  /*
   * FILTERS
   */
  const [searchText, setSearchText] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  /*
   * ADD / EDIT
   */
  const [merchantDialogOpen, setMerchantDialogOpen] = useState(false);

  const [dialogMode, setDialogMode] = useState("add");

  const [selectedMerchant, setSelectedMerchant] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [merchantDialogError, setMerchantDialogError] = useState("");

  /*
   * DELETE
   */
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const [deleteError, setDeleteError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  /*
   * VIEW MERCHANT
   */
  const [viewMerchantOpen, setViewMerchantOpen] = useState(false);

  const [viewMerchant, setViewMerchant] = useState(null);

  const [merchantBanks, setMerchantBanks] = useState([]);

  const [isLoadingMerchantBanks, setIsLoadingMerchantBanks] = useState(false);

  const [merchantBanksError, setMerchantBanksError] = useState("");

  /*
   * CHANGE MERCHANT BANKS
   */
  const [isChangingBanks, setIsChangingBanks] = useState(false);

  const [availableBanks, setAvailableBanks] = useState([]);

  const [selectedBankIds, setSelectedBankIds] = useState([]);

  const [isLoadingAvailableBanks, setIsLoadingAvailableBanks] = useState(false);

  const [isSavingBanks, setIsSavingBanks] = useState(false);

  const [changeBanksError, setChangeBanksError] = useState("");

  /*
   * BANK LOGO URL
   */
  const getBankLogoUrl = (logo) => {
    if (!logo) {
      return "";
    }

    if (logo.startsWith("http://") || logo.startsWith("https://")) {
      return logo;
    }

    const baseURL = apiClient.defaults?.baseURL || "";

    return `${baseURL.replace(/\/api\/?$/, "")}${
      logo.startsWith("/") ? logo : `/${logo}`
    }`;
  };

  /*
   * LOAD MERCHANTS
   */
  const loadMerchants = async () => {
    try {
      setIsLoading(true);
      setLoadError("");

      const response = await getMerchants();

      console.log("MERCHANTS API RESPONSE:", response);

      const rawMerchants = response?.merchants || [];

      /*
       * BACKEND -> FRONTEND MAPPING
       *
       * merchant_id   -> id
       * merchant_name -> merchantName
       * MID           -> mid
       * TID           -> tid
       * created_at    -> createdAt
       * updated_at    -> updatedAt
       */
      const mappedMerchants = rawMerchants.map((merchant) => ({
        id: merchant.merchant_id,

        merchantName: merchant.merchant_name || "",

        mid: merchant.MID || "",

        tid: merchant.TID || "",

        createdAt: merchant.created_at,

        updatedAt: merchant.updated_at,

        /*
         * Backend currently does
         * not return status.
         */
        status: "Active",
      }));

      console.log("MAPPED MERCHANTS:", mappedMerchants);

      setMerchants(mappedMerchants);
    } catch (error) {
      console.error("LOAD MERCHANT ERROR:", error);

      setLoadError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load merchants.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMerchants();
  }, []);

  /*
   * STATS
   */
  const activeMerchants = merchants.filter(
    (merchant) => merchant.status === "Active",
  ).length;

  const inactiveMerchants = merchants.filter(
    (merchant) => merchant.status === "Inactive",
  ).length;

  /*
   * SEARCH / FILTER
   */
  const filteredMerchants = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return merchants.filter((merchant) => {
      /*
       * Search Merchant Name,
       * MID and TID.
       */
      const searchable = `
            ${merchant.merchantName || ""} 
            ${merchant.mid || ""} 
            ${merchant.tid || ""} 
          `.toLowerCase();

      const matchesSearch = !search || searchable.includes(search);

      const matchesStatus =
        statusFilter === "All" || merchant.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [merchants, searchText, statusFilter]);

  /*
   * OPEN ADD
   */
  const openAddMerchant = () => {
    setDialogMode("add");

    setSelectedMerchant(null);

    setMerchantDialogError("");

    setSuccessMessage("");

    setMerchantDialogOpen(true);
  };

  /*
   * OPEN EDIT
   */
  const openEditMerchant = (merchant) => {
    setDialogMode("edit");

    setSelectedMerchant(merchant);

    setMerchantDialogError("");

    setSuccessMessage("");

    setMerchantDialogOpen(true);
  };

  /*
   * OPEN VIEW
   */
  const openViewMerchant = async (merchant) => {
    try {
      setViewMerchant(merchant);

      setMerchantBanks([]);

      setMerchantBanksError("");

      setIsChangingBanks(false);

      setAvailableBanks([]);

      setSelectedBankIds([]);

      setChangeBanksError("");

      setViewMerchantOpen(true);

      setIsLoadingMerchantBanks(true);

      const response = await getMerchantBanks(merchant.id);

      console.log("MERCHANT BANKS RESPONSE:", response);

      setMerchantBanks(response?.banks || []);
    } catch (error) {
      console.error("LOAD MERCHANT BANKS ERROR:", error);

      setMerchantBanksError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load merchant banks.",
      );
    } finally {
      setIsLoadingMerchantBanks(false);
    }
  };

  /*
   * START CHANGE BANKS
   */
  const handleStartChangingBanks = async () => {
    try {
      setIsChangingBanks(true);

      setChangeBanksError("");

      setIsLoadingAvailableBanks(true);

      /*
       * Keep current assigned banks selected.
       */
      setSelectedBankIds(
        merchantBanks.map((bank) => Number(bank.bank_id)),
      );

      const response = await getBanks();

      console.log("ALL BANKS RESPONSE:", response);

      setAvailableBanks(response?.banks || []);
    } catch (error) {
      console.error("LOAD AVAILABLE BANKS ERROR:", error);

      setChangeBanksError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load banks.",
      );
    } finally {
      setIsLoadingAvailableBanks(false);
    }
  };

  /*
   * SELECT / UNSELECT BANK
   */
  const handleBankSelection = (bankId) => {
    const id = Number(bankId);

    setSelectedBankIds((currentIds) => {
      if (currentIds.includes(id)) {
        return currentIds.filter((currentId) => currentId !== id);
      }

      return [...currentIds, id];
    });
  };

  /*
   * CANCEL CHANGE BANKS
   */
  const handleCancelChangingBanks = () => {
    setIsChangingBanks(false);

    setAvailableBanks([]);

    setSelectedBankIds([]);

    setChangeBanksError("");
  };

  /*
   * SAVE CHANGED BANKS
   */
  const handleSaveMerchantBanks = async () => {
    if (!viewMerchant) {
      return;
    }

    if (selectedBankIds.length === 0) {
      setChangeBanksError("At least one bank must be selected.");
      return;
    }

    try {
      setIsSavingBanks(true);

      setChangeBanksError("");

      const response = await updateMerchantBanks(
        viewMerchant.id,
        selectedBankIds,
      );

      console.log("UPDATE MERCHANT BANKS RESPONSE:", response);

      /*
       * Reload assigned banks after save.
       */
      const banksResponse = await getMerchantBanks(viewMerchant.id);

      setMerchantBanks(banksResponse?.banks || []);

      setIsChangingBanks(false);

      setAvailableBanks([]);

      setSelectedBankIds([]);

      setChangeBanksError("");
    } catch (error) {
      console.error("UPDATE MERCHANT BANKS ERROR:", error);

      setChangeBanksError(
        error.response?.data?.message ||
          error.message ||
          "Unable to update merchant banks.",
      );
    } finally {
      setIsSavingBanks(false);
    }
  };

  /*
   * CLOSE VIEW
   */
  const closeViewMerchant = () => {
    if (isLoadingMerchantBanks || isSavingBanks) {
      return;
    }

    setViewMerchantOpen(false);

    setViewMerchant(null);

    setMerchantBanks([]);

    setMerchantBanksError("");

    setIsChangingBanks(false);

    setAvailableBanks([]);

    setSelectedBankIds([]);

    setChangeBanksError("");
  };

  /*
   * CLOSE ADD / EDIT
   */
  const closeMerchantDialog = () => {
    if (isSubmitting) {
      return;
    }

    setMerchantDialogOpen(false);

    setSelectedMerchant(null);

    setMerchantDialogError("");
  };

  /*
   * ADD / EDIT MERCHANT
   */
  const handleMerchantSubmit = async (formData) => {
    try {
      setIsSubmitting(true);

      setMerchantDialogError("");

      /*
       * ADD
       */
      if (dialogMode === "add") {
        const response = await createMerchant({
          merchantName: formData.merchantName,

          MID: formData.mid,

          TID: formData.tid,

          bankIds: formData.bankIds,
        });

        console.log("CREATE MERCHANT RESPONSE:", response);

        setSuccessMessage(
          response?.message || "Merchant created successfully.",
        );

        /*
         * Reload from backend so
         * mapping remains consistent.
         */
        await loadMerchants();
      } else {
        /*
         * EDIT
         */
        const response = await updateMerchant(selectedMerchant, formData);

        console.log("UPDATE MERCHANT RESPONSE:", response);

        setSuccessMessage(
          response?.message || "Merchant updated successfully.",
        );

        await loadMerchants();
      }

      setMerchantDialogOpen(false);

      setSelectedMerchant(null);

      return true;
    } catch (error) {
      console.error("SAVE MERCHANT ERROR:", error);

      setMerchantDialogError(
        error.response?.data?.message ||
          error.message ||
          "Unable to save merchant.",
      );

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
   * OPEN DELETE
   */
  const openDeleteMerchant = (merchant) => {
    setSelectedMerchant(merchant);

    setDeleteError("");

    setSuccessMessage("");

    setDeleteDialogOpen(true);
  };

  /*
   * DELETE
   */
  const handleDeleteMerchant = async () => {
    if (!selectedMerchant) {
      return;
    }

    try {
      setIsDeleting(true);

      setDeleteError("");

      const response = await deleteMerchant(selectedMerchant.id);

      console.log("DELETE MERCHANT RESPONSE:", response);

      /*
       * Remove from local list.
       */
      loadMerchants();

      setSuccessMessage(response?.message || "Merchant deleted successfully.");

      setDeleteDialogOpen(false);

      setSelectedMerchant(null);
    } catch (error) {
      console.error("DELETE MERCHANT ERROR:", error);

      setDeleteError(
        error.response?.data?.message ||
          error.message ||
          "Unable to delete merchant.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  /*
   * RESET FILTERS
   */
  const resetFilters = () => {
    setSearchText("");

    setStatusFilter("All");
  };

  /*
   * DATE FORMAT
   */
  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleString("en-PK", {
      day: "2-digit",

      month: "short",

      year: "numeric",

      hour: "2-digit",

      minute: "2-digit",
    });
  };

  /*
   * STAT CARD
   */
  const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    iconBackground,
    iconColor,
  }) => (
    <Paper
      elevation={0}
      sx={{
        width: "100%",

        minWidth: 0,

        minHeight: 132,

        p: 2.5,

        display: "flex",

        alignItems: "center",

        gap: 2.5,

        border: "1px solid #eaecf0",

        borderRadius: 3,

        boxShadow: "0 4px 14px rgba(16,24,40,0.05)",
      }}
    >
      <Box
        sx={{
          width: 72,

          height: 72,

          flexShrink: 0,

          display: "grid",

          placeItems: "center",

          borderRadius: "50%",

          color: iconColor,

          backgroundColor: iconBackground,
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          sx={{
            color: "#475467",

            fontSize: 14,

            fontWeight: 600,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 0.3,

            color: "#101828",

            fontSize: 30,

            fontWeight: 750,

            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>

        <Typography
          sx={{
            mt: 0.7,

            color: "#667085",

            fontSize: 13,
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Paper>
  );

  return (
    <Box
      sx={{
        width: "100%",

        minWidth: 0,
      }}
    >
      {/* ============================= */}
      {/* PAGE HEADER */}
      {/* ============================= */}

      <Box
        sx={{
          mb: 3,

          display: "flex",

          flexDirection: {
            xs: "column",
            sm: "row",
          },

          alignItems: {
            xs: "stretch",
            sm: "center",
          },

          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "#101828",

              fontSize: {
                xs: 27,
                sm: 32,
              },

              fontWeight: 750,

              lineHeight: 1.2,
            }}
          >
            Merchants
          </Typography>

          <Typography
            sx={{
              mt: 0.5,

              color: "#667085",

              fontSize: 15,
            }}
          >
            View and manage all merchants.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={openAddMerchant}
          sx={{
            ml: {
              sm: "auto",
            },

            minHeight: 46,

            px: 2.5,

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
          <Box
            component="span"
            sx={{
              mr: 1,

              fontSize: 23,

              lineHeight: 1,
            }}
          >
            +
          </Box>
          Create Merchant
        </Button>
      </Box>

      {/* ============================= */}
      {/* SUCCESS MESSAGE */}
      {/* ============================= */}

      {successMessage && (
        <Alert
          severity="success"
          onClose={() => setSuccessMessage("")}
          sx={{
            mb: 2,

            borderRadius: 2,
          }}
        >
          {successMessage}
        </Alert>
      )}

      {/* ============================= */}
      {/* STATS */}
      {/* ============================= */}

      <Box
        sx={{
          width: "100%",

          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",

            sm: "repeat(2, minmax(0, 1fr))",

            lg: "repeat(3, minmax(0, 1fr))",
          },

          gap: 2,
        }}
      >
        <StatCard
          title="Total Merchants"
          value={merchants.length}
          subtitle="All merchants"
          icon={
            <StorefrontOutlined
              sx={{
                fontSize: 36,
              }}
            />
          }
          iconBackground="#fff0eb"
          iconColor="#f23a17"
        />

        <StatCard
          title="Active Merchants"
          value={activeMerchants}
          subtitle={`${
            merchants.length
              ? ((activeMerchants / merchants.length) * 100).toFixed(2)
              : 0
          }% of total`}
          icon={
            <CheckCircleOutlined
              sx={{
                fontSize: 36,
              }}
            />
          }
          iconBackground="#ecfdf3"
          iconColor="#039855"
        />

        <StatCard
          title="Inactive Merchants"
          value={inactiveMerchants}
          subtitle={`${
            merchants.length
              ? ((inactiveMerchants / merchants.length) * 100).toFixed(2)
              : 0
          }% of total`}
          icon={
            <PauseCircleOutlineOutlined
              sx={{
                fontSize: 36,
              }}
            />
          }
          iconBackground="#fff7e6"
          iconColor="#d68a00"
        />
      </Box>

      {/* ============================= */}
      {/* SEARCH / FILTER */}
      {/* ============================= */}

      <Paper
        elevation={0}
        sx={{
          mt: 2.5,

          p: 2,

          display: "flex",

          flexWrap: "wrap",

          alignItems: "center",

          gap: 1.5,

          border: "1px solid #eaecf0",

          borderRadius: 3,
        }}
      >
        <TextField
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search by merchant name, MID or TID..."
          size="small"
          sx={{
            width: {
              xs: "100%",
              sm: 360,
            },

            "& .MuiOutlinedInput-root": {
              minHeight: 46,

              borderRadius: 2,

              "&.Mui-focused fieldset": {
                borderColor: "#f23a17",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined
                  sx={{
                    color: "#667085",
                  }}
                />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          size="small"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          sx={{
            width: {
              xs: "100%",
              sm: 160,
            },

            "& .MuiOutlinedInput-root": {
              minHeight: 46,

              borderRadius: 2,
            },
          }}
        >
          <MenuItem value="All">All Status</MenuItem>

          <MenuItem value="Active">Active</MenuItem>

          <MenuItem value="Inactive">Inactive</MenuItem>
        </TextField>

        <Button
          variant="outlined"
          onClick={resetFilters}
          sx={{
            minHeight: 46,

            px: 2,

            color: "#475467",

            borderColor: "#d0d5dd",

            borderRadius: 2,

            textTransform: "none",

            fontWeight: 600,
          }}
        >
          Reset
        </Button>

        <Typography
          sx={{
            ml: {
              md: "auto",
            },

            color: "#667085",

            fontSize: 14,
          }}
        >
          Showing{" "}
          <Box
            component="span"
            sx={{
              color: "#101828",

              fontWeight: 700,
            }}
          >
            {filteredMerchants.length}
          </Box>{" "}
          of {merchants.length} merchants
        </Typography>
      </Paper>

      {/* ============================= */}
      {/* MERCHANT TABLE */}
      {/* ============================= */}

      <Paper
        elevation={0}
        sx={{
          mt: 1.5,

          width: "100%",

          overflowX: "auto",

          border: "1px solid #eaecf0",

          borderRadius: 3,

          boxShadow: "0 4px 14px rgba(16,24,40,0.04)",
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              p: 3,
            }}
          >
            {Array.from({
              length: 8,
            }).map((_, index) => (
              <Skeleton
                key={index}
                height={60}
                sx={{
                  mb: 1,
                }}
              />
            ))}
          </Box>
        ) : loadError ? (
          <Box
            sx={{
              minHeight: 280,

              display: "grid",

              placeItems: "center",

              p: 3,

              textAlign: "center",
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "#b42318",

                  fontWeight: 700,
                }}
              >
                {loadError}
              </Typography>

              <Button
                onClick={loadMerchants}
                sx={{
                  mt: 1,

                  color: "#f23a17",

                  textTransform: "none",
                }}
              >
                Try Again
              </Button>
            </Box>
          </Box>
        ) : filteredMerchants.length === 0 ? (
          <Box
            sx={{
              minHeight: 280,

              display: "grid",

              placeItems: "center",

              textAlign: "center",
            }}
          >
            <Box>
              <StorefrontOutlined
                sx={{
                  fontSize: 50,

                  color: "#f23a17",
                }}
              />

              <Typography
                sx={{
                  mt: 1,

                  color: "#101828",

                  fontSize: 18,

                  fontWeight: 700,
                }}
              >
                No merchants found
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,

                  color: "#667085",
                }}
              >
                Change your search or create a new merchant.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            component="table"
            sx={{
              width: "100%",

              minWidth: 1000,

              borderCollapse: "collapse",

              "& th": {
                px: 2.5,

                py: 2,

                color: "#667085",

                borderBottom: "1px solid #eaecf0",

                textAlign: "left",

                fontSize: 13,

                fontWeight: 600,

                whiteSpace: "nowrap",
              },

              "& td": {
                px: 2.5,

                py: 2,

                color: "#101828",

                borderBottom: "1px solid #eaecf0",

                fontSize: 14,

                verticalAlign: "middle",
              },

              "& tbody tr:hover": {
                backgroundColor: "#fcfcfd",
              },

              "& tbody tr:last-child td": {
                borderBottom: 0,
              },
            }}
          >
            <Box component="thead">
              <Box component="tr">
                <Box component="th">#</Box>

                <Box component="th">Merchant Name</Box>

                <Box component="th">MID</Box>

                <Box component="th">TID</Box>

                <Box component="th">Status</Box>

                <Box component="th">View Assigned Banks</Box>

                <Box component="th">Actions</Box>
              </Box>
            </Box>

            <Box component="tbody">
              {filteredMerchants.map((merchant, index) => (
                <Box component="tr" key={merchant.id}>
                  <Box component="td">{index + 1}</Box>

                  <Box component="td">
                    <Typography
                      sx={{
                        color: "#101828",

                        fontSize: 14,

                        fontWeight: 650,

                        whiteSpace: "nowrap",
                      }}
                    >
                      {merchant.merchantName}
                    </Typography>
                  </Box>

                  <Box component="td">
                    <Typography
                      sx={{
                        display: "inline-block",

                        px: 1.2,

                        py: 0.5,

                        borderRadius: 1.5,

                        backgroundColor: "#f2f4f7",

                        color: "#344054",

                        fontFamily: "monospace",

                        fontSize: 14,

                        fontWeight: 700,

                        letterSpacing: 0.5,

                        whiteSpace: "nowrap",
                      }}
                    >
                      {merchant.mid}
                    </Typography>
                  </Box>

                  <Box component="td">
                    <Typography
                      sx={{
                        fontFamily: "monospace",

                        fontSize: 14,

                        fontWeight: 700,

                        letterSpacing: 0.5,

                        whiteSpace: "nowrap",
                      }}
                    >
                      {merchant.tid}
                    </Typography>
                  </Box>

                  <Box component="td">
                    <Chip
                      size="small"
                      label={merchant.status}
                      sx={{
                        color:
                          merchant.status === "Active" ? "#027a48" : "#b42318",

                        backgroundColor:
                          merchant.status === "Active" ? "#ecfdf3" : "#fef3f2",

                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <Box
                    component="td"
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <IconButton
                      aria-label="View merchant"
                      onClick={() => openViewMerchant(merchant)}
                      sx={{
                        color: "#344054",
                        "&:hover": {
                          color: "#f23a17",
                          backgroundColor: "#fff0eb",
                        },
                      }}
                    >
                      <VisibilityOutlined
                        sx={{
                          fontSize: 20,
                        }}
                      />
                    </IconButton>
                  </Box>

                  <Box component="td">
                    <Box
                      sx={{
                        display: "flex",

                        alignItems: "center",

                        gap: 0.5,
                      }}
                    >
                      <IconButton
                        aria-label="Edit merchant"
                        onClick={() => openEditMerchant(merchant)}
                        sx={{
                          color: "#344054",

                          "&:hover": {
                            color: "#f23a17",

                            backgroundColor: "#fff0eb",
                          },
                        }}
                      >
                        <EditOutlined
                          sx={{
                            fontSize: 20,
                          }}
                        />
                      </IconButton>

                      <IconButton
                        aria-label="Delete merchant"
                        onClick={() => openDeleteMerchant(merchant)}
                        sx={{
                          color: "#d92d20",

                          "&:hover": {
                            backgroundColor: "#fef3f2",
                          },
                        }}
                      >
                        <DeleteOutlineOutlined
                          sx={{
                            fontSize: 20,
                          }}
                        />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Paper>

      {/* ============================= */}
      {/* VIEW MERCHANT DIALOG */}
      {/* ============================= */}

      <Dialog
        open={viewMerchantOpen}
        onClose={closeViewMerchant}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            color: "#101828",

            fontSize: 20,

            fontWeight: 700,

            borderBottom: "1px solid #eaecf0",
          }}
        >
          Merchant Details
        </DialogTitle>

        <DialogContent
          sx={{
            pt: 3,
          }}
        >
          {viewMerchant && (
            <>
              {/* MERCHANT DETAILS */}

              <Box
                sx={{
                  display: "grid",

                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(3, 1fr)",
                  },

                  gap: 2,

                  mb: 3,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: "#667085",

                      fontSize: 12,

                      fontWeight: 600,
                    }}
                  >
                    Merchant Name
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,

                      color: "#101828",

                      fontSize: 14,

                      fontWeight: 700,
                    }}
                  >
                    {viewMerchant.merchantName}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: "#667085",

                      fontSize: 12,

                      fontWeight: 600,
                    }}
                  >
                    MID
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,

                      color: "#101828",

                      fontFamily: "monospace",

                      fontSize: 14,

                      fontWeight: 700,
                    }}
                  >
                    {viewMerchant.mid}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: "#667085",

                      fontSize: 12,

                      fontWeight: 600,
                    }}
                  >
                    TID
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,

                      color: "#101828",

                      fontFamily: "monospace",

                      fontSize: 14,

                      fontWeight: 700,
                    }}
                  >
                    {viewMerchant.tid}
                  </Typography>
                </Box>
              </Box>

              {/* BANK HEADING */}

              <Box
                sx={{
                  mb: 1.5,

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "space-between",

                  gap: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "#101828",

                    fontSize: 16,

                    fontWeight: 700,
                  }}
                >
                  Assigned Banks
                </Typography>

                {!isChangingBanks && (
                  <Button
                    variant="outlined"
                    onClick={handleStartChangingBanks}
                    disabled={
                      isLoadingMerchantBanks || isLoadingAvailableBanks
                    }
                    sx={{
                      minHeight: 36,

                      px: 1.8,

                      color: "#f23a17",

                      borderColor: "#f23a17",

                      borderRadius: 2,

                      textTransform: "none",

                      fontWeight: 600,

                      "&:hover": {
                        borderColor: "#d92d12",

                        backgroundColor: "#fff0eb",
                      },
                    }}
                  >
                    Change Banks
                  </Button>
                )}
              </Box>

              {/* CHANGE BANKS ERROR */}

              {isChangingBanks && changeBanksError && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 1.5,

                    borderRadius: 2,
                  }}
                >
                  {changeBanksError}
                </Alert>
              )}

              {/* BANK LOADING */}

              {isLoadingMerchantBanks && (
                <Box>
                  <Skeleton
                    variant="rounded"
                    height={64}
                    sx={{
                      mb: 1,
                    }}
                  />

                  <Skeleton
                    variant="rounded"
                    height={64}
                    sx={{
                      mb: 1,
                    }}
                  />
                </Box>
              )}

              {/* BANK ERROR */}

              {!isLoadingMerchantBanks &&
                !isChangingBanks &&
                merchantBanksError && (
                  <Alert
                    severity="error"
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    {merchantBanksError}
                  </Alert>
                )}

              {/* CHANGE BANKS MODE */}

              {isChangingBanks && (
                <>
                  {isLoadingAvailableBanks ? (
                    <Box>
                      <Skeleton
                        variant="rounded"
                        height={64}
                        sx={{
                          mb: 1,
                        }}
                      />

                      <Skeleton
                        variant="rounded"
                        height={64}
                        sx={{
                          mb: 1,
                        }}
                      />

                      <Skeleton
                        variant="rounded"
                        height={64}
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",

                        flexDirection: "column",

                        gap: 1,
                      }}
                    >
                      {availableBanks.map((bank) => {
                        const isSelected = selectedBankIds.includes(
                          Number(bank.bank_id),
                        );

                        return (
                          <Box
                            key={bank.bank_id}
                            onClick={() =>
                              handleBankSelection(bank.bank_id)
                            }
                            sx={{
                              display: "flex",

                              alignItems: "center",

                              gap: 1,

                              p: 1.2,

                              border: "1px solid",

                              borderColor: isSelected
                                ? "#f23a17"
                                : "#eaecf0",

                              borderRadius: 2,

                              backgroundColor: isSelected
                                ? "#fff8f5"
                                : "#fcfcfd",

                              cursor: "pointer",

                              transition: "all 0.15s ease",

                              "&:hover": {
                                borderColor: "#f23a17",

                                backgroundColor: "#fff8f5",
                              },
                            }}
                          >
                            <Checkbox
                              checked={isSelected}
                              onChange={() =>
                                handleBankSelection(bank.bank_id)
                              }
                              onClick={(event) =>
                                event.stopPropagation()
                              }
                              sx={{
                                color: "#98a2b3",

                                "&.Mui-checked": {
                                  color: "#f23a17",
                                },
                              }}
                            />

                            {/* BANK LOGO */}

                            <Box
                              sx={{
                                width: 44,

                                height: 44,

                                flexShrink: 0,

                                display: "grid",

                                placeItems: "center",

                                border: "1px solid #eaecf0",

                                borderRadius: 1.5,

                                backgroundColor: "#ffffff",

                                overflow: "hidden",
                              }}
                            >
                              {bank.logo ? (
                                <Box
                                  component="img"
                                  src={getBankLogoUrl(bank.logo)}
                                  alt={bank.bank_name}
                                  sx={{
                                    width: "100%",

                                    height: "100%",

                                    objectFit: "contain",

                                    p: 0.5,
                                  }}
                                />
                              ) : (
                                <Typography
                                  sx={{
                                    color: "#667085",

                                    fontSize: 12,

                                    fontWeight: 700,
                                  }}
                                >
                                  BANK
                                </Typography>
                              )}
                            </Box>

                            {/* BANK NAME */}

                            <Box>
                              <Typography
                                sx={{
                                  color: "#101828",

                                  fontSize: 14,

                                  fontWeight: 650,
                                }}
                              >
                                {bank.bank_name}
                              </Typography>

                              <Typography
                                sx={{
                                  mt: 0.2,

                                  color: "#667085",

                                  fontSize: 12,
                                }}
                              >
                                Bank ID: {bank.bank_id}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </>
              )}

              {/* NORMAL BANKS */}

              {!isChangingBanks &&
                !isLoadingMerchantBanks &&
                !merchantBanksError &&
                merchantBanks.length === 0 && (
                  <Box
                    sx={{
                      p: 2,

                      border: "1px solid #eaecf0",

                      borderRadius: 2,

                      textAlign: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#667085",

                        fontSize: 14,
                      }}
                    >
                      No banks assigned to this merchant.
                    </Typography>
                  </Box>
                )}

              {!isChangingBanks &&
                !isLoadingMerchantBanks &&
                !merchantBanksError &&
                merchantBanks.length > 0 && (
                  <Box
                    sx={{
                      display: "flex",

                      flexDirection: "column",

                      gap: 1,
                    }}
                  >
                    {merchantBanks.map((bank) => (
                      <Box
                        key={bank.bank_id}
                        sx={{
                          display: "flex",

                          alignItems: "center",

                          gap: 1.5,

                          p: 1.5,

                          border: "1px solid #eaecf0",

                          borderRadius: 2,

                          backgroundColor: "#fcfcfd",
                        }}
                      >
                        {/* BANK LOGO */}

                        <Box
                          sx={{
                            width: 44,

                            height: 44,

                            flexShrink: 0,

                            display: "grid",

                            placeItems: "center",

                            border: "1px solid #eaecf0",

                            borderRadius: 1.5,

                            backgroundColor: "#ffffff",

                            overflow: "hidden",
                          }}
                        >
                          {bank.logo ? (
                            <Box
                              component="img"
                              src={getBankLogoUrl(bank.logo)}
                              alt={bank.bank_name}
                              sx={{
                                width: "100%",

                                height: "100%",

                                objectFit: "contain",

                                p: 0.5,
                              }}
                            />
                          ) : (
                            <Typography
                              sx={{
                                color: "#667085",

                                fontSize: 12,

                                fontWeight: 700,
                              }}
                            >
                              BANK
                            </Typography>
                          )}
                        </Box>

                        {/* BANK NAME */}

                        <Box>
                          <Typography
                            sx={{
                              color: "#101828",

                              fontSize: 14,

                              fontWeight: 650,
                            }}
                          >
                            {bank.bank_name}
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.2,

                              color: "#667085",

                              fontSize: 12,
                            }}
                          >
                            Bank ID: {bank.bank_id}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
            </>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,

            py: 2,

            borderTop: "1px solid #eaecf0",
          }}
        >
          {isChangingBanks ? (
            <>
              <Button
                onClick={handleCancelChangingBanks}
                disabled={isSavingBanks}
                sx={{
                  color: "#475467",

                  textTransform: "none",

                  fontWeight: 600,
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={handleSaveMerchantBanks}
                disabled={
                  isSavingBanks ||
                  isLoadingAvailableBanks ||
                  selectedBankIds.length === 0
                }
                sx={{
                  minWidth: 120,

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
                {isSavingBanks ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button
              onClick={closeViewMerchant}
              disabled={isLoadingMerchantBanks}
              sx={{
                color: "#475467",

                textTransform: "none",

                fontWeight: 600,
              }}
            >
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* ============================= */}
      {/* CREATE / EDIT DIALOG */}
      {/* ============================= */}

      <MerchantDialog
        open={merchantDialogOpen}
        mode={dialogMode}
        merchant={selectedMerchant}
        existingMerchants={merchants}
        isSubmitting={isSubmitting}
        apiError={merchantDialogError}
        onClose={closeMerchantDialog}
        onSubmit={handleMerchantSubmit}
      />

      {/* ============================= */}
      {/* DELETE DIALOG */}
      {/* ============================= */}

      <DeleteMerchantDialog
        open={deleteDialogOpen}
        merchant={selectedMerchant}
        isDeleting={isDeleting}
        apiError={deleteError}
        onClose={() => {
          if (!isDeleting) {
            setDeleteDialogOpen(false);

            setSelectedMerchant(null);

            setDeleteError("");
          }
        }}
        onConfirm={handleDeleteMerchant}
      />
    </Box>
  );
};

export default MerchantsPage;