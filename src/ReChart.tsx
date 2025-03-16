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
import { Transaction } from "./App.tsx";
const data = [
  { name: "January", uv: 400, pv: 2400, amt: 2400 },
  { name: "February", uv: 300, pv: 1398, amt: 2210 },
  { name: "March", uv: 200, pv: 9800, amt: 2290 },
  { name: "April", uv: 278, pv: 3908, amt: 2000 },
  { name: "May", uv: 189, pv: 4800, amt: 2181 },
  { name: "June", uv: 239, pv: 3800, amt: 2500 },
  { name: "July", uv: 349, pv: 4300, amt: 2100 },
  { name: "August", uv: 500, pv: 2400, amt: 2400 },
  { name: "September", uv: 150, pv: 1300, amt: 1500 },
  { name: "October", uv: 280, pv: 5200, amt: 2800 },
  { name: "November", uv: 380, pv: 5200, amt: 2800 },
  { name: "December", uv: 780, pv: 5200, amt: 2800 },
];

// @ts-ignore
function ReChart({ inputData }: { data: Transaction[] }) {
  return (
    <BarChart
      width={500}
      height={300}
      data={data}
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
        dataKey="pv"
        fill="#8884d8"
        activeBar={<Rectangle fill="pink" stroke="blue" />}
      />
      <Bar
        dataKey="uv"
        fill="#82ca9d"
        activeBar={<Rectangle fill="gold" stroke="purple" />}
      />
    </BarChart>
  );
}

export default ReChart;
