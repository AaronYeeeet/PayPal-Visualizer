import "./App.css";
import { Button, styled } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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
    <>
      {state === 0 && (
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload files
          <VisuallyHiddenInput
            type="file"
            onChange={(event) => {
              handleFileChange(event.target.files);
              setState(1);
            }}
            multiple
          />
        </Button>
      )}

      {state === 1 && data && <ReChart data={data} />}
    </>
  );
}

export default App;
