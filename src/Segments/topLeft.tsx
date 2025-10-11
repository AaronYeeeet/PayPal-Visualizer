import Grid from "@mui/material/Grid2";
import {
  Typography,
  FormControlLabel,
  Switch,
  Stack,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Checkbox,
} from "@mui/material";
import MonthlySpent from "../Charts/MonthlySpent.tsx";
import MonthlyRecipientSpent from "../Charts/MonthlyRecipientSpent.tsx";
import { Transaction } from "../App.tsx";
import { useState } from "react";

interface TopLeftProps {
  gridSize: number;
  filteredData: Transaction[];
}

const TopLeft = ({ gridSize, filteredData }: TopLeftProps) => {
  const [showPerRecipient, setShowPerRecipient] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [pieCount, setPieCount] = useState(6);

  return (
    <Grid size={gridSize} sx={{ overflow: "visible" }}>
      <Stack spacing={2}>
        <Typography variant="h6">Spenditure per Month</Typography>
        <Stack direction={"row"} spacing={2} alignItems="center">
          <FormControlLabel
            control={
              <Switch
                checked={showPerRecipient}
                onChange={(event) => setShowPerRecipient(event.target.checked)}
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
            label="Show per Recipient"
            sx={{ marginLeft: 1 }}
          />
          <FormControl
            sx={{
              m: 1,
              width: "200px",
              marginBottom: "16px",
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#1e1e1e",
                "& fieldset": {
                  borderColor: "#333",
                },
                "&:hover fieldset": {
                  borderColor: "#555",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "mediumpurple",
                },
                "& input": {
                  color: "white",
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
                style: { color: "white" },
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
        {showPerRecipient ? (
          <MonthlyRecipientSpent
            data={filteredData}
            topRecipients={showAll ? filteredData.length : pieCount}
          />
        ) : (
          <MonthlySpent data={filteredData} />
        )}
      </Stack>
    </Grid>
  );
};

export default TopLeft;
