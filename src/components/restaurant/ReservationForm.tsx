import React, { useState } from "react";
import axiosApi from "../../api/axiosApi"; // ✅ 경로는 네 프로젝트에 맞게 조정
// 예: import axiosApi from "../../api/axiosApi";

const ReservationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    people: 1,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "people" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date || !formData.time) {
      alert("날짜와 시간을 선택해주세요.");
      return;
    }

    // ✅ Spring LocalDateTime 호환 포맷: YYYY-MM-DDTHH:mm:ss
    const visit = `${formData.date}T${formData.time}:00`;

    // ✅ JWT 인증이면 memberId는 보내지 말고, 백에서 토큰으로 꺼내야 함
    const requestBody = {
      restaurantId: 1, // TODO: 실제 식당 id로 바꾸기
      visit,
      numPeople: formData.people,
    };

    console.log("📦 보내는 예약 데이터:", requestBody);

    try {
      // ✅ baseURL이 http://52.78.21.91:8080/api 이므로 "/reservations"만 쓰면 됨
      await axiosApi.post("/reservations", requestBody);

      alert("예약이 완료되었습니다!");

      setFormData({
        date: "",
        time: "",
        people: 1,
      });
    } catch (error: any) {
      // axios 에러 메시지 추출 (서버가 JSON으로 주는 경우도 커버)
      const serverMsg =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message;

      console.error("❌ 예약 요청 실패:", error);
      console.error("❌ 서버 메시지:", serverMsg);

      if (error?.response?.status === 401) {
        alert("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
      } else {
        alert("예약 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <form className="reservation-form" onSubmit={handleSubmit}>
      <label>
        날짜:
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        시간:
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        인원 수:
        <select name="people" value={formData.people} onChange={handleChange}>
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}명
            </option>
          ))}
        </select>
      </label>

      <button type="submit" className="submit-btn">
        예약하기
      </button>
    </form>
  );
};

export default ReservationForm;
