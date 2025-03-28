import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Admin Dashboard</h2>
      <ul className="sidebar-menu">
        <li>
          <Link
            to="/admin"
            className={`sidebar-link ${location.pathname === "/admin" ? "active" : ""}`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/admin/users"
            className={`sidebar-link ${location.pathname === "/admin/users" ? "active" : ""}`}
          >
            Users
          </Link>
        </li>
        <li>
          <Link
            to="/admin/courses"
            className={`sidebar-link ${location.pathname === "/admin/courses" ? "active" : ""}`}
          >
            Courses
          </Link>
        </li>
        <li>
          <Link
            to="/admin/analytics"
            className={`sidebar-link ${location.pathname === "/admin/analytics" ? "active" : ""}`}
          >
            Analytics
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;