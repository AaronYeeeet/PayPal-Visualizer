import { Transaction } from "../App.tsx";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle, // Import Rectangle for the activeBar effect
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { sumPerMonthByRecipient } from "../utils/prepareData.ts";
import { useMemo } from "react";

// Color palette for the different recipients in the stacked chart.
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7c7c",
  "#a28dd8",
  "#66c2a5",
];

/**
 * Prepares and formats data for the stacked bar chart.
 * This function ensures that data for all 12 months is returned, even if there were no transactions.
 * @param {Transaction[]} data - The raw transaction data.
 * @param {number} topRecipients - The number of top recipients to include.
 * @returns {object} An object containing the formatted chart data and the list of recipient names.
 */
function formatData(data: Transaction[], topRecipients: number) {
  const sparseData = sumPerMonthByRecipient(data, topRecipients);
  const recipients =
    sparseData.length > 0
      ? Object.keys(sparseData[0]).filter((key) => key !== "month")
      : [];

  const finalChartData = [];
  for (let i = 1; i <= 12; i++) {
    const monthString = i.toString().padStart(2, "0");
    const monthDataFromUtil = sparseData.find((d) => d.month === monthString);
    const newMonthObject: { [key: string]: string | number } = {
      month: monthString,
    };
    recipients.forEach((recipient) => {
      newMonthObject[recipient] = monthDataFromUtil
        ? monthDataFromUtil[recipient] || 0
        : 0;
    });
    finalChartData.push(newMonthObject);
  }
  return { finalChartData, recipients };
}

/**
 * A React component that displays a stacked bar chart of monthly spending
 * broken down by the top N recipients, styled similarly to MonthlySpent.
 */
function MonthlyRecipientSpent({
  data,
  topRecipients = 5,
}: {
  data: Transaction[];
  topRecipients?: number;
}) {
  const { finalChartData, recipients } = useMemo(
    () => formatData(data, topRecipients),
    [data, topRecipients],
  );

  return (
    // Use the same ResponsiveContainer styling as MonthlySpent
    <ResponsiveContainer
      width="100%"
      height={350}
      style={{ overflow: "visible" }}
    >
      {/* Use the same BarChart props (width, height, margin) as MonthlySpent */}
      <BarChart
        width={700}
        height={300}
        data={finalChartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" stroke="white" />
        <YAxis stroke="white" />
        <Tooltip
          contentStyle={{ backgroundColor: "#333", border: "1px solid #666" }}
        />
        <Legend />
        {recipients.map((recipient, index) => (
          <Bar
            key={recipient}
            dataKey={recipient}
            stackId="a"
            fill={COLORS[index % COLORS.length]}
            // Add the same activeBar prop as MonthlySpent for a consistent hover effect
            activeBar={<Rectangle fill="pink" stroke="blue" />}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default MonthlyRecipientSpent;
