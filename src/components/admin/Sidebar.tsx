import React from "react";
import { Link, useLocation } from "react-router-dom";
import "/src/styles/sidebar.css";
import { Box, Flex, Text } from "@chakra-ui/react";
import {
  FaUser,
  FaStore,
  FaCommentDots,
  FaTachometerAlt,
} from "react-icons/fa";

const menuItems = [
  { name: "대시보드", path: "/admin", icon: <FaTachometerAlt /> },
  { name: "회원 관리", path: "/admin/members", icon: <FaUser /> },
  { name: "식당 관리", path: "/admin/restaurants", icon: <FaStore /> },
  { name: "리뷰 관리", path: "/admin/reviews", icon: <FaCommentDots /> },
];

export default function AdminSidebar() {
  const { pathname } = useLocation();

  return (
    <Box className="admin-sidebar">
      <Text className="sidebar-title">관리자 페이지</Text>
      <Flex direction="column" gap={2} mt={6}>
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Flex
              align="center"
              className={`sidebar-item ${
                pathname === item.path ? "active" : ""
              }`}
            >
              <Box className="sidebar-icon">{item.icon}</Box>
              <Text>{item.name}</Text>
            </Flex>
          </Link>
        ))}
      </Flex>
    </Box>
  );
}
