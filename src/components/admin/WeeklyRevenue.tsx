import React from "react";
import { Box } from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "월", value: 300 },
  { name: "화", value: 420 },
  { name: "수", value: 350 },
  { name: "목", value: 500 },
  { name: "금", value: 480 },
  { name: "토", value: 390 },
  { name: "일", value: 420 },
];

const WeeklyRevenue: React.FC = () => {
  return (
    <Box width="100%" height="250px">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#4318ff" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default WeeklyRevenue;
