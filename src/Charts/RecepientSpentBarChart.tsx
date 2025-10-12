import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Transaction } from "../App.tsx";
import { spenditureByRecepient } from "../utils/prepareData.ts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#D8B4FE",
  "#FF6384",
  "#36A2EB",
  "#36A200",
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#1e1e1e",
          border: "1px solid #333",
          borderRadius: "4px",
          color: "white",
          padding: "5px 10px",
        }}
      >
        <p style={{ margin: 0, padding: 0, fontWeight: "bold" }}>{label}</p>
        <p
          style={{ margin: 0, padding: 0 }}
        >{`${payload[0].value.toFixed(2)} €`}</p>
      </div>
    );
  }

  return null;
};

export default function RecipientSpentBarChart({
  data,
  excludeOthers,
  pieCount,
}: {
  data: Transaction[];
  excludeOthers: boolean;
  pieCount: number;
}) {
  const chartData = spenditureByRecepient(data, excludeOthers, pieCount);

  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" tick={{ fill: "lightgrey" }} />
        <YAxis
          type="category"
          dataKey="name"
          width={150}
          tick={({ x, y, payload }) => (
            <text x={x} y={y} textAnchor="end" fontSize={12} fill="lightgrey">
              {payload.value.replace(/\s+/g, "-")}
            </text>
          )}
        />
        <Tooltip
          cursor={{ fill: "rgba(138, 132, 216, 0.3)" }}
          content={<CustomTooltip />}
        />
        <Bar dataKey="EUR" name="">
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
