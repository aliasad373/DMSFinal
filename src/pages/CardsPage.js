import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { mapCardFromApi } from "../utils/cardMapper";

import {
  Co2Sharp,
  CreditCardOutlined,
  DeleteOutlineOutlined,
  EditOutlined,
  PercentOutlined,
  SearchOutlined,
  SosRounded,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";

import CardDialog from "../components/cards/CardDialog";
import DeleteCardDialog from "../components/cards/DeleteCardDialog";

import {
  deleteAllCard,
  getAllCards,
  updateAllCard,
} from "../api/allCardsApi";

import {
  getCardSchemeIcon,
} from "../utils/cardSchemeIcons";

const CardsPage = () => {
  /*
   * DATA
   */
  const [cards, setCards] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState("");

  /*
   * SEARCH / FILTERS
   */
  const [searchText, setSearchText] =
    useState("");

  const [bankFilter, setBankFilter] =
    useState("All");

  const [typeFilter, setTypeFilter] =
    useState("All");

  const [schemeFilter, setSchemeFilter] =
    useState("All");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("All");

  /*
   * EDIT
   */
  const [
    selectedCard,
    setSelectedCard,
  ] = useState(null);

  const [
    editDialogOpen,
    setEditDialogOpen,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    editError,
    setEditError,
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
   * LOAD CARDS
   */
  const loadCards = async () => {
    try {
      setIsLoading(true);

      setLoadError("");

      const response =
        await getAllCards();

        console.log(response)

      const rawCards = Array.isArray(response.cards)
  ? response.cards
  : response?.cards || [];

const mappedCards = rawCards
  .map(mapCardFromApi)
  .filter(Boolean);

setCards(mappedCards);

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
  }, []);

  /*
   * STATS
   */
  const debitCards =
    cards.filter(
      (card) =>
        card.type === "Debit"
    ).length;

  const creditCards =
    cards.filter(
      (card) =>
        card.type === "Credit"
    ).length;

  const averageDiscount =
    cards.length === 0
      ? 0
      : cards.reduce(
          (
            total,
            card
          ) =>
            total +
            Number(
              card.discountPercentage ||
                0
            ),
          0
        ) / cards.length;

  /*
   * UNIQUE BANK LIST
   */
  const banks = useMemo(() => {
    return [
      ...new Set(
        cards.map(
          (card) =>
            card.bankName
        )
      ),
    ].sort();
  }, [cards]);

  /*
   * UNIQUE CATEGORIES
   *
   * This also supports custom
   * categories such as Classic,
   * Signature, Infinite, etc.
   */
  const categories =
    useMemo(() => {
      return [
        ...new Set(
          cards.map(
            (card) =>
              card.category
          )
        ),
      ].sort();
    }, [cards]);

  /*
   * SEARCH / FILTER
   */
  const filteredCards =
    useMemo(() => {
      const search =
        searchText
          .trim()
          .toLowerCase();

      return cards.filter(
        (card) => {
          const searchable =
            `
              ${card.bankName || ""}
              ${card.type || ""}
              ${card.bin || ""}
              ${card.scheme || ""}
              ${card.category || ""}
            `.toLowerCase();

          const matchesSearch =
            !search ||
            searchable.includes(
              search
            );

          const matchesBank =
            bankFilter === "All" ||
            card.bankName ===
              bankFilter;

          const matchesType =
            typeFilter === "All" ||
            card.type ===
              typeFilter;

          const matchesScheme =
            schemeFilter ===
              "All" ||
            card.scheme ===
              schemeFilter;

          const matchesCategory =
            categoryFilter ===
              "All" ||
            card.category ===
              categoryFilter;

          return (
            matchesSearch &&
            matchesBank &&
            matchesType &&
            matchesScheme &&
            matchesCategory
          );
        }
      );
    }, [
      cards,
      searchText,
      bankFilter,
      typeFilter,
      schemeFilter,
      categoryFilter,
    ]);

  /*
   * EDIT
   */
  const openEditCard = (
    card
  ) => {
    console.log(card)
    setSelectedCard(card);

    setEditError("");

    setSuccessMessage("");

    setEditDialogOpen(true);
  };

  const closeEditDialog =
    () => {
      if (isSubmitting) {
        return;
      }

      setEditDialogOpen(
        false
      );

      setSelectedCard(null);

      setEditError("");
    };

  const handleUpdateCard =
    async (formData) => {
      if (!selectedCard) {
        return false;
      }

      try {
        setIsSubmitting(
          true
        );

        setEditError("");

        console.log(selectedCard)

        const response = await updateAllCard(
           selectedCard.id,
           selectedCard.bankId,
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


        setSuccessMessage(
          response.message
        );

        setEditDialogOpen(
          false
        );
        //loadCards();
        setSelectedCard(null);

        return true;
      } catch (error) {
        setEditError(
          error.message ||
            "Unable to update card."
        );

        return false;
      } finally {
        setIsSubmitting(
          false
        );
      }
    };

  /*
   * DELETE
   */
  const openDeleteCard = (
    card
  ) => {
    setSelectedCard(card);

    setDeleteError("");

    setSuccessMessage("");

    setDeleteDialogOpen(
      true
    );
  };

  const handleDeleteCard =
    async () => {
      if (!selectedCard) {
        return;
      }

      try {
        setIsDeleting(true);

        setDeleteError("");

        const response =
          await deleteAllCard(
            selectedCard.id
          );

        setCards(
          (
            previousCards
          ) =>
            previousCards.filter(
              (card) =>
                card.id !==
                selectedCard.id
            )
        );

        setSuccessMessage(
          response.message
        );

        setDeleteDialogOpen(
          false
        );

        setSelectedCard(null);
      } catch (error) {
        setDeleteError(
          error.message ||
            "Unable to delete card."
        );
      } finally {
        setIsDeleting(
          false
        );
      }
    };

  /*
   * CATEGORY CHIP
   */
  const getCategoryStyle = (
    category
  ) => {
    switch (category) {
      case "Gold":
        return {
          color: "#b76e00",

          backgroundColor:
            "#fff5d9",
        };

      case "Platinum":
        return {
          color: "#6941c6",

          backgroundColor:
            "#f1eaff",
        };

      case "Silver":
        return {
          color: "#475467",

          backgroundColor:
            "#f2f4f7",
        };

      default:
        return {
          color: "#026aa2",

          backgroundColor:
            "#e0f2fe",
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
  }) => {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2.5,

          minWidth: 0,

          display: "flex",

          alignItems: "center",

          gap: 2,

          border:
            "1px solid #eaecf0",

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

        <Box
          sx={{
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              color:
                "#475467",

              fontSize: 13,

              fontWeight:
                600,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              mt: 0.2,

              color:
                "#101828",

              fontSize: 28,

              fontWeight:
                750,

              lineHeight: 1.2,
            }}
          >
            {value}
          </Typography>

          <Typography
            sx={{
              mt: 0.5,

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
  };

  return (
    <Box
      sx={{
        width: "100%",

        minWidth: 0,
      }}
    >
      {/* PAGE HEADING */}

      <Box
        sx={{
          mb: 3,
        }}
      >
        <Typography
          sx={{
            color: "#101828",

            fontSize: {
              xs: 27,
              sm: 32,
            },

            fontWeight: 750,
          }}
        >
          Cards
        </Typography>

        <Typography
          sx={{
            mt: 0.5,

            color: "#667085",

            fontSize: 15,
          }}
        >
          View and manage all cards
          across all banks.
        </Typography>
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

      {/* STATS */}

      <Box
        sx={{
          width: "100%",

          display: "grid",

          gridTemplateColumns:
            {
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
          subtitle="All bank cards"
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
              ? (
                  (debitCards /
                    cards.length) *
                  100
                ).toFixed(2)
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
              ? (
                  (creditCards /
                    cards.length) *
                  100
                ).toFixed(2)
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

          gap: 1.2,

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
          placeholder="Search by bank, BIN, scheme, category..."
          size="small"
          sx={{
            width: {
              xs: "100%",

              lg: 320,
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

        {/* BANK */}

        <TextField
          select
          size="small"
          value={bankFilter}
          onChange={(event) =>
            setBankFilter(
              event.target.value
            )
          }
          sx={{
            width: {
              xs: "100%",
              sm: 170,
            },
          }}
        >
          <MenuItem value="All">
            All Banks
          </MenuItem>

          {banks.map(
            (bankName) => (
              <MenuItem
                key={bankName}
                value={bankName}
              >
                {bankName}
              </MenuItem>
            )
          )}
        </TextField>

        {/* TYPE */}

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
              sm: 160,
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

        {/* SCHEME */}

        <TextField
          select
          size="small"
          value={schemeFilter}
          onChange={(event) =>
            setSchemeFilter(
              event.target.value
            )
          }
          sx={{
            width: {
              xs: "100%",
              sm: 150,
            },
          }}
        >
          <MenuItem value="All">
            All Schemes
          </MenuItem>

          <MenuItem value="Visa">
            Visa
          </MenuItem>

          <MenuItem value="Mastercard">
            Mastercard
          </MenuItem>

          <MenuItem value="PayPak">
            PayPak
          </MenuItem>

          <MenuItem value="UnionPay">
            UnionPay
          </MenuItem>
        </TextField>

        {/* CATEGORY */}

        <TextField
          select
          size="small"
          value={
            categoryFilter
          }
          onChange={(event) =>
            setCategoryFilter(
              event.target.value
            )
          }
          sx={{
            width: {
              xs: "100%",
              sm: 170,
            },
          }}
        >
          <MenuItem value="All">
            All Categories
          </MenuItem>

          {categories.map(
            (category) => (
              <MenuItem
                key={category}
                value={category}
              >
                {category}
              </MenuItem>
            )
          )}
        </TextField>

        <Typography
          sx={{
            ml: {
              xl: "auto",
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
              length: 8,
            }).map(
              (_, index) => (
                <Skeleton
                  key={index}
                  height={62}
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
              p: 4,

              textAlign:
                "center",
            }}
          >
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
          </Box>
        ) : (
          <Box
            component="table"
            sx={{
              width: "100%",

              minWidth: 1100,

              borderCollapse:
                "collapse",

              "& th": {
                px: 2,

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
                px: 2,

                py: 2,

                borderBottom:
                  "1px solid #eaecf0",

                color:
                  "#101828",

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
                  Bank
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

            <Box component="tbody">
              {filteredCards.map(
                (
                  card,
                  index
                ) => {
                  const schemeIcon =
                    getCardSchemeIcon(
                      card.scheme
                    );

                  const categoryStyle =
                    getCategoryStyle(
                      card.category
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

                      {/* BANK - NO ICON */}

                      <Box component="td">
                        <Typography
                          sx={{
                            fontWeight:
                              700,

                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {
                            card.bankName
                          }
                        </Typography>
                      </Box>

                      {/* TYPE */}

                      <Box component="td">
                        <Chip
                          size="small"
                          label={
                            card.type
                          }
                          sx={{
                            color:
                              card.type ===
                              "Debit"
                                ? "#027a48"
                                : "#d92d20",

                            backgroundColor:
                              card.type ===
                              "Debit"
                                ? "#ecfdf3"
                                : "#fef3f2",

                            fontWeight:
                              600,
                          }}
                        />
                      </Box>

                      {/* BIN */}

                      <Box component="td">
                        <Typography
                          sx={{
                            fontFamily:
                              "monospace",

                            fontWeight:
                              700,

                            letterSpacing:
                              0.5,
                          }}
                        >
                          {card.bin ||
                            "-"}
                        </Typography>
                      </Box>

                      {/* SCHEME ICON */}

                      <Box component="td">
                        <Box
                          sx={{
                            minWidth:
                              100,

                            display:
                              "flex",

                            alignItems:
                              "center",

                            gap: 1,
                          }}
                        >
                          {schemeIcon ? (
                            <Box
                              component="img"
                              src={
                                schemeIcon
                              }
                              alt={
                                card.scheme
                              }
                              sx={{
                                width:
                                  48,

                                height:
                                  28,

                                objectFit:
                                  "contain",
                              }}
                            />
                          ) : null}

                          {!schemeIcon && (
                            <Typography
                              sx={{
                                fontWeight:
                                  600,
                              }}
                            >
                              {
                                card.scheme
                              }
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      {/* CATEGORY */}

                      <Box component="td">
                        <Chip
                          size="small"
                          label={
                            card.category
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
                        ).toFixed(
                          2
                        )}
                        %
                      </Box>

                      {/* CAP */}

                      <Box component="td">
                        {Number(
                          card.capValue
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

      {/* EDIT */}

      <CardDialog
        open={editDialogOpen}
        mode="edit"
        card={selectedCard}
        isSubmitting={
          isSubmitting
        }
        apiError={editError}
        onClose={
          closeEditDialog
        }
        onSubmit={
          handleUpdateCard
        }
      />

      {/* DELETE */}

      <DeleteCardDialog
        open={
          deleteDialogOpen
        }
        card={selectedCard}
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

            setSelectedCard(
              null
            );

            setDeleteError(
              ""
            );
          }
        }}
        onConfirm={
          handleDeleteCard
        }
      />
    </Box>
  );
};

export default CardsPage;