import { Transaction } from "../App";

function isWithinMonth(date: string, month: number): boolean {
  let monthString = month.toString();
  if (monthString.length === 1) {
    monthString = "0" + monthString;
  }
  return date.split(".")[1] === monthString;
}

//TODO skip payments to own account
export function calculateSumPerMonth(
  data: Transaction[],
  month: number,
): number {
  let transactionsWithinMonth: Transaction[] = data.filter((transaction) =>
    isWithinMonth(transaction.Datum, month),
  );
  let sum = 0;
  transactionsWithinMonth.forEach((transaction) => {
    if (transaction.Währung === "EUR" && parseFloat(transaction.Brutto) < 0) {
      console.log("Name", transaction.Name);
      console.log("Brutto", transaction.Brutto);
      sum -= parseFloat(transaction.Brutto);
    }
  });
  return sum;
}
