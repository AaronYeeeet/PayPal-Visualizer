import {
  Box,
  Typography,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useState } from "react";
import { spentPerCategory, getStoresByCategory } from "../utils/prepareData";
import { Transaction } from "../App";

interface CategorizationResult {
  categories: string[];
  classified: {
    index: number;
    name: string;
    category: string;
  }[];
}

interface BottomAIProps {
  gridSize: any;
  categorization: CategorizationResult | null;
  isLoading?: boolean;
  transactions: Transaction[];
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#a4de6c",
  "#d0ed57",
  "#83a6ed",
  "#8dd1e1",
  "#d084d0",
  "#ffbb28",
];

const BottomAI = ({
  gridSize,
  categorization,
  isLoading,
  transactions,
}: BottomAIProps) => {
  const [showCount, setShowCount] = useState(false);

  const handleToggleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: boolean | null,
  ) => {
    if (newValue !== null) {
      setShowCount(newValue);
    }
  };

  const chartData = categorization
    ? spentPerCategory(categorization, transactions, showCount)
    : [];

  const tableData = categorization ? getStoresByCategory(categorization) : [];

  return (
    <Grid size={gridSize} sx={{ overflow: "visible" }}>
      <Box sx={{ textAlign: "center", padding: 3 }}>
        <Typography variant="h6" sx={{ color: "white", marginBottom: 2 }}>
          AI Transaction Categorization
        </Typography>

        {isLoading ? (
          <CircularProgress sx={{ color: "#65C466" }} />
        ) : categorization ? (
          <Box sx={{ color: "white" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 2,
              }}
            >
              <ToggleButtonGroup
                value={showCount}
                exclusive
                onChange={handleToggleChange}
                sx={{ marginLeft: 2 }}
              >
                <ToggleButton
                  value={false}
                  sx={{
                    color: "white",
                    borderColor: "grey",
                    "&.Mui-selected": {
                      backgroundColor: "#9d4edd",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#8338c9",
                      },
                    },
                  }}
                >
                  Betrag
                </ToggleButton>
                <ToggleButton
                  value={true}
                  sx={{
                    color: "white",
                    borderColor: "grey",
                    "&.Mui-selected": {
                      backgroundColor: "#9d4edd",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#8338c9",
                      },
                    },
                  }}
                >
                  Anzahl
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis type="number" stroke="white" />
                <YAxis
                  type="category"
                  dataKey="category"
                  stroke="white"
                  width={140}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#333",
                    border: "1px solid #666",
                    color: "white",
                  }}
                  formatter={(value: number) =>
                    showCount
                      ? [`${value}`, "Anzahl"]
                      : [`${value.toFixed(2)} €`, "Betrag"]
                  }
                />
                <Bar dataKey="value" fill="#8884d8">
                  {chartData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Category Store Table */}
            <Box sx={{ marginTop: 4 }}>
              <Typography variant="h6" sx={{ color: "white", marginBottom: 2 }}>
                Stores by Category
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: "#1e1e1e",
                  maxHeight: 500,
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          backgroundColor: "#2d2d2d",
                          color: "white",
                          fontWeight: "bold",
                          width: "200px",
                        }}
                      >
                        Category
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: "#2d2d2d",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        Stores
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData.map((row) => (
                      <TableRow
                        key={row.category}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#2d2d2d",
                          },
                        }}
                      >
                        <TableCell
                          sx={{
                            color: "white",
                            borderBottom: "1px solid #444",
                            verticalAlign: "top",
                            paddingTop: 2,
                          }}
                        >
                          {row.category}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            borderBottom: "1px solid #444",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 1,
                            }}
                          >
                            {row.stores.map((store) => (
                              <Chip
                                key={store}
                                label={store}
                                size="small"
                                sx={{
                                  backgroundColor: "#3d3d3d",
                                  color: "white",
                                  "&:hover": {
                                    backgroundColor: "#4d4d4d",
                                  },
                                }}
                              />
                            ))}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        ) : (
          <Typography variant="body1" sx={{ color: "white", opacity: 0.7 }}>
            Yeet
          </Typography>
        )}
      </Box>
    </Grid>
  );
};

export default BottomAI;
