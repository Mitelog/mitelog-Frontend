import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosApi from "../../api/axiosApi";
import "/src/styles/restaurantForm.css";

interface RestaurantFormData {
  name: string;
  address: string;
  area: string;
  phone?: string;
  description?: string;
}

/** ✅ 카테고리 타입 정의 */
interface Category {
  id: number;
  name: string;
}

/** ✅ 요일 타입 (백엔드 enum과 동일하게) */
type DayOfWeekType = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

/** ✅ 프론트 영업시간 폼 타입 */
interface RestaurantHoursForm {
  dayOfWeek: DayOfWeekType;
  openTime: string; // "HH:mm" (input type="time")
  closeTime: string; // "HH:mm"
  isOpen: boolean;
}

/** ✅ 초기 영업시간(월~일) */
const INITIAL_HOURS: RestaurantHoursForm[] = [
  { dayOfWeek: "MON", openTime: "09:00", closeTime: "18:00", isOpen: true },
  { dayOfWeek: "TUE", openTime: "09:00", closeTime: "18:00", isOpen: true },
  { dayOfWeek: "WED", openTime: "09:00", closeTime: "18:00", isOpen: true },
  { dayOfWeek: "THU", openTime: "09:00", closeTime: "18:00", isOpen: true },
  { dayOfWeek: "FRI", openTime: "09:00", closeTime: "18:00", isOpen: true },
  { dayOfWeek: "SAT", openTime: "10:00", closeTime: "20:00", isOpen: true },
  { dayOfWeek: "SUN", openTime: "", closeTime: "", isOpen: false },
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

const RestaurantForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<RestaurantFormData>({
    name: "",
    address: "",
    area: "",
    phone: "",
    description: "",
  });

  /** ✅ 카테고리 관련 상태 */
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  /** ✅ 영업시간 상태 */
  const [hours, setHours] = useState<RestaurantHoursForm[]>(INITIAL_HOURS);

  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  // ✅ 1. 카테고리 목록 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosApi.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("카테고리 불러오기 실패:", err);
      }
    };
    fetchCategories();
  }, []);

  // ✅ 2. 수정 모드: 레스토랑 기본 정보 불러오기
  useEffect(() => {
    if (!isEditMode) return;

    const fetchRestaurant = async () => {
      try {
        const res = await axiosApi.get(`/restaurants/${id}`);
        const { name, address, area, phone, description, categoryIds } =
          res.data;

        setFormData({ name, address, area, phone, description });

        if (categoryIds && Array.isArray(categoryIds)) {
          setSelectedCategories(categoryIds);
        }
      } catch (err) {
        console.error("식당 데이터 로드 실패:", err);
        setError("店舗情報の読み込みに失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id, isEditMode]);

  // ✅ 3. 수정 모드: 영업시간 불러오기 (GET /hours)
  useEffect(() => {
    if (!isEditMode || !id) return;

    const fetchHours = async () => {
      try {
        const res = await axiosApi.get(`/restaurants/${id}/hours`);
        const serverHours = res.data as Array<{
          dayOfWeek: DayOfWeekType;
          openTime: string | null;
          closeTime: string | null;
          isOpen: boolean;
        }>;

        // 서버 응답(HH:mm:ss)을 프론트(HH:mm)로 맞추기
        setHours((prev) =>
          prev.map((h) => {
            const found = serverHours.find((x) => x.dayOfWeek === h.dayOfWeek);
            if (!found) return h;

            return {
              ...h,
              openTime: found.openTime ? found.openTime.slice(0, 5) : "",
              closeTime: found.closeTime ? found.closeTime.slice(0, 5) : "",
              isOpen: found.isOpen,
            };
          })
        );
      } catch (err) {
        console.error("영업시간 로드 실패:", err);
        // 영업시간이 아직 세팅되지 않은 가게일 수도 있으니 여기선 에러를 띄우지 않아도 됨
      }
    };

    fetchHours();
  }, [id, isEditMode]);

  // ✅ 입력값 변경 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ 카테고리 체크박스 핸들러
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((x) => x !== categoryId)
        : [...prev, categoryId]
    );
  };

  // ✅ 영업시간 변경 핸들러
  const handleHoursChange = (
    dayOfWeek: DayOfWeekType,
    field: "openTime" | "closeTime" | "isOpen",
    value: string | boolean
  ) => {
    setHours((prev) =>
      prev.map((h) =>
        h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h
      )
    );
  };

  // ✅ "HH:mm" -> "HH:mm:00" / 빈 값 -> null
  const toTimeWithSecondsOrNull = (time: string): string | null => {
    if (!time) return null;
    if (time.length === 8) return time; // 이미 HH:mm:ss면 그대로
    return `${time}:00`;
  };

  // ✅ 영업시간 간단 검증 (영업 체크인데 시간 비어있으면 막기)
  const validateHours = (): boolean => {
    for (const h of hours) {
      if (h.isOpen) {
        if (!h.openTime || !h.closeTime) {
          alert(`${DAY_LABELS[h.dayOfWeek]}曜日の営業時間を入力してください。`);
          return false;
        }
        if (h.openTime >= h.closeTime) {
          alert(
            `${
              DAY_LABELS[h.dayOfWeek]
            }曜日の閉店時間は開店時間より後にしてください。`
          );
          return false;
        }
      }
    }
    return true;
  };

  // ✅ 등록 / 수정 요청
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!validateHours()) return;

    const requestData = {
      ...formData,
      categoryIds: selectedCategories,
    };

    try {
      if (isEditMode && id) {
        // 1) 기본 정보 수정
        await axiosApi.put(`/restaurants/${id}`, requestData);

        // 2) 영업시간 수정 (요일별 PUT)
        const payload = hours.map((h) => ({
          dayOfWeek: h.dayOfWeek,
          openTime: h.isOpen ? toTimeWithSecondsOrNull(h.openTime) : null,
          closeTime: h.isOpen ? toTimeWithSecondsOrNull(h.closeTime) : null,
          isOpen: h.isOpen,
        }));

        await Promise.all(
          payload.map((p) =>
            axiosApi.put(`/restaurants/${id}/hours/${p.dayOfWeek}`, p)
          )
        );

        alert("店舗情報を更新しました。");
      } else {
        // 1) 레스토랑 등록 (응답에서 id 필요)
        const res = await axiosApi.post("/restaurants", requestData);

        // ⚠️ 여기 응답 구조가 다르면 맞춰서 수정해야 함
        const newRestaurantId: number = res.data?.id;

        if (!newRestaurantId) {
          throw new Error("레스토랑 생성 응답에서 id를 찾을 수 없습니다.");
        }

        // 2) 영업시간 초기 세팅 (POST /hours)
        const payload = hours.map((h) => ({
          dayOfWeek: h.dayOfWeek,
          openTime: h.isOpen ? toTimeWithSecondsOrNull(h.openTime) : null,
          closeTime: h.isOpen ? toTimeWithSecondsOrNull(h.closeTime) : null,
          isOpen: h.isOpen,
        }));

        await axiosApi.post(`/restaurants/${newRestaurantId}/hours`, payload);

        alert("新しいレストランを登録しました。");
      }

      navigate("/restaurants");
    } catch (err) {
      console.error("요청 실패:", err);
      setError("データの送信に失敗しました。");
    }
  };

  if (loading) return <p className="loading">読み込み中...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="restaurant-form-container">
      <h2>{isEditMode ? "店舗情報の編集" : "新しいレストランを登録"}</h2>

      <form onSubmit={handleSubmit} className="restaurant-form">
        <label>
          店舗名
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          住所
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          エリア（地域）
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="例: 大邱広域市"
            required
          />
        </label>

        <label>
          電話番号
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </label>

        <label>
          説明
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </label>

        {/* ✅ 카테고리 선택 */}
        <div className="category-section">
          <p>カテゴリー選択</p>
          <div className="category-list">
            {Array.isArray(categories) &&
              categories.map((cat) => (
                <label key={cat.id} className="category-item">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => handleCategoryChange(cat.id)}
                  />
                  {cat.name}
                </label>
              ))}
          </div>
        </div>

        {/* ✅ 요일별 영업시간 설정 */}
        <div className="hours-section">
          <p>営業時間の設定</p>

          <table className="hours-table">
            <thead>
              <tr>
                <th>曜日</th>
                <th>営業</th>
                <th>開店</th>
                <th>閉店</th>
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
                        handleHoursChange(
                          h.dayOfWeek,
                          "isOpen",
                          e.target.checked
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={h.openTime}
                      disabled={!h.isOpen}
                      onChange={(e) =>
                        handleHoursChange(
                          h.dayOfWeek,
                          "openTime",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={h.closeTime}
                      disabled={!h.isOpen}
                      onChange={(e) =>
                        handleHoursChange(
                          h.dayOfWeek,
                          "closeTime",
                          e.target.value
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button type="submit" className="submit-btn">
          {isEditMode ? "更新する" : "登録する"}
        </button>
      </form>
    </div>
  );
};

export default RestaurantForm;
