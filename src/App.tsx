import "./App.css";
import { Button, styled, Box, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { parseFile } from "./utils/Parser.ts";
import { useState } from "react";
import ReChart from "./ReChart.tsx";

const VisuallyHiddenInput = styled("input")({
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export type Transaction = {
  Datum: string;
  Uhrzeit: string;
  Zeitzone: string;
  Beschreibung: string;
  Name: string;
  Brutto: string;
  Währung: string;
};

function App() {
  const [state, setState] = useState(0);
  const [data, setData] = useState<Transaction[]>();

  const handleFileChange = async (event: FileList | null) => {
    console.log("file change");
    if (event && event.length === 1) {
      console.log("app calls parser");
      setData(await parseFile(event[0]));
    }
  };

  return (
    <Box className="app-container">
      {state === 0 && (
        <div className="upload-screen">
          <div className="upload-card">
            <AssessmentIcon className="upload-icon" sx={{ fontSize: "5rem" }} />
            <Typography variant="h3" className="upload-title" gutterBottom>
              PayPal Visualizer
            </Typography>
            <Typography variant="body1" className="upload-subtitle">
              Upload your PayPal transaction CSV to get beautiful insights
            </Typography>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              className="upload-button"
              sx={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                },
              }}
            >
              Upload Transaction File
              <VisuallyHiddenInput
                type="file"
                onChange={(event) => {
                  handleFileChange(event.target.files);
                  setState(1);
                }}
                multiple
              />
            </Button>
            <Typography
              variant="caption"
              sx={{ display: "block", mt: 2, color: "rgba(255,255,255,0.5)" }}
            >
              Supports CSV files exported from PayPal
            </Typography>
          </div>
        </div>
      )}

      {state === 1 && data && <ReChart data={data} />}
    </Box>
  );
}

export default App;
