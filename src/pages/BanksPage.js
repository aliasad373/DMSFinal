import { useEffect, useMemo, useState } from "react";

import { AccountBalanceOutlined, SearchOutlined } from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  InputAdornment,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import AddBankDialog from "../components/banks/AddBankDialog";
import BankGridCard from "../components/banks/BankGridCard";
import DeleteBankDialog from "../components/banks/DeleteBankDialog";

import { createBank, deleteBank, getBanks, updateBank } from "../api/bankApi";

const BanksPage = () => {
  const navigate = useNavigate();

  const [banks, setBanks] = useState([]);

  const [searchText, setSearchText] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  /*
   * ADD / EDIT
   */

  const [bankDialogOpen, setBankDialogOpen] = useState(false);

  const [dialogMode, setDialogMode] = useState("add");

  const [selectedBank, setSelectedBank] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [bankDialogError, setBankDialogError] = useState("");

  /*
   * DELETE
   */

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const [deleteError, setDeleteError] = useState("");

  /*
   * LOAD BANKS
   */

  const loadBanks = async () => {
    try {
      setIsLoading(true);

      setLoadError("");

      const response = await getBanks();
      //
      console.log("RAW BANK RESPONSE:", response);

      const rawBanks = Array.isArray(response.banks)
        ? response.banks
        : Array.isArray(response?.banks)
          ? response.banks
          : [];

      const mappedBanks = rawBanks.map((bank) => ({
        id: bank.bank_id,
        name: bank.bank_name,

        iconUrl: bank.logo
          ? bank.logo.startsWith("http")
            ? bank.logo
            : `http://localhost:5000${bank.logo}`
          : null,

        createdAt: bank.created_at,
        updatedAt: bank.updated_at,
      }));

      // const mappedBanks = rawBanks.map((bank) => ({
      //   id: bank.bank_id,
      //   name: bank.bank_name,
      //   iconUrl: bank.logo,
      //   createdAt: bank.created_at,
      //   updatedAt: bank.updated_at,
      // }));

      console.log("MAPPED BANKS:", mappedBanks);

      setBanks(mappedBanks);
      //
    } catch (error) {
      setLoadError(error.message || "Unable to fetch banks.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBanks();
  }, []);

  /*
   * SEARCH
   */

  const filteredBanks = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    if (!search) {
      return banks;
    }

    return banks.filter((bank) => bank.name.toLowerCase().includes(search));
  }, [banks, searchText]);

  /*
   * ADD
   */

  const handleOpenAdd = () => {
    setDialogMode("add");

    setSelectedBank(null);

    setBankDialogError("");

    setSuccessMessage("");

    setBankDialogOpen(true);
  };

  /*
   * EDIT
   */

  const handleOpenEdit = (bank) => {
    setDialogMode("edit");

    setSelectedBank(bank);

    setBankDialogError("");

    setSuccessMessage("");

    setBankDialogOpen(true);
  };

  /*
   * CLOSE ADD/EDIT
   */

  const handleCloseBankDialog = () => {
    if (isSubmitting) {
      return;
    }

    setBankDialogOpen(false);

    setSelectedBank(null);

    setBankDialogError("");
  };

  /*
   * SUBMIT ADD/EDIT
   */

  const handleBankSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setBankDialogError("");

      if (dialogMode === "add") {
        const response = await createBank({
          name: formData.name,
        });

        console.log("REGISTER BANK RESPONSE:", response);

        setSuccessMessage(response?.message || "Bank registered successfully.");

        // IMPORTANT:
        // Do not manually add response.data to banks.
        // Fetch the latest list from backend instead.
        await loadBanks();
      } else {
        const response = await updateBank(selectedBank.id, {
          name: formData.name,
        });

        console.log("UPDATE BANK RESPONSE:", response);

        setSuccessMessage(response?.message || "Bank updated successfully.");

        await loadBanks();

        setSuccessMessage(response?.message || "Bank updated successfully.");
      }

      setBankDialogOpen(false);
      setSelectedBank(null);

      return true;
    } catch (error) {
      console.error("BANK SAVE ERROR:", error);

      setBankDialogError(
        error.response?.data?.message ||
          error.message ||
          "Unable to save bank.",
      );

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
   * OPEN DELETE
   */

  const handleOpenDelete = (bank) => {
    setSelectedBank(bank);

    setDeleteError("");

    setSuccessMessage("");

    setDeleteDialogOpen(true);
  };

  /*
   * CLOSE DELETE
   */

  const handleCloseDelete = () => {
    if (isDeleting) {
      return;
    }

    setDeleteDialogOpen(false);

    setSelectedBank(null);

    setDeleteError("");
  };

  /*
   * DELETE
   */

  const handleConfirmDelete = async () => {
    if (!selectedBank) {
      return;
    }

    try {
      setIsDeleting(true);

      setDeleteError("");

      const response = await deleteBank(selectedBank.id);

      loadBanks();

      setSuccessMessage(response.message);

      setDeleteDialogOpen(false);

      setSelectedBank(null);
    } catch (error) {
      setDeleteError(error.message || "Unable to delete bank.");
    } finally {
      setIsDeleting(false);
    }
  };

  /*
   * BANK CLICK
   */

  const handleBankClick = (bank) => {
    navigate(`/banks/${bank.id}/cards`, {
      state: {
        bank,
      },
    });
  };

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
              color: "#101828",

              fontSize: {
                xs: 27,
                sm: 32,
              },

              fontWeight: 750,

              lineHeight: 1.2,
            }}
          >
            Banks
          </Typography>

          <Typography
            sx={{
              mt: 0.5,

              color: "#667085",

              fontSize: 15,
            }}
          >
            Manage and view all registered banks.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={handleOpenAdd}
          sx={{
            minWidth: 125,
            minHeight: 46,

            ml: {
              sm: "auto",
            },

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
          Add Bank
        </Button>
      </Box>

      {/* SUCCESS */}

      {successMessage && (
        <Alert
          severity="success"
          onClose={() => setSuccessMessage("")}
          sx={{
            mb: 2.5,

            borderRadius: 2,
          }}
        >
          {successMessage}
        </Alert>
      )}

      {/* SEARCH */}

      <Box
        sx={{
          mb: 2.5,

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
        <TextField
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search banks by name..."
          size="small"
          sx={{
            width: {
              xs: "100%",
              sm: 380,
            },

            "& .MuiOutlinedInput-root": {
              minHeight: 48,

              borderRadius: 2,

              backgroundColor: "#ffffff",

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

        <Typography
          sx={{
            ml: {
              sm: "auto",
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
            {filteredBanks.length}
          </Box>{" "}
          of {banks.length} banks
        </Typography>
      </Box>

      {/* LOADING */}

      {isLoading && (
        <Box
          sx={{
            width: "100%",

            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",

              sm: "repeat(2, minmax(0, 1fr))",

              lg: "repeat(3, minmax(0, 1fr))",

              xl: "repeat(4, minmax(0, 1fr))",
            },

            gap: 2,
          }}
        >
          {Array.from({
            length: 12,
          }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              height={132}
              sx={{
                borderRadius: 3,
              }}
            />
          ))}
        </Box>
      )}

      {/* LOAD ERROR */}

      {!isLoading && loadError && (
        <Box
          sx={{
            minHeight: 300,

            display: "grid",

            placeItems: "center",

            p: 3,

            border: "1px solid #fecdca",

            borderRadius: 3,

            backgroundColor: "#ffffff",

            textAlign: "center",
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#b42318",

                fontSize: 17,

                fontWeight: 700,
              }}
            >
              Unable to load banks
            </Typography>

            <Typography
              sx={{
                mt: 1,

                color: "#667085",
              }}
            >
              {loadError}
            </Typography>

            <Button
              variant="contained"
              onClick={loadBanks}
              sx={{
                mt: 2,

                backgroundColor: "#f23a17",

                textTransform: "none",

                boxShadow: "none",
              }}
            >
              Try Again
            </Button>
          </Box>
        </Box>
      )}

      {/* GRID */}

      {!isLoading && !loadError && filteredBanks.length > 0 && (
        <Box
          sx={{
            width: "100%",

            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",

              sm: "repeat(2, minmax(0, 1fr))",

              lg: "repeat(3, minmax(0, 1fr))",

              xl: "repeat(4, minmax(0, 1fr))",
            },

            gap: 2,
          }}
        >
          {filteredBanks.map((bank) => (
            <BankGridCard
              key={bank.id}
              bank={bank}
              onClick={handleBankClick}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          ))}
        </Box>
      )}

      {/* EMPTY SEARCH */}

      {!isLoading && !loadError && filteredBanks.length === 0 && (
        <Box
          sx={{
            minHeight: 340,

            display: "grid",

            placeItems: "center",

            p: 3,

            border: "1px dashed #d0d5dd",

            borderRadius: 3,

            backgroundColor: "#ffffff",

            textAlign: "center",
          }}
        >
          <Box>
            <AccountBalanceOutlined
              sx={{
                color: "#f23a17",

                fontSize: 48,
              }}
            />

            <Typography
              sx={{
                mt: 1.5,

                fontSize: 18,

                fontWeight: 700,
              }}
            >
              No banks found
            </Typography>

            <Typography
              sx={{
                mt: 0.5,

                color: "#667085",
              }}
            >
              No bank matches your search.
            </Typography>

            <Button
              onClick={() => setSearchText("")}
              sx={{
                mt: 1,

                color: "#f23a17",

                textTransform: "none",
              }}
            >
              Clear Search
            </Button>
          </Box>
        </Box>
      )}

      {/* ADD / EDIT */}

      <AddBankDialog
        open={bankDialogOpen}
        mode={dialogMode}
        bank={selectedBank}
        existingBanks={banks}
        isSubmitting={isSubmitting}
        apiError={bankDialogError}
        onClose={handleCloseBankDialog}
        onSubmit={handleBankSubmit}
      />

      {/* DELETE */}

      <DeleteBankDialog
        open={deleteDialogOpen}
        bank={selectedBank}
        isDeleting={isDeleting}
        apiError={deleteError}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default BanksPage;
