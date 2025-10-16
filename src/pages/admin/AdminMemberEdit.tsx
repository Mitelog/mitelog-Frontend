// src/pages/admin/AdminMemberEdit.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMemberById, updateMember } from "../../api/axiosAdmin";

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
    <div>
      <h2>회원 수정</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이름</label>
          <input
            name="name"
            value={member.name || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>전화번호</label>
          <input
            name="phone"
            value={member.phone || ""}
            onChange={handleChange}
          />
        </div>
        <button type="submit">저장</button>
        <button type="button" onClick={() => navigate("/admin/members")}>
          취소
        </button>
      </form>
    </div>
  );
}
