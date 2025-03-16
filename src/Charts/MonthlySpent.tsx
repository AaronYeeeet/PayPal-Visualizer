import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Legend,
  Bar,
  Rectangle,
} from "recharts";
import { Transaction } from "../App.tsx";
import { calculateSumPerMonth } from "../utils/prepareData.ts";
import { useMemo } from "react";

// @ts-ignore
const testData = [
  { name: "01", uv: 400 },
  { name: "02", uv: 300 },
  { name: "03", uv: 200 },
  { name: "04", uv: 278 },
  { name: "05", uv: 189 },
  { name: "06", uv: 239 },
  { name: "07", uv: 349 },
  { name: "08", uv: 500 },
  { name: "09", uv: 150 },
  { name: "10", uv: 280 },
  { name: "11", uv: 380 },
  { name: "12", uv: 780 },
];

function formatData(data: Transaction[]): { name: string; uv: number }[] {
  const chartData: { name: string; uv: number }[] = [];
  for (let i = 0; i < 12; i++) {
    chartData.push({
      name: (i + 1).toString().padStart(2, "0"),
      uv: calculateSumPerMonth(data, i + 1),
    });
    console.log("chartData", chartData);
  }
  return chartData;
}

// @ts-ignore
function MonthlySpent({ data }: { data: Transaction[] }) {
  const chartData = useMemo(() => formatData(data), [data]);

  return (
    <BarChart
      width={700}
      height={300}
      data={chartData}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar
        dataKey="uv"
        fill="#8884d8"
        activeBar={<Rectangle fill="pink" stroke="blue" />}
      />
    </BarChart>
  );
}

export default MonthlySpent;
