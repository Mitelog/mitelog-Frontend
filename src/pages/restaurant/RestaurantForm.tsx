import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosApi from "../../api/axiosApi";
import "/src/styles/restaurantForm.css";

/**
 * ✅ Restaurant 기본 정보(restaurant 테이블 성격)
 * - 주의: GET /restaurants/{id} 응답에는 최상위 description이 없음(현재 너가 준 JSON 기준)
 * - 따라서 restaurant 쪽 description은 "restaurantDescription"으로 따로 관리(필요 없으면 UI에서 제거해도 됨)
 */
interface RestaurantFormData {
  name: string;
  address: string;
  area: string;
  phone?: string;
  restaurantDescription?: string; // ✅ restaurant 최상위 description이 없으니 별도명으로 관리
}

/** ✅ 카테고리 마스터(/categories) */
interface Category {
  id: number;
  name: string;
}

/** ✅ 요일 타입(백엔드 enum과 맞춘다) */
type DayOfWeekType = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

/** ✅ 영업시간 폼 타입 */
interface RestaurantHoursForm {
  dayOfWeek: DayOfWeekType;
  openTime: string; // "HH:mm"
  closeTime: string; // "HH:mm"
  isOpen: boolean;
}

/** ✅ 영업시간 초기값 */
const INITIAL_HOURS: RestaurantHoursForm[] = [
  { dayOfWeek: "MON", openTime: "09:00", closeTime: "18:00", isOpen: true },
  { dayOfWeek: "TUE", openTime: "09:00", closeTime: "18:00", isOpen: true },
  { dayOfWeek: "WED", openTime: "09:00", closeTime: "18:00", isOpen: true },
  { dayOfWeek: "THU", openTime: "09:00", closeTime: "18:00", isOpen: true },
  { dayOfWeek: "FRI", openTime: "09:00", closeTime: "18:00", isOpen: true },
  { dayOfWeek: "SAT", openTime: "10:00", closeTime: "20:00", isOpen: true },
  { dayOfWeek: "SUN", openTime: "", closeTime: "", isOpen: false },
];

/** ✅ 요일 라벨(일본어) */
const DAY_LABELS: Record<DayOfWeekType, string> = {
  MON: "月",
  TUE: "火",
  WED: "水",
  THU: "木",
  FRI: "金",
  SAT: "土",
  SUN: "日",
};

/** ✅ 결제수단 타입(백엔드 enum과 맞춘다) */
type PaymentMethodType = "CASH" | "CREDIT_CARD" | "E_MONEY" | "QR_PAY";

/** ✅ 상세 폼 타입(restaurant_detail 성격) */
interface RestaurantDetailFormData {
  description: string; // ✅ 소개문(detail.description)
  privateRoom: boolean;
  smoking: boolean;
  unlimitDrink: boolean;
  unlimitFood: boolean;
  parkingArea: boolean;
  seatCount: string; // input이 문자열이라 string 유지 후 submit 시 number로 변환
  averagePrice: string;
  paymentMethods: PaymentMethodType[];
}

/** ✅ 상세 초기값 */
const INITIAL_DETAIL: RestaurantDetailFormData = {
  description: "",
  privateRoom: false,
  smoking: false,
  unlimitDrink: false,
  unlimitFood: false,
  parkingArea: false,
  seatCount: "",
  averagePrice: "",
  paymentMethods: [],
};

/** ✅ 결제수단 옵션 */
const PAYMENT_METHOD_OPTIONS: PaymentMethodType[] = [
  "CASH",
  "CREDIT_CARD",
  "E_MONEY",
  "QR_PAY",
];

/** ✅ 결제수단 라벨 */
const PAYMENT_METHOD_LABEL: Record<PaymentMethodType, string> = {
  CASH: "現金",
  CREDIT_CARD: "クレジットカード",
  E_MONEY: "電子マネー",
  QR_PAY: "QR決済",
};

const RestaurantForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  /** ✅ 기본정보 폼 */
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: "",
    address: "",
    area: "",
    phone: "",
    restaurantDescription: "",
  });

  /** ✅ 카테고리 마스터 */
  const [categories, setCategories] = useState<Category[]>([]);

  /**
   * ✅ 선택된 카테고리 ID 목록(체크박스 컨트롤용)
   * - 서버에 보낼 때도 이 ID 배열을 그대로 categoryIds로 보냄
   */
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  /**
   * ✅ 수정 모드에서만 사용: 서버 응답의 categoryNames를 임시 보관
   * - 서버가 categoryIds를 내려주지 않는 환경에서도,
   *   /categories(마스터)와 매칭해서 selectedCategories를 복원한다.
   */
  const [restaurantCategoryNames, setRestaurantCategoryNames] = useState<
    string[]
  >([]);

  /** ✅ 영업시간 폼 */
  const [hours, setHours] = useState<RestaurantHoursForm[]>(INITIAL_HOURS);

  /** ✅ 상세 폼 */
  const [detailData, setDetailData] =
    useState<RestaurantDetailFormData>(INITIAL_DETAIL);

  /** ✅ 로딩/에러 */
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  /**
   * =========================================================
   * 1) 카테고리 마스터 목록 로드 (/categories)
   * =========================================================
   */
  useEffect(() => {
    axiosApi
      .get("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  /**
   * =========================================================
   * 2) 수정 모드: 레스토랑 기본정보 로드 (/restaurants/{id})
   *
   * ✅ 현재 응답(JSON 기준):
   *  - 최상위에 description, categoryIds 없음
   *  - categoryNames만 존재(그리고 지금 데이터는 [])
   *
   * ✅ 그래서:
   *  - formData는 name/address/area/phone만 채움
   *  - categoryNames는 restaurantCategoryNames로 따로 저장해둔다
   * =========================================================
   */
  useEffect(() => {
    if (!isEditMode || !id) return;

    axiosApi
      .get(`/restaurants/${id}`)
      .then((res) => {
        const { name, address, area, phone, categoryNames } = res.data;

        setFormData((p) => ({
          ...p,
          name: name ?? "",
          address: address ?? "",
          area: area ?? "",
          phone: phone ?? "",
          // restaurantDescription은 응답에 없으므로 건드리지 않음(유지)
        }));

        // ✅ categoryIds가 없으므로 categoryNames로 받아두고,
        //    아래의 "name -> id 매핑 useEffect"에서 selectedCategories를 복원
        setRestaurantCategoryNames(categoryNames || []);

        setLoading(false);
      })
      .catch(() => {
        setError("店舗情報の読み込みに失敗しました。");
        setLoading(false);
      });
  }, [id, isEditMode]);

  /**
   * =========================================================
   * 3) 수정 모드: categoryNames -> categoryIds 복원 로직
   *
   * - categories(마스터)가 로딩되고
   * - restaurantCategoryNames(서버에서 받은 이름들)가 준비되면
   * - 선택 ID 목록(selectedCategories)을 계산해서 체크박스를 복원한다.
   *
   * ⚠️ 현재 너가 준 응답은 categoryNames: [] 이라 복원할 게 없어서 빈 배열이 정상.
   * =========================================================
   */
  useEffect(() => {
    if (!isEditMode) return;
    if (categories.length === 0) return;

    // 서버가 categoryNames를 안 주거나 빈 배열인 경우 그대로 빈 배열
    if (!restaurantCategoryNames || restaurantCategoryNames.length === 0) {
      setSelectedCategories([]);
      return;
    }

    const ids = categories
      .filter((c) => restaurantCategoryNames.includes(c.name))
      .map((c) => c.id);

    setSelectedCategories(ids);
  }, [isEditMode, categories, restaurantCategoryNames]);

  /**
   * =========================================================
   * 4) 수정 모드: 영업시간 로드 (/restaurants/{id}/hours)
   * =========================================================
   */
  useEffect(() => {
    if (!isEditMode || !id) return;

    axiosApi
      .get(`/restaurants/${id}/hours`)
      .then((res) => {
        setHours((prev) =>
          prev.map((h) => {
            const found = res.data.find(
              (x: any) => x.dayOfWeek === h.dayOfWeek
            );
            return found
              ? {
                  ...h,
                  openTime: found.openTime?.slice(0, 5) || "",
                  closeTime: found.closeTime?.slice(0, 5) || "",
                  isOpen: !!found.isOpen,
                }
              : h;
          })
        );
      })
      .catch(() => {
        // hours는 실패해도 폼 편집은 가능하게 두는 편이 UX가 낫다
      });
  }, [id, isEditMode]);

  /**
   * =========================================================
   * 5) 수정 모드: 상세 로드 (/restaurants/{id}/detail)
   * =========================================================
   */
  useEffect(() => {
    if (!isEditMode || !id) return;

    axiosApi
      .get(`/restaurants/${id}/detail`)
      .then((res) => {
        setDetailData({
          description: res.data.description ?? "",
          privateRoom: !!res.data.privateRoom,
          smoking: !!res.data.smoking,
          unlimitDrink: !!res.data.unlimitDrink,
          unlimitFood: !!res.data.unlimitFood,
          parkingArea: !!res.data.parkingArea,
          seatCount: res.data.seatCount ? String(res.data.seatCount) : "",
          averagePrice: res.data.averagePrice ?? "",
          paymentMethods: res.data.paymentMethods ?? [],
        });
      })
      .catch(() => {
        // detail도 실패해도 폼 편집은 가능하게 두는 편이 UX가 낫다
      });
  }, [id, isEditMode]);

  /**
   * =========================================================
   * 입력 핸들러
   * =========================================================
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleDetailChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setDetailData((p) => ({ ...p, [e.target.name]: e.target.value }));

  /**
   * ✅ 카테고리 토글
   * - 체크박스 클릭 시 id 배열을 토글
   */
  const toggleCategory = (categoryId: number) =>
    setSelectedCategories((p) =>
      p.includes(categoryId)
        ? p.filter((x) => x !== categoryId)
        : [...p, categoryId]
    );

  /**
   * ✅ 결제수단 토글
   */
  const togglePayment = (m: PaymentMethodType) =>
    setDetailData((p) => ({
      ...p,
      paymentMethods: p.paymentMethods.includes(m)
        ? p.paymentMethods.filter((x) => x !== m)
        : [...p.paymentMethods, m],
    }));

  /**
   * ✅ 영업 여부/시간 토글
   */
  const toggleHour = (
    day: DayOfWeekType,
    key: keyof RestaurantHoursForm,
    value: any
  ) =>
    setHours((p) =>
      p.map((h) => (h.dayOfWeek === day ? { ...h, [key]: value } : h))
    );

  /**
   * =========================================================
   * submit 유틸: "HH:mm" -> "HH:mm:00"
   * - 백엔드가 LocalTime("HH:mm:ss")로 받는 경우를 고려
   * =========================================================
   */
  const toTime = (t: string) => (t ? `${t}:00` : null);

  /**
   * =========================================================
   * 폼 제출
   * =========================================================
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /**
     * ✅ 레스토랑 Payload
     * - categoryIds는 항상 "선택된 ID 배열"로 보냄
     * - (백엔드가 이걸 저장해줘야 categoryNames가 채워짐)
     */
    const restaurantPayload = {
      name: formData.name,
      address: formData.address,
      area: formData.area,
      phone: formData.phone,
      // restaurantDescription은 현재 백엔드 응답/모델에 없으므로 전송하지 않는 게 안전
      // 필요하면 백엔드 DTO 필드명에 맞춰 추가해라.
      categoryIds: selectedCategories,
    };

    /**
     * ✅ 상세 Payload
     * - seatCount: 문자열 -> 숫자 변환
     */
    const detailPayload = {
      ...detailData,
      seatCount: detailData.seatCount ? Number(detailData.seatCount) : null,
    };

    try {
      if (isEditMode && id) {
        // ✅ 기본정보 업데이트
        await axiosApi.put(`/restaurants/${id}`, restaurantPayload);

        // ✅ 상세 업데이트
        await axiosApi.put(`/restaurants/${id}/detail`, detailPayload);

        // ✅ 영업시간 업데이트(요일별 PUT)
        await Promise.all(
          hours.map((h) =>
            axiosApi.put(`/restaurants/${id}/hours/${h.dayOfWeek}`, {
              dayOfWeek: h.dayOfWeek,
              isOpen: h.isOpen,
              openTime: h.isOpen ? toTime(h.openTime) : null,
              closeTime: h.isOpen ? toTime(h.closeTime) : null,
            })
          )
        );
      } else {
        // ✅ 신규 등록
        const res = await axiosApi.post("/restaurants", restaurantPayload);
        const newId = res.data.id;

        // ✅ 상세 등록
        await axiosApi.post(`/restaurants/${newId}/detail`, detailPayload);

        // ✅ 영업시간 일괄 등록
        await axiosApi.post(
          `/restaurants/${newId}/hours`,
          hours.map((h) => ({
            dayOfWeek: h.dayOfWeek,
            isOpen: h.isOpen,
            openTime: h.isOpen ? toTime(h.openTime) : null,
            closeTime: h.isOpen ? toTime(h.closeTime) : null,
          }))
        );
      }

      // ✅ 완료 후 목록으로
      navigate("/restaurants");
    } catch {
      setError("データの送信に失敗しました。");
    }
  };

  /**
   * =========================================================
   * 렌더링
   * =========================================================
   */
  if (loading) return <p className="loading">読み込み中...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="restaurant-form-container">
      <h2>{isEditMode ? "店舗情報の編集" : "新しいレストランを登録"}</h2>

      <form className="restaurant-form" onSubmit={handleSubmit}>
        {/* ✅ 기본 정보 */}
        <div className="form-row">
          <label>
            店舗名
            <input name="name" value={formData.name} onChange={handleChange} />
          </label>
          <label>
            電話番号
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            エリア
            <input name="area" value={formData.area} onChange={handleChange} />
          </label>
          <label>
            住所
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </label>
        </div>

        {/* ✅ 설명(restaurantDescription) + 소개문(detail.description)
            - 현재 백엔드 응답 구조상 restaurant 최상위 description이 없으므로
              restaurantDescription은 "선택사항"으로 두었다.
            - 필요 없으면 아래 첫 textarea 블록을 통째로 제거해도 된다.
        */}
        <div className="form-row full">
          <label>
            説明（任意）
            <textarea
              name="restaurantDescription"
              value={formData.restaurantDescription || ""}
              onChange={handleChange}
              rows={3}
            />
          </label>
          <label>
            紹介文
            <textarea
              name="description"
              value={detailData.description}
              onChange={handleDetailChange}
              rows={3}
            />
          </label>
        </div>

        {/* ✅ 상세 옵션 */}
        <div className="detail-section">
          <div className="detail-flags">
            {[
              ["privateRoom", "個室"],
              ["smoking", "喫煙"],
              ["unlimitDrink", "飲み放題"],
              ["unlimitFood", "食べ放題"],
              ["parkingArea", "駐車場"],
            ].map(([k, l]) => (
              <label key={k}>
                <input
                  type="checkbox"
                  checked={(detailData as any)[k]}
                  onChange={(e) =>
                    setDetailData((p) => ({ ...p, [k]: e.target.checked }))
                  }
                />
                {l}
              </label>
            ))}
          </div>

          <div className="detail-extra">
            <label>
              席数
              <input
                type="number"
                name="seatCount"
                value={detailData.seatCount}
                onChange={handleDetailChange}
              />
            </label>
            <label>
              平均予算
              <input
                name="averagePrice"
                value={detailData.averagePrice}
                onChange={handleDetailChange}
              />
            </label>
          </div>

          <div className="detail-payments">
            <div className="payment-list">
              {PAYMENT_METHOD_OPTIONS.map((m) => (
                <label key={m} className="payment-item">
                  <input
                    type="checkbox"
                    checked={detailData.paymentMethods.includes(m)}
                    onChange={() => togglePayment(m)}
                  />
                  {PAYMENT_METHOD_LABEL[m]}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ✅ 카테고리 */}
        <div className="category-section">
          <p className="section-title">カテゴリー</p>

          <div className="category-list">
            {categories.map((c) => (
              <label key={c.id} className="category-item">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(c.id)}
                  onChange={() => toggleCategory(c.id)}
                />
                {c.name}
              </label>
            ))}
          </div>
        </div>

        {/* ✅ 영업시간 */}
        <div className="hours-section">
          <table className="hours-table">
            <thead>
              <tr>
                <th>曜</th>
                <th>営</th>
                <th>開</th>
                <th>閉</th>
              </tr>
            </thead>
            <tbody>
              {hours.map((h) => (
                <tr key={h.dayOfWeek}>
                  <td>{DAY_LABELS[h.dayOfWeek]}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={h.isOpen}
                      onChange={(e) =>
                        toggleHour(h.dayOfWeek, "isOpen", e.target.checked)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={h.openTime}
                      disabled={!h.isOpen}
                      onChange={(e) =>
                        toggleHour(h.dayOfWeek, "openTime", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={h.closeTime}
                      disabled={!h.isOpen}
                      onChange={(e) =>
                        toggleHour(h.dayOfWeek, "closeTime", e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="submit-btn">{isEditMode ? "更新" : "登録"}</button>
      </form>
    </div>
  );
};

export default RestaurantForm;
