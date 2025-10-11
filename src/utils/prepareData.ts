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
      sum -= parseFloat(transaction.Brutto);
    }
  });
  return sum;
}

export function spenditureByRecepient(
  data: Transaction[],
  excludeOthers: boolean,
  pieCount: number,
): { name: string; EUR: number }[] {
  let spentPerRecipient: Map<string, number> = new Map();
  let other = 0;

  // Calculate total spent per recipient (only expenses)
  data.forEach((element) => {
    const amount = parseFloat(element.Brutto);
    if (
      element.Währung === "EUR" && // TODO add more
      amount < 0 &&
      element.Name &&
      element.Name.trim() !== ""
    ) {
      const positiveAmount = -amount; // Convert to positive for display
      if (spentPerRecipient.has(element.Name)) {
        spentPerRecipient.set(
          element.Name,
          spentPerRecipient.get(element.Name)! + positiveAmount,
        );
      } else {
        spentPerRecipient.set(element.Name, positiveAmount);
      }
    }
  });

  // filter top pieCount recipients, rest to "Other"
  let sortedEntries = Array.from(spentPerRecipient.entries()).sort(
    (a, b) => b[1] - a[1],
  );
  let topRecipients = sortedEntries.slice(0, pieCount);
  let otherRecipients = sortedEntries.slice(pieCount);

  // Clear the map and add back only top recipients
  spentPerRecipient.clear();
  topRecipients.forEach(([recipient, value]) => {
    spentPerRecipient.set(recipient, value);
  });

  // Sum up the "Other" category
  otherRecipients.forEach(([recipient, value]) => {
    console.log(recipient, value);
    other += value;
  });

  // prepare result map -> array
  let result: { name: string; EUR: number }[] = [];
  spentPerRecipient.forEach((value, recipient) => {
    result.push({ name: recipient, EUR: value });
  });
  // add other category depending on toggle
  if (!excludeOthers && other > 0) {
    result.push({ name: "Other", EUR: other });
  }
  console.log("pie chart:", result);
  return result;
}
