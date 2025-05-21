"use client";

import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const location = window.location.pathname;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Only redirect if we're at the root dashboard path
    if (location === "/dashboard") {
      if (user?.role === "ADMIN") {
        navigate("/dashboard/admin");
      } else if (user?.role === "USER") {
        navigate("/dashboard/user");
      } else {
        navigate("/login");
      }
    }
  }, [navigate, user, isAuthenticated, location]);

  return <Outlet />;
};

export default Dashboard;