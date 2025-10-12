import { Transaction } from "../App.tsx";
import Grid from "@mui/material/Grid2";
import {
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import SpentPerWeekday from "../Charts/SpentPerWeekday.tsx";
import { useState } from "react";
import TransactionPerWeekday from "../Charts/TransactionPerWeekday.tsx";

interface MidLeftProps {
  gridSize: number;
  filteredData: Transaction[];
}

function MidLeft({ gridSize, filteredData }: MidLeftProps) {
  const [viewMode, setViewMode] = useState<"amount" | "count">("amount");

  return (
    <Grid size={gridSize} sx={{ overflow: "visible" }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h6" sx={{ color: "white" }}>
          Activity per Weekday
        </Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newType) => newType && setViewMode(newType)}
          sx={{
            "& .MuiToggleButton-root": {
              color: "white",
              borderColor: "#333",
              "&.Mui-selected": {
                backgroundColor: "mediumpurple",
                color: "white",
                "&:hover": {
                  backgroundColor: "mediumpurple",
                },
              },
              "&:hover": {
                backgroundColor: "rgba(147, 112, 219, 0.1)",
              },
            },
          }}
        >
          <ToggleButton value="amount">Amount</ToggleButton>
          <ToggleButton value="count">Count</ToggleButton>
        </ToggleButtonGroup>
        {viewMode === "amount" ? (
          <SpentPerWeekday data={filteredData} />
        ) : (
          <TransactionPerWeekday data={filteredData} />
        )}
      </Stack>
    </Grid>
  );
}

export default MidLeft;
