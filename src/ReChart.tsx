import { Transaction } from "./App.tsx";
import Grid from "@mui/material/Grid2";
import MonthlySpent from "./Charts/MonthlySpent.tsx";
import {
  Box,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import RecepientSpent from "./Charts/RecepientSpent.tsx";
import { useState } from "react";

function ReChart({ data }: { data: Transaction[] }) {
  const gridSize = 6;
  const [excludeOthers, setExcludeOthers] = useState(false);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        rowSpacing={5}
        columnSpacing={10}
        sx={{
          overflow: "visible",
          "--Grid-borderWidth": "1px",
          borderTop: "var(--Grid-borderWidth) solid",
          borderLeft: "var(--Grid-borderWidth) solid",
          borderColor: "mediumpurple",
          "& > div": {
            borderRight: "var(--Grid-borderWidth) solid",
            borderBottom: "var(--Grid-borderWidth) solid",
            borderColor: "mediumpurple",
          },
        }}
      >
        <Grid size={gridSize} sx={{ overflow: "visible" }}>
          <Typography variant="h6">Spenditure per Month</Typography>
          <MonthlySpent data={data} />
        </Grid>

        <Grid size={gridSize}>
          <Stack spacing={2}>
            <Typography variant="h6">Spenditure per Recepient</Typography>
            <FormControlLabel
              control={
                <Switch
                  onChange={() => setExcludeOthers(!excludeOthers)}
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
              label="Exclude Other"
            />
            <RecepientSpent data={data} excludeOthers={excludeOthers} />
          </Stack>
        </Grid>
        <Grid size={gridSize}>
          <MonthlySpent data={data} />
        </Grid>
        <Grid size={gridSize}>
          <MonthlySpent data={data} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ReChart;
