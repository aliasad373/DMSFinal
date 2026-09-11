import {
  AccountBalanceOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  LogoutOutlined,
  StorefrontOutlined,
  AssessmentOutlined,
} from "@mui/icons-material";

import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";

import digiKhataLogo from "../../assets/digikhata-logo.PNG";

export const drawerWidth = 275;

const navigationItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <DashboardOutlined />,
  },
  {
    title: "Banks",
    path: "/banks",
    icon: <AccountBalanceOutlined />,
  },
  {
    title: "Cards",
    path: "/cards",
    icon: <CreditCardOutlined />,
  },
  {
    title: "Merchants",
    path: "/merchants",
    icon: <StorefrontOutlined />,
  },
  {
    title: "Transaction Report",
    path: "/transactions",
    icon: <AssessmentOutlined />,
  },
];

const SidebarContent = ({ onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);

    if (onNavigate) {
      onNavigate();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("dms_token");
    sessionStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <Box
      sx={{
        height: "100%",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        color: "#ffffff",
        background:
          "linear-gradient(180deg, #f23a17 0%, #f34416 50%, #ed2f0b 100%)",
        overflowY: "auto",
      }}
    >
      {/* ================= LOGO ================= */}
      <Box
        sx={{
          px: 2.5,
          pt: 3,
          pb: 2,
          flexShrink: 0,
        }}
      >
        <Box
          component="img"
          src={digiKhataLogo}
          alt="DigiKhata"
          sx={{
            width: "100%",
            maxWidth: 210,
            height: 56,
            objectFit: "contain",
            objectPosition: "left center",
            borderRadius: 1,
            backgroundColor: "#ffffff",
            px: 1,
          }}
        />

        <Typography
          sx={{
            mt: 1,
            pl: 0.5,
            color: "rgba(255,255,255,0.9)",
            fontSize: 12,
          }}
        >
          Discount Management System
        </Typography>
      </Box>

      {/* ================= NAVIGATION ================= */}
      <List
        sx={{
          px: 2,
          pt: 2,
          flexShrink: 0,
        }}
      >
        {navigationItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(`${item.path}/`);

          return (
            <ListItemButton
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                minHeight: 58,
                mb: 1,
                px: 2,
                borderRadius: 2,
                color: "#ffffff",

                backgroundColor: isActive
                  ? "rgba(255,255,255,0.18)"
                  : "transparent",

                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.14)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 44,
                  color: "#ffffff",
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontSize: 16,
                  fontWeight: isActive ? 700 : 500,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Push bottom section down */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 20,
        }}
      />

      {/* ================= USER + LOGOUT ================= */}
      <Box
        sx={{
          px: 2.5,
          pb: 2.5,
          flexShrink: 0,
        }}
      >
        <Divider
          sx={{
            mb: 2,
            borderColor: "rgba(255,255,255,0.28)",
          }}
        />

        {/* User Info */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 2,
          }}
        >
          <Avatar
            sx={{
              width: 46,
              height: 46,
              color: "#f23a17",
              backgroundColor: "#ffffff",
              fontWeight: 700,
            }}
          >
            A
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              Admin User
            </Typography>

            <Typography
              sx={{
                mt: 0.3,
                fontSize: 12,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              Administrator
            </Typography>
          </Box>
        </Box>

        {/* Logout */}
        <ListItemButton
          onClick={handleLogout}
          sx={{
            minHeight: 46,
            px: 1.5,
            borderRadius: 2,
            color: "#ffffff",

            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.14)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 40,
              color: "#ffffff",
            }}
          >
            <LogoutOutlined />
          </ListItemIcon>

          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: 15,
              fontWeight: 600,
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
};

const Sidebar = ({ mobileOpen, onMobileClose }) => {
  return (
    <Box
      component="nav"
      sx={{
        width: {
          md: drawerWidth,
        },
        flexShrink: {
          md: 0,
        },
      }}
    >
      {/* ================= MOBILE DRAWER ================= */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: {
            xs: "block",
            md: "none",
          },

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            border: 0,
            boxSizing: "border-box",
            overflowY: "auto",
          },
        }}
      >
        <SidebarContent onNavigate={onMobileClose} />
      </Drawer>

      {/* ================= DESKTOP DRAWER ================= */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: {
            xs: "none",
            md: "block",
          },

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            border: 0,
            boxSizing: "border-box",
            overflowY: "auto",
          },
        }}
      >
        <SidebarContent />
      </Drawer>
    </Box>
  );
};

export default Sidebar;