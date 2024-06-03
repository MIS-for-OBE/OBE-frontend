import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@mantine/core/styles.css";
import "tailwindcss/tailwind.css";
import "./App.css";
import Sidebar from "./component/Sidebar";
import Navbar from "./component/Navbar";
import Login from "./pages/login";
import SelectDepartment from "./pages/selectDepartment";
import Dashboard from "./pages/dashboard";

function App() {
  const location = window.location.pathname;
  const showSidebar = !["/", "/select-department"].includes(location);
  const showNavbar = !["/", "/select-department"].includes(location);

  return (
    <Router>
      <div
        className={`flex  h-screen w-screen ${
          showSidebar ? "sidebar-linear-gradient" : ""
        }`}
      >
        {showSidebar && <Sidebar />}
        <div className="flex flex-col w-full">
          {showNavbar && <Navbar />}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/select-department" element={<SelectDepartment />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
