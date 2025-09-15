"use client";

import React, { useState, useMemo } from "react";
import useInventory from "../../hooks/useInventory";
import useModal from "../../hooks/useModal";
import AddItem from "../AddItem";
import Csv from "../Csv";
import { isExpired, isExpiringSoon } from "../../utils/date";
import { FaSearch } from "react-icons/fa";
const COLOR_DARK_GREEN = "#234B06";
const COLOR_ORANGE = "#FF8614";

const Inventory = () => {
  const { listings, loading, error, refresh } = useInventory();
  const { modalOpen, modalContent, openModal, closeModal, setModalContent } =
    useModal();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const listingsWithStatus = useMemo(() => {
    return listings.map((item) => {
      const expired = isExpired(item.expiry_date);
      return {
        ...item,
        status: expired ? "expired" : "available",
        quantity: Number(item.quantity),
      };
    });
  }, [listings]);

  const filteredListings = useMemo(() => {
    return listingsWithStatus
      .filter((item) =>
        categoryFilter === "All" ? true : item.category === categoryFilter
      )
      .filter((item) =>
        statusFilter === "All" ? true : item.status === statusFilter
      )
      .filter((item) =>
        item.product_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [listingsWithStatus, categoryFilter, statusFilter, searchTerm]);

  const pageCount = Math.ceil(filteredListings.length / itemsPerPage);

  const paginatedListings = filteredListings.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalItems = listings.length;
  const expiringSoonCount = listingsWithStatus.filter(
    (item) => !isExpired(item.expiry_date) && isExpiringSoon(item.expiry_date)
  ).length;

  const expiredCount = listingsWithStatus.filter(
    (item) => item.status === "expired"
  ).length;

  const categoryOptions = useMemo(() => {
    const cats = new Set(listings.map((item) => item.category));
    return ["All", ...Array.from(cats)];
  }, [listings]);

  const handleUploadClick = () => {
    setModalContent("uploadMethod");
    openModal();
  };

  const renderModalContent = () => {
    switch (modalContent) {
      case "uploadMethod":
        return (
          <div className="p-6 bg-white rounded shadow-lg max-w-sm mx-auto text-center">
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: COLOR_DARK_GREEN }}
            >
              Choose upload method
            </h2>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => setModalContent("manual")}
                className="bg-[#234B06] text-white px-4 py-2 rounded hover:bg-[#1f4105]"
              >
                Manually
              </button>
              <button
                onClick={() => setModalContent("csv")}
                className="bg-[#234B06] text-white px-4 py-2 rounded hover:bg-[#1f4105]"
              >
                CSV file
              </button>
            </div>
            <button
              onClick={closeModal}
              className="mt-6 text-sm underline"
              style={{ color: COLOR_ORANGE }}
            >
              Cancel
            </button>
          </div>
        );
      case "manual":
        return (
          <div className="p-6 bg-white rounded shadow-lg max-w-lg mx-auto">
            <AddItem
              onSuccess={() => {
                closeModal();
                refresh();
              }}
              onCancel={closeModal}
            />
          </div>
        );
      case "csv":
        return (
          <div className="p-6 bg-white rounded shadow-lg max-w-lg mx-auto">
            <Csv
              onSuccess={() => {
                closeModal();
                refresh();
              }}
              onCancel={closeModal}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className=" font-nunito  p-6 bg-gray-50 min-h-screen mt-10 ml-6 mr-6">
      <h1
        className="text-4xl font-bold mb-8"
        style={{ color: COLOR_DARK_GREEN, overflow: "hidden", }}
      >
        Inventory Management
      </h1>

      {/* Summary cards */}
      <div className="flex gap-7 mb-10">
        <div
          className="p-5 rounded shadow flex-1 text-center"
          style={{ backgroundColor: "#9FB68E", color: "" }}
        >
          <div className="text-2xl">Total items</div>
          <div className="text-2xl font-semibold">{totalItems}</div>

          <div className="text-2xl opacity-80">across all categories</div>
        </div>
        <div
          className=" font-nunito p-5 rounded shadow flex-1 text-center"
          style={{ backgroundColor: "#9FB68E", color: "" }}
        >
          <div className="text-2xl">Expiring soon</div>
          <div className="text-2xl font-semibold">{expiringSoonCount}</div>

          <div className="text-2xl opacity-80">expiring within 3 days</div>
        </div>
        <div
          className=" font-nunito p-5 rounded shadow flex-1 text-center"
          style={{ backgroundColor: "#9FB68E", color: "" }}
        >
          <div className="text-2xl">Expired items</div>
          <div className="text-2xl font-semibold">{expiredCount}</div>

          <div className="text-2xl opacity-80">Recycled</div>
        </div>
      </div>

      { }
      <div className="font-nunito flex flex-wrap items-center gap-4 mb-8">
        <input
          type="search"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded px-3 py-1 focus:outline-[#234B06] focus:ring-1 focus:ring-[#234B06] flex-grow max-w-xs"
        />
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="font-nunito border border-gray-300 rounded px-3 py-1 focus:outline-[#234B06]"
        >
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="font-nunito border border-gray-300 rounded px-3 py-1 focus:outline-[#234B06]"
        >
          <option value="All">All status</option>
          <option value="available">Available</option>
          <option value="expired">Expired</option>
        </select>

        <button
          onClick={handleUploadClick}
          className="ml-auto px-4 py-2 rounded text-white"
          style={{ backgroundColor: COLOR_DARK_GREEN }}
        >
          Upload
        </button>
      </div>

      { }
      <div className="font-nunito overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead style={{ backgroundColor: COLOR_ORANGE, color: "white" }}>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold border-r border-gray-300">Item</th>
              <th className="px-4 py-2 text-left text-sm font-semibold border-r border-gray-300">Quantity</th>
              <th className="px-4 py-2 text-left text-sm font-semibold border-r border-gray-300">Category</th>
              <th className="px-4 py-2 text-left text-sm font-semibold border-r border-gray-300">Expiry</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-red-600">
                  Failed to load listings.
                </td>
              </tr>
            )}
            {!loading && !error && paginatedListings.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No items found.
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              paginatedListings.map((item) => (
                <tr key={item.listing_id} className="hover:bg-[#f0f5eb] border-b border-gray-200">
                  <td className="px-4 py-2 border-r border-gray-200">{item.product_type}</td>
                  <td className="px-4 py-2 border-r border-gray-200">{item.quantity}</td>
                  <td className="px-4 py-2 border-r border-gray-200">{item.category}</td>
                  <td className="px-4 py-2 border-r border-gray-200">
                    {item.expiry_date && !isNaN(new Date(item.expiry_date).getTime())
                      ? new Date(item.expiry_date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${item.status === "available"
                        ? "bg-[#234B06] text-white"
                        : "bg-[#FF8614] text-white"
                        }`}
                    >
                      {item.status
                        ? item.status[0].toUpperCase() + item.status.slice(1)
                        : ""}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      { }
      {pageCount > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50"
          >
            &lt;
          </button>
          {[...Array(pageCount)].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`px-3 py-1 rounded border border-gray-300 ${pageNum === page
                  ? "bg-[#234B06] text-white"
                  : "hover:bg-[#f0f5eb]"
                  }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            disabled={page === pageCount}
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}

      {/* Modal Overlay */}
      {modalOpen && (
        <div
          onClick={closeModal}
          className="font-nunito fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl mx-auto"
          >
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;