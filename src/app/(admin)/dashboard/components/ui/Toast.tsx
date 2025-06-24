import React, { useEffect } from "react";

interface ToastProps {
  toast: { type: "success" | "error"; message: string } | null;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div
      className={`fixed top-8 right-8 z-50 px-6 py-3 rounded-xl shadow-xl text-white font-bold transition-all ${
        toast.type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {toast.message}
    </div>
  );
};

export default Toast;