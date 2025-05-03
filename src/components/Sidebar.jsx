import React from "react";

export default function Sidebar() {
    return (
        <div className="vertical-menu">
          <div data-simplebar className="h-100">
            <div id="sidebar-menu">
              <ul className="metismenu list-unstyled" id="side-menu">
                <li>
                  <a href="/dashboard" className="waves-effect">
                    <i className="mdi mdi-file-document-box-outline"></i>
                    <span>Dashboard</span>
                  </a>
                </li>
                <li>
                  <a href="/vendors" className="waves-effect">
                    <i className="mdi mdi-receipt"></i>
                    <span>Vendors</span>
                  </a>
                </li>
                <li>
                  <a href="/rfp" className="waves-effect">
                    <i className="mdi mdi-flip-vertical"></i>
                    <span>RFP Lists</span>
                  </a>
                </li>
                <li>
                  <a href="/users" className="waves-effect">
                    <i className="mdi mdi-apps"></i>
                    <span>User Management</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="waves-effect">
                    <i className="mdi mdi-weather-night"></i>
                    <span>Categories</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
}