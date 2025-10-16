import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRestaurants, deleteRestaurant } from "../../api/axiosAdmin";

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("name");
  const navigate = useNavigate();

  const loadData = async () => {
    const res = await getAllRestaurants({ page, size: 10, type, keyword });
    const { content, totalPages } = res.data.data;
    setRestaurants(content);
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
    if (!window.confirm("식당을 삭제하시겠습니까?")) return;
    await deleteRestaurant(id);
    loadData();
  };

  return (
    <div className="admin-container">
      <h2>식당 관리</h2>

      <div className="search-bar">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="name">이름</option>
          <option value="address">주소</option>
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
            <th>식당명</th>
            <th>주소</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>{r.address}</td>
              <td>
                {/* ✏️ 수정 버튼 */}
                <button onClick={() => navigate(`/admin/restaurants/${r.id}/edit`)}>
                  수정
                </button>

                {/* 🗑 삭제 버튼 */}
                <button onClick={() => handleDelete(r.id)}>삭제</button>
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
