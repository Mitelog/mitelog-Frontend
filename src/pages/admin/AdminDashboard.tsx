import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  Icon,
  Text,
  Heading,
} from "@chakra-ui/react";
import {
  getAllMembers,
  getAllRestaurants,
  getAllReviews,
} from "../../api/axiosAdmin";
import {
  FaUsers,
  FaUtensils,
  FaRegCommentDots,
  FaChartBar,
  FaChartPie,
} from "react-icons/fa";
import "../../styles/admin-dashboard.css";
import WeeklyRevenue from "../../components/admin/WeeklyRevenue";
import PieCard from "../../components/admin/PieCard";
import UserActivity from "../../components/admin/UserActivity";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    members: 0,
    restaurants: 0,
    reviews: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [m, r, rv] = await Promise.all([
          getAllMembers(),
          getAllRestaurants(),
          getAllReviews(),
        ]);

        console.log("📡 Members Response:", m);
        console.log("📡 Restaurants Response:", r);
        console.log("📡 Reviews Response:", rv);

        /**
         * ✅ axios Response / res.data / JSON 문자열
         *    모든 케이스를 통일 처리
         */
        const parseIfString = (v: any) => {
          if (typeof v !== "string") return v;
          try {
            return JSON.parse(v);
          } catch {
            return null;
          }
        };

        const unwrap = (resOrBody: any) => {
          const body = resOrBody?.data ?? resOrBody; // axios Response → body
          return parseIfString(body); // string이면 JSON.parse
        };

        const totalElements = (x: any) => {
          const body = unwrap(x); // { status, msg, data }
          return body?.data?.totalElements ?? 0;
        };

        setStats({
          members: totalElements(m),
          restaurants: totalElements(r),
          reviews: totalElements(rv),
        });
      } catch (err) {
        console.error("❌ API 요청 실패:", err);
        setStats({ members: 0, restaurants: 0, reviews: 0 });
      }
    };

    loadStats();
  }, []);

  return (
    <div className="dashboard-container">
      <Heading size="lg" mb="6">
        대시보드
      </Heading>

      {/* 📊 상단 카드 영역 */}
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap={6}
        className="dashboard-grid"
      >
        <GridItem>
          <Box className="dashboard-card members-card">
            <Flex align="center">
              <Icon as={FaUsers} className="dashboard-icon" />
              <Box ml="4">
                <Stat>
                  <StatLabel>회원 수</StatLabel>
                  <StatNumber>{stats.members}명</StatNumber>
                </Stat>
              </Box>
            </Flex>
          </Box>
        </GridItem>

        <GridItem>
          <Box className="dashboard-card restaurants-card">
            <Flex align="center">
              <Icon as={FaUtensils} className="dashboard-icon" />
              <Box ml="4">
                <Stat>
                  <StatLabel>식당 수</StatLabel>
                  <StatNumber>{stats.restaurants}개</StatNumber>
                </Stat>
              </Box>
            </Flex>
          </Box>
        </GridItem>

        <GridItem>
          <Box className="dashboard-card reviews-card">
            <Flex align="center">
              <Icon as={FaRegCommentDots} className="dashboard-icon" />
              <Box ml="4">
                <Stat>
                  <StatLabel>리뷰 수</StatLabel>
                  <StatNumber>{stats.reviews}개</StatNumber>
                </Stat>
              </Box>
            </Flex>
          </Box>
        </GridItem>
      </Grid>

      {/* 📈 중간 그래프 영역 */}
      <Grid
        templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
        gap={6}
        mt={8}
        alignItems="start"
      >
        <GridItem>
          <Box className="chart-card">
            <Flex align="center" mb={4}>
              <Icon as={FaChartBar} className="chart-icon" />
              <Text fontSize="lg" fontWeight="600" ml={2}>
                주간 방문 통계
              </Text>
            </Flex>
            <WeeklyRevenue />
          </Box>
        </GridItem>

        <GridItem>
          <Box className="chart-card">
            <Flex align="center" mb={4}>
              <Icon as={FaChartPie} className="chart-icon" />
              <Text fontSize="lg" fontWeight="600" ml={2}>
                리뷰 비율
              </Text>
            </Flex>
            <PieCard />
          </Box>
        </GridItem>
      </Grid>

      {/* 👥 하단 활동 요약 */}
      <Box mt={10}>
        <Heading size="md" mb={4}>
          최근 회원 / 식당 활동
        </Heading>
        <UserActivity />
      </Box>
    </div>
  );
}
