import { Transaction } from "../App.tsx";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { spentPerWeekday } from "../utils/prepareData.ts";

function SpentPerWeekday({ data }: { data: Transaction[] }) {
  const chartData = spentPerWeekday(data);

  return (
    <ResponsiveContainer
      width="100%"
      height={600}
      style={{ overflow: "visible" }}
    >
      <BarChart
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
        <XAxis dataKey="weekday" stroke="lightgrey" />
        <YAxis stroke="lightgrey" />
        <Tooltip
          contentStyle={{ backgroundColor: "#333", border: "1px solid #666" }}
        />
        <Legend />
        <Bar
          dataKey="EUR"
          fill="#8884d8"
          activeBar={<Rectangle fill="pink" stroke="blue" />}
          name="Euro"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default SpentPerWeekday;
