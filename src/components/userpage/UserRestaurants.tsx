import React, { useEffect, useState } from "react";
import "/src/styles/restaurantReview.css";

interface Restaurant {
  id: number;
  name: string;
  area?: string;
  address?: string;
  image?: string;
  averageRating?: number;
}

const UserRestaurants: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    setLoading(true);

    // ✅ 더미 식당 데이터
    const dummy = [
      {
        id: 1,
        name: "김인태 라멘",
        area: "대구 남구",
        address: "대구 남구 중앙대로 123",
        image:
          "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&q=80",
        averageRating: 4.8,
      },
      {
        id: 2,
        name: "소바노야",
        area: "서울 강남",
        address: "서울 강남구 봉은사로 321",
        image:
          "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&q=80",
        averageRating: 4.3,
      },
    ];

    setTimeout(() => {
      setRestaurants(dummy);
      setTotalPages(Math.ceil(dummy.length / pageSize));
      setLoading(false);
    }, 300);
  }, [page]);

  if (loading) return <p className="loading-text">読み込み中...</p>;

  return (
    <div className="restaurant-review-section">
      <div className="review-header-row">
        <h3>登録店舗</h3>
      </div>

      {restaurants.length === 0 ? (
        <p className="no-review-text">登録された店舗はありません。</p>
      ) : (
        <div className="bookmark-list">
          {restaurants.map((r) => (
            <a
              key={r.id}
              href={`/restaurants/${r.id}`}
              className="bookmark-card"
            >
              <div className="bookmark-thumb">
                <img src={r.image} alt={r.name} className="bookmark-img" />
              </div>
              <div className="bookmark-info">
                <div className="bookmark-header">
                  <h4 className="bookmark-name">{r.name}</h4>
                  <span className="bookmark-rating">⭐ {r.averageRating}</span>
                </div>
                <p className="bookmark-address">{r.address}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserRestaurants;
