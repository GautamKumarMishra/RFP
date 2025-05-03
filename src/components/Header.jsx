import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <header id="page-topbar">
      <div className="navbar-header">
        <div className="d-flex">
          <div className="navbar-brand-box">
            <a href="/" className="logo logo-light">
              <span className="logo-sm">
                <img src="/assets/images/velocity_logo.png" alt="Logo" height="40" />
              </span>
              <span className="logo-lg">
                <img src="/assets/images/velocity_logo.png" alt="Logo" />
              </span>
            </a>
          </div>
        </div>
        <div className="d-flex pr-2">
          <div className="dropdown d-inline-block">
            {isLoggedIn ? (
              <>
                <span className="d-none d-xl-inline-block ml-1">Welcome Henry</span>
                &nbsp;&nbsp;
                <a href="#" onClick={handleLogout}>Logout</a>
              </>
            ) : (
              <a href="#" onClick={handleLogin}>Login</a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}