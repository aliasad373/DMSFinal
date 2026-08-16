import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CheckCircleOutlined,
  DeleteOutlineOutlined,
  EditOutlined,
  PauseCircleOutlineOutlined,
  SearchOutlined,
  StorefrontOutlined,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  Chip,
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
  getMerchants,
  updateMerchant,
} from "../api/merchantApi";

const MerchantsPage = () => {
  /*
   * DATA
   */
  const [
    merchants,
    setMerchants,
  ] = useState([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    loadError,
    setLoadError,
  ] = useState("");

  /*
   * FILTERS
   */
  const [
    searchText,
    setSearchText,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  /*
   * ADD / EDIT
   */
  const [
    merchantDialogOpen,
    setMerchantDialogOpen,
  ] = useState(false);

  const [
    dialogMode,
    setDialogMode,
  ] = useState("add");

  const [
    selectedMerchant,
    setSelectedMerchant,
  ] = useState(null);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    merchantDialogError,
    setMerchantDialogError,
  ] = useState("");

  /*
   * DELETE
   */
  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);

  const [
    isDeleting,
    setIsDeleting,
  ] = useState(false);

  const [
    deleteError,
    setDeleteError,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  /*
   * LOAD
   */
  const loadMerchants =
    async () => {
      try {
        setIsLoading(true);

        setLoadError("");

        const response =
          await getMerchants();

        setMerchants(
          response.data || []
        );
      } catch (error) {
        setLoadError(
          error.message ||
            "Unable to load merchants."
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
  const activeMerchants =
    merchants.filter(
      (merchant) =>
        merchant.status ===
        "Active"
    ).length;

  const inactiveMerchants =
    merchants.filter(
      (merchant) =>
        merchant.status ===
        "Inactive"
    ).length;

  /*
   * FILTER
   */
  const filteredMerchants =
    useMemo(() => {
      const search =
        searchText
          .trim()
          .toLowerCase();

      return merchants.filter(
        (merchant) => {
          const searchable =
            `
              ${merchant.mid || ""}
              ${merchant.tid || ""}
            `.toLowerCase();

          const matchesSearch =
            !search ||
            searchable.includes(
              search
            );

          const matchesStatus =
            statusFilter ===
              "All" ||
            merchant.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      merchants,
      searchText,
      statusFilter,
    ]);

  /*
   * ADD
   */
  const openAddMerchant =
    () => {
      setDialogMode(
        "add"
      );

      setSelectedMerchant(
        null
      );

      setMerchantDialogError(
        ""
      );

      setSuccessMessage(
        ""
      );

      setMerchantDialogOpen(
        true
      );
    };

  /*
   * EDIT
   */
  const openEditMerchant =
    (merchant) => {
      setDialogMode(
        "edit"
      );

      setSelectedMerchant(
        merchant
      );

      setMerchantDialogError(
        ""
      );

      setSuccessMessage(
        ""
      );

      setMerchantDialogOpen(
        true
      );
    };

  /*
   * CLOSE ADD/EDIT
   */
  const closeMerchantDialog =
    () => {
      if (isSubmitting) {
        return;
      }

      setMerchantDialogOpen(
        false
      );

      setSelectedMerchant(
        null
      );

      setMerchantDialogError(
        ""
      );
    };

  /*
   * SUBMIT ADD/EDIT
   */
  const handleMerchantSubmit =
    async (formData) => {
      try {
        setIsSubmitting(
          true
        );

        setMerchantDialogError(
          ""
        );

        if (
          dialogMode ===
          "add"
        ) {
          const response =
            await createMerchant(
              formData
            );

          setMerchants(
            (previous) => [
              response.data,
              ...previous,
            ]
          );

          setSuccessMessage(
            response.message
          );
        } else {
          const response =
            await updateMerchant(
              selectedMerchant.id,
              formData
            );

          setMerchants(
            (previous) =>
              previous.map(
                (merchant) =>
                  merchant.id ===
                  selectedMerchant.id
                    ? response.data
                    : merchant
              )
          );

          setSuccessMessage(
            response.message
          );
        }

        setMerchantDialogOpen(
          false
        );

        setSelectedMerchant(
          null
        );

        return true;
      } catch (error) {
        setMerchantDialogError(
          error.message ||
            "Unable to save merchant."
        );

        return false;
      } finally {
        setIsSubmitting(
          false
        );
      }
    };

  /*
   * OPEN DELETE
   */
  const openDeleteMerchant =
    (merchant) => {
      setSelectedMerchant(
        merchant
      );

      setDeleteError("");

      setSuccessMessage("");

      setDeleteDialogOpen(
        true
      );
    };

  /*
   * DELETE
   */
  const handleDeleteMerchant =
    async () => {
      if (!selectedMerchant) {
        return;
      }

      try {
        setIsDeleting(true);

        setDeleteError("");

        const response =
          await deleteMerchant(
            selectedMerchant.id
          );

        setMerchants(
          (previous) =>
            previous.filter(
              (merchant) =>
                merchant.id !==
                selectedMerchant.id
            )
        );

        setSuccessMessage(
          response.message
        );

        setDeleteDialogOpen(
          false
        );

        setSelectedMerchant(
          null
        );
      } catch (error) {
        setDeleteError(
          error.message ||
            "Unable to delete merchant."
        );
      } finally {
        setIsDeleting(
          false
        );
      }
    };

  /*
   * RESET FILTERS
   */
  const resetFilters = () => {
    setSearchText("");

    setStatusFilter(
      "All"
    );
  };

  /*
   * DATE FORMAT
   */
  const formatDate = (
    dateValue
  ) => {
    if (!dateValue) {
      return "-";
    }

    const date =
      new Date(dateValue);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return dateValue;
    }

    return date.toLocaleString(
      "en-PK",
      {
        day: "2-digit",

        month: "short",

        year: "numeric",

        hour: "2-digit",

        minute: "2-digit",
      }
    );
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

        alignItems:
          "center",

        gap: 2.5,

        border:
          "1px solid #eaecf0",

        borderRadius: 3,

        boxShadow:
          "0 4px 14px rgba(16,24,40,0.05)",
      }}
    >
      <Box
        sx={{
          width: 72,

          height: 72,

          flexShrink: 0,

          display: "grid",

          placeItems:
            "center",

          borderRadius:
            "50%",

          color:
            iconColor,

          backgroundColor:
            iconBackground,
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          sx={{
            color:
              "#475467",

            fontSize: 14,

            fontWeight: 600,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 0.3,

            color:
              "#101828",

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

            color:
              "#667085",

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
      {/* PAGE HEADER */}

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
              color:
                "#101828",

              fontSize: {
                xs: 27,

                sm: 32,
              },

              fontWeight:
                750,

              lineHeight:
                1.2,
            }}
          >
            Merchants
          </Typography>

          <Typography
            sx={{
              mt: 0.5,

              color:
                "#667085",

              fontSize: 15,
            }}
          >
            View and manage all
            merchants.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={
            openAddMerchant
          }
          sx={{
            ml: {
              sm: "auto",
            },

            minHeight: 46,

            px: 2.5,

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

      {/* SUCCESS */}

      {successMessage && (
        <Alert
          severity="success"
          onClose={() =>
            setSuccessMessage(
              ""
            )
          }
          sx={{
            mb: 2,

            borderRadius: 2,
          }}
        >
          {successMessage}
        </Alert>
      )}

      {/* STATS - FULL WIDTH */}

      <Box
        sx={{
          width: "100%",

          display: "grid",

          gridTemplateColumns:
            {
              xs: "1fr",

              sm: "repeat(2, minmax(0, 1fr))",

              lg: "repeat(3, minmax(0, 1fr))",
            },

          gap: 2,
        }}
      >
        <StatCard
          title="Total Merchants"
          value={
            merchants.length
          }
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
          value={
            activeMerchants
          }
          subtitle={`${
            merchants.length
              ? (
                  (activeMerchants /
                    merchants.length) *
                  100
                ).toFixed(2)
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
          value={
            inactiveMerchants
          }
          subtitle={`${
            merchants.length
              ? (
                  (inactiveMerchants /
                    merchants.length) *
                  100
                ).toFixed(2)
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

      {/* SEARCH / FILTER */}

      <Paper
        elevation={0}
        sx={{
          mt: 2.5,

          p: 2,

          display: "flex",

          flexWrap: "wrap",

          alignItems:
            "center",

          gap: 1.5,

          border:
            "1px solid #eaecf0",

          borderRadius: 3,
        }}
      >
        <TextField
          value={
            searchText
          }
          onChange={(
            event
          ) =>
            setSearchText(
              event.target.value
            )
          }
          placeholder="Search by MID or TID..."
          size="small"
          sx={{
            width: {
              xs: "100%",

              sm: 360,
            },

            "& .MuiOutlinedInput-root":
              {
                minHeight:
                  46,

                borderRadius:
                  2,

                "&.Mui-focused fieldset":
                  {
                    borderColor:
                      "#f23a17",
                  },
              },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined
                  sx={{
                    color:
                      "#667085",
                  }}
                />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          size="small"
          value={
            statusFilter
          }
          onChange={(
            event
          ) =>
            setStatusFilter(
              event.target.value
            )
          }
          sx={{
            width: {
              xs: "100%",

              sm: 160,
            },

            "& .MuiOutlinedInput-root":
              {
                minHeight:
                  46,

                borderRadius:
                  2,
              },
          }}
        >
          <MenuItem value="All">
            All Status
          </MenuItem>

          <MenuItem value="Active">
            Active
          </MenuItem>

          <MenuItem value="Inactive">
            Inactive
          </MenuItem>
        </TextField>

        <Button
          variant="outlined"
          onClick={
            resetFilters
          }
          sx={{
            minHeight: 46,

            px: 2,

            color:
              "#475467",

            borderColor:
              "#d0d5dd",

            borderRadius: 2,

            textTransform:
              "none",

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

            color:
              "#667085",

            fontSize: 14,
          }}
        >
          Showing{" "}
          <Box
            component="span"
            sx={{
              color:
                "#101828",

              fontWeight: 700,
            }}
          >
            {
              filteredMerchants.length
            }
          </Box>{" "}
          of{" "}
          {merchants.length}{" "}
          merchants
        </Typography>
      </Paper>

      {/* MERCHANT TABLE */}

      <Paper
        elevation={0}
        sx={{
          mt: 1.5,

          width: "100%",

          overflowX:
            "auto",

          border:
            "1px solid #eaecf0",

          borderRadius: 3,

          boxShadow:
            "0 4px 14px rgba(16,24,40,0.04)",
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
            }).map(
              (_, index) => (
                <Skeleton
                  key={
                    index
                  }
                  height={60}
                  sx={{
                    mb: 1,
                  }}
                />
              )
            )}
          </Box>
        ) : loadError ? (
          <Box
            sx={{
              minHeight:
                280,

              display:
                "grid",

              placeItems:
                "center",

              p: 3,

              textAlign:
                "center",
            }}
          >
            <Box>
              <Typography
                sx={{
                  color:
                    "#b42318",

                  fontWeight:
                    700,
                }}
              >
                {loadError}
              </Typography>

              <Button
                onClick={
                  loadMerchants
                }
                sx={{
                  mt: 1,

                  color:
                    "#f23a17",

                  textTransform:
                    "none",
                }}
              >
                Try Again
              </Button>
            </Box>
          </Box>
        ) : filteredMerchants.length ===
          0 ? (
          <Box
            sx={{
              minHeight:
                280,

              display:
                "grid",

              placeItems:
                "center",

              textAlign:
                "center",
            }}
          >
            <Box>
              <StorefrontOutlined
                sx={{
                  fontSize:
                    50,

                  color:
                    "#f23a17",
                }}
              />

              <Typography
                sx={{
                  mt: 1,

                  color:
                    "#101828",

                  fontSize:
                    18,

                  fontWeight:
                    700,
                }}
              >
                No merchants found
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,

                  color:
                    "#667085",
                }}
              >
                Change your
                search or create
                a new merchant.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            component="table"
            sx={{
              width: "100%",

              minWidth: 850,

              borderCollapse:
                "collapse",

              "& th": {
                px: 2.5,

                py: 2,

                color:
                  "#667085",

                borderBottom:
                  "1px solid #eaecf0",

                textAlign:
                  "left",

                fontSize: 13,

                fontWeight:
                  600,

                whiteSpace:
                  "nowrap",
              },

              "& td": {
                px: 2.5,

                py: 2,

                color:
                  "#101828",

                borderBottom:
                  "1px solid #eaecf0",

                fontSize: 14,

                verticalAlign:
                  "middle",
              },

              "& tbody tr:hover":
                {
                  backgroundColor:
                    "#fcfcfd",
                },

              "& tbody tr:last-child td":
                {
                  borderBottom:
                    0,
                },
            }}
          >
            <Box component="thead">
              <Box component="tr">
                <Box component="th">
                  #
                </Box>

                <Box component="th">
                  MID
                </Box>

                <Box component="th">
                  TID
                </Box>

                <Box component="th">
                  Status
                </Box>

                <Box component="th">
                  Created At
                </Box>

                <Box component="th">
                  Actions
                </Box>
              </Box>
            </Box>

            <Box component="tbody">
              {filteredMerchants.map(
                (
                  merchant,
                  index
                ) => (
                  <Box
                    component="tr"
                    key={
                      merchant.id
                    }
                  >
                    {/* INDEX */}

                    <Box component="td">
                      {index +
                        1}
                    </Box>

                    {/* MID */}

                    <Box component="td">
                      <Typography
                        sx={{
                          display:
                            "inline-block",

                          px: 1.2,

                          py: 0.5,

                          borderRadius:
                            1.5,

                          backgroundColor:
                            "#f2f4f7",

                          color:
                            "#344054",

                          fontFamily:
                            "monospace",

                          fontSize:
                            14,

                          fontWeight:
                            700,

                          letterSpacing:
                            0.5,

                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {
                          merchant.mid
                        }
                      </Typography>
                    </Box>

                    {/* TID */}

                    <Box component="td">
                      <Typography
                        sx={{
                          fontFamily:
                            "monospace",

                          fontSize:
                            14,

                          fontWeight:
                            700,

                          letterSpacing:
                            0.5,

                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {
                          merchant.tid
                        }
                      </Typography>
                    </Box>

                    {/* STATUS */}

                    <Box component="td">
                      <Chip
                        size="small"
                        label={
                          merchant.status
                        }
                        sx={{
                          color:
                            merchant.status ===
                            "Active"
                              ? "#027a48"
                              : "#b42318",

                          backgroundColor:
                            merchant.status ===
                            "Active"
                              ? "#ecfdf3"
                              : "#fef3f2",

                          fontWeight:
                            600,
                        }}
                      />
                    </Box>

                    {/* CREATED */}

                    <Box component="td">
                      <Typography
                        sx={{
                          color:
                            "#475467",

                          fontSize:
                            14,

                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {formatDate(
                          merchant.createdAt
                        )}
                      </Typography>
                    </Box>

                    {/* ACTIONS */}

                    <Box component="td">
                      <Box
                        sx={{
                          display:
                            "flex",

                          alignItems:
                            "center",

                          gap: 0.5,
                        }}
                      >
                        <IconButton
                          aria-label="Edit merchant"
                          onClick={() =>
                            openEditMerchant(
                              merchant
                            )
                          }
                          sx={{
                            color:
                              "#344054",

                            "&:hover":
                              {
                                color:
                                  "#f23a17",

                                backgroundColor:
                                  "#fff0eb",
                              },
                          }}
                        >
                          <EditOutlined
                            sx={{
                              fontSize:
                                20,
                            }}
                          />
                        </IconButton>

                        <IconButton
                          aria-label="Delete merchant"
                          onClick={() =>
                            openDeleteMerchant(
                              merchant
                            )
                          }
                          sx={{
                            color:
                              "#d92d20",

                            "&:hover":
                              {
                                backgroundColor:
                                  "#fef3f2",
                              },
                          }}
                        >
                          <DeleteOutlineOutlined
                            sx={{
                              fontSize:
                                20,
                            }}
                          />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                )
              )}
            </Box>
          </Box>
        )}
      </Paper>

      {/* CREATE / EDIT */}

      <MerchantDialog
        open={
          merchantDialogOpen
        }
        mode={
          dialogMode
        }
        merchant={
          selectedMerchant
        }
        existingMerchants={
          merchants
        }
        isSubmitting={
          isSubmitting
        }
        apiError={
          merchantDialogError
        }
        onClose={
          closeMerchantDialog
        }
        onSubmit={
          handleMerchantSubmit
        }
      />

      {/* DELETE */}

      <DeleteMerchantDialog
        open={
          deleteDialogOpen
        }
        merchant={
          selectedMerchant
        }
        isDeleting={
          isDeleting
        }
        apiError={
          deleteError
        }
        onClose={() => {
          if (
            !isDeleting
          ) {
            setDeleteDialogOpen(
              false
            );

            setSelectedMerchant(
              null
            );

            setDeleteError(
              ""
            );
          }
        }}
        onConfirm={
          handleDeleteMerchant
        }
      />
    </Box>
  );
};

export default MerchantsPage;