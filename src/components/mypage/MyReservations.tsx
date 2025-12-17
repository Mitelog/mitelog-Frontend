import React, { useEffect, useMemo, useState } from "react";
import "/src/styles/restaurantReview.css";
import { useNavigate } from "react-router-dom";
import axiosApi from "../../api/axiosApi";

/* =========================
   Types
========================= */
type ReservationStatus = "確定" | "保留" | "キャンセル";

type ApiReservation = {
  id: number;
  restaurantId: number;
  memberId: number;
  visit: string;     // "YYYY-MM-DDTHH:mm:ss"
  numPeople: number;
};

type RestaurantApi = {
  id: number;
  name: string;
  image: string | null;
};

type ReservationVM = {
  id: number;
  restaurantId: number;
  restaurantName: string;
  date: string;  // YYYY-MM-DD
  time: string;  // HH:mm
  people: number;
  status: ReservationStatus;
  createdAt: string;
  image?: string;
};

/* =========================
   Utils
========================= */
const PAGE_SIZE = 5;

const statusChip = (s: ReservationStatus) =>
  s === "確定"
    ? "chip status-ok"
    : s === "保留"
    ? "chip status-pending"
    : "chip status-cancel";

const dtKey = (r: ReservationVM) => `${r.date} ${r.time}`;

function splitVisit(visit: string) {
  const [date, t] = visit.split("T");
  const time = (t || "00:00:00").slice(0, 5);
  return { date, time };
}

/* =========================
   Component
========================= */
const MyReservations: React.FC = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState<ReservationVM[]>([]);
  const [restaurantMap, setRestaurantMap] = useState<
    Record<number, { name: string; image?: string }>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);

  const fallback =
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&q=60&auto=format";

  /* =========================
     1) 예약 목록 조회
  ========================= */
  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError(null);

      try {
        // ✅ 인증 필요
        const res = await axiosApi.get<ApiReservation[]>("/reservations/me");
        const list = res.data ?? [];

        const vm: ReservationVM[] = list.map((r) => {
          const { date, time } = splitVisit(r.visit);
          return {
            id: r.id,
            restaurantId: r.restaurantId,
            restaurantName: `Restaurant #${r.restaurantId}`, // 임시 → 아래에서 채움
            date,
            time,
            people: r.numPeople,
            status: "確定",        // 백에 status 없으므로 기본값
            createdAt: r.visit,    // createdAt 없어서 visit 사용
            image: undefined,
          };
        });

        setRows(vm);

        /* =========================
           2) 필요한 식당 정보만 추가 조회
        ========================= */
        const ids = Array.from(new Set(vm.map((x) => x.restaurantId)));
        const need = ids.filter((id) => !restaurantMap[id]);

        if (need.length > 0) {
          const results = await Promise.all(
            need.map(async (id) => {
              try {
                const rr = await axiosApi.get<RestaurantApi>(`/restaurants/${id}`);
                const data = rr.data;
                return {
                  id,
                  name: data?.name ?? `Restaurant #${id}`,
                  image: data?.image ?? undefined,
                };
              } catch {
                return { id, name: `Restaurant #${id}`, image: undefined };
              }
            })
          );

          setRestaurantMap((prev) => {
            const next = { ...prev };
            results.forEach((r) => {
              next[r.id] = { name: r.name, image: r.image };
            });
            return next;
          });
        }
      } catch (e: any) {
        setError(e?.response?.data?.message || "予約一覧の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================
     3) 식당 정보 반영
  ========================= */
  useEffect(() => {
    if (rows.length === 0) return;

    setRows((prev) =>
      prev.map((r) => {
        const info = restaurantMap[r.restaurantId];
        if (!info) return r;
        return {
          ...r,
          restaurantName: info.name,
          image: info.image,
        };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantMap]);

  /* =========================
     Sorting & Pagination
  ========================= */
  const sorted = useMemo(
    () => [...rows].sort((a, b) => (dtKey(a) < dtKey(b) ? 1 : -1)),
    [rows]
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const visible = useMemo(
    () => sorted.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [sorted, page]
  );

  useEffect(() => {
    if (page > totalPages - 1) setPage(0);
  }, [totalPages, page]);

  /* =========================
     4) 예약 취소
  ========================= */
  const cancelReservation = async (reservationId: number) => {
    if (!window.confirm(`予約 #${reservationId} をキャンセルしますか？`)) return;

    try {
      await axiosApi.delete(`/reservations/${reservationId}`);
      setRows((prev) =>
        prev.map((r) =>
          r.id === reservationId ? { ...r, status: "キャンセル" } : r
        )
      );
      alert("キャンセルしました。");
    } catch (e: any) {
      alert(
        e?.response?.data?.message ||
          "キャンセルに失敗しました。(認証/権限/サーバー確認)"
      );
    }
  };

  /* =========================
     Render
  ========================= */
  if (loading) return <p className="no-review-text">読み込み中...</p>;
  if (error) return <p className="no-review-text">{error}</p>;

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
                  {/* Left */}
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

                  {/* Body */}
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

                    <div className="reservation-footer">
                      {rv.status !== "キャンセル" && (
                        <button
                          className="btn-soft cancel-btn-inline"
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelReservation(rv.id);
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
