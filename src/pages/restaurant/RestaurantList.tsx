import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosApi from "../../api/axiosApi";
import FilterSidebar, {
  RestaurantListFilters,
} from "../../components/sidebar/FilterSidebar";
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
  area?: string;

  image?: string | null;
  categoryNames?: string[];
  averageRating?: number | null;
  phone?: string | null;

  // UI용
  images?: string[];
}

const RestaurantList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchParams] = useSearchParams();
  const keywordFromUrl = (searchParams.get("keyword") ?? "").trim();

  // ✅ 서버 DTO 키와 동일한 filters
  const [filters, setFilters] = useState<RestaurantListFilters>({
    keyword: "",
    area: "",
    category: "",
  });

  // ✅ URL의 keyword를 filters.keyword에 반영 (메인 검색 연동)
  useEffect(() => {
    if (keywordFromUrl === filters.keyword) return;

    setFilters((cur) => ({
      ...cur,
      keyword: keywordFromUrl,
    }));
  }, [keywordFromUrl]);

  // ✅ 페이징
  const [page, setPage] = useState(0); // 0-based
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("accessToken");

  // ✅ 필터가 바뀌면 page=0
  useEffect(() => {
    setPage(0);
  }, [filters]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);

      try {
        // ✅ 서버가 받는 형태로 params 구성
        const params: any = {
          page,
          size,

          keyword: filters.keyword || undefined,
          area: filters.area || undefined,
          category: filters.category || undefined,

          creditCard: filters.creditCard ? true : undefined,
          parkingArea: filters.parkingArea ? true : undefined,
          privateRoom: filters.privateRoom ? true : undefined,
          smoking: filters.smoking ? true : undefined,
          unlimitDrink: filters.unlimitDrink ? true : undefined,
          unlimitFood: filters.unlimitFood ? true : undefined,
        };

        const res = await axiosApi.get("/restaurants", { params });

        const pageData = res.data; // Spring Page
        const data: Restaurant[] = pageData.content || [];

        // 🔥 MOCK 이미지 주입(테스트용) - 서버 image가 있으면 그걸 우선 사용
        const withImages: Restaurant[] = data.map((raw: any, idx: number) => {
          const seed = raw.id ?? idx;
          const picsum = (n: number) =>
            `https://picsum.photos/seed/${seed}-${n}/240/240`;

          const baseImg = raw.image || raw.thumbnailUrl;

          const injected = raw.images?.length
            ? raw.images
            : baseImg
            ? [baseImg, picsum(2)]
            : [picsum(1), picsum(2), picsum(3)];

          return { ...raw, images: injected };
        });

        setRestaurants(withImages);

        setTotalPages(pageData.totalPages ?? 0);
        setTotalElements(pageData.totalElements ?? 0);
      } catch (err) {
        console.error("식당 목록 조회 실패:", err);
        setError("データの取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [page, size, filters]);

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
    } catch {}
  };

  const handleMap = (e: React.MouseEvent, r: Restaurant) => {
    e.stopPropagation();
    const q = encodeURIComponent(r.address || r.name);
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${q}`;
    window.open(mapUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="restaurant-page">
      {/* 왼쪽 필터 */}
      <FilterSidebar
        onFilterChange={(patch) =>
          setFilters((cur) => ({
            ...cur,
            ...patch,

            // ✅ patch에서 빈 문자열이 오면 그대로 반영(리셋에 유리)
            keyword: patch.keyword !== undefined ? patch.keyword : cur.keyword,
            area: patch.area !== undefined ? patch.area : cur.area,
            category:
              patch.category !== undefined ? patch.category : cur.category,
          }))
        }
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

        {/* ✅ 페이징 정보 표시 (상단) */}
        {!loading && !error && (
          <div style={{ fontSize: 13, color: "#666", margin: "8px 0 14px" }}>
            {totalElements} 件
          </div>
        )}

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
            <>
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
                    <ImageCarousel
                      key={r.id}
                      images={r.images}
                      size={120}
                      rounded={10}
                    />

                    <div
                      className="quick-actions"
                      onClick={(e) => e.stopPropagation()}
                    >
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

                      <button
                        className="qa-btn"
                        onClick={(e) => handleMap(e, r)}
                        aria-label="지도에서 보기"
                        title="지도"
                      >
                        🗺️
                      </button>

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
                        {/* ✅ categoryNames 대응 */}
                        {r.categoryNames?.length ? (
                          <span
                            style={{
                              fontSize: 12,
                              padding: "4px 10px",
                              border: "1px solid rgba(0,0,0,.12)",
                              borderRadius: 999,
                              background: "#fff",
                            }}
                          >
                            カテゴリ: {r.categoryNames.join(", ")}
                          </span>
                        ) : null}

                        {typeof r.averageRating === "number" &&
                          r.averageRating !== null && (
                            <span
                              style={{
                                fontSize: 12,
                                padding: "4px 10px",
                                border: "1px solid rgba(0,0,0,.12)",
                                borderRadius: 999,
                                background: "#fff",
                              }}
                            >
                              ⭐ {Number(r.averageRating).toFixed(1)}
                            </span>
                          )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* ✅ 페이지네이션 (하단) */}
              {totalPages > 1 && (
                <div
                  className="pagination"
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 18,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <button
                    className="btn-soft"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                  >
                    ← Prev
                  </button>

                  <span style={{ fontSize: 13 }}>
                    {page + 1} / {totalPages}
                  </span>

                  <button
                    className="btn-soft"
                    disabled={page >= totalPages - 1}
                    onClick={() =>
                      setPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ))}
      </main>
    </div>
  );
};

export default RestaurantList;
