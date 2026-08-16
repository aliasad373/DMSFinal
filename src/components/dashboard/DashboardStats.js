import {
  AccountBalanceOutlined,
  CreditCardOutlined,
  LocalOfferOutlined,
  PercentOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";

import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import { dashboardStats } from "../../data/dashboardData";

const getIcon = (iconName) => {
  const iconStyle = {
    fontSize: 32,
    color: "#f23a17",
  };

  switch (iconName) {
    case "bank":
      return <AccountBalanceOutlined sx={iconStyle} />;

    case "card":
      return <CreditCardOutlined sx={iconStyle} />;

    case "offer":
      return <LocalOfferOutlined sx={iconStyle} />;

    case "discount":
      return <PercentOutlined sx={iconStyle} />;

    default:
      return null;
  }
};

const DashboardStats = () => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(4, minmax(0, 1fr))",
        },
        gap: 2,
      }}
    >
      {dashboardStats.map((stat) => (
        <Card
          key={stat.id}
          elevation={0}
          sx={{
            width: "100%",
            minWidth: 0,
            height: "100%",
            border: "1px solid #eaecf0",
            borderRadius: 3,
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 14px rgba(16, 24, 40, 0.05)",
            transition: "transform 180ms ease, box-shadow 180ms ease",

            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 22px rgba(16, 24, 40, 0.08)",
            },
          }}
        >
          <CardContent
            sx={{
              minHeight: 118,
              px: 2.2,
              py: 2.1,
              display: "flex",
              alignItems: "center",
              gap: 1.8,

              "&:last-child": {
                pb: 2.1,
              },
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                backgroundColor: "#fff0eb",
              }}
            >
              {getIcon(stat.icon)}
            </Box>

            <Box
              sx={{
                minWidth: 0,
                flexGrow: 1,
              }}
            >
              <Typography
                sx={{
                  color: "#344054",
                  fontSize: 13,
                  fontWeight: 600,
                  lineHeight: 1.25,
                  whiteSpace: "normal",
                }}
              >
                {stat.title}
              </Typography>

              <Typography
                sx={{
                  mt: 0.35,
                  color: "#101828",
                  fontSize: {
                    xs: 26,
                    lg: 28,
                  },
                  fontWeight: 750,
                  lineHeight: 1.05,
                }}
              >
                {stat.value}
              </Typography>

              <Box
                sx={{
                  mt: 0.8,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.4,
                  color: "#039855",
                }}
              >
                <TrendingUpOutlined
                  sx={{
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 12,
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                  }}
                >
                  {stat.change}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default DashboardStats;