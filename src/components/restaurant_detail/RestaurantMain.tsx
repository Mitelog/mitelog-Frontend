import React from "react";
import "./RestaurantMain.css"; // 별도 스타일 분리

interface Props {
  restaurant: {
    name: string;
    categoryNames?: string[];
    phone?: string;
    address: string;
    description?: string;
    reservationAvailable?: boolean;
    openHours?: string[];
  };
}

const RestaurantMain: React.FC<Props> = ({ restaurant }) => {
  return (
    <div className="restaurant-info-section">
      <h3 className="section-title">점포 정보(상세)</h3>

      <table className="info-table">
        <tbody>
          <tr>
            <th>점포명</th>
            <td>{restaurant.name}</td>
          </tr>
          <tr>
            <th>카테고리</th>
            <td>{restaurant.categoryNames?.join(", ") || "미등록"}</td>
          </tr>
          <tr>
            <th>예약 · 문의</th>
            <td>{restaurant.phone || "전화번호 미등록"}</td>
          </tr>
          <tr>
            <th>예약 가능 여부</th>
            <td>
              {restaurant.reservationAvailable ? "예약 가능" : "예약 불가"}
            </td>
          </tr>
          <tr>
            <th>주소</th>
            <td>
              {restaurant.address}
              <div className="map-placeholder">
                {/* 실제로는 Google Maps or Kakao Map 삽입 */}
                <iframe
                  title="map"
                  src="https://maps.google.com/maps?q=Fukuoka&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="250"
                  style={{ border: 0, borderRadius: "8px", marginTop: "8px" }}
                ></iframe>
              </div>
            </td>
          </tr>
          <tr>
            <th>영업시간</th>
            <td>
              <ul className="open-hours">
                <li>월·화·수·목·금: 16:00 - 04:00</li>
                <li>토·일·공휴일: 12:00 - 04:00</li>
              </ul>
              <p className="note">※ 22시 이후 이용 시 10% 요금 추가됩니다.</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RestaurantMain;
