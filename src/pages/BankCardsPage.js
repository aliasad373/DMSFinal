import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AccountBalanceOutlined,
  ArrowBackOutlined,
  CreditCardOutlined,
  DeleteOutlineOutlined,
  EditOutlined,
  PercentOutlined,
  SearchOutlined,
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

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import CardDialog from "../components/cards/CardDialog";
import DeleteCardDialog from "../components/cards/DeleteCardDialog";

import {
  createCard,
  deleteCard,
  getCardsByBank,
  updateCard,
} from "../api/cardApi";

const BankCardsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { bankId } = useParams();

  /*
   * Bank is passed from Banks screen.
   */
  const bank = location.state?.bank;

  /*
   * CARD DATA
   */
  const [cards, setCards] = useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState("");

  /*
   * FILTERS
   */
  const [searchText, setSearchText] =
    useState("");

  const [typeFilter, setTypeFilter] =
    useState("All");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  /*
   * ADD / EDIT
   */
  const [cardDialogOpen, setCardDialogOpen] =
    useState(false);

  const [dialogMode, setDialogMode] =
    useState("add");

  const [selectedCard, setSelectedCard] =
    useState(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [dialogError, setDialogError] =
    useState("");

  /*
   * DELETE
   */
  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [deleteError, setDeleteError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  /*
   * LOAD CARDS
   */
  const loadCards = async () => {
    try {
      setIsLoading(true);
      setLoadError("");

      const response =
        await getCardsByBank(bankId);

        console.log("API bank card response: " + response.cards)

      setCards(response.cards || []);
    } catch (error) {
      setLoadError(
        error.message ||
          "Unable to load cards."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, [bankId]);

  /*
   * STATS
   */
  const debitCards = cards.filter(
    (card) => card.cardType === "DEBIT"
  ).length;

  const creditCards = cards.filter(
    (card) => card.cardType === "CREDIT"
  ).length;

  const averageDiscount =
    cards.length === 0
      ? 0
      : cards.reduce(
          (total, card) =>
            total +
            Number(card.discountPercentage || 0),
          0
        ) / cards.length;

  /*
   * FILTERED CARDS
   *
   * Search now includes:
   * - Card Type
   * - Scheme
   * - Category
   * - BIN
   */
  const filteredCards = useMemo(() => {
    const search =
      searchText.trim().toLowerCase();

    return cards.filter((card) => {
      const searchableValue = `
        ${card.cardType || ""}
        ${card.scheme || ""}
        ${card.cardCategory || ""}
        ${card.cardbin || ""}
      `.toLowerCase();

      const matchesSearch =
        !search ||
        searchableValue.includes(search);

      const matchesType =
        typeFilter === "All" ||
        card.type === typeFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        card.category ===
          categoryFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory
      );
    });
  }, [
    cards,
    searchText,
    typeFilter,
    categoryFilter,
  ]);

  /*
   * ADD CARD
   */
  const openAddCard = () => {
    setDialogMode("add");
    setSelectedCard(null);
    setDialogError("");
    setSuccessMessage("");
    setCardDialogOpen(true);
  };

  const formatCategory = (value) => {
  if (!value) return "";

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1).toLowerCase()
  );
};

  /*
   * EDIT CARD
   */
  const openEditCard = (card) => {
const mappedCard = {
    id: card.cardId ?? card.card_id,

    type: formatCategory(card.type ?? card.cardType),

    bin: card.bin ?? card.cardbin,

    category:
      formatCategory(card.category ?? card.cardCategory),

    discountPercentage:
      card.discountPercentage,

    capValue:
      card.capValue ??
      card.discountedAmount,

    // Keep other fields if needed
    scheme:
      card.scheme ?? card.cardName ?? "",
  };
    setDialogMode("edit");
    setSelectedCard(mappedCard);
    setDialogError("");
    setSuccessMessage("");
    setCardDialogOpen(true);
  };

  const closeCardDialog = () => {
    if (isSubmitting) {
      return;
    }

    setCardDialogOpen(false);
    setSelectedCard(null);
    setDialogError("");
  };

  /*
   * ADD / UPDATE CARD
   */
  const handleCardSubmit = async (
    formData
  ) => {
    try {
      setIsSubmitting(true);
      setDialogError("");

      if (dialogMode === "add") {
        const response =
          await createCard(
            bankId,
            formData
          );

       /* setCards((previous) => [
          response.data,
          ...previous,
        ]);*/

        await loadCards();

        setSuccessMessage(
          response.message
        );
      } else {
         const response = await updateCard(
    selectedCard.id,
    bankId,
    formData
  );

  console.log(
    "UPDATE CARD RESPONSE:",
    response
  );

  setSuccessMessage(
    response?.message ||
      "Card updated successfully."
  );

  // Reload cards from backend
  await loadCards();
      }

      setCardDialogOpen(false);
      setSelectedCard(null);

      return true;
    } catch (error) {
      setDialogError(
        error.message ||
          "Unable to save card."
      );

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
   * OPEN DELETE
   */
  const openDeleteCard = (card) => {
    setSelectedCard(card);
    setDeleteError("");
    setSuccessMessage("");
    setDeleteDialogOpen(true);
  };

  /*
   * DELETE CARD
   */
  const handleDeleteCard = async () => {
    if (!selectedCard) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError("");

      console.log(selectedCard)

      const response =
        await deleteCard(
          selectedCard.cardId
        );


      setSuccessMessage(
        response.message
      );

      setDeleteDialogOpen(false);
      setSelectedCard(null);
      await loadCards();
    } catch (error) {
      setDeleteError(
        error.message ||
          "Unable to delete card."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  /*
   * BANK LOGO
   */
  const BankLogo = () => {
    if (bank?.iconUrl) {
      return (
        <Box
          component="img"
          src={bank.iconUrl}
          alt={bank.name}
          sx={{
            width: 64,
            height: 64,
            p: 0.5,
            objectFit: "contain",
            borderRadius: 2,
            backgroundColor: "#ffffff",
          }}
        />
      );
    }

    return (
      <Box
        sx={{
          width: 64,
          height: 64,
          display: "grid",
          placeItems: "center",
          color: "#f23a17",
          borderRadius: 2.5,
          backgroundColor: "#fff0eb",
        }}
      >
        <AccountBalanceOutlined
          sx={{
            fontSize: 34,
          }}
        />
      </Box>
    );
  };

  /*
   * CATEGORY CHIP STYLE
   */
  const getCategoryStyle = (
    category
  ) => {
    switch (category) {
      case "Gold":
        return {
          color: "#b76e00",
          backgroundColor: "#fff5d9",
        };

      case "Platinum":
        return {
          color: "#6941c6",
          backgroundColor: "#f1eaff",
        };

      case "Silver":
        return {
          color: "#475467",
          backgroundColor: "#f2f4f7",
        };

      default:
        return {
          color: "#026aa2",
          backgroundColor: "#e0f2fe",
        };
    }
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
        p: 2.5,
        minWidth: 0,
        display: "flex",
        alignItems: "center",
        gap: 2,
        border: "1px solid #eaecf0",
        borderRadius: 3,
        boxShadow:
          "0 4px 14px rgba(16,24,40,0.05)",
      }}
    >
      <Box
        sx={{
          width: 66,
          height: 66,
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          borderRadius: "50%",
          color: iconColor,
          backgroundColor:
            iconBackground,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            color: "#475467",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 0.2,
            color: "#101828",
            fontSize: 28,
            fontWeight: 750,
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
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
      {/* HEADER */}

      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <IconButton
            onClick={() =>
              navigate("/banks")
            }
            sx={{
              width: 46,
              height: 46,
              flexShrink: 0,
              border:
                "1px solid #d0d5dd",
              color: "#344054",
              backgroundColor:
                "#ffffff",

              "&:hover": {
                color: "#f23a17",
                backgroundColor:
                  "#fff3ef",
              },
            }}
          >
            <ArrowBackOutlined />
          </IconButton>

          <BankLogo />

          <Box>
            <Typography
              sx={{
                color: "#101828",
                fontSize: {
                  xs: 24,
                  sm: 31,
                },
                fontWeight: 750,
                lineHeight: 1.2,
              }}
            >
              {bank?.name ||
                `Bank ${bankId}`}{" "}
              - Cards
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                color: "#667085",
                fontSize: 15,
              }}
            >
              Manage card types, BINs,
              categories and discount settings.
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          onClick={openAddCard}
          sx={{
            ml: {
              sm: "auto",
            },

            alignSelf: {
              xs: "stretch",
              sm: "center",
            },

            minHeight: 46,

            px: 2.5,

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
          + Add Card
        </Button>
      </Box>

      {/* SUCCESS MESSAGE */}

      {successMessage && (
        <Alert
          severity="success"
          onClose={() =>
            setSuccessMessage("")
          }
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          {successMessage}
        </Alert>
      )}

      {/* STATS */}

      <Box
        sx={{
          width: "100%",

          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",

            sm: "repeat(2, minmax(0,1fr))",

            lg: "repeat(4, minmax(0,1fr))",
          },

          gap: 2,
        }}
      >
        <StatCard
          title="Total Cards"
          value={cards.length}
          subtitle="All card types"
          icon={
            <CreditCardOutlined
              sx={{
                fontSize: 32,
              }}
            />
          }
          iconBackground="#fff0eb"
          iconColor="#f23a17"
        />

        <StatCard
          title="Debit Cards"
          value={debitCards}
          subtitle={`${
            cards.length
              ? Math.round(
                  (debitCards /
                    cards.length) *
                    100
                )
              : 0
          }% of total`}
          icon={
            <CreditCardOutlined
              sx={{
                fontSize: 32,
              }}
            />
          }
          iconBackground="#ecfdf3"
          iconColor="#039855"
        />

        <StatCard
          title="Credit Cards"
          value={creditCards}
          subtitle={`${
            cards.length
              ? Math.round(
                  (creditCards /
                    cards.length) *
                    100
                )
              : 0
          }% of total`}
          icon={
            <CreditCardOutlined
              sx={{
                fontSize: 32,
              }}
            />
          }
          iconBackground="#fff7e6"
          iconColor="#d68a00"
        />

        <StatCard
          title="Average Discount"
          value={`${averageDiscount.toFixed(
            2
          )}%`}
          subtitle="Across all cards"
          icon={
            <PercentOutlined
              sx={{
                fontSize: 33,
              }}
            />
          }
          iconBackground="#f4ebff"
          iconColor="#7f56d9"
        />
      </Box>

      {/* FILTERS */}

      <Paper
        elevation={0}
        sx={{
          mt: 2.5,
          p: 2,

          display: "flex",

          flexWrap: "wrap",

          gap: 1.5,

          alignItems: "center",

          border:
            "1px solid #eaecf0",

          borderRadius: 3,
        }}
      >
        <TextField
          value={searchText}
          onChange={(event) =>
            setSearchText(
              event.target.value
            )
          }
          placeholder="Search by type, scheme, category or BIN..."
          size="small"
          sx={{
            width: {
              xs: "100%",
              sm: 340,
            },

            "& .MuiOutlinedInput-root":
              {
                minHeight: 46,

                borderRadius: 2,

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
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(
              event.target.value
            )
          }
          sx={{
            width: {
              xs: "100%",
              sm: 190,
            },

            "& .MuiOutlinedInput-root":
              {
                minHeight: 46,

                borderRadius: 2,
              },
          }}
        >
          <MenuItem value="All">
            All Card Types
          </MenuItem>

          <MenuItem value="Debit">
            Debit
          </MenuItem>

          <MenuItem value="Credit">
            Credit
          </MenuItem>
        </TextField>

        <TextField
          select
          size="small"
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(
              event.target.value
            )
          }
          sx={{
            width: {
              xs: "100%",
              sm: 190,
            },

            "& .MuiOutlinedInput-root":
              {
                minHeight: 46,

                borderRadius: 2,
              },
          }}
        >
          <MenuItem value="All">
            All Categories
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
        </TextField>

        <Typography
          sx={{
            ml: {
              md: "auto",
            },

            color: "#667085",

            fontSize: 14,
          }}
        >
          {filteredCards.length} cards
        </Typography>
      </Paper>

      {/* TABLE */}

      <Paper
        elevation={0}
        sx={{
          mt: 1.5,

          width: "100%",

          overflowX: "auto",

          border:
            "1px solid #eaecf0",

          borderRadius: 3,
        }}
      >
        {isLoading ? (
          <Box sx={{ p: 3 }}>
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <Skeleton
                key={index}
                height={62}
                sx={{
                  mb: 1,
                }}
              />
            ))}
          </Box>
        ) : loadError ? (
          <Box
            sx={{
              minHeight: 250,

              display: "grid",

              placeItems: "center",

              p: 3,
            }}
          >
            <Box
              sx={{
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  color:
                    "#b42318",

                  fontWeight: 700,
                }}
              >
                {loadError}
              </Typography>

              <Button
                onClick={loadCards}
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
        ) : filteredCards.length ===
          0 ? (
          <Box
            sx={{
              minHeight: 260,

              display: "grid",

              placeItems: "center",

              textAlign: "center",
            }}
          >
            <Box>
              <CreditCardOutlined
                sx={{
                  fontSize: 50,

                  color:
                    "#f23a17",
                }}
              />

              <Typography
                sx={{
                  mt: 1,

                  fontWeight: 700,
                }}
              >
                No cards found
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,

                  color:
                    "#667085",
                }}
              >
                Change your filters or
                add a new card.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            component="table"
            sx={{
              width: "100%",

              minWidth: 980,

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

                fontWeight: 600,

                whiteSpace:
                  "nowrap",
              },

              "& td": {
                px: 2.5,

                py: 2,

                borderBottom:
                  "1px solid #eaecf0",

                color:
                  "#101828",

                fontSize: 14,

                verticalAlign:
                  "middle",
              },

              "& tbody tr:last-child td":
                {
                  borderBottom: 0,
                },

              "& tbody tr:hover":
                {
                  backgroundColor:
                    "#fcfcfd",
                },
            }}
          >
            {/* TABLE HEADER */}

            <Box component="thead">
              <Box component="tr">
                <Box component="th">
                  #
                </Box>

                <Box component="th">
                  Card Type
                </Box>

                <Box component="th">
                  BIN
                </Box>

                <Box component="th">
                  Scheme
                </Box>

                <Box component="th">
                  Category
                </Box>

                <Box component="th">
                  Discount (%)
                </Box>

                <Box component="th">
                  Cap Value (PKR)
                </Box>

                <Box component="th">
                  Actions
                </Box>
              </Box>
            </Box>

            {/* TABLE BODY */}

            <Box component="tbody">
              {filteredCards.map(
                (card, index) => {
                  const categoryStyle =
                    getCategoryStyle(
                      card.cardCategory
                    );

                  return (
                    <Box
                      component="tr"
                      key={card.id}
                    >
                      {/* INDEX */}

                      <Box component="td">
                        {index + 1}
                      </Box>

                      {/* CARD TYPE */}

                      <Box component="td">
                        <Box
                          sx={{
                            display:
                              "flex",

                            alignItems:
                              "center",

                            gap: 1.3,
                          }}
                        >
                          <Box
                            sx={{
                              width: 38,

                              height: 28,

                              display:
                                "grid",

                              placeItems:
                                "center",

                              borderRadius:
                                1,

                              color:
                                card.cardType ===
                                "DEBIT"
                                  ? "#039855"
                                  : "#f23a17",

                              backgroundColor:
                                card.cardType ===
                                "DEBIT"
                                  ? "#ecfdf3"
                                  : "#fff0eb",
                            }}
                          >
                            <CreditCardOutlined
                              sx={{
                                fontSize:
                                  21,
                              }}
                            />
                          </Box>

                          <Box>
                            <Typography
                              sx={{
                                fontSize:
                                  14,

                                fontWeight:
                                  700,
                              }}
                            >
                              {card.type}
                            </Typography>

                            <Typography
                              sx={{
                                color:
                                  "#667085",

                                fontSize:
                                  12,
                              }}
                            >
                              {card.cardType} Card
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* BIN */}

                      <Box component="td">
                        <Typography
                          sx={{
                            display:
                              "inline-block",

                            px: 1.2,

                            py: 0.5,

                            borderRadius:
                              1.5,

                            color:
                              "#344054",

                            backgroundColor:
                              "#f2f4f7",

                            fontFamily:
                              "monospace",

                            fontSize: 14,

                            fontWeight:
                              700,

                            letterSpacing:
                              0.8,

                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {card.cardbin || "-"}
                        </Typography>
                      </Box>

                      {/* SCHEME */}

                      <Box component="td">
                        <Typography
                          sx={{
                            color:
                              "#344054",

                            fontSize: 14,

                            fontWeight:
                              600,
                          }}
                        >
                          {card.cardName ||
                            "-"}
                        </Typography>
                      </Box>

                      {/* CATEGORY */}

                      <Box component="td">
                        <Chip
                          size="small"
                          label={
                            card.cardCategory
                          }
                          sx={{
                            color:
                              categoryStyle.color,

                            backgroundColor:
                              categoryStyle.backgroundColor,

                            fontWeight:
                              600,
                          }}
                        />
                      </Box>

                      {/* DISCOUNT */}

                      <Box
                        component="td"
                        sx={{
                          fontWeight:
                            "700 !important",
                        }}
                      >
                        {Number(
                          card.discountPercentage
                        ).toFixed(2)}
                        %
                      </Box>

                      {/* CAP VALUE */}

                      <Box component="td">
                        {Number(
                          card.discountedAmount
                        ).toLocaleString()}
                      </Box>

                      {/* ACTIONS */}

                      <Box component="td">
                        <Box
                          sx={{
                            display:
                              "flex",

                            gap: 0.5,
                          }}
                        >
                          <IconButton
                            aria-label="Edit card"
                            onClick={() =>
                              openEditCard(
                                card
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
                            aria-label="Delete card"
                            onClick={() =>
                              openDeleteCard(
                                card
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
                  );
                }
              )}
            </Box>
          </Box>
        )}
      </Paper>

      {/* ADD / EDIT CARD DIALOG */}

      <CardDialog
        open={cardDialogOpen}
        mode={dialogMode}
        card={selectedCard}
        isSubmitting={
          isSubmitting
        }
        apiError={dialogError}
        onClose={closeCardDialog}
        onSubmit={
          handleCardSubmit
        }
      />

      {/* DELETE CARD DIALOG */}

      <DeleteCardDialog
        open={deleteDialogOpen}
        card={selectedCard}
        isDeleting={isDeleting}
        apiError={deleteError}
        onClose={() => {
          if (!isDeleting) {
            setDeleteDialogOpen(
              false
            );

            setSelectedCard(null);

            setDeleteError("");
          }
        }}
        onConfirm={
          handleDeleteCard
        }
      />
    </Box>
  );
};

export default BankCardsPage;