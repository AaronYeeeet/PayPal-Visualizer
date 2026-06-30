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
      <Stack spacing={3} alignItems="center">
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Activity per Weekday
        </Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newType) => newType && setViewMode(newType)}
          sx={{
            gap: 1,
            "& .MuiToggleButton-root": {
              color: "white",
              borderColor: "rgba(99, 102, 241, 0.3)",
              borderRadius: "12px",
              px: 3,
              py: 1,
              fontWeight: 500,
              minWidth: "100px",
              "&.Mui-selected": {
                backgroundColor: "#6366f1",
                color: "white",
                "&:hover": {
                  backgroundColor: "#4f46e5",
                },
              },
              "&:hover": {
                backgroundColor: "rgba(99, 102, 241, 0.1)",
              },
              "&:not(:first-of-type)": {
                marginLeft: "8px",
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
