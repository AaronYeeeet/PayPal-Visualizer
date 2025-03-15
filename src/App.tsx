import "./App.css";
import { Button, styled } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { parseFile } from "./Parser.ts";

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

const handleFileChange = (event: FileList | null) => {
  console.log("file change");
  if (event && event.length === 1) {
    console.log("app calls parser");
    parseFile(event[0]);
  }
};

function App() {
  return (
    <>
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
          onChange={(event) => handleFileChange(event.target.files)}
          multiple
        />
      </Button>
    </>
  );
}

export default App;
