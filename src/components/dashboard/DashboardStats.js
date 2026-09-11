import {
  AccountBalanceOutlined,
  CreditCardOutlined,
  PercentOutlined,
  StorefrontOutlined,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Skeleton,
  Typography,
} from "@mui/material";

const DashboardStats = ({
  stats = {},
  loading = false,
  error = "",
}) => {
  /*
   * DashboardPage sends:
   *
   * {
   *   totalBanks,
   *   totalCards,
   *   totalMerchants,
   *   averageDiscount,
   *   creditCards,
   *   debitCards
   * }
   */

  const statsData = [
    {
      id: 1,
      title: "Total Banks",
      value: stats.totalBanks ?? 0,
      subtitle: "Registered banks",
      icon: (
        <AccountBalanceOutlined
          sx={{
            fontSize: 32,
            color: "#f23a17",
          }}
        />
      ),
    },

    {
      id: 2,
      title: "Total Cards",
      value: stats.totalCards ?? 0,
      subtitle: "Registered cards",
      icon: (
        <CreditCardOutlined
          sx={{
            fontSize: 32,
            color: "#f23a17",
          }}
        />
      ),
    },

    {
      id: 3,
      title: "Total Merchants",
      value:
        stats.totalMerchants ?? 0,
      subtitle: "Registered merchants",
      icon: (
        <StorefrontOutlined
          sx={{
            fontSize: 32,
            color: "#f23a17",
          }}
        />
      ),
    },

    {
      id: 4,
      title: "Average Discount",
      value: `${
        stats.averageDiscount ?? "0.00"
      }%`,
      subtitle: "Across all cards",
      icon: (
        <PercentOutlined
          sx={{
            fontSize: 32,
            color: "#f23a17",
          }}
        />
      ),
    },
  ];

  /*
   * ERROR
   */
  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          mb: 2,
          borderRadius: 2,
        }}
      >
        {error}
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",

        display: "grid",

        gridTemplateColumns: {
          xs: "1fr",

          sm:
            "repeat(2, minmax(0, 1fr))",

          lg:
            "repeat(4, minmax(0, 1fr))",
        },

        gap: 2,
      }}
    >
      {loading
        ? Array.from({
            length: 4,
          }).map((_, index) => (
            <Card
              key={index}
              elevation={0}
              sx={{
                width: "100%",

                minWidth: 0,

                height: "100%",

                border:
                  "1px solid #eaecf0",

                borderRadius: 3,

                backgroundColor:
                  "#ffffff",

                boxShadow:
                  "0 4px 14px rgba(16, 24, 40, 0.05)",
              }}
            >
              <CardContent
                sx={{
                  minHeight: 118,

                  px: 2.2,

                  py: 2.1,

                  display: "flex",

                  alignItems:
                    "center",

                  gap: 1.8,

                  "&:last-child": {
                    pb: 2.1,
                  },
                }}
              >
                <Skeleton
                  variant="circular"
                  width={64}
                  height={64}
                />

                <Box
                  sx={{
                    flexGrow: 1,
                  }}
                >
                  <Skeleton
                    width="55%"
                    height={20}
                  />

                  <Skeleton
                    width="35%"
                    height={36}
                  />

                  <Skeleton
                    width="65%"
                    height={18}
                  />
                </Box>
              </CardContent>
            </Card>
          ))
        : statsData.map((stat) => (
            <Card
              key={stat.id}
              elevation={0}
              sx={{
                width: "100%",

                minWidth: 0,

                height: "100%",

                border:
                  "1px solid #eaecf0",

                borderRadius: 3,

                backgroundColor:
                  "#ffffff",

                boxShadow:
                  "0 4px 14px rgba(16, 24, 40, 0.05)",

                transition:
                  "transform 180ms ease, box-shadow 180ms ease",

                "&:hover": {
                  transform:
                    "translateY(-2px)",

                  boxShadow:
                    "0 8px 22px rgba(16, 24, 40, 0.08)",
                },
              }}
            >
              <CardContent
                sx={{
                  minHeight: 118,

                  px: 2.2,

                  py: 2.1,

                  display: "flex",

                  alignItems:
                    "center",

                  gap: 1.8,

                  "&:last-child": {
                    pb: 2.1,
                  },
                }}
              >
                {/* ICON */}

                <Box
                  sx={{
                    width: 64,

                    height: 64,

                    flexShrink: 0,

                    display: "grid",

                    placeItems:
                      "center",

                    borderRadius:
                      "50%",

                    backgroundColor:
                      "#fff0eb",
                  }}
                >
                  {stat.icon}
                </Box>

                {/* DATA */}

                <Box
                  sx={{
                    minWidth: 0,

                    flexGrow: 1,
                  }}
                >
                  <Typography
                    sx={{
                      color:
                        "#344054",

                      fontSize: 13,

                      fontWeight: 600,

                      lineHeight:
                        1.25,

                      whiteSpace:
                        "normal",
                    }}
                  >
                    {stat.title}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.35,

                      color:
                        "#101828",

                      fontSize: {
                        xs: 26,
                        lg: 28,
                      },

                      fontWeight: 750,

                      lineHeight:
                        1.05,
                    }}
                  >
                    {stat.value}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.8,

                      color:
                        "#667085",

                      fontSize: 12,

                      lineHeight:
                        1.2,

                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {stat.subtitle}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
    </Box>
  );
};

export default DashboardStats;