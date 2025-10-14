import React from "react";

interface Props {
  restaurant: any;
}

const RestaurantMain: React.FC<Props> = ({ restaurant }) => {
  return (
    <div className="restaurant-main">
      <h3>店舗情報</h3>
      <table className="info-table">
        <tbody>
          <tr>
            <th>店名</th>
            <td>{restaurant.name}</td>
          </tr>
          <tr>
            <th>住所</th>
            <td>{restaurant.address}</td>
          </tr>
          <tr>
            <th>電話番号</th>
            <td>{restaurant.phone || "未登録"}</td>
          </tr>
          <tr>
            <th>カテゴリー</th>
            <td>{restaurant.categoryNames?.join(", ") || "未登録"}</td>
          </tr>
        </tbody>
      </table>

      <div className="map-container">
        <iframe
          title="restaurant-map"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(
            restaurant.address
          )}&z=15&output=embed&_=${Date.now()}`}
          width="100%"
          height="250"
          style={{ border: 0, borderRadius: "8px", marginTop: "8px" }}
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default RestaurantMain;
