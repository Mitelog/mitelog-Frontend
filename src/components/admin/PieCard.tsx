import React from "react";
import { Box } from "@chakra-ui/react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "긍정 리뷰", value: 55 },
  { name: "보통", value: 30 },
  { name: "부정 리뷰", value: 15 },
];

const COLORS = ["#38a169", "#f6ad55", "#e53e3e"];

const PieCard: React.FC = () => {
  return (
    <Box width="100%" height="250px">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PieCard;
