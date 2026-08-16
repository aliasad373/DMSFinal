import { useState } from "react";

import AccountBalanceOutlined from "@mui/icons-material/AccountBalanceOutlined";

import {
  Box,
  Card,
  CardActionArea,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

const getBankInitials = (bankName) => {
  return bankName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

const BankGridCard = ({
  bank,
  onClick,
  onEdit,
  onDelete,
}) => {
  const [imageFailed, setImageFailed] =
    useState(false);

  const [menuAnchor, setMenuAnchor] =
    useState(null);

  const menuOpen = Boolean(menuAnchor);

  const shouldShowImage =
    Boolean(bank.iconUrl) && !imageFailed;

  const handleMenuOpen = (event) => {
    event.stopPropagation();

    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    if (event) {
      event.stopPropagation();
    }

    setMenuAnchor(null);
  };

  const handleEdit = (event) => {
    event.stopPropagation();

    setMenuAnchor(null);

    onEdit(bank);
  };

  const handleDelete = (event) => {
    event.stopPropagation();

    setMenuAnchor(null);

    onDelete(bank);
  };

  return (
    <Card
      elevation={0}
      sx={{
        position: "relative",
        width: "100%",
        minWidth: 0,
        border: "1px solid #eaecf0",
        borderRadius: 3,
        overflow: "visible",
        backgroundColor: "#ffffff",
        boxShadow:
          "0 4px 14px rgba(16,24,40,0.05)",

        transition:
          "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",

        "&:hover": {
          transform: "translateY(-3px)",
          borderColor: "#fdb7a8",

          boxShadow:
            "0 12px 28px rgba(16,24,40,0.10)",
        },
      }}
    >
      <CardActionArea
        onClick={() => onClick(bank)}
        sx={{
          minHeight: 132,
          px: 2.3,
          py: 2.2,
          borderRadius: 3,
          display: "flex",
          justifyContent: "flex-start",
          textAlign: "left",
        }}
      >
        {/* Bank image */}
        <Box
          sx={{
            width: 66,
            height: 66,
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
            overflow: "hidden",
            border: "1px solid #fee4dc",
            borderRadius: 2.5,
            color: "#f23a17",
            backgroundColor: "#fff3ef",
          }}
        >
          {shouldShowImage ? (
            <Box
              component="img"
              src={bank.iconUrl}
              alt={`${bank.name} logo`}
              onError={() =>
                setImageFailed(true)
              }
              sx={{
                width: "100%",
                height: "100%",
                p: 0.8,
                objectFit: "contain",
              }}
            />
          ) : (
            <Box
              sx={{
                textAlign: "center",
              }}
            >
              <AccountBalanceOutlined
                sx={{
                  display: "block",
                  mx: "auto",
                  fontSize: 31,
                }}
              />

              <Typography
                sx={{
                  mt: -0.2,
                  fontSize: 9,
                  fontWeight: 800,
                }}
              >
                {getBankInitials(bank.name)}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Bank name */}
        <Box
          sx={{
            minWidth: 0,
            ml: 2,
            pr: 4,
            flexGrow: 1,
          }}
        >
          <Typography
            title={bank.name}
            sx={{
              color: "#101828",
              fontSize: 16,
              fontWeight: 700,
              lineHeight: 1.35,

              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",

              overflow: "hidden",
            }}
          >
            {bank.name}
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#667085",
              fontSize: 13,
            }}
          >
            View cards and discounts
          </Typography>
        </Box>
      </CardActionArea>

      {/* 3 dots */}
      <IconButton
        onClick={handleMenuOpen}
        aria-label={`Actions for ${bank.name}`}
        sx={{
          position: "absolute",
          top: 10,
          right: 8,

          width: 36,
          height: 36,

          color: "#667085",

          fontSize: 26,
          fontWeight: 800,

          "&:hover": {
            color: "#f23a17",
            backgroundColor: "#fff0eb",
          },
        }}
      >
        ⋮
      </IconButton>

      <Menu
        anchorEl={menuAnchor}
        open={menuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            minWidth: 160,
            mt: 0.5,
            border: "1px solid #eaecf0",
            borderRadius: 2,
            boxShadow:
              "0 12px 30px rgba(16,24,40,0.13)",
          },
        }}
      >
        <MenuItem
          onClick={handleEdit}
          sx={{
            minHeight: 44,
            gap: 1.2,
            fontSize: 14,
          }}
        >
          <Box
            component="span"
            sx={{
              width: 20,
              textAlign: "center",
            }}
          >
            ✎
          </Box>

          Edit Bank
        </MenuItem>

        <MenuItem
          onClick={handleDelete}
          sx={{
            minHeight: 44,
            gap: 1.2,
            color: "#d92d20",
            fontSize: 14,
          }}
        >
          <Box
            component="span"
            sx={{
              width: 20,
              textAlign: "center",
            }}
          >
            🗑
          </Box>

          Delete Bank
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default BankGridCard;