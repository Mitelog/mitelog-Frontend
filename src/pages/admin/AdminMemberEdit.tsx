import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMemberById, updateMember } from "../../api/axiosAdmin";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Heading,
} from "@chakra-ui/react";
import "../../styles/admin-edit.css";

export default function AdminMemberEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState<any>(null);

  useEffect(() => {
    const fetchMember = async () => {
      const res = await getMemberById(Number(id));
      setMember(res.data.data);
    };
    fetchMember();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMember(Number(id), member);
    alert("회원 정보가 수정되었습니다!");
    navigate("/admin/members");
  };

  if (!member) return <p>로딩 중...</p>;

  return (
    <Box className="admin-edit-container">
      <Heading size="lg" mb={6}>
        회원 수정
      </Heading>
      <Box
        as="form"
        onSubmit={handleSubmit}
        bg="#fff"
        p={6}
        borderRadius="12px"
        boxShadow="md"
        w="400px"
      >
        <FormControl mb={4}>
          <FormLabel>이름</FormLabel>
          <Input
            name="name"
            value={member.name || ""}
            onChange={handleChange}
            placeholder="이름"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>전화번호</FormLabel>
          <Input
            name="phone"
            value={member.phone || ""}
            onChange={handleChange}
            placeholder="전화번호"
          />
        </FormControl>

        <Flex justify="flex-end" mt={4} gap={3}>
          <Button colorScheme="purple" type="submit">
            저장
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin/members")}>
            취소
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
