import React, { useState } from "react";

interface AddItemProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddItem: React.FC<AddItemProps> = ({ onSuccess, onCancel }) => {
  const [productType, setProductType] = useState<string>("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [originalPrice, setOriginalPrice] = useState<string>("");
  const [discountedPrice, setDiscountedPrice] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [unit, setUnit] = useState<string>("");
  const [uploadMethod, setUploadMethod] = useState<string>("");
  const [pickupWindowDuration, setPickupWindowDuration] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    } else {
      setImage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!productType) {
      setError("Please select the product type.");
      setLoading(false);
      return;
    }
    if (quantity === "" || quantity <= 0) {
      setError("Quantity must be greater than zero.");
      setLoading(false);
      return;
    }
    if (!unit) {
      setError("Please select a unit.");
      setLoading(false);
      return;
    }
    if (!uploadMethod) {
      setError("Please select an upload method.");
      setLoading(false);
      return;
    }
    if (!pickupWindowDuration) {
      setError("Please select a pickup window duration.");
      setLoading(false);
      return;
    }

    if (productType === "edible") {
      if (
        originalPrice !== "" &&
        (isNaN(Number(originalPrice)) || Number(originalPrice) < 0)
      ) {
        setError("Original price must be a positive number or empty.");
        setLoading(false);
        return;
      }
      if (
        discountedPrice !== "" &&
        (isNaN(Number(discountedPrice)) || Number(discountedPrice) < 0)
      ) {
        setError("Discounted price must be a positive number or empty.");
        setLoading(false);
        return;
      }
    }

    if (expiryDate && isNaN(new Date(expiryDate).getTime())) {
      setError("Please enter a valid expiry date.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("product_type", productType);
      formData.append("quantity", quantity.toString());
      formData.append("unit", unit);
      formData.append("upload_method", uploadMethod);
      formData.append("pickup_window_duration", pickupWindowDuration);

      if (category) formData.append("category", category);
      if (description) formData.append("description", description);
      if (originalPrice !== "") formData.append("original_price", originalPrice);
      if (discountedPrice !== "") formData.append("discounted_price", discountedPrice);
      if (expiryDate) formData.append("expiry_date", expiryDate);
      if (image) formData.append("image", image);

      const response = await fetch("http://localhost:8000/api/listings/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.detail || "Failed to add item. Please try again.";
        setError(errorMessage);
        setLoading(false);
        return;
      }

      onSuccess();
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg h-[85vh] flex flex-col">
      {/* Scrollable form container */}
      <form
        onSubmit={handleSubmit}
        className="flex-grow overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-[#FF8614] scrollbar-track-[#234B06]"
        style={{ scrollbarWidth: "thin" }}
      >
        {error && (
          <p className="text-[#FF8614] mb-6 bg-[#234B06] bg-opacity-20 p-3 rounded border border-[#FF8614]">
            {error}
          </p>
        )}

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-[#234B06]">
            Product Type <span className="text-[#FF8614]">*</span>
          </label>
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className="w-full border border-[#234B06] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8614] transition"
          >
            <option value="">Select product type</option>
            <option value="edible">Edible</option>
            <option value="inedible">Inedible</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-[#234B06]">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="w-full border border-[#234B06] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8614] transition"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-[#234B06]">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={3}
            className="w-full border border-[#234B06] rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#FF8614] transition"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-[#234B06]">
            Quantity <span className="text-[#FF8614]">*</span>
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-full border border-[#234B06] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8614] transition"
            required
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-[#234B06]">
            Unit <span className="text-[#FF8614]">*</span>
          </label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full border border-[#234B06] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8614] transition"
          >
            <option value="">Select unit</option>
            <option value="kg">Kg (weight)</option>
            <option value="L">L (volume)</option>
            <option value="unit">Unit (count)</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-[#234B06]">Original Price</label>
          <input
            type="number"
            min="0"
            step="any"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="Original price"
            className="w-full border border-[#234B06] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8614] transition"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-[#234B06]">Discounted Price</label>
          <input
            type="number"
            min="0"
            step="any"
            value={discountedPrice}
            onChange={(e) => setDiscountedPrice(e.target.value)}
            placeholder="Discounted price"
            className="w-full border border-[#234B06] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8614] transition"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-[#234B06]">Expiry Date</label>
          <input
            type="datetime-local"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full border border-[#234B06] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8614] transition"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-[#234B06]">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-[#234B06]">
            Upload Method <span className="text-[#FF8614]">*</span>
          </label>
          <select
            value={uploadMethod}
            onChange={(e) => setUploadMethod(e.target.value)}
            className="w-full border border-[#234B06] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8614] transition"
          >
            <option value="">Select upload method</option>
            <option value="manual">Manual</option>
            <option value="csv">CSV</option>
            <option value="api">API</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold text-[#234B06]">
            Pickup Window Duration <span className="text-[#FF8614]">*</span>
          </label>
          <input
            type="datetime-local"
            value={pickupWindowDuration}
            onChange={(e) => setPickupWindowDuration(e.target.value)}
            className="w-full border border-[#234B06] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8614] transition"
          />
        </div>
      </form>

      {/* Sticky footer buttons */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#234B06]">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="bg-[#FF8614] text-[#234B06] font-semibold px-6 py-2 rounded-md hover:bg-[#e4760f] transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            const formElement = e.currentTarget.closest("div")?.previousElementSibling as HTMLFormElement;
            formElement?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
          }}
          disabled={loading}
          className="bg-[#234B06] text-white px-6 py-2 rounded-md hover:bg-[#1f3e05] transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Item"}
        </button>
      </div>
    </div>
  );
};

export default AddItem;