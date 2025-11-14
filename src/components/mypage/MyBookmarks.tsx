// src/components/mypage/MyBookmarks.tsx
import React, { useEffect, useMemo, useState } from "react";
import axiosApi from "../../api/axiosApi";
import "/src/styles/restaurantReview.css";

type RestaurantCardData = {
  id: number;
  name: string;
  image?: string;
  area?: string;
  address?: string;
  averageRating?: number;
  categoryNames?: string[];
  reservationAvailable?: boolean;
  openHours?: string[];
  averagePrice?: string;
  description?: string;
};

const PAGE_SIZE = 5; // ✅ 한 페이지 최대 개수

const MyBookmarks: React.FC = () => {
  const [items, setItems] = useState<RestaurantCardData[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ 페이징 상태
  const [page, setPage] = useState(0); // 0-based

  // 전체 페이지 수 계산
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / PAGE_SIZE)),
    [items.length]
  );

  // 데이터 로드
  useEffect(() => {
    setLoading(true);
    axiosApi
      .get("/bookmarks/me")
      .then((res) => {
        const list = Array.isArray(res.data?.data)
          ? res.data.data
          : res.data ?? [];
        setItems(list);
      })
      .catch((err) => {
        console.error("ブックマーク取得失敗:", err);
        // 401은 인터셉터에서 처리됨
      })
      .finally(() => setLoading(false));
  }, []);

  // 아이템 수가 변해서 현재 page가 범위를 넘으면 보정
  useEffect(() => {
    if (page > 0 && page >= totalPages) setPage(totalPages - 1);
  }, [page, totalPages]);

  // ✅ 현재 페이지에 보여줄 아이템
  const visible = useMemo(() => {
    const start = page * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, page]);

  if (loading)
    return <p className="loading-text">ブックマークを読み込み中...</p>;

  return (
    <div className="restaurant-review-section">
      <div className="review-header-row">
        <h3>ブックマーク</h3>
      </div>

      {items.length === 0 ? (
        <p className="no-review-text">まだブックマークがありません。</p>
      ) : (
        <>
          {/* ✅ 목록 */}
          <div className="bookmark-list">
            {visible.map((r) => {
              const ratingText =
                typeof r.averageRating === "number"
                  ? `⭐ ${r.averageRating.toFixed(1)}`
                  : "⭐ -";
              const addressLine = r.area || r.address || "住所情報なし";
              const budget = r.averagePrice || "¥3,000〜¥5,000";
              const hours = r.openHours?.length
                ? r.openHours.join(" / ")
                : "月〜金 11:30〜22:00 / 土日祝 12:00〜21:30";

              return (
                <a
                  key={r.id}
                  href={`/restaurants/${r.id}`}
                  className="bookmark-card"
                >
                  {/* 왼쪽: 이미지 */}
                  <div className="bookmark-thumb">
                    <img
                      src={
                        r.image ||
                        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&q=60&auto=format"
                      }
                      alt={r.name}
                      className="bookmark-img"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&q=60&auto=format";
                      }}
                    />
                  </div>

                  {/* 오른쪽: 정보 */}
                  <div className="bookmark-info">
                    <div className="bookmark-header">
                      <h4 className="bookmark-name">{r.name}</h4>
                      <span className="bookmark-rating">{ratingText}</span>
                    </div>
                    <p className="bookmark-address">{addressLine}</p>
                    <p className="bookmark-detail">
                      予算：{budget}　営業時間：{hours}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>

          {/* ✅ 페이지네이션 (리뷰와 동일 스타일) */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <button
                disabled={page === 0}
                onClick={() => setPage((prev) => prev - 1)}
                className="page-btn"
              >
                ◀ 前へ
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPage(idx)}
                  className={`page-btn ${page === idx ? "active" : ""}`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                disabled={page === totalPages - 1}
                onClick={() => setPage((prev) => prev + 1)}
                className="page-btn"
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

export default MyBookmarks;
