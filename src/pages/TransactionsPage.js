import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  DownloadOutlined,
  LocalOfferOutlined,
  PaymentsOutlined,
  PercentOutlined,
  ReceiptLongOutlined,
} from "@mui/icons-material";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  getDiscountedTransactions,
} from "../api/transactionApi";

const getToday = () => {
  return new Date()
    .toISOString()
    .split("T")[0];
};

const TransactionsPage = () => {
  /*
   * DATE FILTER
   */
  const [fromDate, setFromDate] =
    useState(getToday());

  const [toDate, setToDate] =
    useState(getToday());

  /*
   * DATA
   */
  const [
    transactions,
    setTransactions,
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
   * LOAD TRANSACTIONS
   */
  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      setLoadError("");

      const response =
        await getDiscountedTransactions(
          fromDate,
          toDate
        );

      console.log(
        "TRANSACTION RESPONSE:",
        response
      );

      const rawTransactions =
        Array.isArray(response)
          ? response
          : Array.isArray(
              response?.data
            )
            ? response.data
            : [];

      setTransactions(
        rawTransactions
      );
    } catch (error) {
      console.error(
        "TRANSACTION API ERROR:",
        error
      );

      setLoadError(
        error.response?.data
          ?.message ||
          error.message ||
          "Unable to load transactions."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * DEFAULT:
   * FETCH TODAY'S DATA
   */
  useEffect(() => {
    loadTransactions();
  }, []);

  /*
   * APPLY DATE FILTER
   */
  const handleApplyFilter = () => {
    if (!fromDate || !toDate) {
      setLoadError(
        "Please select both dates."
      );

      return;
    }

    if (
      new Date(fromDate) >
      new Date(toDate)
    ) {
      setLoadError(
        "From date cannot be greater than To date."
      );

      return;
    }

    loadTransactions();
  };

  /*
   * RESET TO TODAY
   */
  const handleReset = () => {
    const today = getToday();

    setFromDate(today);
    setToDate(today);

    setTimeout(() => {
      loadTransactions();
    }, 0);
  };

  /*
   * ==========================
   * STATS
   * ==========================
   */

  const totalTransactions =
    transactions.length;

  const totalAmount =
    transactions.reduce(
      (total, transaction) =>
        total +
        Number(
          transaction.Amount || 0
        ),
      0
    );

  const totalDiscountedAmount =
    transactions.reduce(
      (total, transaction) =>
        total +
        Number(
          transaction
            .discountedAmount ||
            0
        ),
      0
    );

  const averageDiscount =
    totalTransactions > 0
      ? transactions.reduce(
          (total, transaction) =>
            total +
            Number(
              transaction
                .discountedPercentage ||
                0
            ),
          0
        ) / totalTransactions
      : 0;

  /*
   * ==========================
   * CHART DATA
   * ==========================
   */

  const chartData =
    useMemo(() => {
      const grouped = {};

      transactions.forEach(
        (transaction) => {
          const date =
            transaction
              .TransactionDate ||
            "Unknown";

          if (!grouped[date]) {
            grouped[date] = {
              date,
              transactions: 0,
              amount: 0,
              discountedAmount: 0,
            };
          }

          grouped[
            date
          ].transactions += 1;

          grouped[date].amount +=
            Number(
              transaction.Amount ||
                0
            );

          grouped[
            date
          ].discountedAmount +=
            Number(
              transaction
                .discountedAmount ||
                0
            );
        }
      );

      return Object.values(
        grouped
      ).sort(
        (a, b) =>
          new Date(a.date) -
          new Date(b.date)
      );
    }, [transactions]);

  /*
   * ==========================
   * MASK CARD NUMBER
   * ==========================
   */

  const maskCardNumber = (
    cardNumber
  ) => {
    if (!cardNumber) {
      return "-";
    }

    if (
      cardNumber.length <= 8
    ) {
      return cardNumber;
    }

    return `${cardNumber.slice(
      0,
      6
    )}******${cardNumber.slice(
      -4
    )}`;
  };

  /*
   * ==========================
   * EXCEL EXPORT
   * ==========================
   */

  const exportToExcel = () => {
    if (
      transactions.length === 0
    ) {
      return;
    }

    const excelData =
      transactions.map(
        (transaction) => ({
          "Card Number":
            transaction.CardNumber,

          Amount:
            transaction.Amount,

          RRN:
            transaction.RRN,

          STAN:
            transaction.STAN,

          "Auth Code":
            transaction.AuthNumber,

          "Discount %":
            transaction
              .discountedPercentage,

          "Discounted Amount":
            transaction
              .discountedAmount,

          MID:
            transaction.MerchantID,

          TID:
            transaction.TerminalID,

          Date:
            transaction
              .TransactionDate,

          Time:
            transaction
              .TransactionTime,

          "Card Scheme":
            transaction.CardScheme,

          "Transaction Type":
            transaction
              .TransactionType,

          "Response Code":
            transaction
              .ResponseCode,
        })
      );

    const worksheet =
      XLSX.utils.json_to_sheet(
        excelData
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Transactions"
    );

    const excelBuffer =
      XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

    const file = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    saveAs(
      file,
      `discounted_transactions_${fromDate}_${toDate}.xlsx`
    );
  };

  /*
   * STAT CARD
   */
  const StatCard = ({
    title,
    value,
    icon,
    subtitle,
  }) => (
    <Card
      elevation={0}
      sx={{
        border:
          "1px solid #eaecf0",

        borderRadius: 3,

        boxShadow:
          "0 4px 14px rgba(16,24,40,0.05)",
      }}
    >
      <CardContent
        sx={{
          p: 2.5,

          "&:last-child": {
            pb: 2.5,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 58,

              height: 58,

              flexShrink: 0,

              display: "grid",

              placeItems:
                "center",

              borderRadius:
                "50%",

              color:
                "#f23a17",

              backgroundColor:
                "#fff0eb",

              "& svg": {
                fontSize: 29,
              },
            }}
          >
            {icon}
          </Box>

          <Box>
            <Typography
              sx={{
                color:
                  "#667085",

                fontSize: 13,

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

                fontSize: 25,

                fontWeight: 750,
              }}
            >
              {value}
            </Typography>

            <Typography
              sx={{
                mt: 0.4,

                color:
                  "#98a2b3",

                fontSize: 12,
              }}
            >
              {subtitle}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
      }}
    >
      {/* ======================= */}
      {/* HEADER */}
      {/* ======================= */}

      <Box
        sx={{
          mb: 3,

          display: "flex",

          alignItems: {
            xs: "stretch",
            sm: "center",
          },

          flexDirection: {
            xs: "column",
            sm: "row",
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

              fontWeight: 750,
            }}
          >
            Transactions
          </Typography>

          <Typography
            sx={{
              mt: 0.5,

              color:
                "#667085",

              fontSize: 15,
            }}
          >
            View discounted
            transactions and settlement
            activity.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={
            <DownloadOutlined />
          }
          onClick={
            exportToExcel
          }
          disabled={
            transactions.length ===
            0
          }
          sx={{
            ml: {
              sm: "auto",
            },

            minHeight: 44,

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

              boxShadow: "none",
            },
          }}
        >
          Export to Excel
        </Button>
      </Box>

      {/* ======================= */}
      {/* DATE FILTER */}
      {/* ======================= */}

      <Paper
        elevation={0}
        sx={{
          p: 2.5,

          mb: 2.5,

          display: "flex",

          flexWrap: "wrap",

          alignItems: "flex-end",

          gap: 2,

          border:
            "1px solid #eaecf0",

          borderRadius: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              mb: 0.8,

              color:
                "#344054",

              fontSize: 13,

              fontWeight: 650,
            }}
          >
            From Date
          </Typography>

          <TextField
            type="date"
            value={fromDate}
            onChange={(event) =>
              setFromDate(
                event.target.value
              )
            }
            size="small"
          />
        </Box>

        <Box>
          <Typography
            sx={{
              mb: 0.8,

              color:
                "#344054",

              fontSize: 13,

              fontWeight: 650,
            }}
          >
            To Date
          </Typography>

          <TextField
            type="date"
            value={toDate}
            onChange={(event) =>
              setToDate(
                event.target.value
              )
            }
            size="small"
          />
        </Box>

        <Button
          variant="contained"
          onClick={
            handleApplyFilter
          }
          sx={{
            minHeight: 40,

            backgroundColor:
              "#f23a17",

            textTransform:
              "none",

            boxShadow: "none",
          }}
        >
          Apply Filter
        </Button>

        <Button
          variant="outlined"
          onClick={handleReset}
          sx={{
            minHeight: 40,

            color:
              "#475467",

            borderColor:
              "#d0d5dd",

            textTransform:
              "none",
          }}
        >
          Reset
        </Button>
      </Paper>

      {/* ERROR */}

      {loadError && (
        <Alert
          severity="error"
          sx={{
            mb: 2.5,
          }}
        >
          {loadError}
        </Alert>
      )}

      {/* ======================= */}
      {/* STATS */}
      {/* ======================= */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",

            sm:
              "repeat(2, minmax(0, 1fr))",

            xl:
              "repeat(4, minmax(0, 1fr))",
          },

          gap: 2,
        }}
      >
        <StatCard
          title="Total Transactions"
          value={
            totalTransactions
          }
          subtitle="Loaded transactions"
          icon={
            <ReceiptLongOutlined />
          }
        />

        <StatCard
          title="Total Amount"
          value={`PKR ${totalAmount.toFixed(
            2
          )}`}
          subtitle="Transaction amount"
          icon={
            <PaymentsOutlined />
          }
        />

        <StatCard
          title="Discounted Amount"
          value={`PKR ${totalDiscountedAmount.toFixed(
            2
          )}`}
          subtitle="Total discount value"
          icon={
            <LocalOfferOutlined />
          }
        />

        <StatCard
          title="Average Discount"
          value={`${averageDiscount.toFixed(
            2
          )}%`}
          subtitle="Average discount rate"
          icon={
            <PercentOutlined />
          }
        />
      </Box>

      {/* ======================= */}
      {/* CHARTS */}
      {/* ======================= */}

      <Box
        sx={{
          mt: 2.5,

          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            lg:
              "repeat(2, minmax(0, 1fr))",
          },

          gap: 2,
        }}
      >
        {/* TRANSACTION COUNT */}

        <Card
          elevation={0}
          sx={{
            border:
              "1px solid #eaecf0",

            borderRadius: 3,
          }}
        >
          <CardContent>
            <Typography
              sx={{
                mb: 2,

                fontSize: 18,

                fontWeight: 700,
              }}
            >
              Transactions Over Time
            </Typography>

            <Box
              sx={{
                width: "100%",
                height: 280,
              }}
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={chartData}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="date"
                  />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="transactions"
                    stroke="#f23a17"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        {/* AMOUNT VS DISCOUNT */}

        <Card
          elevation={0}
          sx={{
            border:
              "1px solid #eaecf0",

            borderRadius: 3,
          }}
        >
          <CardContent>
            <Typography
              sx={{
                mb: 2,

                fontSize: 18,

                fontWeight: 700,
              }}
            >
              Amount vs Discounted Amount
            </Typography>

            <Box
              sx={{
                width: "100%",
                height: 280,
              }}
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={chartData}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="date"
                  />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="amount"
                    fill="#f23a17"
                    name="Amount"
                  />

                  <Bar
                    dataKey="discountedAmount"
                    fill="#98a2b3"
                    name="Discounted Amount"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* ======================= */}
      {/* TRANSACTION TABLE */}
      {/* ======================= */}

      <Card
        elevation={0}
        sx={{
          mt: 2.5,

          border:
            "1px solid #eaecf0",

          borderRadius: 3,

          overflow: "hidden",
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
          <Box
            sx={{
              px: 3,

              py: 2.5,

              borderBottom:
                "1px solid #eaecf0",
            }}
          >
            <Typography
              sx={{
                fontSize: 18,

                fontWeight: 700,
              }}
            >
              Transaction Details
            </Typography>

            <Typography
              sx={{
                mt: 0.3,

                color:
                  "#667085",

                fontSize: 13,
              }}
            >
              {transactions.length}{" "}
              transactions loaded
            </Typography>
          </Box>

          {isLoading ? (
            <Box
              sx={{
                minHeight: 220,

                display: "grid",

                placeItems:
                  "center",
              }}
            >
              <CircularProgress
                sx={{
                  color:
                    "#f23a17",
                }}
              />
            </Box>
          ) : transactions.length ===
            0 ? (
            <Box
              sx={{
                minHeight: 220,

                display: "grid",

                placeItems:
                  "center",
              }}
            >
              <Typography
                sx={{
                  color:
                    "#667085",
                }}
              >
                No transactions found
                for the selected date
                range.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table
                sx={{
                  minWidth: 1250,
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      #
                    </TableCell>

                    <TableCell>
                      Card Number
                    </TableCell>

                    <TableCell>
                      Amount
                    </TableCell>

                    <TableCell>
                      RRN
                    </TableCell>

                    <TableCell>
                      STAN
                    </TableCell>

                    <TableCell>
                      Auth Code
                    </TableCell>

                    <TableCell>
                      Discounted Amount
                    </TableCell>

                    <TableCell>
                      MID
                    </TableCell>

                    <TableCell>
                      TID
                    </TableCell>

                    <TableCell>
                      Date & Time
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {transactions.map(
                    (
                      transaction,
                      index
                    ) => (
                      <TableRow
                        key={
                          transaction.ID
                        }
                        hover
                      >
                        <TableCell>
                          {index +
                            1}
                        </TableCell>

                        <TableCell>
                          {maskCardNumber(
                            transaction
                              .CardNumber
                          )}
                        </TableCell>

                        <TableCell>
                          PKR{" "}
                          {Number(
                            transaction.Amount ||
                              0
                          ).toFixed(
                            2
                          )}
                        </TableCell>

                        <TableCell>
                          {
                            transaction.RRN
                          }
                        </TableCell>

                        <TableCell>
                          {
                            transaction.STAN
                          }
                        </TableCell>

                        <TableCell>
                          {transaction
                            .AuthNumber ||
                            "-"}
                        </TableCell>

                        <TableCell
                          sx={{
                            color:
                              "#039855",

                            fontWeight:
                              700,
                          }}
                        >
                          PKR{" "}
                          {Number(
                            transaction
                              .discountedAmount ||
                              0
                          ).toFixed(
                            2
                          )}
                        </TableCell>

                        <TableCell>
                          {
                            transaction.MerchantID
                          }
                        </TableCell>

                        <TableCell>
                          {
                            transaction.TerminalID
                          }
                        </TableCell>

                        <TableCell>
                          {
                            transaction.TransactionDate
                          }{" "}
                          {
                            transaction.TransactionTime
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
    </Box>
  );
};

export default TransactionsPage;