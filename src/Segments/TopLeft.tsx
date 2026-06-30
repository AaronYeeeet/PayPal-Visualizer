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
          Expenditure per Month
        </Typography>
        <Stack direction={"row"} spacing={2} alignItems="center" flexWrap="wrap" justifyContent="center">
          <FormControlLabel
            control={
              <Switch
                checked={showPerRecipient}
                onChange={(event) => setShowPerRecipient(event.target.checked)}
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
            label={<Typography variant="body2" sx={{ fontWeight: 500 }}>Show per Recipient</Typography>}
            sx={{ marginLeft: 1 }}
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
                disabled={!showPerRecipient}
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
