import { Transaction } from "./App.tsx";
import Grid from "@mui/material/Grid2";
import {
  Box,
  FormControlLabel,
  Switch,
  Button,
  Container,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import RefreshIcon from "@mui/icons-material/Refresh";

import MidLeft from "./Segments/MidLeft.tsx";
import TopRight from "./Segments/TopRight.tsx";
import TopLeft from "./Segments/TopLeft.tsx";
import MidRight from "./Segments/MidRight.tsx";
import BottomAI from "./Segments/BottomAI.tsx";
import { categorizeTransactions } from "./utils/MistralApi.ts";

function ReChart({ data }: { data: Transaction[] }) {
  const defaultData = data.filter(
    (transaction) =>
      transaction.Beschreibung !== "Von Nutzer eingeleitete Abbuchung",
  );
  const dataExFF = data.filter(
    (transaction) =>
      ![
        "Handyzahlung",
        "Allgemeine Zahlung",
        "Von Nutzer eingeleitete Abbuchung",
      ].includes(transaction.Beschreibung),
  );
  console.log(dataExFF);
  const dataALl = data;
  const [filteredData, setData] = useState(defaultData);
  const gridSize = 6;
  const [excludeOthers, setExcludeOthers] = useState(false);
  const [pieCount, setPieCount] = useState(6);
  const [showAll, setShowAll] = useState(false);
  const [categorization, setCategorization] = useState<{
    categories: string[];
    classified: { index: number; name: string; category: string }[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBottomAI, setShowBottomAI] = useState(false);

  async function handleCategorization() {
    setIsLoading(true);
    setShowBottomAI(true);
    try {
      const result = await categorizeTransactions(filteredData);
      console.log("Categorization result:", result);
      setCategorization(result);
    } catch (error) {
      console.error("Error during categorization:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", width: "100%", pb: 4 }}>
      {/* Modern Header */}
      <AppBar
        position="sticky"
        sx={{
          background: "rgba(30, 41, 59, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(99, 102, 241, 0.2)",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Toolbar>
          <AssessmentIcon
            sx={{
              mr: 2,
              fontSize: "2rem",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              borderRadius: "8px",
              padding: "4px",
            }}
          />
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            PayPal Transaction Analytics
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => window.location.reload()}
            sx={{
              "&:hover": {
                background: "rgba(99, 102, 241, 0.2)",
              },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* Filter Controls */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            background: "rgba(30, 41, 59, 0.6)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
            borderRadius: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <FormControlLabel
            control={
              <Switch
                onChange={(event) =>
                  setData(event.target.checked ? dataExFF : dataALl)
                }
                sx={{
                  "& .MuiSwitch-switchBase": {
                    color: "#9e9e9e",
                    "&.Mui-checked": {
                      color: "#6366f1",
                      "& + .MuiSwitch-track": {
                        backgroundColor: "#6366f1",
                      },
                    },
                  },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Exclude Friends & Family
              </Typography>
            }
          />

          <Button
            variant="contained"
            onClick={handleCategorization}
            startIcon={<AutoAwesomeIcon />}
            disabled={isLoading}
            sx={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              "&:hover": {
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              },
              "&:disabled": {
                background: "rgba(99, 102, 241, 0.3)",
              },
            }}
          >
            {isLoading ? "Analyzing..." : "AI Categorization"}
          </Button>
        </Paper>

        {/* Charts Grid */}
        <Grid
          container
          spacing={3}
          sx={{
            "& > div": {
              "& > div": {
                background: "rgba(30, 41, 59, 0.6)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(99, 102, 241, 0.2)",
                borderRadius: "16px",
                padding: 3,
                height: "100%",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "rgba(99, 102, 241, 0.4)",
                  boxShadow: "0 8px 32px rgba(99, 102, 241, 0.2)",
                  transform: "translateY(-2px)",
                },
              },
            },
          }}
        >
          <TopLeft gridSize={gridSize} filteredData={filteredData} />
          <TopRight
            gridSize={gridSize}
            filteredData={filteredData}
            excludeOthers={excludeOthers}
            setExcludeOthers={setExcludeOthers}
            pieCount={pieCount}
            setPieCount={setPieCount}
            showAll={showAll}
            setShowAll={setShowAll}
          />
          <MidLeft gridSize={gridSize} filteredData={filteredData} />
          <MidRight gridSize={gridSize} filteredData={filteredData} />

          {showBottomAI && (
            <BottomAI
              gridSize={12}
              categorization={categorization}
              isLoading={isLoading}
              transactions={filteredData}
            />
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default ReChart;
