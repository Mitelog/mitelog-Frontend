import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../api/axiosApi";
import FilterSidebar from "../components/sidebar/FilterSidebar";
import "/src/styles/restaurantList.css";

/* ─────────── 안정화된 미니 캐러셀 ─────────── */
type CarouselProps = {
  images?: string[];
  size?: number; // 정사각 한 변(px)
  rounded?: number; // 모서리(px)
};

const ImageCarousel: React.FC<CarouselProps> = ({
  images,
  size = 120,
  rounded = 10,
}) => {
  const fallback =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='100%' height='100%' fill='#f0f0f0' /><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='12' fill='#999'>No Image</text></svg>"
    );
  const safe = images && images.length > 0 ? images : [fallback];

  const [idx, setIdx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);

  const next = () => setIdx((p) => (p + 1) % safe.length);
  const prev = () => setIdx((p) => (p - 1 + safe.length) % safe.length);
  const goto = (i: number) => setIdx(i);

  // 드래그 시작은 "내 트랙"에서만
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onDown = (e: TouchEvent | MouseEvent) => {
      const x =
        "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      setStartX(x);
      setDragging(true);
    };

    el.addEventListener("mousedown", onDown);
    el.addEventListener("touchstart", onDown, { passive: true });

    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("touchstart", onDown);
    };
  }, []);

  // move/up은 전역으로 받되, dragging일 때만 내 인스턴스가 처리
  useEffect(() => {
    const onMove = (e: TouchEvent | MouseEvent) => {
      if (!dragging) return;
    };

    const onUp = (e: TouchEvent | MouseEvent) => {
      if (!dragging) return;
      const x =
        "touches" in e
          ? e.changedTouches?.[0]?.clientX ?? 0
          : (e as MouseEvent).clientX;

      const dx = x - startX;
      if (dx > 40) prev();
      else if (dx < -40) next();

      setDragging(false);
      setStartX(0);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchmove", onMove as any, { passive: true });
    document.addEventListener("touchend", onUp);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onMove as any);
      document.removeEventListener("touchend", onUp);
    };
  }, [dragging, startX]);

  return (
    <div
      className="ic-wrap"
      style={{ width: size, height: size, borderRadius: rounded }}
    >
      <div
        ref={trackRef}
        className="ic-track"
        style={{ transform: `translateX(-${idx * size}px)` }}
      >
        {safe.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            loading="lazy"
            draggable={false}
            style={{
              width: size,
              height: size,
              borderRadius: rounded,
              objectFit: "cover",
            }}
          />
        ))}
      </div>

      {safe.length > 1 && (
        <>
          <button
            className="ic-arrow ic-left"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="previous"
          >
            ‹
          </button>
          <button
            className="ic-arrow ic-right"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="next"
          >
            ›
          </button>

          <div className="ic-dots" onClick={(e) => e.stopPropagation()}>
            {safe.map((_, i) => (
              <button
                key={i}
                className={`ic-dot ${i === idx ? "active" : ""}`}
                onClick={() => goto(i)}
                aria-label={`go to ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
/* ───────────────────────────────────────────── */

interface Restaurant {
  id: number;
  name: string;
  address: string;
  ownerName?: string;
  category?: string;
  averageRating?: number;
  thumbnailUrl?: string;
  images?: string[]; // ✅ 여러 장 지원
  phone?: string; // ✅ 있으면 퀵액션에서 사용
}

const RestaurantList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filters, setFilters] = useState({
    keyword: "",
    region: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const res = await axiosApi.get("/restaurants", { params: filters });
        const data = res.data.content || [];

        /* 🔥 MOCK 주입(테스트용): 이미지 없을 때 2~3장 넣기 */
        const withImages: Restaurant[] = data.map((raw: any, idx: number) => {
          const seed = raw.id ?? idx;
          const picsum = (n: number) =>
            `https://picsum.photos/seed/${seed}-${n}/240/240`;
          const injected = raw.images?.length
            ? raw.images
            : raw.thumbnailUrl
            ? [raw.thumbnailUrl, picsum(2)]
            : [picsum(1), picsum(2), picsum(3)];
          return { ...raw, images: injected };
        });

        setRestaurants(withImages);
      } catch (err) {
        console.error("식당 목록 조회 실패:", err);
        setError("データの取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, [filters]);

  /* ─────────── 퀵액션 핸들러 ─────────── */
  const buildDetailUrl = (id: number) => `${location.origin}/restaurants/${id}`;
  const handleShare = async (e: React.MouseEvent, r: Restaurant) => {
    e.stopPropagation();
    const url = buildDetailUrl(r.id);
    try {
      if (navigator.share) {
        await navigator.share({ title: r.name, text: r.address, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("링크가 클립보드에 복사되었습니다.");
      }
    } catch {
      // 사용자가 공유 취소 등
    }
  };

  const handleMap = (e: React.MouseEvent, r: Restaurant) => {
    e.stopPropagation();
    const q = encodeURIComponent(r.address || r.name);
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${q}`;
    window.open(mapUrl, "_blank", "noopener,noreferrer");
  };

  // 전화는 <a href="tel:...">가 가장 호환성이 좋음 (아래 JSX에서 처리)

  return (
    <div className="restaurant-page">
      {/* 왼쪽 필터 */}
      <FilterSidebar
        onFilterChange={(patch) => setFilters((cur) => ({ ...cur, ...patch }))}
      />

      {/* 오른쪽 메인 */}
      <main className="restaurant-main">
        <div className="list-header">
          <h2 className="page-title" style={{ margin: 0 }}>
            レストラン一覧
          </h2>
          {isLoggedIn && (
            <button
              className="btn-soft hover-grow"
              onClick={() => navigate("/restaurants/new")}
            >
              <span className="label">➕ 新しいレストランを登録</span>
            </button>
          )}
        </div>

        {loading && (
          <div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ marginBottom: 16 }} />
            ))}
          </div>
        )}

        {!loading && error && <p className="error">{error}</p>}

        {!loading &&
          !error &&
          (restaurants.length === 0 ? (
            <div
              style={{
                padding: 28,
                textAlign: "center",
                border: "1px dashed rgba(0,0,0,.12)",
                borderRadius: 16,
                background: "linear-gradient(180deg,#fff,#fafafa)",
              }}
            >
              該当するレストランが見つかりません。
            </div>
          ) : (
            <ul className="restaurant-list">
              {restaurants.map((r) => (
                <li
                  key={r.id}
                  className="restaurant-card hover-grow"
                  onClick={() => navigate(`/restaurants/${r.id}`)}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: 14,
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  {/* 썸네일 캐러셀 */}
                  <ImageCarousel
                    key={r.id}
                    images={r.images}
                    size={120}
                    rounded={10}
                  />

                  {/* ✅ 호버 시 퀵액션 */}
                  <div
                    className="quick-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* 전화 (전화번호 있는 경우만 노출) */}
                    {r.phone && (
                      <a
                        className="qa-btn"
                        href={`tel:${r.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="전화 걸기"
                        title="전화"
                      >
                        📞
                      </a>
                    )}

                    {/* 지도 열기 */}
                    <button
                      className="qa-btn"
                      onClick={(e) => handleMap(e, r)}
                      aria-label="지도에서 보기"
                      title="지도"
                    >
                      🗺️
                    </button>

                    {/* 공유하기 */}
                    <button
                      className="qa-btn"
                      onClick={(e) => handleShare(e, r)}
                      aria-label="공유하기"
                      title="공유"
                    >
                      🔗
                    </button>
                  </div>

                  <div
                    className="restaurant-info"
                    style={{ flex: 1, minWidth: 0 }}
                  >
                    <h3
                      className="restaurant-name"
                      style={{ margin: "2px 0 6px", fontWeight: 700 }}
                    >
                      {r.name}
                    </h3>
                    <p
                      className="restaurant-address"
                      style={{ margin: 0, color: "#666" }}
                    >
                      {r.address}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        marginTop: 6,
                        flexWrap: "wrap",
                      }}
                    >
                      {r.category && (
                        <span
                          style={{
                            fontSize: 12,
                            padding: "4px 10px",
                            border: "1px solid rgba(0,0,0,.12)",
                            borderRadius: 999,
                            background: "#fff",
                          }}
                        >
                          カテゴリ: {r.category}
                        </span>
                      )}
                      {typeof r.averageRating === "number" && (
                        <span
                          style={{
                            fontSize: 12,
                            padding: "4px 10px",
                            border: "1px solid rgba(0,0,0,.12)",
                            borderRadius: 999,
                            background: "#fff",
                          }}
                        >
                          ⭐ {r.averageRating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ))}
      </main>
    </div>
  );
};

export default RestaurantList;
