import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllMembers, deleteMember } from "../../api/axiosAdmin";
import {
  Box,
  Flex,
  Heading,
  Input,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import "../../styles/admin-table.css";

export default function AdminMembers() {
  const [members, setMembers] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("name");
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const res = await getAllMembers({ page, size: 10, type, keyword });
      const { content, totalPages } = res.data.data;
      setMembers(content);
      setTotalPages(totalPages);
    } catch (err) {
      console.error("회원 목록 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [page]);

  const handleSearch = () => {
    setPage(0);
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    await deleteMember(id);
    loadData();
  };

  return (
    <Box className="admin-page">
      <Heading size="lg" mb={6}>
        회원 관리
      </Heading>

      {/* 🔍 검색 */}
      <Flex gap={3} mb={6} align="center">
        <Select
          w="150px"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="name">이름</option>
          <option value="email">이메일</option>
          <option value="phone">전화번호</option>
          <option value="id">ID</option>
        </Select>

        <Input
          placeholder="검색어 입력"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          w="250px"
        />

        <Button colorScheme="blue" onClick={handleSearch}>
          검색
        </Button>
      </Flex>

      {/* 📋 회원 테이블 */}
      <TableContainer borderRadius="12px" boxShadow="md" bg="#fff">
        <Table variant="simple">
          <Thead bg="#f7f7f7">
            <Tr>
              <Th>ID</Th>
              <Th>이름</Th>
              <Th>이메일</Th>
              <Th>전화번호</Th>
              <Th textAlign="center">관리</Th>
            </Tr>
          </Thead>
          <Tbody>
            {members.map((m) => (
              <Tr key={m.id}>
                <Td>{m.id}</Td>
                <Td>{m.name}</Td>
                <Td>{m.email}</Td>
                <Td>{m.phone}</Td>
                <Td textAlign="center">
                  <Button
                    size="sm"
                    colorScheme="purple"
                    mr={2}
                    onClick={() => navigate(`/admin/members/${m.id}/edit`)}
                  >
                    수정
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDelete(m.id)}
                  >
                    삭제
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* 📄 페이지네이션 */}
      <Flex justify="center" mt={6} gap={2}>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            size="sm"
            variant={page === i ? "solid" : "outline"}
            colorScheme="blue"
            onClick={() => setPage(i)}
          >
            {i + 1}
          </Button>
        ))}
      </Flex>
    </Box>
  );
}
