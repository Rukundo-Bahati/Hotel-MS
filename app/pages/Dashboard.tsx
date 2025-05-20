"use client";

import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role === "ADMIN") {
      navigate("/dashboard/admin");
    } else if (user?.role === "USER") {
      navigate("/dashboard/user");
    } else {
      navigate("/login");
    }
  }, [navigate, user, isAuthenticated]);

  return <Outlet />;
};

export default Dashboard;