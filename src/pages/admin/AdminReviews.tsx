import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllReviews, deleteReview } from "../../api/axiosAdmin";

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("title");
  const navigate = useNavigate();

  const loadData = async () => {
    const res = await getAllReviews({ page, size: 10, type, keyword });
    const { content, totalPages } = res.data.data;
    setReviews(content);
    setTotalPages(totalPages);
  };

  useEffect(() => {
    loadData();
  }, [page]);

  const handleSearch = () => {
    setPage(0);
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("리뷰를 삭제하시겠습니까?")) return;
    await deleteReview(id);
    loadData();
  };

  return (
    <div className="admin-container">
      <h2>리뷰 관리</h2>

      <div className="search-bar">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="title">제목</option>
          <option value="email">작성자 이메일</option>
          <option value="id">ID</option>
        </select>
        <input
          placeholder="검색어 입력"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={handleSearch}>검색</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>제목</th>
            <th>작성자</th>
            <th>별점</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((rv) => (
            <tr key={rv.id}>
              <td>{rv.id}</td>
              <td>{rv.title}</td>
              <td>{rv.member?.email}</td>
              <td>{rv.rating}</td>
              <td>
                {/* ✏️ 수정 버튼 */}
                <button onClick={() => navigate(`/admin/reviews/${rv.id}/edit`)}>
                  수정
                </button>

                {/* 🗑 삭제 버튼 */}
                <button onClick={() => handleDelete(rv.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
