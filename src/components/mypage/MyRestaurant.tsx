import React, { useEffect, useMemo, useState } from "react";
import axiosApi from "../../api/axiosApi";
import "/src/styles/restaurantReview.css";
import { useNavigate } from "react-router-dom";

interface Restaurant {
  id: number;
  name: string;
  area?: string;
  address?: string;
  image?: string;
  averageRating?: number;

}

/** 백 ReservationResponse 기준 */
type Reservation = {
  id: number;
  restaurantId: number;
  memberId: number;
  visit: string; // "YYYY-MM-DDTHH:mm:ss"
  numPeople: number;
};

/** /api/members/{id}/public 응답 (필드는 프로젝트에 맞게 name/nickname 중 존재하는 걸 사용) */
type MemberPublic = {
  id: number;
  name?: string | null;
  nickname?: string | null;
};

function splitVisit(visit: string) {
  const [date, t] = visit.split("T");
  const time = (t || "00:00:00").slice(0, 5);
  return { date, time };
}

const MyRestaurant: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;
  const navigate = useNavigate();

  // ✅ 모달 상태
  const [open, setOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  // ✅ 예약 목록 상태
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);
  const [reservationsError, setReservationsError] = useState<string | null>(null);

  // ✅ memberId -> 이름 매핑
  const [memberNameMap, setMemberNameMap] = useState<Record<number, string>>({});

  const fallback =
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&q=60&auto=format";

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

  // ✅ 예약 + 예약자 이름 같이 불러오기(백 수정 없이 public API 사용)
  const fetchReservationsByRestaurant = async (restaurantId: number) => {
    setReservationsLoading(true);
    setReservationsError(null);

    try {
      // 1) 예약 조회
      const res = await axiosApi.get(`/reservations/restaurant/${restaurantId}`);
      const list: Reservation[] = res.data?.data ?? res.data ?? [];
      setReservations(Array.isArray(list) ? list : []);

      // 2) memberId 중복 제거
      const memberIds = Array.from(new Set((list || []).map((r) => r.memberId)));

      // 3) public profile 병렬 호출
      const memberResponses = await Promise.all(
        memberIds.map((id) =>
          axiosApi
            .get(`/members/${id}/public`)
            .then((r) => (r.data?.data ?? r.data) as MemberPublic)
            .catch(() => null)
        )
      );

      // 4) memberId -> 이름 매핑
      const map: Record<number, string> = {};
      memberResponses.forEach((m) => {
        if (!m || typeof m.id !== "number") return;
        map[m.id] = m.nickname || m.name || `회원#${m.id}`;
      });
      setMemberNameMap(map);
    } catch (e: any) {
      console.error("❌ 予約取得失敗:", e);
      setReservationsError(e?.response?.data?.message || "予約一覧の取得に失敗しました。");
      setReservations([]);
      setMemberNameMap({});
    } finally {
      setReservationsLoading(false);
    }
  };

  // ✅ 모달 열기
  const openReservationsModal = async (r: Restaurant) => {
    setSelectedRestaurant(r);
    setOpen(true);
    await fetchReservationsByRestaurant(r.id);
  };

  // ✅ 예약 취소
  const cancelReservation = async (reservationId: number) => {
    if (!selectedRestaurant) return;

    const ok = window.confirm(`予約 #${reservationId} をキャンセルしますか？`);
    if (!ok) return;

    try {
      await axiosApi.delete(`/reservations/${reservationId}`);

      // UI 반영(삭제)
      setReservations((prev) => prev.filter((x) => x.id !== reservationId));
      alert("キャンセルしました。");
    } catch (e: any) {
      console.error("❌ キャンセル失敗:", e);
      alert(e?.response?.data?.message || "キャンセルに失敗しました。(権限/認証確認)");
    }
  };

  // ✅ 모달 닫기
  const closeModal = () => {
    setOpen(false);
    setSelectedRestaurant(null);
    setReservations([]);
    setMemberNameMap({});
    setReservationsError(null);
  };

  // ESC로 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const sortedReservations = useMemo(() => {
    return [...reservations].sort((a, b) => (a.visit < b.visit ? 1 : -1));
  }, [reservations]);

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
              const addressLine = r.address?.trim() || r.area || "住所情報なし";
              const rating =
                typeof r.averageRating === "number"
                  ? r.averageRating.toFixed(1)
                  : "0.0";

              return (
                <div key={r.id} className="bookmark-card" style={{ position: "relative" }}>
                  {/* 카드 클릭 이동 */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/restaurants/${r.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        navigate(`/restaurants/${r.id}`);
                    }}
                    style={{ display: "flex", gap: 12, width: "100%" }}
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
                    <div className="bookmark-info" style={{ flex: 1 }}>
                      <div className="bookmark-header">
                        <h4 className="bookmark-name">{r.name}</h4>
                        <span className="bookmark-rating">⭐ {rating}</span>
                      </div>

                      <p className="bookmark-address" title={addressLine}>
                        {addressLine}
                      </p>
                    </div>
                  </div>

                  {/* ✅ 예약 보기 버튼 */}
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                    <button
                      className="btn-soft hover-grow"
                      onClick={(e) => {
                        e.stopPropagation(); // 카드 이동 막기
                        openReservationsModal(r);
                      }}
                    >
                      予約を見る
                    </button>
                  </div>
                </div>
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

      {/* =========================
          ✅ MODAL
      ========================= */}
      {open && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">
                  予約一覧 {selectedRestaurant ? `- ${selectedRestaurant.name}` : ""}
                </h3>
              </div>

              <button className="btn-soft" onClick={closeModal}>
                ✕ 閉じる
              </button>
            </div>

            <div style={{ marginTop: 12 }}>
              <button
                className="btn-soft hover-grow"
                onClick={() =>
                  selectedRestaurant && fetchReservationsByRestaurant(selectedRestaurant.id)
                }
                disabled={reservationsLoading}
              >
                🔄 再読み込み
              </button>
            </div>

            <div style={{ marginTop: 14 }}>
              {reservationsLoading && <p className="loading-text">読み込み中...</p>}

              {reservationsError && (
                <p className="no-review-text" style={{ color: "#ef4444" }}>
                  {reservationsError}
                </p>
              )}

              {!reservationsLoading && !reservationsError && sortedReservations.length === 0 && (
                <p className="no-review-text">この店舗の予約はありません。</p>
              )}

              {!reservationsLoading && sortedReservations.length > 0 && (
                <div className="reservation-list">
                  {sortedReservations.map((rv) => {
                    const { date, time } = splitVisit(rv.visit);
                    const memberName = memberNameMap[rv.memberId] ?? `회원#${rv.memberId}`;

                    return (
                      <div key={rv.id} className="reservation-row">
                        <div className="reservation-info">
                          <div className="reservation-main">
                            🗓️ {date} {time} ・ 👥 {rv.numPeople}名
                          </div>
                          <div className="reservation-sub">
                            🙍 {memberName}{" "}
                            <span style={{ opacity: 0.6 }}>(memberId: {rv.memberId})</span>
                          </div>
                        </div>

                        <button
                          className="btn-soft cancel-btn-inline"
                          onClick={() => cancelReservation(rv.id)}
                        >
                          予約を取り消す
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRestaurant;
