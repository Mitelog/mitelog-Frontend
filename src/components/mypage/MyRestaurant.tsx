import React, { useEffect, useState, useRef } from "react";
import axiosApi from "../../api/axiosApi";
import "../../styles/restaurantList.css"; // ✅ 같은 CSS 그대로 적용
import { useNavigate } from "react-router-dom";

/* --- 미니 캐러셀 컴포넌트 --- */
type CarouselProps = {
  images?: string[];
  size?: number;
  rounded?: number;
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
          <button className="ic-arrow ic-left" onClick={prev}>
            ‹
          </button>
          <button className="ic-arrow ic-right" onClick={next}>
            ›
          </button>
          <div className="ic-dots">
            {safe.map((_, i) => (
              <button
                key={i}
                className={`ic-dot ${i === idx ? "active" : ""}`}
                onClick={() => goto(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/* --- 내 가게 목록 --- */
interface Restaurant {
  id: number;
  name: string;
  address: string;
  area?: string;
  phone?: string;
  image?: string | null;
  categoryNames?: string[];
  averageRating?: number;
}

const MyRestaurant: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRestaurants = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axiosApi.get("/restaurants/my-restaurants?page=0&size=10", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data.data.content || [];
        const withImages = data.map((r: any, idx: number) => {
          const seed = r.id ?? idx;
          const picsum = (n: number) =>
            `https://picsum.photos/seed/${seed}-${n}/240/240`;
          return {
            ...r,
            images: r.image ? [r.image] : [picsum(1), picsum(2)],
          };
        });

        setRestaurants(withImages);
      } catch (err) {
        console.error("❌ 내 가게 목록 불러오기 실패:", err);
        setError("データの取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };
    fetchMyRestaurants();
  }, []);

  if (loading)
    return (
      <div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ marginBottom: 16 }} />
        ))}
      </div>
    );

  if (error)
    return (
      <p className="error" style={{ color: "red" }}>
        {error}
      </p>
    );

  if (restaurants.length === 0)
    return (
      <div
        style={{
          padding: 28,
          textAlign: "center",
          border: "1px dashed rgba(0,0,0,.12)",
          borderRadius: 16,
          background: "linear-gradient(180deg,#fff,#fafafa)",
        }}
      >
        등록된 가게가 없습니다.
      </div>
    );

  return (
    <div className="restaurant-main">
      <div className="list-header">
        <h2 className="page-title">🍴 내 가게 목록</h2>
        <button
          className="btn-soft hover-grow"
          onClick={() => navigate("/restaurants/new")}
        >
          <span className="label">➕ 새 식당 등록</span>
        </button>
      </div>

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
            <ImageCarousel images={r.images} size={120} rounded={10} />

            <div className="restaurant-info" style={{ flex: 1, minWidth: 0 }}>
              <h3 className="restaurant-name">{r.name}</h3>
              <p className="restaurant-address">{r.address}</p>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 6,
                  flexWrap: "wrap",
                }}
              >
                {r.categoryNames && r.categoryNames.length > 0 && (
                  <span
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      border: "1px solid rgba(0,0,0,.12)",
                      borderRadius: 999,
                      background: "#fff",
                    }}
                  >
                    {r.categoryNames.join(", ")}
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
    </div>
  );
};

export default MyRestaurant;
