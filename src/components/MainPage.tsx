import React from "react";
import "../styles/mainpage.css";

const MainPage: React.FC = () => {
  return (
    <main>
      <section className="main-visual">
        <div
          className="main-visual__bg"
          style={{
            backgroundImage: "url('/images/mainpage-food.jpg')",
          }}
        />
        <div className="main-visual__inner container">
          <h1 className="main-visual__title">미테로그 메인페이지</h1>
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
              placeholder="가게 이름을 입력하세요"
              className="search-input"
            />
            <button type="submit" className="search-btn">
              검색
            </button>
          </form>
        </div>
      </section>
      <section className="ranking-section">
        <h2 className="ranking-title">🥇 인기 맛집</h2>
        <div className="ranking-list">
          <div className="ranking-item">
            <div className="ranking-img placeholder"></div>
            <div className="name">가게 이름</div>
          </div>
          <div className="ranking-item">
            <div className="ranking-img placeholder"></div>
            <div className="name">가게 이름</div>
          </div>
          <div className="ranking-item">
            <div className="ranking-img placeholder"></div>
            <div className="name">가게 이름</div>
          </div>
          <div className="ranking-item">
            <div className="ranking-img placeholder"></div>
            <div className="name">가게 이름</div>
          </div>
          <div className="ranking-item">
            <div className="ranking-img placeholder"></div>
            <div className="name">가게 이름</div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainPage;
