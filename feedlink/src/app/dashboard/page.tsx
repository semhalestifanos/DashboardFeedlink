"use client";

import React from "react";
import Sidebar from "./components/Sidebar";
import Inventory from "./components/Inventory";

const DashboardPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Inventory />
      </main>
    </div>
  );
};

export default DashboardPage;