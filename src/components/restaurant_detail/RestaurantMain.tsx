import React from "react";
import "../../styles/restaurantMain.css";

interface Props {
  restaurant: {
    name: string;
    categoryNames?: string[];
    phone?: string;
    address: string;
    description?: string;
    reservationAvailable?: boolean;
    openHours?: string[];
    seatCount?: number;
    averagePrice?: string;
    parkingAvailable?: boolean;
    smokingArea?: boolean;
    paymentMethods?: string[];
    holiday?: string;
    website?: string;
  };
}

const RestaurantMain: React.FC<Props> = ({ restaurant }) => {
  return (
    <div className="restaurant-info-section">
      <h3 className="section-title">店舗情報</h3>

      <table className="info-table">
        <tbody>
          <tr>
            <th>店名</th>
            <td>{restaurant.name}</td>
          </tr>

          <tr>
            <th>カテゴリー</th>
            <td>{restaurant.categoryNames?.join(" / ")}</td>
          </tr>

          <tr>
            <th>電話番号</th>
            <td>{restaurant.phone}</td>
          </tr>

          <tr>
            <th>住所</th>
            <td>
              {restaurant.address}
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
            </td>
          </tr>

          <tr>
            <th>営業時間</th>
            <td>
              {restaurant.openHours?.length ? (
                <ul className="open-hours">
                  {restaurant.openHours.map((hour, i) => (
                    <li key={i}>{hour}</li>
                  ))}
                </ul>
              ) : (
                <ul className="open-hours">
                  <li>月〜金 11:30〜22:00</li>
                  <li>土日祝 12:00〜21:30</li>
                </ul>
              )}
            </td>
          </tr>

          <tr>
            <th>定休日</th>
            <td>{restaurant.holiday ?? "不定休"}</td>
          </tr>

          <tr>
            <th>座席数</th>
            <td>{restaurant.seatCount ?? 40}席</td>
          </tr>

          <tr>
            <th>平均予算</th>
            <td>{restaurant.averagePrice ?? "¥3,000〜¥5,000"}</td>
          </tr>

          <tr>
            <th>駐車場</th>
            <td>
              {restaurant.parkingAvailable !== undefined
                ? restaurant.parkingAvailable
                  ? "あり"
                  : "なし"
                : "なし"}
            </td>
          </tr>

          <tr>
            <th>喫煙可否</th>
            <td>
              {restaurant.smokingArea !== undefined
                ? restaurant.smokingArea
                  ? "喫煙可"
                  : "全席禁煙"
                : "全席禁煙"}
            </td>
          </tr>

          <tr>
            <th>支払い方法</th>
            <td>
              {restaurant.paymentMethods?.length
                ? restaurant.paymentMethods.join(" / ")
                : "現金 / クレジットカード / 電子マネー"}
            </td>
          </tr>

          <tr>
            <th>予約可否</th>
            <td>{restaurant.reservationAvailable ? "予約可能" : "予約不可"}</td>
          </tr>

          <tr>
            <th>公式サイト</th>
            <td>
              <a
                href={restaurant.website ?? "https://example.com/"}
                target="_blank"
                rel="noreferrer"
              >
                {restaurant.website ?? "https://example.com/"}
              </a>
            </td>
          </tr>

          <tr>
            <th>紹介文</th>
            <td>
              {restaurant.description ??
                "炭火で焼き上げる上質な肉料理と、落ち着いた雰囲気の中でお食事を楽しめます。"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RestaurantMain;
