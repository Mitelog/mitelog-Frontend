// src/pages/admin/AdminReviewEdit.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getReviewById, updateReview } from "../../api/axiosAdmin";
import "../../styles/admin-edit.css";


export default function AdminReviewEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getReviewById(Number(id));
      setReview(res.data.data);
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReview({ ...review, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateReview(Number(id), review);
    alert("리뷰가 수정되었습니다!");
    navigate("/admin/reviews");
  };

  if (!review) return <p>로딩 중...</p>;

  return (
    <div>
      <h2>리뷰 수정</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>제목</label>
          <input
            name="title"
            value={review.title || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>내용</label>
          <textarea
            name="content"
            value={review.content || ""}
            onChange={handleChange}
          />
        </div>
        <button type="submit">저장</button>
        <button type="button" onClick={() => navigate("/admin/reviews")}>
          취소
        </button>
      </form>
    </div>
  );
}
