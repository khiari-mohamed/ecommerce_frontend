import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
interface CouponProps {
  value: string;
  onChange: (val: string) => void;
}

const Coupon : React.FC<CouponProps> = ({ value, onChange }) => {
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoupon(e.target.value);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupon.trim()) {
      toast.error("Please enter a coupon code.");
      return;
    }
    setLoading(true);
    try {
      // Adjust the endpoint as per your backend
      const res = await axios.post(`${API_BASE}/promo-codes/validate`, {
        code: coupon.trim(),
      });
      if (res.data.valid) {
        toast.success(res.data.message || "Coupon applied!");
        // Optionally, update cart/discount state here
      } else {
        toast.error(res.data.message || "Invalid coupon code.");
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to validate coupon code."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Have any Coupon Code?</h3>
      </div>

      <div className="py-8 px-4 sm:px-8.5">
        <div className="flex gap-4">
          <input
            type="text"
            name="coupon"
            id="coupon"
            placeholder="Enter coupon code"
            value={coupon}
            onChange={handleChange}
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            disabled={loading}
          />

          <button
            type="button"
            className="inline-flex font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
            disabled={loading}
            onClick={handleApply}
          >
            {loading ? "Applying..." : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Coupon;
