import React, { useEffect, useState } from "react";
import axiosApi from "../../api/axiosApi";
import "/src/styles/restaurantReview.css"; // 북마크/리뷰 공용 CSS
import { useNavigate } from "react-router-dom";

interface Restaurant {
  id: number;
  name: string;
  area?: string;
  address?: string;
  image?: string;
  averageRating?: number;
}

const MyRestaurant: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;
  const navigate = useNavigate();

  const fetchMyRestaurants = async (pageNum = 0) => {
    try {
      const res = await axiosApi.get("/restaurants/my-restaurants", {
        params: { page: pageNum, size: pageSize },
      });
      const pageData = res.data?.data || res.data;
      setRestaurants(pageData?.content || []);
      setTotalPages(pageData?.totalPages ?? 1);
    } catch (err) {
      console.error("❌ マイ店舗の取得に失敗:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRestaurants(page);
  }, [page]);

  if (loading) return <p className="loading-text">読み込み中...</p>;

  return (
    <div className="restaurant-review-section">
      {/* 상단 헤더 */}
      <div className="review-header-row">
        <h3>私のレストラン</h3>
        <button
          className="btn-soft hover-grow"
          onClick={() => navigate("/restaurants/new")}
        >
          ＋ 店舗を追加
        </button>
      </div>

      {/* 목록 */}
      {restaurants.length === 0 ? (
        <p className="no-review-text">登録された店舗はありません。</p>
      ) : (
        <>
          <div className="bookmark-list">
            {restaurants.map((r) => {
              const fallback =
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&q=60&auto=format";
              const addressLine = r.address?.trim() || r.area || "住所情報なし";
              const rating =
                typeof r.averageRating === "number"
                  ? r.averageRating.toFixed(1)
                  : "0.0";

              return (
                <a
                  key={r.id}
                  href={`/restaurants/${r.id}`}
                  className="bookmark-card"
                >
                  {/* 썸네일 */}
                  <div className="bookmark-thumb">
                    <img
                      src={r.image || fallback}
                      alt={r.name}
                      className="bookmark-img"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = fallback;
                      }}
                    />
                  </div>

                  {/* 내용 */}
                  <div className="bookmark-info">
                    {/* 이름 + 평점 */}
                    <div className="bookmark-header">
                      <h4 className="bookmark-name">{r.name}</h4>
                      <span className="bookmark-rating">⭐ {rating}</span>
                    </div>

                    {/* 주소 */}
                    <p
                      className="bookmark-address"
                      title={addressLine} // ← 마우스 올리면 전체 주소 툴팁
                    >
                      {addressLine}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <button
                className="page-btn"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                ◀ 前へ
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`page-btn ${page === i ? "active" : ""}`}
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="page-btn"
                disabled={page === totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                次へ ▶
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyRestaurant;
