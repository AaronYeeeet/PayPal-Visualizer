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
        <defs>
          <linearGradient id="colorEuro" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9}/>
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.7}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.2)" />
        <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.7)" style={{ fontSize: '14px', fontWeight: 500 }} />
        <YAxis stroke="rgba(255, 255, 255, 0.7)" style={{ fontSize: '14px', fontWeight: 500 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(30, 41, 59, 0.95)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '12px',
            color: 'white',
          }}
          cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
        />
        <Legend wrapperStyle={{ fontSize: '14px', fontWeight: 500 }} />
        <Bar
          dataKey="Euro"
          fill="url(#colorEuro)"
          radius={[8, 8, 0, 0]}
          activeBar={<Rectangle fill="#818cf8" stroke="#6366f1" strokeWidth={2} />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default MonthlySpent;
