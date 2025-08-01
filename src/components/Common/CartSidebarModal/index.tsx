"use client";
import React, { useEffect } from "react";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import {
  removeItemFromCart,
  selectTotalPrice,
} from "@/redux/features/cart-slice";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import SingleItem from "./SingleItem";
import Link from "next/link";
import EmptyCart from "./EmptyCart";

const CartSidebarModal = () => {
  const { isCartModalOpen, closeCartModal } = useCartModalContext();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest(".modal-content")) {
        closeCartModal();
      }
    }

    if (isCartModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isCartModalOpen, closeCartModal]);

  return (
    <div
      className={`fixed inset-0 z-99999 w-full bg-dark/70 ease-linear duration-300 ${
        isCartModalOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div className="flex justify-end h-full">
        {/* Modal content container */}
        <div className={`w-full max-w-[500px] bg-white relative modal-content z-50 flex flex-col ${
          cartItems.length > 3 ? 'h-full md:h-auto' : 'h-auto'
        }`}>
          {/* Header */}
          <div className="sticky top-0 bg-white flex items-center justify-between pb-4 pt-4 sm:pb-7 sm:pt-7.5 lg:pt-11 border-b border-gray-3 px-4 sm:px-7.5 lg:px-11">
            <h2 className="font-medium text-dark text-lg sm:text-2xl">
              Voir le panier
            </h2>
            <button
              onClick={() => closeCartModal()}
              aria-label="button for close modal"
              className="flex items-center justify-center ease-in duration-150 bg-meta text-dark-5 hover:text-dark"
            >
              <svg
                className="fill-current"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5379 11.2121C12.1718 10.846 11.5782 10.846 11.212 11.2121C10.8459 11.5782 10.8459 12.1718 11.212 12.5379L13.6741 15L11.2121 17.4621C10.846 17.8282 10.846 18.4218 11.2121 18.7879C11.5782 19.154 12.1718 19.154 12.5379 18.7879L15 16.3258L17.462 18.7879C17.8281 19.154 18.4217 19.154 18.7878 18.7879C19.154 18.4218 19.154 17.8282 18.7878 17.462L16.3258 15L18.7879 12.5379C19.154 12.1718 19.154 11.5782 18.7879 11.2121C18.4218 10.846 17.8282 10.846 17.462 11.2121L15 13.6742L12.5379 11.2121Z"
                  fill=""
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15 1.5625C7.57867 1.5625 1.5625 7.57867 1.5625 15C1.5625 22.4213 7.57867 28.4375 15 28.4375C22.4213 28.4375 28.4375 22.4213 28.4375 15C28.4375 7.57867 22.4213 1.5625 15 1.5625ZM3.4375 15C3.4375 8.61421 8.61421 3.4375 15 3.4375C21.3858 3.4375 26.5625 8.61421 26.5625 15C26.5625 21.3858 21.3858 26.5625 15 26.5625C8.61421 26.5625 3.4375 21.3858 3.4375 15Z"
                  fill=""
                />
              </svg>
            </button>
          </div>

          {/* Scrollable content area */}
          <div className={`flex-1 ${cartItems.length > 3 ? 'overflow-y-auto' : ''} px-4 sm:px-7.5 lg:px-11 py-4`}>
            <div className="flex flex-col gap-6">
              {cartItems.length > 0 ? (
                cartItems.map((item, key) => (
                  <SingleItem
                    key={key}
                    item={item}
                    removeItemFromCart={removeItemFromCart}
                  />
                ))
              ) : (
                <EmptyCart />
              )}
            </div>
          </div>

          {/* Footer with buttons - sticky at bottom */}
          <div className="sticky bottom-0 bg-white border-t border-gray-3 px-4 sm:px-7.5 lg:px-11 py-4 sm:py-5 lg:py-7.5">
            <div className="flex items-center justify-between gap-5 mb-4 sm:mb-6">
              <p className="font-medium text-lg sm:text-xl text-dark">total:</p>
              <p className="font-medium text-lg sm:text-xl text-dark">
                {Number(totalPrice).toLocaleString("fr-TN", {
                  style: "currency",
                  currency: "TND",
                })}
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <Link
                onClick={() => closeCartModal()}
                href="/cart"
                className="w-full flex justify-center font-medium text-white py-3 px-6 rounded-md ease-out duration-200 text-base sm:text-lg"
                style={{ background: '#ff4500' }}
              >
                Voir le panier
              </Link>
              <Link
                onClick={() => closeCartModal()}
                href="/checkout"
                className="w-full flex justify-center font-medium text-white py-3 px-6 rounded-md ease-out duration-200 text-base sm:text-lg"
                style={{ background: '#ff944d' }}
              >
                Vérifier
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebarModal;