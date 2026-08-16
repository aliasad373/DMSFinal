import { Box, Typography } from "@mui/material";

import DashboardStats from "../components/dashboard/DashboardStats";
import CardOverview from "../components/dashboard/CardOverview";
import TopBanksTable from "../components/dashboard/TopBanksTable";

const DashboardPage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
      }}
    >
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
          Here&apos;s what&apos;s happening with your discount management
          system today.
        </Typography>
      </Box>

      <DashboardStats />

      <CardOverview />

      <TopBanksTable />
    </Box>
  );
};

export default DashboardPage;