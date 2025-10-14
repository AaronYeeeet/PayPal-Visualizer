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

  const result: { month: string; [key: string]: number | string }[] = [];

  monthlyData.forEach((recipientMap, month) => {
    const monthData: { month: string; [key: string]: number | string } = {
      month: month,
    };

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

export function spentPerWeekday(
  data: Transaction[],
): { weekday: string; EUR: number }[] {
  const weekdayMap = new Map<string, number>();
  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  weekdays.forEach((day) => weekdayMap.set(day, 0));

  data.forEach((transaction) => {
    const amount = parseFloat(transaction.Brutto);
    if (transaction.Währung === "EUR" && amount < 0) {
      const [day, month, year] = transaction.Datum.split(".");
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const weekdayIndex = date.getDay();
      const weekdayName = weekdays[weekdayIndex === 0 ? 6 : weekdayIndex - 1];

      weekdayMap.set(weekdayName, weekdayMap.get(weekdayName)! - amount);
    }
  });

  return weekdays.map((day) => ({
    weekday: day,
    EUR: parseFloat(weekdayMap.get(day)!.toFixed(2)),
  }));
}

export function transactionPerWeekdayData(
  transactions: Transaction[],
  showCount: boolean,
): { weekday: string; value: number }[] {
  const weekdayMap = new Map<string, { amount: number; count: number }>();
  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  weekdays.forEach((day) => weekdayMap.set(day, { amount: 0, count: 0 }));

  transactions.forEach((transaction) => {
    const amount = parseFloat(transaction.Brutto);
    if (transaction.Währung === "EUR" && amount < 0) {
      const [day, month, year] = transaction.Datum.split(".");
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const weekdayIndex = date.getDay();
      const weekdayName = weekdays[weekdayIndex === 0 ? 6 : weekdayIndex - 1];

      const current = weekdayMap.get(weekdayName)!;
      weekdayMap.set(weekdayName, {
        amount: current.amount - amount,
        count: current.count + 1,
      });
    }
  });

  return weekdays.map((day) => {
    const data = weekdayMap.get(day)!;
    return {
      weekday: day,
      value: showCount ? data.count : parseFloat(data.amount.toFixed(2)),
    };
  });
}

export function spentPerHour(
  transactions: Transaction[],
): { hour: string; value: number }[] {
  const hourMap = new Map<number, number>();

  for (let i = 0; i < 24; i++) {
    hourMap.set(i, 0);
  }

  transactions.forEach((transaction) => {
    const amount = parseFloat(transaction.Brutto);
    if (transaction.Währung === "EUR" && amount < 0) {
      const [hours] = transaction.Uhrzeit.split(":");
      const hour = parseInt(hours);

      hourMap.set(hour, hourMap.get(hour)! - amount);
    }
  });

  return Array.from(hourMap.entries()).map(([hour, amount]) => ({
    hour: (hour + 1).toString().padStart(2, "0"),
    value: parseFloat(amount.toFixed(2)),
  }));
}

export function countPerHour(
  transactions: Transaction[],
): { hour: string; value: number }[] {
  const hourMap = new Map<number, number>();

  for (let i = 0; i < 24; i++) {
    hourMap.set(i, 0);
  }

  transactions.forEach((transaction) => {
    const amount = parseFloat(transaction.Brutto);
    if (transaction.Währung === "EUR" && amount < 0) {
      const [hours] = transaction.Uhrzeit.split(":");
      const hour = parseInt(hours);

      hourMap.set(hour, hourMap.get(hour)! + 1);
    }
  });

  return Array.from(hourMap.entries()).map(([hour, count]) => ({
    hour: (hour + 1).toString().padStart(2, "0"),
    value: count,
  }));
}

interface CategorizationResult {
  categories: string[];
  classified: {
    index: number;
    name: string;
    category: string;
  }[];
}

export function spentPerCategory(
  categorization: CategorizationResult,
  transactions: Transaction[],
  showCount: boolean,
): { category: string; value: number }[] {
  const categoryMap = new Map<string, { amount: number; count: number }>();

  categorization.categories.forEach((category) => {
    categoryMap.set(category, { amount: 0, count: 0 });
  });

  const transactionAmounts = transactions
    .filter((transaction) => parseFloat(transaction.Brutto) < 0)
    .map((transaction, index) => ({
      index,
      amount: -parseFloat(transaction.Brutto),
    }));

  categorization.classified.forEach((item) => {
    const current = categoryMap.get(item.category);
    const transactionData = transactionAmounts[item.index];

    if (current && transactionData) {
      categoryMap.set(item.category, {
        amount: current.amount + transactionData.amount,
        count: current.count + 1,
      });
    }
  });

  return Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      value: showCount ? data.count : parseFloat(data.amount.toFixed(2)),
    }))
    .filter((item) => item.value > 0) // Remove empty categories
    .sort((a, b) => b.value - a.value);
}

export function getStoresByCategory(
  categorization: CategorizationResult,
): { category: string; stores: string[] }[] {
  const categoryStoreMap = new Map<string, Set<string>>();

  categorization.categories.forEach((category) => {
    categoryStoreMap.set(category, new Set());
  });

  categorization.classified.forEach((item) => {
    const storeSet = categoryStoreMap.get(item.category);
    if (storeSet && item.name) {
      storeSet.add(item.name);
    }
  });

  return Array.from(categoryStoreMap.entries())
    .map(([category, storeSet]) => ({
      category,
      stores: Array.from(storeSet).sort(),
    }))
    .filter((item) => item.stores.length > 0)
    .sort((a, b) => b.stores.length - a.stores.length);
}
