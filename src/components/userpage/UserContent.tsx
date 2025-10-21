import React, { useEffect, useState } from "react";
import axiosApi from "../../api/axiosApi";

interface Restaurant {
  id: number;
  name: string;
  address: string;
  thumbnail?: string | null;
}

interface Review {
  id: number;
  title: string;
  content: string;
  rating: number;
}

interface Bookmark {
  id: number;
  name: string;
  address: string;
  image?: string | null;
  averageRating?: number;
}

interface Props {
  activeTab: "review" | "restaurant" | "bookmark" | "reservation";
}

const UserContent: React.FC<Props> = ({ activeTab }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);

  const userId = window.location.pathname.split("/").pop(); // /users/:id

  useEffect(() => {
    if (!userId) return;

    setLoading(true);

    if (activeTab === "restaurant") {
      axiosApi
        .get(`/members/${userId}/restaurants`)
        .then((res) => {
          const data = res.data.data ?? res.data;
          setRestaurants(data);
        })
        .catch((err) => {
          console.error("❌ 등록 가게 목록 불러오기 실패:", err);
        })
        .finally(() => setLoading(false));
    }

    if (activeTab === "review") {
      axiosApi
        .get(`/members/${userId}/reviews`)
        .then((res) => {
          const data = res.data.data ?? res.data;
          setReviews(data);
        })
        .catch((err) => {
          console.error("❌ 리뷰 목록 불러오기 실패:", err);
        })
        .finally(() => setLoading(false));
    }

    if (activeTab === "bookmark") {
      axiosApi
        .get(`/members/${userId}/bookmarks`)
        .then((res) => {
          const data = res.data.data ?? res.data;
          setBookmarks(data);
        })
        .catch((err) => {
          console.error("❌ 북마크 목록 불러오기 실패:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [activeTab, userId]);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="user-content">
      {/* ✅ 리뷰 목록 */}
      {activeTab === "review" && (
        <div className="review-list">
          {reviews.length > 0 ? (
            reviews.map((r) => (
              <div key={r.id} className="review-card">
                <h3>{r.title}</h3>
                <p>{r.content}</p>
                <span>⭐ {r.rating}</span>
              </div>
            ))
          ) : (
            <p>작성한 리뷰가 없습니다。</p>
          )}
        </div>
      )}

      {/* ✅ 등록 가게 목록 */}
      {activeTab === "restaurant" && (
        <div className="restaurant-list">
          {restaurants.length > 0 ? (
            restaurants.map((rest) => (
              <div key={rest.id} className="restaurant-card">
                <img
                  src={rest.thumbnail || "/no-image.png"}
                  alt={rest.name}
                  className="restaurant-thumb"
                />
                <div className="restaurant-info">
                  <h3>{rest.name}</h3>
                  <p>{rest.address}</p>
                </div>
              </div>
            ))
          ) : (
            <p>登録した店舗がありません。</p>
          )}
        </div>
      )}

      {/* ✅ 북마크 목록 */}
      {activeTab === "bookmark" && (
        <div className="bookmark-list">
          {bookmarks.length > 0 ? (
            bookmarks.map((b) => (
              <div key={b.id} className="bookmark-card">
                <img
                  src={b.image || "/no-image.png"}
                  alt={b.name}
                  className="bookmark-thumb"
                />
                <div>
                  <h3>{b.name}</h3>
                  <p>{b.address}</p>
                  {b.averageRating !== undefined && (
                    <p>⭐ {b.averageRating.toFixed(1)}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>ブックマークがありません。</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserContent;
