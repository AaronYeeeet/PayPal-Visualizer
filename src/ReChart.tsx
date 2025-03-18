import { Transaction } from "./App.tsx";
import Grid from "@mui/material/Grid2";
import MonthlySpent from "./Charts/MonthlySpent.tsx";
import {
    Box, FormControl,
    FormControlLabel,  InputAdornment, OutlinedInput,
    Stack,
    Switch,
    Typography,
} from "@mui/material";
import RecepientSpent from "./Charts/RecepientSpent.tsx";
import { useState } from "react";

function ReChart({ data }: { data: Transaction[] }) {
    const dataExFF = data.filter((transaction) => transaction.Beschreibung !== "Handyzahlung");
    console.log(dataExFF);
    const dataALl = data;
    const [filteredData, setData] = useState(data);
  const gridSize = 6;
  const [excludeOthers, setExcludeOthers] = useState(false);
  const [pieCount, setPieCount] = useState(6);
  return (
    <Box sx={{ flexGrow: 1 }}>
        <FormControlLabel
            control={
                <Switch
                    onChange={(event) => setData(event.target.checked ? dataExFF : dataALl)}
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
        <Grid size={gridSize} sx={{ overflow: "visible" }}>
          <Typography variant="h6">Spenditure per Month</Typography>
          <MonthlySpent data={filteredData} />
        </Grid>

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
                          width: '200px',
                          marginBottom: '16px',
                          '& .MuiOutlinedInput-root': {
                              backgroundColor: '#1e1e1e', // Dark background
                              '& fieldset': {
                                  borderColor: '#333', // Darker outline when not focused
                              },
                              '&:hover fieldset': {
                                  borderColor: '#555', // Slightly lighter outline on hover
                              },
                              '&.Mui-focused fieldset': {
                                  borderColor: "purple",
                              },
                              '& input': {
                                  color: "white", // Light text color
                              },
                              '& .MuiInputAdornment-root': {
                                  color: "white", // Light color for the adornment text
                              },
                          },
                      }}
                      variant="outlined"

                  >
                      <OutlinedInput
                          id="pieCountAdornment"
                          defaultValue={"6"}
                          onChange={(event) => Number(event.target.value) > 0 ? setPieCount(Number(event.target.value)) : setPieCount(pieCount)}
                          endAdornment={<InputAdornment position="end" sx={{ color: "white", textDecorationColor: "white" }}>Recipients shown</InputAdornment>}
                          aria-describedby="outlined-weight-helper-text"
                          inputProps={{
                              'aria-label': 'count of recipients',
                              style: { color: "white" }, // Ensure input text is light
                          }}
                      />
                  </FormControl>
              </Stack>
            <RecepientSpent data={filteredData} excludeOthers={excludeOthers} pieCount={pieCount} />
          </Stack>
        </Grid>
        <Grid size={gridSize}>
          <MonthlySpent data={filteredData} />
        </Grid>
        <Grid size={gridSize}>
          <MonthlySpent data={filteredData} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ReChart;
