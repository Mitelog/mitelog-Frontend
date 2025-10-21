import React, { useState } from "react";

const ReservationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    people: 1,
    request: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("예약 정보:", formData);
    alert("예약 요청이 전송되었습니다! (임시)");
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
          {[...Array(10)].map((_, i) => (
            <option key={i} value={i + 1}>
              {i + 1}명
            </option>
          ))}
        </select>
      </label>

      <label>
        요청사항:
        <textarea
          name="request"
          placeholder="예: 창가 자리 부탁드려요."
          value={formData.request}
          onChange={handleChange}
        />
      </label>

      <button type="submit" className="submit-btn">
        예약하기
      </button>
    </form>
  );
};

export default ReservationForm;
