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
      <Stack spacing={2} alignItems="center">
        <Typography variant="h6">Spenditure per Recepient</Typography>
        <Stack direction={"row"}>
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
          <FormControl
            sx={{
              m: 1,
              width: "200px",
              marginBottom: "16px",
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#1e1e1e", // Dark background
                "& fieldset": {
                  borderColor: "#333", // Darker outline when not focused
                },
                "&:hover fieldset": {
                  borderColor: "#555", // Slightly lighter outline on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "mediumpurple",
                },
                "& input": {
                  color: "white", // Light text color
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
                    color: "white !important",
                    "& .MuiTypography-root": {
                      color: "lightgrey !important",
                    },
                  }}
                >
                  Recipients shown
                </InputAdornment>
              }
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "count of recipients",
                style: { color: "white" }, // Ensure input text is light
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
                    color: "#mediunpurple",
                  },
                }}
              />
            }
            label="Show All"
            sx={{ marginLeft: 1 }}
          />
        </Stack>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={(_, newType) => newType && setChartType(newType)}
          sx={{
            "& .MuiToggleButton-root": {
              color: "white",
              borderColor: "#333",
              "&.Mui-selected": {
                backgroundColor: "mediumpurple",
                justifyContent: "flex-start",
                color: "white",
              },
            },
          }}
        >
          <ToggleButton value="pie">PieChart</ToggleButton>
          <ToggleButton value="bar">BarChart</ToggleButton>
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
