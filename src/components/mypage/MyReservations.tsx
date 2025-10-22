import React, { useMemo, useState } from "react";
import "../restaurant_detail/restaurantReview.css";
import { useNavigate } from "react-router-dom";

type ReservationStatus = "確定" | "保留" | "キャンセル";

type Reservation = {
  id: number;
  restaurantId: number;
  restaurantName: string;
  date: string;
  time: string;
  people: number;
  request?: string;
  status: ReservationStatus;
  createdAt: string;
  image?: string;
};

const MOCK: Reservation[] = [
  {
    id: 1003,
    restaurantId: 11,
    restaurantName: "재환",
    date: "2025-11-10",
    time: "19:00",
    people: 4,
    request: "誕生日ケーキの持ち込み可否を確認したいです。",
    status: "キャンセル",
    createdAt: "2025-10-18T20:03:00",
  },
  {
    id: 1002,
    restaurantId: 8,
    restaurantName: "인태집",
    date: "2025-11-05",
    time: "12:00",
    people: 3,
    status: "保留",
    createdAt: "2025-10-21T09:22:00",
  },
  {
    id: 1001,
    restaurantId: 6,
    restaurantName: "가게이름",
    date: "2025-11-02",
    time: "18:30",
    people: 2,
    request: "窓側の席をお願いします。",
    status: "確定",
    createdAt: "2025-10-20T12:10:00",
  },
];

const statusChip = (s: ReservationStatus) =>
  s === "確定"
    ? "chip status-ok"
    : s === "保留"
    ? "chip status-pending"
    : "chip status-cancel";

const dtKey = (r: Reservation) => `${r.date} ${r.time}`;
const PAGE_SIZE = 5;

const MyReservations: React.FC = () => {
  const navigate = useNavigate();

  const sorted = useMemo(
    () => [...MOCK].sort((a, b) => (dtKey(a) < dtKey(b) ? 1 : -1)),
    []
  );
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const visible = useMemo(
    () => sorted.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [sorted, page]
  );

  const fallback =
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&q=60&auto=format";

  return (
    <div className="restaurant-review-section">
      <div className="review-header-row">
        <h3>私の予約</h3>
      </div>

      {sorted.length === 0 ? (
        <p className="no-review-text">予約履歴はありません。</p>
      ) : (
        <>
          <div className="bookmark-list">
            {visible.map((rv) => {
              const created = new Date(rv.createdAt).toLocaleString("ja-JP");

              return (
                <div
                  key={rv.id}
                  className="bookmark-card reservation-card link-card"
                  onClick={() => navigate(`/restaurants/${rv.restaurantId}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      navigate(`/restaurants/${rv.restaurantId}`);
                  }}
                >
                  {/* 왼쪽 컬럼: 썸네일 + 작성일 */}
                  <div className="thumb-col">
                    <div className="bookmark-thumb">
                      <img
                        src={rv.image || fallback}
                        alt={rv.restaurantName}
                        className="bookmark-img"
                      />
                    </div>
                    <span className="chip created-under">作成：{created}</span>
                  </div>

                  {/* 본문 */}
                  <div className="bookmark-info">
                    <div className="bookmark-header">
                      <h4 className="bookmark-name">{rv.restaurantName}</h4>
                      <span className={`status-badge ${statusChip(rv.status)}`}>
                        {rv.status}
                      </span>
                    </div>

                    <p className="rv-when">
                      🗓️ {rv.date} {rv.time} <span className="dot">•</span> 👥{" "}
                      {rv.people}名
                    </p>

                    {rv.request && rv.request.trim().length > 0 && (
                      <p className="bookmark-detail" title={rv.request}>
                        ✍️ リクエスト：{rv.request}
                      </p>
                    )}

                    {/* 하단: 오른쪽 취소 버튼만 */}
                    <div className="reservation-footer">
                      {rv.status !== "キャンセル" && (
                        <button
                          className="btn-soft cancel-btn-inline"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`予約 #${rv.id} をキャンセルします。`);
                          }}
                        >
                          予約を取り消す
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="pagination-container" style={{ marginTop: 12 }}>
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

export default MyReservations;
