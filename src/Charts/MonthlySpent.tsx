import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Legend,
  Bar,
  Rectangle,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from "../App.tsx";
import { calculateSumPerMonth } from "../utils/prepareData.ts";
import { useMemo } from "react";

function formatData(data: Transaction[]): { name: string; Euro: number }[] {
  const chartData: { name: string; Euro: number }[] = [];
  for (let i = 0; i < 12; i++) {
    chartData.push({
      name: (i + 1).toString().padStart(2, "0"),
      Euro: calculateSumPerMonth(data, i + 1),
    });
    // console.log("chartData", chartData);
  }
  return chartData;
}

// @ts-ignore
function MonthlySpent({ data }: { data: Transaction[] }) {
  const chartData = useMemo(() => formatData(data), [data]);

  return (
    <ResponsiveContainer
      width="100%"
      height={600}
      style={{ overflow: "visible" }}
    >
      <BarChart
        width={700}
        height={600}
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="lightgrey" />
        <YAxis stroke="lightgrey" />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="Euro"
          fill="#8884d8"
          activeBar={<Rectangle fill="pink" stroke="blue" />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default MonthlySpent;
