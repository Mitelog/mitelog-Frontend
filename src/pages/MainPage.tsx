import React from "react";
import "/src/styles/mainpage.css";

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

const SectionBlock: React.FC<{
  title: string;
  note?: string;
  sub?: string;
}> = ({ title, note, sub }) => (
  <section className="ranking-section">
    <h2 className="ranking-title">{title}</h2>
    {note && <p className="section-note">{note}</p>}
    <PlaceholderRow sub={sub} />
  </section>
);

const MainPage: React.FC = () => {
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
              window.location.href = "/restaurants";
            }}
          >
            <input
              name="q"
              type="text"
              placeholder="店名を入力してください"
              className="search-input"
            />
            <button type="submit" className="search-btn">
              検索
            </button>
          </form>
        </div>
      </section>

      {/* 1) 人気の飲食店 */}
      <SectionBlock title="🥇 人気の飲食店" />

      {/* 2) 新着店舗 */}
      <SectionBlock title="🆕 新着店舗" />

      {/* 3) 話題のレビュー */}
      <SectionBlock title="🗣️ 話題のレビュー" />

      {/* 4) あなたへのおすすめ */}
      <SectionBlock title="💡 あなたへのおすすめ" />
    </main>
  );
};

export default MainPage;
