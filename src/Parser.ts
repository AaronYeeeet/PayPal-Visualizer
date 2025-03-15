import Papa from "papaparse";

export const parseFile = (file: File): void => {
  Papa.parse(file, {
    complete: (result: { data: string[] }) => {
      console.log("CSV-Daten:", result.data);
    },
    header: true,
    skipEmptyLines: true,
  });
};
