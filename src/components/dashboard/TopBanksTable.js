import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import { topBanks } from "../../data/dashboardData";

const TopBanksTable = () => {
  const navigate = useNavigate();

  return (
    <Card
      elevation={0}
      sx={{
        mt: 2.5,
        border: "1px solid #eaecf0",
        borderRadius: 3,
        boxShadow: "0 4px 15px rgba(16,24,40,0.05)",
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
            px: {
              xs: 2,
              sm: 3,
            },
            pt: 2.5,
            pb: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            Top Banks by Cards
          </Typography>

          <Button
            onClick={() => navigate("/banks")}
            sx={{
              ml: "auto",
              color: "#f23a17",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            View All
          </Button>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Bank Name</TableCell>
                <TableCell align="center">Total Cards</TableCell>
                <TableCell align="center">Active Cards</TableCell>
                <TableCell align="center">Active Offers</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {topBanks.map((bank, index) => (
                <TableRow
                  key={bank.id}
                  hover
                  sx={{
                    "&:last-child td": {
                      borderBottom: 0,
                    },
                  }}
                >
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          display: "grid",
                          placeItems: "center",
                          borderRadius: "50%",
                          color: "#f23a17",
                          fontWeight: 800,
                          backgroundColor: "#fff0eb",
                        }}
                      >
                        {bank.name.charAt(0)}
                      </Box>

                      <Typography sx={{ fontWeight: 600 }}>
                        {bank.name}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    {bank.totalCards}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      color: "#039855",
                      fontWeight: 700,
                    }}
                  >
                    {bank.activeCards}
                  </TableCell>

                  <TableCell align="center">
                    {bank.activeOffers}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default TopBanksTable;