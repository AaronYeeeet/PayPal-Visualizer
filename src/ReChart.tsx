import { Transaction } from "./App.tsx";
import Grid from "@mui/material/Grid2";
import { Box, FormControlLabel, Switch, Button } from "@mui/material";
import { useState } from "react";

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
    <Box
      sx={{
        flexGrow: 1,
        width: 1400,
        padding: 0,
        margin: 0,
        boxSizing: "border-box",
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
                  color: "#65C466",
                  "& + .MuiSwitch-track": {
                    backgroundColor: "#65C466",
                  },
                },
              },
            }}
          />
        }
        label="Exclude Friends & Family"
      />

      <Grid
        container
        rowSpacing={3}
        columnSpacing={0}
        sx={{
          overflow: "visible",
          "--Grid-borderWidth": "1px",
          borderTop: "var(--Grid-borderWidth) solid",
          borderLeft: "var(--Grid-borderWidth) solid",
          borderColor: "grey",
          "& > div": {
            borderRight: "var(--Grid-borderWidth) solid",
            borderBottom: "var(--Grid-borderWidth) solid",
            borderColor: "grey",
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

      <Button
        variant="contained"
        onClick={handleCategorization}
        sx={{ marginTop: 2 }}
      >
        Yeet
      </Button>
    </Box>
  );
}

export default ReChart;
