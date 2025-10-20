import { useEffect, useState } from "react";
import axiosApi from "../../api/axiosApi";

type Props = { restaurantId: number };

export default function BookmarkButton({ restaurantId }: Props) {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setBookmarked(false);
      return;
    }

    let alive = true;
    (async () => {
      try {
        const { data } = await axiosApi.get("/bookmarks/me");
        const list = data?.data ?? [];
        const isBookmarked = list.some(
          (it: any) =>
            it.id === restaurantId || it.restaurantId === restaurantId
        );
        if (alive) setBookmarked(isBookmarked);
      } catch (e) {
        console.error("초기 북마크 조회 실패", e);
      }
    })();

    return () => {
      alive = false;
    };
  }, [restaurantId]);

  const handleToggle = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (loading) return;
    setLoading(true);
    try {
      if (bookmarked) {
        await axiosApi.delete(`/bookmarks/${restaurantId}`);
        setBookmarked(false);
      } else {
        await axiosApi.post(`/bookmarks/${restaurantId}`);
        setBookmarked(true);
      }
    } catch (e: any) {
      const status = e?.response?.status;
      const message = e?.response?.data?.message || e?.message;
      if (status === 409) {
        alert(message ?? "이미 처리된 상태입니다.");
      } else if (status && status !== 401) {
        alert(message ?? "요청 중 오류가 발생했습니다.");
      }
      console.error("북마크 토글 실패", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleToggle} disabled={loading}>
      {bookmarked ? "★ 북마크됨" : "☆ 북마크"}
    </button>
  );
}
