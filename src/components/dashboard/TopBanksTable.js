import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { useMemo } from "react";

import { useNavigate } from "react-router-dom";

const TopBanksTable = ({
  banks = [],
  cards = [],
  loading = false,
  error = "",
}) => {
  const navigate = useNavigate();

  /*
   * Make sure we always work
   * with arrays.
   */
  const safeBanks =
    Array.isArray(banks)
      ? banks
      : [];

  const safeCards =
    Array.isArray(cards)
      ? cards
      : [];

  /*
   * BUILD TOP BANKS
   *
   * We calculate:
   *
   * - Total Cards
   * - Credit Cards
   * - Debit Cards
   *
   * Then sort banks by Total Cards.
   */
  const topBanks = useMemo(() => {
    /*
     * First create a map using
     * the banks API.
     */
    const bankMap = {};

    safeBanks.forEach((bank) => {
      const bankId =
        bank.bank_id ??
        bank.bankId ??
        bank.id;

      const bankName =
        bank.bank_name ??
        bank.bankName ??
        bank.name ??
        "Unknown Bank";

      if (
        bankId === undefined ||
        bankId === null
      ) {
        return;
      }

      bankMap[bankId] = {
        id: bankId,

        name: bankName,

        totalCards: 0,

        creditCards: 0,

        debitCards: 0,
      };
    });

    /*
     * Now count cards for
     * each bank.
     */
    safeCards.forEach((card) => {
      const bankId =
        card.bankId ??
        card.bank_id;

      const bankName =
        card.bankName ??
        card.bank_name ??
        "Unknown Bank";

      /*
       * Sometimes a card can belong
       * to a bank that isn't currently
       * inside the bank list response.
       */
      if (!bankMap[bankId]) {
        bankMap[bankId] = {
          id: bankId,

          name: bankName,

          totalCards: 0,

          creditCards: 0,

          debitCards: 0,
        };
      }

      bankMap[bankId].totalCards += 1;

      const cardType =
        card.cardType
          ?.toUpperCase() || "";

      if (cardType === "CREDIT") {
        bankMap[bankId].creditCards += 1;
      }

      if (cardType === "DEBIT") {
        bankMap[bankId].debitCards += 1;
      }
    });

    /*
     * Convert object into array,
     * sort highest card count first,
     * then show top 5.
     */
    return Object.values(bankMap)
      .sort(
        (a, b) =>
          b.totalCards -
          a.totalCards
      )
      .slice(0, 5);
  }, [
    safeBanks,
    safeCards,
  ]);

  return (
    <Card
      elevation={0}
      sx={{
        mt: 2.5,

        border:
          "1px solid #eaecf0",

        borderRadius: 3,

        boxShadow:
          "0 4px 15px rgba(16,24,40,0.05)",
      }}
    >
      <CardContent
        sx={{
          p: 0,

          "&:last-child": {
            pb: 0,
          },
        }}
      >
        {/* HEADER */}

        <Box
          sx={{
            px: {
              xs: 2,
              sm: 3,
            },

            pt: 2.5,

            pb: 1,

            display: "flex",

            alignItems:
              "center",
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              Top Banks by Cards
            </Typography>

            <Typography
              sx={{
                mt: 0.3,

                color:
                  "#667085",

                fontSize: 13,
              }}
            >
              Banks with the highest
              number of registered cards.
            </Typography>
          </Box>

          <Button
            onClick={() =>
              navigate("/banks")
            }
            sx={{
              ml: "auto",

              color:
                "#f23a17",

              textTransform:
                "none",

              fontWeight: 600,
            }}
          >
            View All
          </Button>
        </Box>

        {/* ERROR */}

        {error && (
          <Box
            sx={{
              px: 3,

              py: 2,
            }}
          >
            <Alert
              severity="error"
              sx={{
                borderRadius: 2,
              }}
            >
              {error}
            </Alert>
          </Box>
        )}

        {/* LOADING */}

        {!error &&
          loading && (
            <Box
              sx={{
                px: 3,

                py: 2,
              }}
            >
              {Array.from({
                length: 5,
              }).map(
                (_, index) => (
                  <Skeleton
                    key={index}
                    height={55}
                    sx={{
                      mb: 0.5,
                    }}
                  />
                )
              )}
            </Box>
          )}

        {/* EMPTY */}

        {!error &&
          !loading &&
          topBanks.length ===
            0 && (
            <Box
              sx={{
                minHeight: 180,

                display: "grid",

                placeItems:
                  "center",

                px: 3,

                py: 4,

                textAlign:
                  "center",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color:
                      "#101828",

                    fontSize: 16,

                    fontWeight:
                      700,
                  }}
                >
                  No card data
                  available
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,

                    color:
                      "#667085",

                    fontSize: 13,
                  }}
                >
                  Banks will appear
                  here after cards are
                  registered.
                </Typography>
              </Box>
            </Box>
          )}

        {/* TABLE */}

        {!error &&
          !loading &&
          topBanks.length >
            0 && (
            <TableContainer>
              <Table
                sx={{
                  minWidth: 700,
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      #
                    </TableCell>

                    <TableCell>
                      Bank Name
                    </TableCell>

                    <TableCell align="center">
                      Total Cards
                    </TableCell>

                    <TableCell align="center">
                      Credit Cards
                    </TableCell>

                    <TableCell align="center">
                      Debit Cards
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {topBanks.map(
                    (
                      bank,
                      index
                    ) => (
                      <TableRow
                        key={
                          bank.id ??
                          `${bank.name}-${index}`
                        }
                        hover
                        sx={{
                          "&:last-child td":
                            {
                              borderBottom:
                                0,
                            },
                        }}
                      >
                        {/* INDEX */}

                        <TableCell>
                          {index +
                            1}
                        </TableCell>

                        {/* BANK */}

                        <TableCell>
                          <Box
                            sx={{
                              display:
                                "flex",

                              alignItems:
                                "center",

                              gap: 1.5,
                            }}
                          >
                            <Box
                              sx={{
                                width:
                                  34,

                                height:
                                  34,

                                flexShrink:
                                  0,

                                display:
                                  "grid",

                                placeItems:
                                  "center",

                                borderRadius:
                                  "50%",

                                color:
                                  "#f23a17",

                                fontWeight:
                                  800,

                                backgroundColor:
                                  "#fff0eb",
                              }}
                            >
                              {bank.name
                                ?.charAt(
                                  0
                                )
                                ?.toUpperCase() ||
                                "B"}
                            </Box>

                            <Typography
                              sx={{
                                fontWeight:
                                  600,

                                color:
                                  "#101828",
                              }}
                            >
                              {
                                bank.name
                              }
                            </Typography>
                          </Box>
                        </TableCell>

                        {/* TOTAL */}

                        <TableCell align="center">
                          <Typography
                            sx={{
                              fontWeight:
                                700,
                            }}
                          >
                            {
                              bank.totalCards
                            }
                          </Typography>
                        </TableCell>

                        {/* CREDIT */}

                        <TableCell
                          align="center"
                          sx={{
                            color:
                              "#039855",

                            fontWeight:
                              700,
                          }}
                        >
                          {
                            bank.creditCards
                          }
                        </TableCell>

                        {/* DEBIT */}

                        <TableCell
                          align="center"
                          sx={{
                            color:
                              "#f23a17",

                            fontWeight:
                              700,
                          }}
                        >
                          {
                            bank.debitCards
                          }
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
      </CardContent>
    </Card>
  );
};

export default TopBanksTable;