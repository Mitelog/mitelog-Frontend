import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const menuItems = [
    { name: "대시보드", path: "/admin" },
    { name: "회원 관리", path: "/admin/members" },
    { name: "식당 관리", path: "/admin/restaurants" },
    { name: "리뷰 관리", path: "/admin/reviews" },
  ];

  return (
    <aside className="sidebar">
      <h2>관리자 페이지</h2>
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={pathname === item.path ? "active" : ""}
          >
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
