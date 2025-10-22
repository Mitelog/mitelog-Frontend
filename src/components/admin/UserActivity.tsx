import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

const recentData = [
  { name: "김재환", action: "새 리뷰 등록", time: "5분 전" },
  { name: "김재환", action: "식당 추가", time: "10분 전" },
  { name: "장세훈", action: "리뷰 수정", time: "30분 전" },
  { name: "김지환", action: "회원 가입", time: "1시간 전" },
];

const UserActivity: React.FC = () => {
  return (
    <Box
      bg="#fff"
      p="20px"
      borderRadius="12px"
      boxShadow="0 4px 10px rgba(0,0,0,0.05)"
    >
      {recentData.map((item, idx) => (
        <Flex
          key={idx}
          justify="space-between"
          align="center"
          borderBottom={idx !== recentData.length - 1 ? "1px solid #eee" : ""}
          py="10px"
        >
          <Text fontWeight="600">{item.name}</Text>
          <Text color="#4a5568">{item.action}</Text>
          <Text fontSize="sm" color="#a0aec0">
            {item.time}
          </Text>
        </Flex>
      ))}
    </Box>
  );
};

export default UserActivity;
