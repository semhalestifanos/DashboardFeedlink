"use client";

import React, { useState } from "react";
import { parseCSV } from "../../utils/csv";

type CsvProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

const UPLOAD_URL = "http://localhost:8000/api/listings/upload-csv/";

const Csv: React.FC<CsvProps> = ({ onSuccess, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a CSV file to upload.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "CSV upload failed");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 text-left"
      encType="multipart/form-data"
    >
      <h2 className="text-xl font-semibold mb-4">Upload CSV File</h2>

      {error && (
        <div className="text-red-600 text-sm mb-2">{error}</div>
      )}

      <input
        type="file"
        accept=".csv,text/csv"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-700 file:text-white hover:file:bg-green-800 cursor-pointer"
      />

      <div className="flex justify-end gap-4 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-green-700 text-white hover:bg-green-800 disabled:opacity-70"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </form>
  );
};

export default Csv;