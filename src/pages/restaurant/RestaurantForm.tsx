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

interface Category {
  id: number;
  name: string;
}

type DayOfWeekType = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

interface RestaurantHoursForm {
  dayOfWeek: DayOfWeekType;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

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

type PaymentMethodType = "CASH" | "CREDIT_CARD" | "E_MONEY" | "QR_PAY";

interface RestaurantDetailFormData {
  description: string;
  privateRoom: boolean;
  smoking: boolean;
  unlimitDrink: boolean;
  unlimitFood: boolean;
  parkingArea: boolean;
  seatCount: string;
  averagePrice: string;
  paymentMethods: PaymentMethodType[];
}

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

const PAYMENT_METHOD_OPTIONS: PaymentMethodType[] = [
  "CASH",
  "CREDIT_CARD",
  "E_MONEY",
  "QR_PAY",
];

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

  const [formData, setFormData] = useState<RestaurantFormData>({
    name: "",
    address: "",
    area: "",
    phone: "",
    description: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [hours, setHours] = useState<RestaurantHoursForm[]>(INITIAL_HOURS);
  const [detailData, setDetailData] =
    useState<RestaurantDetailFormData>(INITIAL_DETAIL);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosApi.get("/categories").then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (!isEditMode) return;
    axiosApi.get(`/restaurants/${id}`).then((res) => {
      const { name, address, area, phone, description, categoryIds } = res.data;
      setFormData({ name, address, area, phone, description });
      setSelectedCategories(categoryIds || []);
      setLoading(false);
    });
  }, [id, isEditMode]);

  useEffect(() => {
    if (!isEditMode || !id) return;
    axiosApi.get(`/restaurants/${id}/hours`).then((res) => {
      setHours((prev) =>
        prev.map((h) => {
          const found = res.data.find((x: any) => x.dayOfWeek === h.dayOfWeek);
          return found
            ? {
                ...h,
                openTime: found.openTime?.slice(0, 5) || "",
                closeTime: found.closeTime?.slice(0, 5) || "",
                isOpen: found.isOpen,
              }
            : h;
        })
      );
    });
  }, [id, isEditMode]);

  useEffect(() => {
    if (!isEditMode || !id) return;
    axiosApi.get(`/restaurants/${id}/detail`).then((res) => {
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
    });
  }, [id, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleDetailChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setDetailData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const toggleCategory = (id: number) =>
    setSelectedCategories((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );

  const togglePayment = (m: PaymentMethodType) =>
    setDetailData((p) => ({
      ...p,
      paymentMethods: p.paymentMethods.includes(m)
        ? p.paymentMethods.filter((x) => x !== m)
        : [...p.paymentMethods, m],
    }));

  const toggleHour = (
    day: DayOfWeekType,
    key: keyof RestaurantHoursForm,
    value: any
  ) =>
    setHours((p) =>
      p.map((h) => (h.dayOfWeek === day ? { ...h, [key]: value } : h))
    );

  const toTime = (t: string) => (t ? `${t}:00` : null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const restaurantPayload = {
      ...formData,
      categoryIds: selectedCategories,
    };

    const detailPayload = {
      ...detailData,
      seatCount: detailData.seatCount ? Number(detailData.seatCount) : null,
    };

    try {
      if (isEditMode && id) {
        await axiosApi.put(`/restaurants/${id}`, restaurantPayload);
        await axiosApi.put(`/restaurants/${id}/detail`, detailPayload);

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
        const res = await axiosApi.post("/restaurants", restaurantPayload);
        const newId = res.data.id;

        await axiosApi.post(`/restaurants/${newId}/detail`, detailPayload);
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
      navigate("/restaurants");
    } catch {
      setError("データの送信に失敗しました。");
    }
  };

  if (loading) return <p className="loading">読み込み中...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="restaurant-form-container">
      <h2>{isEditMode ? "店舗情報の編集" : "新しいレストランを登録"}</h2>

      <form className="restaurant-form" onSubmit={handleSubmit}>
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

        <div className="form-row full">
          <label>
            説明
            <textarea
              name="description"
              value={formData.description}
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
