import Papa from "papaparse";
import { Transaction } from "../App.tsx";

export const parseFile = (file: File): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<Transaction>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        console.log("CSV-Daten:", result.data);
        resolve(result.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};
