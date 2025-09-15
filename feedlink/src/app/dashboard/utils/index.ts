export interface InventoryItem {
  listing_id: number;
  product_type: string;
  quantity: number;
  expiry_date: string;
  original_price: number;
  discounted_price?: number;
  description?: string;
  pickup_window_duration?: string;
  image?: string;
  unit?: string;
  category: string;
  status: string;
}

export const statusColors: Record<string, string> = {
  Available: "bg-green-100 text-green-700",
  Expired: "bg-red-100 text-red-700",
  "Expiring Soon": "bg-yellow-100 text-yellow-700",
  Recycled: "bg-blue-100 text-blue-700",
};

export function getStatus(item: InventoryItem) {
  const expiry = new Date(item.expiry_date);
  const now = new Date();
  if (item.status === "Expired" || expiry < now) return "Expired";
  if ((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= 3) return "Expiring Soon";
  return item.status || "Available";
}
