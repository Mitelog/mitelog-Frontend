import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../api/axiosApi";
import "/src/styles/mainpage.css";

type Restaurant = {
  id: number;
  name: string;
  address?: string;
  area?: string;
  image?: string | null;
  averageRating?: number | null;
};

const PlaceholderCard: React.FC<{ sub?: string }> = ({ sub }) => (
  <div className="ranking-item">
    <div className="ranking-img placeholder"></div>
    <div className="name">店名</div>
    {sub && <div className="subtext">{sub}</div>}
  </div>
);

const PlaceholderRow: React.FC<{ sub?: string }> = ({ sub }) => (
  <div className="ranking-list">
    {Array.from({ length: 5 }).map((_, i) => (
      <PlaceholderCard key={i} sub={sub} />
    ))}
  </div>
);

const RestaurantCard: React.FC<{
  r: Restaurant;
  onClick: () => void;
}> = ({ r, onClick }) => {
  // ✅ 가게별로 고정되는 랜덤 이미지 (picsum)
  const seededRandom = (id: number) =>
    `https://picsum.photos/seed/mitelog-${id}/400/280`;

  // (선택) "이미지 없음"용 회색 svg는 이제 거의 안 씀
  const grayFallback =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='280'><rect width='100%' height='100%' fill='#e9e9e9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='18' fill='#999'>No Image</text></svg>"
    );

  const normalizeImage = (img?: string | null, id?: number) => {
    // ✅ 백에서 이미지 없으면 랜덤으로
    if (!img || !img.trim()) return id ? seededRandom(id) : grayFallback;

    // 절대 URL이면 그대로
    if (img.startsWith("http://") || img.startsWith("https://")) return img;

    // 상대경로면 백엔드 호스트 붙이기
    return `http://52.78.21.91:8080${img.startsWith("/") ? "" : "/"}${img}`;
  };

  const img = normalizeImage(r.image, r.id);

  return (
    <div
      className="ranking-item"
      onClick={onClick}
      style={{ cursor: "pointer" }}
      role="button"
    >
      <div
        className="ranking-img"
        style={{
          backgroundImage: `url("${img}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="name">{r.name}</div>
      <div className="subtext">
        <span className="badge">{r.area ?? "-"}</span>
        <span className="badge rating">
          <span className="star">★</span> {r.averageRating ?? 0}
        </span>{" "}
      </div>
    </div>
  );
};

const RestaurantRow: React.FC<{
  list: Restaurant[] | null;
  onGo: (id: number) => void;
}> = ({ list, onGo }) => {
  if (list === null) return <PlaceholderRow />;
  if (list.length === 0)
    return <p className="section-note">データがありません。</p>;

  return (
    <div className="ranking-list">
      {list.map((r) => (
        <RestaurantCard key={r.id} r={r} onClick={() => onGo(r.id)} />
      ))}
    </div>
  );
};

const SectionBlock: React.FC<{
  title: string;
  note?: string;
  list: Restaurant[] | null;
  onGo: (id: number) => void;
}> = ({ title, note, list, onGo }) => (
  <section className="ranking-section">
    <h2 className="ranking-title">{title}</h2>
    {note && <p className="section-note">{note}</p>}
    <RestaurantRow list={list} onGo={onGo} />
  </section>
);

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  const [popular, setPopular] = useState<Restaurant[] | null>(null);
  const [fresh, setFresh] = useState<Restaurant[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    const fetchMain = async () => {
      try {
        setErr(null);

        const [p, n] = await Promise.all([
          axiosApi.get<Restaurant[]>("/restaurants/popular", {
            params: { size: 5 },
          }),
          axiosApi.get<Restaurant[]>("/restaurants/new", {
            params: { size: 5 },
          }),
        ]);

        setPopular(p.data ?? []);
        setFresh(n.data ?? []);
      } catch (e) {
        console.error("메인 인기/신규 조회 실패:", e);
        setErr("メインデータの取得に失敗しました。");
        setPopular([]);
        setFresh([]);
      }
    };

    fetchMain();
  }, []);

  const goDetail = (id: number) => navigate(`/restaurants/${id}`);

  return (
    <main>
      <section className="main-visual">
        <div
          className="main-visual__bg"
          style={{ backgroundImage: "url('/images/mainpage-food.jpg')" }}
        />
        <div className="main-visual__inner container">
          <h1 className="main-visual__title">メインページ</h1>
          <form
            className="search-bar"
            onSubmit={(e) => {
              e.preventDefault();
              const keyword = q.trim();

              if (!keyword) {
                navigate("/restaurants");
                return;
              }

              navigate(`/restaurants?keyword=${encodeURIComponent(keyword)}`);
            }}
          >
            <input
              name="q"
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="店名を入力してください"
              className="search-input"
            />
            <button type="submit" className="search-btn">
              検索
            </button>
          </form>
        </div>
      </section>

      {err && (
        <section className="ranking-section">
          <p className="section-note" style={{ color: "crimson" }}>
            {err}
          </p>
        </section>
      )}

      {/* 1) 人気の飲食店 */}
      <SectionBlock title="🥇 人気の飲食店" list={popular} onGo={goDetail} />

      {/* 2) 新着店舗 */}
      <SectionBlock title="🆕 新着店舗" list={fresh} onGo={goDetail} />
    </main>
  );
};

export default MainPage;
