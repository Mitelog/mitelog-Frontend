import React, { useEffect, useMemo, useState } from "react";
import axiosApi from "../../api/axiosApi";
import "/src/styles/restaurantMain.css";

type DayOfWeekType = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

interface RestaurantHoursResponse {
  dayOfWeek: DayOfWeekType;
  openTime: string | null; // "09:00:00"
  closeTime: string | null; // "18:00:00"
  isOpen: boolean;
}

interface Props {
  restaurant: {
    id: number; // ✅ 영업시간 조회용으로 필요
    name: string;
    categoryNames?: string[];
    phone?: string;
    address: string;
    description?: string;
    reservationAvailable?: boolean;

    // ✅ 기존 임시 필드들은 fallback 용도로 유지 가능
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

const ORDER: DayOfWeekType[] = [
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
];

const DAY_LABELS: Record<DayOfWeekType, string> = {
  MON: "月",
  TUE: "火",
  WED: "水",
  THU: "木",
  FRI: "金",
  SAT: "土",
  SUN: "日",
};

function toHHmm(time: string | null | undefined) {
  if (!time) return "";
  return time.slice(0, 5); // "09:00:00" -> "09:00"
}

/**
 * ✅ 요일별 영업시간을 사람이 읽기 좋게 묶어서 출력
 * 예)
 * - 月〜金 09:00〜18:00
 * - 土 10:00〜20:00
 * - 日 休み
 */
function groupBusinessHours(hours: RestaurantHoursResponse[]): string[] {
  if (!hours.length) return [];

  const map = new Map<DayOfWeekType, RestaurantHoursResponse>();
  hours.forEach((h) => map.set(h.dayOfWeek, h));

  // 요일별 "상태 키" 만들기
  const states = ORDER.map((dow) => {
    const h = map.get(dow);

    if (!h || !h.isOpen) {
      return { dow, key: "CLOSED" };
    }

    const open = toHHmm(h.openTime);
    const close = toHHmm(h.closeTime);

    if (!open || !close) {
      return { dow, key: "OPEN|未設定" };
    }

    return { dow, key: `OPEN|${open}〜${close}` };
  });

  const result: string[] = [];
  let buffer: typeof states = [];

  const flush = () => {
    if (!buffer.length) return;

    const days = buffer.map((b) => b.dow);

    // 연속 요일이면 月〜金 형태로
    const isContinuous =
      days.length > 1 &&
      ORDER.indexOf(days[days.length - 1]) - ORDER.indexOf(days[0]) ===
        days.length - 1;

    const dayText = isContinuous
      ? `${DAY_LABELS[days[0]]}〜${DAY_LABELS[days[days.length - 1]]}`
      : days.map((d) => DAY_LABELS[d]).join("・");

    const key = buffer[0].key;

    if (key === "CLOSED") {
      result.push(`${dayText} 休み`);
    } else if (key.startsWith("OPEN|")) {
      const time = key.replace("OPEN|", "");
      result.push(`${dayText} ${time}`);
    }

    buffer = [];
  };

  states.forEach((s, idx) => {
    if (buffer.length === 0 || buffer[0].key === s.key) {
      buffer.push(s);
    } else {
      flush();
      buffer.push(s);
    }

    if (idx === states.length - 1) flush();
  });

  return result;
}

/**
 * ✅ 정기휴무 문자열 만들기
 * - CLOSED 요일만 모아서 "月・火" 형태로 표시
 * - 없으면 "なし"
 */
function buildHolidayText(hours: RestaurantHoursResponse[]): string {
  const closedDays = ORDER.filter((dow) => {
    const h = hours.find((x) => x.dayOfWeek === dow);
    return h ? !h.isOpen : false;
  });

  if (closedDays.length === 0) return "なし";
  if (closedDays.length === 7) return "毎日休み";

  return closedDays.map((d) => DAY_LABELS[d]).join("・");
}

const RestaurantMain: React.FC<Props> = ({ restaurant }) => {
  const [hours, setHours] = useState<RestaurantHoursResponse[] | null>(null);

  // ✅ 영업시간 조회
  useEffect(() => {
    if (!restaurant?.id) return;

    const fetchHours = async () => {
      try {
        const res = await axiosApi.get(`/restaurants/${restaurant.id}/hours`);
        setHours(res.data);
      } catch (e) {
        console.error("영업시간 조회 실패:", e);
        setHours(null);
      }
    };

    fetchHours();
  }, [restaurant?.id]);

  // ✅ 영업시간 묶음 출력 (실데이터 우선)
  const groupedOpenHours = useMemo(() => {
    if (!hours || hours.length === 0) return null;
    return groupBusinessHours(hours);
  }, [hours]);

  // ✅ 정기휴무 출력
  const holidayView = useMemo(() => {
    if (!hours || hours.length === 0) return null;
    return buildHolidayText(hours);
  }, [hours]);

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
              {groupedOpenHours?.length ? (
                <ul className="open-hours">
                  {groupedOpenHours.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              ) : restaurant.openHours?.length ? (
                // ✅ fallback: 기존 임시 데이터
                <ul className="open-hours">
                  {restaurant.openHours.map((hour, i) => (
                    <li key={i}>{hour}</li>
                  ))}
                </ul>
              ) : (
                // ✅ fallback: 하드코딩 기본값
                <ul className="open-hours">
                  <li>月〜金 11:30〜22:00</li>
                  <li>土日祝 12:00〜21:30</li>
                </ul>
              )}
            </td>
          </tr>

          <tr>
            <th>定休日</th>
            <td>{holidayView ?? restaurant.holiday ?? "不定休"}</td>
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
              {restaurant.description?.trim()
                ? restaurant.description
                : "紹介文が登録されていません。"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RestaurantMain;
