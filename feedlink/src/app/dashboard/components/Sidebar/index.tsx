"use client";

import React from "react";
import Link from "next/link";
import {
  FiGrid,
  FiBox,
  FiTrash2,
  FiShoppingCart,
  FiLogOut,
} from "react-icons/fi";

const Sidebar = () => {
  const activePath = "/dashboard/Inventory";

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: <FiGrid size={20} /> },
    { label: "Inventory", href: "/dashboard/Inventory", icon: <FiBox size={20} /> },
    { label: "Waste Claims", href: "/dashboard/WasteClaims", icon: <FiTrash2 size={20} /> },
    { label: "Orders", href: "/dashboard/Orders", icon: <FiShoppingCart size={20} /> },
  ];

  return (
    <aside
      className="w-72 min-h-screen flex flex-col relative" // increased width here
      style={{ backgroundColor: "#244400", color: "white" }}
    >
      {/* Logo and tagline */}
      <div className="px-8 pt-18 pb-9 flex flex-col items-start gap-2 select-none">
        <img
          src="/images/Group 161.svg"
          alt="FeedLink Logo"
          width={200} // increased width here
          height={60}
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3 px-6">
        {menuItems.map(({ label, href, icon }) => {
          const isActive = activePath === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-md px-4 py-2 cursor-pointer transition-colors duration-200
                ${
                  isActive
                    ? "bg-white text-orange-500 font-semibold"
                    : "text-white hover:text-orange-400 hover:bg-white/10"
                }`}
            >
              <span className="flex-shrink-0">{icon}</span>
              <span className="text-lg">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex-grow" />

      {}
      <Link
        href="/logout"
        className="flex items-center gap-3 px-6 py-3 text-white hover:text-orange-400 hover:bg-white/10 rounded-tl-lg cursor-pointer select-none"
        style={{ fontSize: "1rem" }}
      >
        <FiLogOut size={20} />
        Log Out
      </Link>

      {/* Bottom wave shape */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "70px",
          backgroundColor: "#244400",
          borderTopLeftRadius: "80px",
          transform: "translateY(15px)",
          zIndex: 0,
        }}
      >
        <svg
          viewBox="0 0 200 70"
          preserveAspectRatio="none"
          className="w-full h-full"
          style={{ display: "block" }}
        >
          <path d="M0 70 Q50 0 200 70 L200 70 L0 70 Z" fill="white" />
        </svg>
      </div>
    </aside>
  );
};

export default Sidebar;