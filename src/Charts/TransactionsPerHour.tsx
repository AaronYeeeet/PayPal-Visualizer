import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Rectangle,
} from "recharts";
import { Transaction } from "../App.tsx";
import { countPerHour } from "../utils/prepareData.ts";

interface Props {
  data: Transaction[];
}

function TransactionsPerHour({ data }: Props) {
  const chartData = countPerHour(data);

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
        <XAxis dataKey="hour" stroke="lightgrey" />
        <YAxis stroke="lightgrey" />
        <Tooltip
          contentStyle={{ backgroundColor: "#333", border: "1px solid #666" }}
        />
        <Legend />
        <Bar
          dataKey="value"
          fill="#8884d8"
          activeBar={<Rectangle fill="pink" stroke="blue" />}
          name="Euro"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default TransactionsPerHour;
