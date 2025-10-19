import React, { useEffect, useState } from "react";
import axiosApi from "../../api/axiosApi";

type RestaurantResponse = {
  id: number;
  name: string;
  area?: string;
  address?: string;
  image?: string;
  averageRating?: number;
};

const MyBookmarks: React.FC = () => {
  const [items, setItems] = useState<RestaurantResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 마이페이지 ‘ブックマーク’ 영역 진입 시 목록 호출
    setLoading(true);
    axiosApi
      .get("/bookmarks/me") // baseURL이 .../api 면 여기엔 /api 붙이면 안 됨!
      .then((res) => setItems(res.data?.data ?? []))
      .catch((err) => {
        console.error(err);
        // 401은 인터셉터에서 처리(알럿 + /login 이동)
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h3 className="text-base font-bold mb-3">🔖 ブックマーク</h3>

      {loading ? (
        <div>불러오는 중…</div>
      ) : items.length === 0 ? (
        <p className="text-gray-500">
          북마크한 가게 목록이 여기에 표시됩니다。
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((r) => (
            <li
              key={r.id}
              className="flex items-center gap-3 p-3 rounded-xl border hover:bg-gray-50"
            >
              <img
                src={r.image || "/noimg.png"}
                alt={r.name}
                className="w-12 h-12 rounded object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <div className="font-semibold truncate">{r.name}</div>
                <div className="text-sm text-gray-500 truncate">
                  {r.area || r.address || "-"} · ★ {r.averageRating ?? "-"}
                </div>
              </div>
              <a
                href={`/restaurants/${r.id}`}
                className="ml-auto text-sm underline"
              >
                상세보기
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyBookmarks;
