"use client";

import useCartStore from "@/store";
import Image from "next/image";
import React from "react";

const AddToCartButton = ({ product, disabled }: { product: any, disabled?: boolean }) => {

  const {
    items,
    addItem,
    decreaseQuantity,
    getTotal,
    increaseQuantity,
    removeItem,
    isCartOpen,
    toggleCartOpen,
  } = useCartStore();
  const handleAddToCart = () => {
    if (!disabled) {
      addItem({
        ...product,
        quantity: 1,
        price: product.promo ? product.promo : product.prix,
      });
      toggleCartOpen();
    }
  };
  return (
    <div className="relative button_prod ">
      <button
        onClick={handleAddToCart}
        className={`w-full h-13 text-white roundedd text-center flex items-center justify-center 
          ${disabled ? "bg-gray-300 cursor-not-allowed" : "bg-bleu"}`}
        disabled={disabled}
      >
        <span className="mt-1 mb-1 spangbutton">Ajouter</span>
        <Image
          src="/img/add-cart.png"
          width={20}
          height={20}
          alt="Ajouter au panier Icon"
          className="ml-2 mt-1 mb-1 mr-1"
        />
      </button>
    </div>
  );
}

export default AddToCartButton;
