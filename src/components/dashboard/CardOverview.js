import {
  CancelOutlined,
  CheckCircleOutlined,
  ScheduleOutlined,
} from "@mui/icons-material";

import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";



const chartColors = ["#f23a17", "#ff9273", "#98a2b3"];



const statusItems = [
  {
    title: "Active Cards",
    value: 98,
    icon: <CheckCircleOutlined />,
    iconColor: "#039855",
    valueColor: "#039855",
    backgroundColor: "#effaf3",
  },
  {
    title: "Inactive Cards",
    value: 34,
    icon: <ScheduleOutlined />,
    iconColor: "#f23a17",
    valueColor: "#f23a17",
    backgroundColor: "#fff3ee",
  },
  {
    title: "Closed Cards",
    value: 20,
    icon: <CancelOutlined />,
    iconColor: "#667085",
    valueColor: "#667085",
    backgroundColor: "#f2f4f7",
  },
];

const CardOverview = ({
  cards = [],
  loading = false,
  error = "",
}) => {
  //data 
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

const otherCards =
  cards.length -
  creditCards -
  debitCards;

const totalCards =
  cards.length;
  //pie chart data
  const cardOverviewData = [
  {
    name: "Credit Cards",
    value: creditCards,
  },
  {
    name: "Debit Cards",
    value: debitCards,
  },
  {
    name: "Other",
    value: otherCards,
  },
];
  // end of pie 
  // percentage


//
//
const statusItems = [
  {
    title: "Credit Cards",
    value: creditCards,
    icon: (
      <CheckCircleOutlined />
    ),
    iconColor: "#039855",
    valueColor: "#039855",
    backgroundColor:
      "#effaf3",
  },
  {
    title: "Debit Cards",
    value: debitCards,
    icon: (
      <ScheduleOutlined />
    ),
    iconColor: "#f23a17",
    valueColor: "#f23a17",
    backgroundColor:
      "#fff3ee",
  },
  {
    title: "Total Cards",
    value: totalCards,
    icon: (
      <CancelOutlined />
    ),
    iconColor: "#667085",
    valueColor: "#667085",
    backgroundColor:
      "#f2f4f7",
  },
];
//

  //end of data
  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        mt: 2.5,
        overflow: "hidden",
        border: "1px solid #eaecf0",
        borderRadius: 3,
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 15px rgba(16, 24, 40, 0.05)",
      }}
    >
      <CardContent
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },

          "&:last-child": {
            pb: {
              xs: 2,
              sm: 3,
            },
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 1.25fr) minmax(320px, 0.75fr)",
            },
            gap: {
              xs: 4,
              lg: 0,
            },
          }}
        >
          {/* Cards overview */}
          <Box
            sx={{
              minWidth: 0,
              pr: {
                lg: 4,
              },
            }}
          >
            <Typography
              sx={{
                mb: 3,
                color: "#101828",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              Cards Overview
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "280px minmax(0, 1fr)",
                },
                alignItems: "center",
                gap: {
                  xs: 2,
                  sm: 4,
                },
              }}
            >
              {/* Donut chart */}
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  maxWidth: 280,
                  height: 260,
                  mx: {
                    xs: "auto",
                    sm: 0,
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cardOverviewData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={72}
                      outerRadius={110}
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={0}
                      stroke="none"
                      isAnimationActive
                    >
                      {cardOverviewData.map((item, index) => (
                        <Cell
                          key={item.name}
                          fill={chartColors[index]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#101828",
                      fontSize: 32,
                      fontWeight: 750,
                      lineHeight: 1,
                    }}
                  >
                    {totalCards}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1,
                      color: "#667085",
                      fontSize: 14,
                    }}
                  >
                    Total Cards
                  </Typography>
                </Box>
              </Box>

              {/* Chart legend */}
              <Stack
                spacing={2.5}
                sx={{
                  width: "100%",
                }}
              >
                {cardOverviewData.map((item, index) => {
                  const percentage =
    totalCards > 0
      ? (
          (item.value / totalCards) *
          100
        ).toFixed(1)
      : "0.0";

                  return (
                    <Box
                      key={item.name}
                      sx={{
                        width: "100%",
                        display: "grid",
                        gridTemplateColumns:
                          "14px minmax(115px, 1fr) auto auto",
                        alignItems: "center",
                        columnGap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor: chartColors[index],
                        }}
                      />

                      <Typography
                        sx={{
                          color: "#344054",
                          fontSize: 15,
                        }}
                      >
                        {item.name}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#101828",
                          fontSize: 15,
                          fontWeight: 700,
                        }}
                      >
                        {item.value}
                      </Typography>

                      <Typography
                        sx={{
                          minWidth: 58,
                          color: chartColors[index],
                          fontSize: 14,
                          fontWeight: 700,
                          textAlign: "right",
                        }}
                      >
                        {percentage}%
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          </Box>

          {/* Card statuses */}
          <Box
            sx={{
              minWidth: 0,
              pl: {
                lg: 4,
              },
              borderLeft: {
                xs: "none",
                lg: "1px solid #eaecf0",
              },
              borderTop: {
                xs: "1px solid #eaecf0",
                lg: "none",
              },
              pt: {
                xs: 3,
                lg: 0,
              },
            }}
          >
            <Typography
              sx={{
                mb: 3,
                color: "#101828",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              Card Status
            </Typography>

            <Stack spacing={1.5}>
              {statusItems.map((item) => (
                <Box
                  key={item.title}
                  sx={{
                    width: "100%",
                    minHeight: 68,
                    px: 2.2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    borderRadius: 2,
                    backgroundColor: item.backgroundColor,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: item.iconColor,

                      "& svg": {
                        fontSize: 25,
                      },
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography
                    sx={{
                      color: "#101828",
                      fontSize: 15,
                      fontWeight: 600,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      ml: "auto",
                      color: item.valueColor,
                      fontSize: 23,
                      fontWeight: 750,
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardOverview;