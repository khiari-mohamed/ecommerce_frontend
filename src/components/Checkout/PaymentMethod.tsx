import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface PaymentMethodType {
  _id: string;
  key: string;
  label: string;
  icon?: string;
  enabled: boolean;
}
interface PaymentMethodProps {
  value: string;
  onChange: (val: string) => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  onChange,
  value: selectedPayment,
}) => {
  const [methods, setMethods] = useState<PaymentMethodType[]>([]);
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(selectedPayment || "");

  useEffect(() => {
    async function fetchMethods() {
      try {
        const res = await axios.get(`${API_BASE}/payment-methods`);
        setMethods(res.data);
        // Set default if not set
        if (!payment && res.data.length > 0) {
          setPayment(res.data[0].key);
          onChange(res.data[0].key);
        }
      } catch (err: any) {
        toast.error("Failed to load payment methods");
      } finally {
        setLoading(false);
      }
    }
    fetchMethods();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setPayment(selectedPayment);
  }, [selectedPayment]);

  const handleSelect = (key: string) => {
    setPayment(key);
    onChange(key);
  };

  if (loading) {
    return (
      <div className="bg-white shadow-1 rounded-[10px] mt-7.5 p-8.5">
        <p>Loading payment methods...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Payment Method</h3>
      </div>
      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-3">
          {methods.map((method) => (
            <label
              key={method.key}
              htmlFor={method.key}
              className="flex cursor-pointer select-none items-center gap-4"
            >
              <div className="relative">
                <input
                  type="radio"
                  name="payment"
                  id={method.key}
                  checked={payment === method.key}
                  onChange={() => handleSelect(method.key)}
                  className="sr-only"
                />
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full ${
                    payment === method.key
                      ? "border-4 border-blue"
                      : "border border-gray-4"
                  }`}
                ></div>
              </div>
              <div
                className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none min-w-[240px] ${
                  payment === method.key
                    ? "border-transparent bg-gray-2"
                    : " border-gray-4 shadow-1"
                }`}
              >
                <div className="flex items-center">
                  {method.icon && (
                    <div className="pr-2.5">
                      <Image
                        src={method.icon}
                        alt={method.key}
                        width={
                          method.key === "payme"
                            ? 75
                            : method.key === "cash"
                            ? 21
                            : 29
                        }
                        height={method.key === "payme" ? 20 : 21}
                      />
                    </div>
                  )}
                  <div className="border-l border-gray-4 pl-2.5">
                    <p>{method.label}</p>
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;