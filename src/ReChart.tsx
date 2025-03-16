import { Transaction } from "./App.tsx";
import Grid from "@mui/material/Grid2";

import MonthlySpent from "./Charts/MonthlySpent.tsx";
import { Box } from "@mui/material";

function ReChart({ data }: { data: Transaction[] }) {
  const gridSize = 6;
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container rowSpacing={10} columnSpacing={20}>
        <Grid size={gridSize}>
          <MonthlySpent data={data} />
        </Grid>
        <Grid size={gridSize}>
          <MonthlySpent data={data} />
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
