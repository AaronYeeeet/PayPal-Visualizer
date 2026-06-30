import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputAdornment,
  OutlinedInput,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import RecepientSpent from "../Charts/RecepientSpent.tsx";
import RecepientSpentBarChart from "../Charts/RecepientSpentBarChart.tsx";
import Grid from "@mui/material/Grid2";
import { Transaction } from "../App.tsx";
import { useState } from "react";

interface TopRightProps {
  gridSize: number;
  filteredData: Transaction[];
  excludeOthers: boolean;
  setExcludeOthers: (value: boolean) => void;
  showAll: boolean;
  setShowAll: (value: boolean) => void;
  pieCount: number;
  setPieCount: (value: number) => void;
}

const TopRight = ({
  gridSize,
  filteredData,
  excludeOthers,
  setExcludeOthers,
  showAll,
  setShowAll,
  pieCount,
  setPieCount,
}: TopRightProps) => {
  const [chartType, setChartType] = useState<"pie" | "bar">("bar");

  return (
    <Grid size={gridSize}>
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
          Expenditure per Recipient
        </Typography>
        <Stack direction={"row"} justifyContent="center" alignItems="center" spacing={2} flexWrap="wrap">
          <FormControlLabel
            control={
              <Switch
                onChange={() => setExcludeOthers(!excludeOthers)}
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
            label={<Typography variant="body2" sx={{ fontWeight: 500 }}>Exclude Other</Typography>}
          />
          <FormControl
            sx={{
              m: 1,
              width: "220px",
              marginBottom: "16px",
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(15, 20, 25, 0.5)",
                borderRadius: "12px",
                "& fieldset": {
                  borderColor: "rgba(99, 102, 241, 0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(99, 102, 241, 0.5)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#6366f1",
                },
                "& input": {
                  color: "white",
                  fontWeight: 500,
                },
              },
            }}
            variant="outlined"
            disabled={showAll}
          >
            <OutlinedInput
              id="pieCountAdornment"
              defaultValue={"6"}
              onChange={(event) =>
                Number(event.target.value) > 0
                  ? setPieCount(Number(event.target.value))
                  : setPieCount(pieCount)
              }
              endAdornment={
                <InputAdornment
                  position="end"
                  sx={{
                    "& .MuiTypography-root": {
                      color: "rgba(255, 255, 255, 0.8) !important",
                      fontWeight: 400,
                    },
                  }}
                >
                  Recipients shown
                </InputAdornment>
              }
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "count of recipients",
                style: { color: "white", fontWeight: 500, fontSize: "16px" },
              }}
            />
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={showAll}
                onChange={(event) => setShowAll(event.target.checked)}
                sx={{
                  color: "#9e9e9e",
                  "&.Mui-checked": {
                    color: "#6366f1",
                  },
                }}
              />
            }
            label={<Typography variant="body2" sx={{ fontWeight: 500 }}>Show All</Typography>}
            sx={{ marginLeft: 1 }}
          />
        </Stack>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={(_, newType) => newType && setChartType(newType)}
          sx={{
            gap: 1,
            "& .MuiToggleButton-root": {
              color: "white",
              borderColor: "rgba(99, 102, 241, 0.3)",
              borderRadius: "12px",
              px: 3,
              py: 1,
              fontWeight: 500,
              minWidth: "110px",
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
          <ToggleButton value="pie">Pie Chart</ToggleButton>
          <ToggleButton value="bar">Bar Chart</ToggleButton>
        </ToggleButtonGroup>

        {chartType === "pie" ? (
          <RecepientSpent
            data={filteredData}
            excludeOthers={excludeOthers}
            pieCount={showAll ? filteredData.length : pieCount}
          />
        ) : (
          <RecepientSpentBarChart
            data={filteredData}
            excludeOthers={excludeOthers}
            pieCount={
              showAll
                ? Math.min(filteredData.length, 10)
                : Math.min(pieCount, 10)
            }
          />
        )}
      </Stack>
    </Grid>
  );
};

export default TopRight;
