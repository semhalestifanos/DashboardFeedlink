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

interface SidebarProps {
  activePath: string;
}

const Sidebar = ({ activePath }: SidebarProps) => {
  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: <FiGrid size={19} /> },
    { label: "Inventory", href: "/dashboard/Inventory", icon: <FiBox size={19} /> },
    { label: "Waste Claims", href: "/dashboard/WasteClaims", icon: <FiTrash2 size={19} /> },
    { label: "Orders", href: "/dashboard/Orders", icon: <FiShoppingCart size={19} /> },
  ];

  return (
    <aside
      className="w-72 min-h-screen relative flex flex-col"
      style={{
        backgroundImage: 'url("/images/sidebar.png")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom',
        color: 'white',
      }}
    >
      <div className="absolute top-16 left-8 flex flex-col items-start gap-2 select-none">
        <img
          src="/images/logocolor.svg"
          alt="FeedLink Logo"
          width={350}
          height={70}
          className="object-contain"
        />
      </div>

      <nav className="flex flex-col gap-3 px-6 pt-40 pb-6 flex-grow">
        {menuItems.map(({ label, href, icon }) => {
          const isActive = activePath === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-md px-4 py-2 cursor-pointer transition-colors duration-200
                ${isActive
                  ? "bg-white text-orange-500 font-semibold"
                  : "text-white hover:bg-white hover:text-orange-500"
                }`}
            >
              {icon}
              <span className="text-lg">{label}</span>
            </Link>
          );
        })}

        <div className="mt-auto" />

        <Link
          href="/logout"
          className="flex items-center gap-3 rounded-md px-4 py-2 text-white hover:bg-white hover:text-orange-500 transition-colors duration-200 mb-30"
        >
          <FiLogOut size={20} />
          <span className="text-lg">Log Out</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;


