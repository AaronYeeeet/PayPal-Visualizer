import { Transaction } from "../App";

function isWithinMonth(date: string, month: number): boolean {
  let monthString = month.toString();
  if (monthString.length === 1) {
    monthString = "0" + monthString;
  }
  return date.split(".")[1] === monthString;
}

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

export function sumPerMonthByRecipient(
  data: Transaction[],
  topRecipients: number = 5,
): { month: string; [key: string]: number | string }[] {
  const monthlyData = new Map<string, Map<string, number>>();

  // get amount per month per recipient
  data.forEach((transaction) => {
    const amount = parseFloat(transaction.Brutto);
    if (
      transaction.Währung === "EUR" &&
      amount < 0 &&
      transaction.Name &&
      transaction.Name.trim() !== ""
    ) {
      const month = transaction.Datum.split(".")[1];
      const recipient = transaction.Name;
      const positiveAmount = -amount;

      if (!monthlyData.has(month)) {
        monthlyData.set(month, new Map());
      }

      const recipientMap = monthlyData.get(month)!;
      recipientMap.set(
        recipient,
        (recipientMap.get(recipient) || 0) + positiveAmount,
      );
    }
  });

  // Finde Top-Empfänger über alle Monate
  const totalPerRecipient = new Map<string, number>();
  monthlyData.forEach((recipientMap) => {
    recipientMap.forEach((amount, recipient) => {
      totalPerRecipient.set(
        recipient,
        (totalPerRecipient.get(recipient) || 0) + amount,
      );
    });
  });

  const topRecipientNames = Array.from(totalPerRecipient.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topRecipients)
    .map(([name]) => name);

  // format for rechart with "Other" category
  const result: { month: string; [key: string]: number | string }[] = [];

  monthlyData.forEach((recipientMap, month) => {
    const monthData: { month: string; [key: string]: number | string } = {
      month: month,
    };

    // Initialisiere alle Top-Empfänger mit 0
    topRecipientNames.forEach((recipient) => {
      monthData[recipient] = 0;
    });

    let otherSum = 0;

    recipientMap.forEach((amount, recipient) => {
      if (topRecipientNames.includes(recipient)) {
        monthData[recipient] = amount;
      } else {
        otherSum += amount;
      }
    });

    // Füge "Other" hinzu, wenn es einen Wert gibt
    if (otherSum > 0) {
      monthData["Other"] = otherSum;
    }

    result.push(monthData);
  });

  return result.sort((a, b) => a.month.localeCompare(b.month));
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
