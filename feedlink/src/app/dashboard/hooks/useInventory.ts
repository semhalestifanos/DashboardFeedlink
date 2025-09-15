"use client";

import { useState, useEffect, useCallback } from "react";

export type Listing = {
  listing_id: number;
  product_type: string;
  quantity: string;
  category: string;
  expiry_date: string;
  status: string;
};

const API_URL = "http://localhost:8000/api/listings/";

export default function useInventory() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch listings");
      const data = await res.json();
      setListings(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return { listings, loading, error, refresh: fetchListings };
}