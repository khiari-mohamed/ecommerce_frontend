import React, { useState, useEffect } from "react";
import Image from "next/image";

interface PaymentMethodProps {
  value: string;
  onChange: (val: string) => void;
}

const PAYMENT_METHODS = [
  {
    key: "payme",
    label: "Paymee (Carte Bancaire)",
    icon: "/images/checkout/paymeelogo.webp",
  },
  {
    key: "cash",
    label: "Paiement à la livraison",
    icon: "/images/checkout/cash.svg", // Assurez-vous que ce fichier existe ou remplacez-le par un chemin valide
  },
];

const PaymentMethod: React.FC<PaymentMethodProps> = ({ value, onChange }) => {
  const [payment, setPayment] = useState(value || "payme");

  useEffect(() => {
    setPayment(value);
  }, [value]);

  const handleSelect = (key: string) => {
    setPayment(key);
    onChange(key);
  };

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Méthode de paiement</h3>
      </div>
      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-3">
          {PAYMENT_METHODS.map((method) => (
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
                        width={method.key === "payme" ? 75 : 29}
                        height={20}
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
