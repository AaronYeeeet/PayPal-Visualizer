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
      //console.log("Name", transaction.Name)
      //console.log("Brutto", transaction.Brutto)
      sum -= parseFloat(transaction.Brutto);
    }
  });
  return sum;
}

export function spenditureByRecepient(
  data: Transaction[],
  excludeOthers: boolean,
): { name: string; EUR: number }[] {
  let spentPerRecipient: Map<string, number> = new Map();
  let other = 0;

  data.forEach((element) => {
    if (spentPerRecipient.has(element.Name)) {
      spentPerRecipient.set(
        element.Name,
        -parseFloat(element.Brutto) +
          -(spentPerRecipient.get(element.Name) || 0),
      );
    } else {
      spentPerRecipient.set(element.Name, -parseFloat(element.Brutto));
    }
  });

  spentPerRecipient.forEach((value, recipient) => {
    let count = 0;
    let deleted = false;
    spentPerRecipient.forEach((compareValue) => {
      if (value < compareValue) {
        count++;
      }
      if (count > 6 && !deleted) {
        deleted = true;
        other -= value;
        spentPerRecipient.delete(recipient);
      }
    });
  });

  let result: { name: string; EUR: number }[] = [];
  spentPerRecipient.forEach((value, recipient) => {
    result.push({ name: recipient, EUR: value });
  });
  if (!excludeOthers) result.push({ name: "Other", EUR: other });
  console.log("pie chart:", result);
  return result;
}
