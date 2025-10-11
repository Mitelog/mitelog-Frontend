import React from "react";

const MypageCalendar: React.FC = () => {
  return (
    <div className="calendar-box">
      <h3>📅 今月の訪問カレンダー</h3>
      <p>※ 실제 연동 시 방문 기록 API를 기반으로 날짜 하이라이트 가능</p>
      <img src="/calendar-sample.png" alt="calendar" className="calendar-img" />
    </div>
  );
};

export default MypageCalendar;
