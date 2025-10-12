import { Transaction } from "./App.tsx";
import Grid from "@mui/material/Grid2";
import MonthlySpent from "./Charts/MonthlySpent.tsx";
import { Box, FormControlLabel, Switch, Typography } from "@mui/material";
import { useState } from "react";

import MidLeft from "./Segments/MidLeft.tsx";
import TopRight from "./Segments/TopRight.tsx";
import TopLeft from "./Segments/TopLeft.tsx";

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
                color: "#9e9e9e", // Unchecked color
                "&.Mui-checked": {
                  color: "#65C466", // Checked color
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
        <Grid size={gridSize}>
          <Typography variant="h6">
            Spenditure per Month by Recipient
          </Typography>
          <MonthlySpent data={filteredData} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ReChart;
