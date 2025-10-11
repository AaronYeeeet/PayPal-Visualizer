import { Transaction } from "./App.tsx";
import Grid from "@mui/material/Grid2";
import MonthlySpent from "./Charts/MonthlySpent.tsx";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputAdornment,
  OutlinedInput,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import RecepientSpent from "./Charts/RecepientSpent.tsx";
import { useState } from "react";
import MonthlyRecipientSpent from "./Charts/MonthlyRecipientSpent.tsx";

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
    <Box sx={{ flexGrow: 1 }}>
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
        {/*  top left spent per month */}
        <Grid size={gridSize} sx={{ overflow: "visible" }}>
          <Typography variant="h6">Spenditure per Month</Typography>
          <MonthlySpent data={filteredData} />
        </Grid>
        {/*  top right spent per recipient */}
        <Grid size={gridSize}>
          <Stack spacing={2}>
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
            <RecepientSpent
              data={filteredData}
              excludeOthers={excludeOthers}
              pieCount={showAll ? filteredData.length : pieCount}
            />
          </Stack>
        </Grid>
        {/*  bottom placeholders */}
        <Grid size={gridSize}>
          <Typography variant="h6">
            Spenditure per Month by Recipient
          </Typography>
          <MonthlyRecipientSpent data={filteredData} topRecipients={5} />
        </Grid>
        <Grid size={gridSize}>
          <MonthlySpent data={filteredData} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ReChart;
