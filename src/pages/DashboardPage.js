import {
  Box,
  Typography,
} from "@mui/material";

import {
  useEffect,
  useState,
} from "react";

import DashboardStats from "../components/dashboard/DashboardStats";
import CardOverview from "../components/dashboard/CardOverview";
import TopBanksTable from "../components/dashboard/TopBanksTable";

import {
  getBanks,
} from "../api/bankApi";

import {
  getMerchants,
} from "../api/merchantApi";

import {
  getAllCards,
} from "../api/allCardsApi";

const DashboardPage = () => {
  /*
   * DATA
   */
  const [cards, setCards] =
    useState([]);

  const [banks, setBanks] =
    useState([]);

  const [merchants, setMerchants] =
    useState([]);

  /*
   * LOADING / ERROR
   */
  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    loadError,
    setLoadError,
  ] = useState("");

  /*
   * LOAD DASHBOARD DATA
   */
  const loadDashboardData =
    async () => {
      try {
        setIsLoading(true);
        setLoadError("");

        /*
         * Load all required dashboard
         * APIs at the same time.
         */
        const [
          cardsResponse,
          banksResponse,
          merchantsResponse,
        ] = await Promise.all([
          getAllCards(),
          getBanks(),
          getMerchants(),
        ]);

        console.log(
          "DASHBOARD CARDS:",
          cardsResponse
        );

        console.log(
          "DASHBOARD BANKS:",
          banksResponse
        );

        console.log(
          "DASHBOARD MERCHANTS:",
          merchantsResponse
        );

        /*
         * ==========================
         * CARDS
         * ==========================
         */
        const rawCards =
          Array.isArray(
            cardsResponse
          )
            ? cardsResponse
            : Array.isArray(
                cardsResponse?.cards
              )
              ? cardsResponse.cards
              : Array.isArray(
                  cardsResponse?.data
                )
                ? cardsResponse.data
                : Array.isArray(
                    cardsResponse
                      ?.data?.cards
                  )
                  ? cardsResponse
                      .data.cards
                  : [];

        /*
         * ==========================
         * BANKS
         * ==========================
         */
        const rawBanks =
          Array.isArray(
            banksResponse
          )
            ? banksResponse
            : Array.isArray(
                banksResponse?.data
              )
              ? banksResponse.data
              : Array.isArray(
                  banksResponse?.banks
                )
                ? banksResponse.banks
                : [];

        /*
         * ==========================
         * MERCHANTS
         * ==========================
         */
        const rawMerchants =
          Array.isArray(
            merchantsResponse
          )
            ? merchantsResponse
            : Array.isArray(
                merchantsResponse
                  ?.merchants
              )
              ? merchantsResponse
                  .merchants
              : Array.isArray(
                  merchantsResponse
                    ?.data
                )
                ? merchantsResponse
                    .data
                : [];

        console.log(
          "CARDS ARRAY:",
          rawCards
        );

        console.log(
          "BANKS ARRAY:",
          rawBanks
        );

        console.log(
          "MERCHANTS ARRAY:",
          rawMerchants
        );

        /*
         * SAVE DATA
         */
        setCards(rawCards);

        setBanks(rawBanks);

        setMerchants(
          rawMerchants
        );
      } catch (error) {
        console.error(
          "DASHBOARD API ERROR:",
          error
        );

        setLoadError(
          error.response?.data
            ?.message ||
            error.message ||
            "Unable to load dashboard."
        );
      } finally {
        setIsLoading(false);
      }
    };

  /*
   * LOAD ON PAGE START
   */
  useEffect(() => {
    loadDashboardData();
  }, []);

  /*
   * ==========================
   * DASHBOARD STATS
   * ==========================
   */

  const totalBanks =
    banks.length;

  const totalCards =
    cards.length;

  const totalMerchants =
    merchants.length;

  /*
   * Average discount from
   * /cards/allcards
   */
  const averageDiscount =
    totalCards > 0
      ? cards.reduce(
          (
            total,
            card
          ) => {
            return (
              total +
              Number(
                card
                  ?.discountPercentage ||
                  0
              )
            );
          },
          0
        ) / totalCards
      : 0;

  /*
   * Extra useful card stats
   */
  const creditCards =
    cards.filter(
      (card) =>
        card?.cardType
          ?.toUpperCase() ===
        "CREDIT"
    ).length;

  const debitCards =
    cards.filter(
      (card) =>
        card?.cardType
          ?.toUpperCase() ===
        "DEBIT"
    ).length;

  /*
   * Pass one stats object to
   * DashboardStats
   */
  const dashboardStats = {
    totalBanks,

    totalCards,

    totalMerchants,

    averageDiscount:
      averageDiscount.toFixed(
        2
      ),

    creditCards,

    debitCards,
  };

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
      }}
    >
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <Box
        sx={{
          mb: 3,
        }}
      >
        <Typography
          sx={{
            color: "#101828",

            fontSize: {
              xs: 25,
              sm: 30,
            },

            fontWeight: 750,

            lineHeight: 1.2,
          }}
        >
          Welcome back, Admin! 👋
        </Typography>

        <Typography
          sx={{
            mt: 0.7,

            color: "#667085",

            fontSize: {
              xs: 14,
              sm: 16,
            },
          }}
        >
          Here&apos;s what&apos;s
          happening with your discount
          management system today.
        </Typography>
      </Box>

      {/* ========================= */}
      {/* DASHBOARD STATS */}
      {/* ========================= */}

      <DashboardStats
        stats={
          dashboardStats
        }
        loading={
          isLoading
        }
        error={
          loadError
        }
      />

      {/* ========================= */}
      {/* CARD OVERVIEW */}
      {/* ========================= */}

      <CardOverview
        cards={cards}
        loading={
          isLoading
        }
        error={
          loadError
        }
      />

      {/* ========================= */}
      {/* TOP BANKS */}
      {/* ========================= */}

      <TopBanksTable
        banks={banks}
        cards={cards}
        loading={
          isLoading
        }
        error={
          loadError
        }
      />
    </Box>
  );
};

export default DashboardPage;