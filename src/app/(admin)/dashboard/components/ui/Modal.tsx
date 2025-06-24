import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  showClose?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-2xl",
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
  showClose = true,
  className = "",
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Trap focus
  useEffect(() => {
    if (!open || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) focusable[0].focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      onClick={onClose}
      style={{ pointerEvents: "auto" }}
    >
      <div
        className={`modal relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full ${sizeMap[size]} ${className} animate-modal-in`}
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1202,
        }}
      >
        {showClose && (
          <button
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        )}
        {title && (
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>
        )}
        <div>{children}</div>
      </div>
      <style jsx>{`
        .animate-modal-in {
          animation: modalIn 0.22s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(40px) scale(0.96);}
          to { opacity: 1; transform: translateY(0) scale(1);}
        }
      `}</style>
    </div>
  );
}