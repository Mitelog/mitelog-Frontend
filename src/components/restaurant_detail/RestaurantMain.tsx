import React from "react";
import "./RestaurantMain.css"; // 표 디자인용 CSS (이전 버전 그대로 사용)

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
              {restaurant.address || "주소 미등록"}

              {/* ✅ 주소가 있으면 지도 표시 */}
              {restaurant.address ? (
                <div className="map-placeholder">
                  <iframe
                    title="restaurant-map"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      restaurant.address
                    )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="250"
                    style={{
                      border: 0,
                      borderRadius: "8px",
                      marginTop: "8px",
                    }}
                    loading="lazy"
                  ></iframe>
                </div>
              ) : (
                <p className="no-map-text">등록된 주소가 없습니다.</p>
              )}
            </td>
          </tr>
          <tr>
            <th>영업시간</th>
            <td>
              {restaurant.openHours ? (
                <ul className="open-hours">
                  {restaurant.openHours.map((hour, index) => (
                    <li key={index}>{hour}</li>
                  ))}
                </ul>
              ) : (
                <p>영업시간 정보가 없습니다.</p>
              )}
              <p className="note">
                ※ 영업시간은 가게 사정에 따라 변동될 수 있습니다.
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RestaurantMain;
