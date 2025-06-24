import React from "react";
import Image from "next/image";

interface ShippingMethodProps {
  value: string;
  onChange: (val: string) => void;
}

const SHIPPING_OPTIONS = [
  {
    key: "free",
    label: "Free Shipping",
    price: 0,
    description: "Standard Shipping",
    icon: null,
  },
  {
    key: "fedex",
    label: "FedEx",
    price: 10.99,
    description: "Standard Shipping",
    icon: "/images/checkout/fedex.svg",
  },
  {
    key: "dhl",
    label: "DHL",
    price: 12.5,
    description: "Standard Shipping",
    icon: "/images/checkout/dhl.svg",
  },
];

const ShippingMethod: React.FC<ShippingMethodProps> = ({ value, onChange }) => {
  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Shipping Method</h3>
      </div>
      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-4">
          {SHIPPING_OPTIONS.map((option) => (
            <label
              key={option.key}
              htmlFor={option.key}
              className="flex cursor-pointer select-none items-center gap-3.5"
            >
              <div className="relative">
                <input
                  type="radio"
                  name="shipping"
                  id={option.key}
                  checked={value === option.key}
                  onChange={() => onChange(option.key)}
                  className="sr-only"
                />
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full ${
                    value === option.key
                      ? "border-4 border-blue"
                      : "border border-gray-4"
                  }`}
                ></div>
              </div>
              {option.icon ? (
                <div className="rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none">
                  <div className="flex items-center">
                    <div className="pr-4">
                      <Image
                        src={option.icon}
                        alt={option.key}
                        width={64}
                        height={20}
                      />
                    </div>
                    <div className="border-l border-gray-4 pl-4">
                      <p className="font-semibold text-dark">
                        {option.price === 0
                          ? "Gratuit"
                          : `${option.price.toLocaleString("fr-TN", {
                              style: "currency",
                              currency: "TND",
                            })}`}
                      </p>
                      <p className="text-custom-xs">{option.description}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <span>{option.label}</span>
              )}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShippingMethod;