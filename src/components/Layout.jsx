import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="" id="layout-wrapper">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">
          <div className="container-fluid">
            <Outlet /> {/* This renders the nested route like Dashboard */}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
