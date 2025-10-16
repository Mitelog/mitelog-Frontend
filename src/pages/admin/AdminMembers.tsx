import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllMembers, deleteMember } from "../../api/axiosAdmin";

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
    <div className="admin-container">
      <h2>회원 관리</h2>

      {/* 🔍 검색창 */}
      <div className="search-bar">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="name">이름</option>
          <option value="email">이메일</option>
          <option value="phone">전화번호</option>
          <option value="id">ID</option>
        </select>
        <input
          placeholder="검색어 입력"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={handleSearch}>검색</button>
      </div>

      {/* 📋 회원 테이블 */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>이메일</th>
            <th>전화번호</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td>{m.phone}</td>
              <td>
                {/* ✏️ 수정 버튼 */}
                <button onClick={() => navigate(`/admin/members/${m.id}/edit`)}>
                  수정
                </button>

                {/* 🗑 삭제 버튼 */}
                <button onClick={() => handleDelete(m.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📄 페이지네이션 */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={page === i ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
