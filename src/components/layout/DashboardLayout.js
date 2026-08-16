import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";

import Header from "./Header";
import Sidebar, { drawerWidth } from "./Sidebar";

const getPageTitle = (pathname) => {
  if (
    pathname.startsWith("/banks/") &&
    pathname.endsWith("/cards")
  ) {
    return "Bank Cards";
  }

  if (pathname.startsWith("/banks")) {
    return "Banks";
  }

  if (pathname.startsWith("/cards")) {
    return "Cards";
  }

  if (pathname.startsWith("/merchants")) {
    return "Merchants";
  }

  return "Dashboard";
};

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "#f8fafc",
      }}
    >
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <Header
        title={getPageTitle(location.pathname)}
        onMenuClick={() => setMobileOpen(true)}
      />

     <Box
  component="main"
  sx={{
    width: {
      xs: "100%",
      md: `calc(100% - ${drawerWidth}px)`,
    },
    maxWidth: "100%",
    flexGrow: 1,
    minWidth: 0,
    overflowX: "hidden",
    p: {
      xs: 2,
      sm: 3,
    },
  }}
>
        <Toolbar
          sx={{
            minHeight: "78px !important",
          }}
        />

        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;