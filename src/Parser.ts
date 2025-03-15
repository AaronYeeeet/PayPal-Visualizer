import Papa from "papaparse";

export const parseFile = (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (result: { data: string[] }) => {
        console.log("CSV-Daten:", result.data);
        resolve(result.data);
      },
      header: true,
      skipEmptyLines: true,
      error: (error) => {
        reject(error);
      },
    });
  });
};
