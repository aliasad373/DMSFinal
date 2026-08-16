import {
  MenuOutlined,
  NotificationsNoneOutlined,
  SearchOutlined,
} from "@mui/icons-material";

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  InputBase,
  Toolbar,
  Typography,
} from "@mui/material";

import { drawerWidth } from "./Sidebar";

const Header = ({ title, onMenuClick }) => {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: {
          md: `calc(100% - ${drawerWidth}px)`,
        },
        ml: {
          md: `${drawerWidth}px`,
        },
        color: "#101828",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #eaecf0",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "78px !important",
          px: {
            xs: 2,
            sm: 3,
          },
          gap: 2,
        }}
      >
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{
            display: {
              xs: "inline-flex",
              md: "none",
            },
          }}
        >
          <MenuOutlined />
        </IconButton>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Box
          sx={{
            width: {
              xs: 44,
              sm: 310,
            },
            height: 46,
            px: {
              xs: 0,
              sm: 1.5,
            },
            display: "flex",
            alignItems: "center",
            justifyContent: {
              xs: "center",
              sm: "flex-start",
            },
            border: "1px solid #d0d5dd",
            borderRadius: 2,
          }}
        >
          <SearchOutlined sx={{ color: "#667085" }} />

          <InputBase
            placeholder="Search here..."
            sx={{
              ml: 1,
              width: "100%",
              display: {
                xs: "none",
                sm: "block",
              },
              fontSize: 14,
            }}
          />
        </Box>

        <IconButton>
          <Badge
            badgeContent={8}
            sx={{
              "& .MuiBadge-badge": {
                color: "#ffffff",
                backgroundColor: "#f23a17",
              },
            }}
          >
            <NotificationsNoneOutlined />
          </Badge>
        </IconButton>

        <Avatar
          sx={{
            width: 42,
            height: 42,
            backgroundColor: "#f23a17",
          }}
        >
          A
        </Avatar>
      </Toolbar>
    </AppBar>
  );
};

export default Header;