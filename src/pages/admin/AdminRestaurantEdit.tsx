// src/pages/admin/AdminRestaurantEdit.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRestaurantById, updateRestaurant } from "../../api/axiosAdmin";
import "../../styles/admin-edit.css";


export default function AdminRestaurantEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getRestaurantById(Number(id));
      setRestaurant(res.data.data);
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRestaurant({ ...restaurant, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateRestaurant(Number(id), restaurant);
    alert("식당 정보가 수정되었습니다!");
    navigate("/admin/restaurants");
  };

  if (!restaurant) return <p>로딩 중...</p>;

  return (
    <div>
      <h2>식당 수정</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>식당명</label>
          <input
            name="name"
            value={restaurant.name || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>주소</label>
          <input
            name="address"
            value={restaurant.address || ""}
            onChange={handleChange}
          />
        </div>
        <button type="submit">저장</button>
        <button type="button" onClick={() => navigate("/admin/restaurants")}>
          취소
        </button>
      </form>
    </div>
  );
}
