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

/** ✅ RestaurantDetail 응답(백엔드 detail 구조에 맞춰 확장) */
interface RestaurantDetailResponse {
  description?: string | null;
  privateRoom?: boolean;
  smoking?: boolean;
  unlimitDrink?: boolean;
  unlimitFood?: boolean;
  parkingArea?: boolean;
  seatCount?: number | null;
  averagePrice?: string | null;
  paymentMethods?: string[]; // enum 문자열들 (e.g., "CASH", "QR_PAY" ...)
}

interface Props {
  restaurant: {
    id: number; // ✅ 영업시간 조회용으로 필요
    name: string;
    categoryNames?: string[];
    phone?: string;
    address: string;

    /** ✅ 이제 소개문은 detail.description을 사용 */
    // description?: string;

    /** ✅ 백엔드에서 내려주는 detail */
    detail?: RestaurantDetailResponse | null;

    /** ✅ 더미 유지(요청대로) */
    reservationAvailable?: boolean;
    website?: string;

    // ✅ 기존 임시 필드들은 fallback 용도로 유지 가능
    openHours?: string[];
    seatCount?: number;
    averagePrice?: string;
    parkingAvailable?: boolean;
    smokingArea?: boolean;
    paymentMethods?: string[];
    holiday?: string;
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
  return time.slice(0, 5);
}

/**
 * ✅ 요일별 영업시간을 사람이 읽기 좋게 묶어서 출력
 */
function groupBusinessHours(hours: RestaurantHoursResponse[]): string[] {
  if (!hours.length) return [];

  const map = new Map<DayOfWeekType, RestaurantHoursResponse>();
  hours.forEach((h) => map.set(h.dayOfWeek, h));

  const states = ORDER.map((dow) => {
    const h = map.get(dow);

    if (!h || !h.isOpen) return { dow, key: "CLOSED" };

    const open = toHHmm(h.openTime);
    const close = toHHmm(h.closeTime);

    if (!open || !close) return { dow, key: "OPEN|未設定" };

    return { dow, key: `OPEN|${open}〜${close}` };
  });

  const result: string[] = [];
  let buffer: typeof states = [];

  const flush = () => {
    if (!buffer.length) return;

    const days = buffer.map((b) => b.dow);

    const isContinuous =
      days.length > 1 &&
      ORDER.indexOf(days[days.length - 1]) - ORDER.indexOf(days[0]) ===
        days.length - 1;

    const dayText = isContinuous
      ? `${DAY_LABELS[days[0]]}〜${DAY_LABELS[days[days.length - 1]]}`
      : days.map((d) => DAY_LABELS[d]).join("・");

    const key = buffer[0].key;

    if (key === "CLOSED") result.push(`${dayText} 休み`);
    else if (key.startsWith("OPEN|")) {
      const time = key.replace("OPEN|", "");
      result.push(`${dayText} ${time}`);
    }

    buffer = [];
  };

  states.forEach((s, idx) => {
    if (buffer.length === 0 || buffer[0].key === s.key) buffer.push(s);
    else {
      flush();
      buffer.push(s);
    }
    if (idx === states.length - 1) flush();
  });

  return result;
}

/**
 * ✅ 정기휴무 문자열 만들기
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

/** ✅ paymentMethods enum 문자열 → 화면 표시용 변환 (원하면 매핑 더 늘려도 됨) */
function renderPaymentMethods(methods?: string[] | null) {
  if (!methods || methods.length === 0) return null;

  const labelMap: Record<string, string> = {
    CASH: "現金",
    CREDIT_CARD: "クレジットカード",
    E_MONEY: "電子マネー",
    QR_PAY: "QR決済",
    BANK_TRANSFER: "振込",
    OTHER: "その他",
  };

  return methods.map((m) => labelMap[m] ?? m).join(" / ");
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

  const groupedOpenHours = useMemo(() => {
    if (!hours || hours.length === 0) return null;
    return groupBusinessHours(hours);
  }, [hours]);

  const holidayView = useMemo(() => {
    if (!hours || hours.length === 0) return null;
    return buildHolidayText(hours);
  }, [hours]);

  /** ✅ detail 우선 값들(없으면 기존 임시 필드 fallback) */
  const detail = restaurant.detail ?? null;

  const seatCountView = detail?.seatCount ?? restaurant.seatCount ?? null;

  const averagePriceView =
    detail?.averagePrice ?? restaurant.averagePrice ?? null;

  const parkingView =
    detail?.parkingArea !== undefined
      ? detail.parkingArea
      : restaurant.parkingAvailable;

  const smokingView =
    detail?.smoking !== undefined ? detail.smoking : restaurant.smokingArea;

  const paymentMethodsView =
    (detail?.paymentMethods && detail.paymentMethods.length > 0
      ? renderPaymentMethods(detail.paymentMethods)
      : null) ??
    (restaurant.paymentMethods && restaurant.paymentMethods.length > 0
      ? restaurant.paymentMethods.join(" / ")
      : null);

  const descriptionView = detail?.description?.trim()
    ? detail.description
    : "紹介文が登録されていません。";

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
            <td>{holidayView ?? restaurant.holiday ?? "不定休"}</td>
          </tr>

          <tr>
            <th>座席数</th>
            <td>{seatCountView !== null ? `${seatCountView}席` : "未設定"}</td>
          </tr>

          <tr>
            <th>平均予算</th>
            <td>{averagePriceView ?? "未設定"}</td>
          </tr>

          <tr>
            <th>駐車場</th>
            <td>
              {parkingView !== undefined
                ? parkingView
                  ? "あり"
                  : "なし"
                : "未設定"}
            </td>
          </tr>

          <tr>
            <th>喫煙可否</th>
            <td>
              {smokingView !== undefined
                ? smokingView
                  ? "喫煙可"
                  : "全席禁煙"
                : "未設定"}
            </td>
          </tr>

          <tr>
            <th>支払い方法</th>
            <td>{paymentMethodsView ?? "未設定"}</td>
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
            <td>{descriptionView}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RestaurantMain;
