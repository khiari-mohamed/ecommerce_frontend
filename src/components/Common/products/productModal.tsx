"use client";
import { storage } from "@/const/urls";
import useCartStore from "@/store";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";

export default function ProductModal({ productslug }: { productslug: any }) {
  const [canFetch, setCanFetch] = useState(false);
  const [product, setProduct] = useState<any>(null);
  let [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const {
    addItem,
    decreaseQuantity,
    increaseQuantity,
    removeItem,
    items,
    setItemQuantity,
    toggleCartOpen,
  } = useCartStore();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
    setCanFetch(true);
  }

  const handleAddToCart = () => {
    //if product exist update the quantity
    //else add the product
    const exist = items.find((item) => item.id === product?.id);
    if (exist) {
      setItemQuantity(product?.id, quantity);
    } else {
      addItem({
        ...product,
        quantity,
        price: product?.promo ? product?.promo : product?.prix,
      });
    }

    toggleCartOpen();
  };

  useEffect(() => {
    if (!canFetch) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://admin.protein.tn/public/api/product_details/${productslug}`
        );

        const data = await res.json();
        setProduct(data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchProduct();
  }, [productslug, canFetch]);

  return (
    <div>
      <div
      //   className="fixed inset-0 flex items-center justify-center"
      >
        <button
          type="button"
          onClick={openModal}
          className="  text-white  focus:outline-none m-auto  "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg text-center font-medium leading-6 text-[#222222]"
                  >
                    {product?.designation_fr}
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col md:flex-row w-full">
                    <div className="w-full aspect-[16/12] relative isolate">
                      {product?.rupture === 0 && (
                        <div className="absolute inset-0   backdrop-blur-[2px] rounded-2xl  flex items-center justify-center ">
                          <div className=" bg-primary my-auto w-full px-1 py-2 z-20 max-w-72">
                            <p className="text-white text-sm font-medium text-center">
                              Rupture De Stock
                            </p>
                          </div>
                        </div>
                      )}
                      <Image
                        fill
                        alt={product?.alt_cover!}
                        src={
                          product?.cover
                            ? storage + product?.cover
                            : "/public/img/product/p1.webp"
                        }
                        className="w-full h-full object-contain -z-10"
                      />
                    </div>
                    <div className="w-full pt-6 flex flex-col flex-grow">
                      {product?.promo ? (
                        <div className="flex flex-row items-center gap-2">
                          <span className="text-gray-500 line-through">
                            {product?.prix} DT
                          </span>
                          <span className="text-primary font-semibold">
                            {product?.promo} DT
                          </span>
                        </div>
                      ) : (
                        <span className="text-primary font-semibold">
                          {product?.prix} DT
                        </span>
                      )}
                      {product?.rupture === 1 && (
                        <div className="gap-2 sm:gap-6 flex items-center mt-3">
                          <p>Quantité:</p>
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(+e.target.value)}
                            className="w-full max-w-20 h-8 border px-3 border-gray-300 rounded-md"
                          />
                          <button
                            onClick={handleAddToCart}
                            type="button"
                            className="h-11 bg-primary text-white px-4 py-2 rounded-md hover:bg-gray-500 whitespace-nowrap "
                          >
                            Ajouter au panier
                          </button>
                        </div>
                      )}
                      <div className="  my-auto">
                        {product?.meta_description_fr && (
                          <div
                            className="pModalDesc"
                            dangerouslySetInnerHTML={{
                              __html: product?.meta_description_fr,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-4 absolute top-3 right-6 rounded-full bg-slate-300 w-6 h-6 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="black"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
