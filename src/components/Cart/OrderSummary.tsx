import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useAppSelector } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const OrderSummary = () => {
const cartItems = useAppSelector((state) => state.cartReducer.items);
const totalPrice = useSelector(selectTotalPrice);
const router = useRouter();

return (
<div className="lg:max-w-[455px] w-full">
{/* <!-- order list box --> */}
<div className="bg-white shadow-1 rounded-[10px]">
<div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
<h3 className="font-medium text-xl text-dark">Résumé de la commande</h3>
</div>

<div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
{/* <!-- title --> */}
<div className="flex flex-col xs:flex-row items-start xs:items-center justify-between py-5 border-b border-gray-3 gap-2 xs:gap-0">
  <div>
    <h4 className="font-medium text-dark">Produit</h4>
  </div>
  <div>
    <h4 className="font-medium text-dark text-right xs:text-left">total</h4>
  </div>
</div>

{/* <!-- product item --> */}
{cartItems.map((item, key) => (
  <div key={key} className="flex flex-col xs:flex-row items-start xs:items-center justify-between py-5 border-b border-gray-3 gap-2 xs:gap-0">
    <div className="w-full xs:w-auto">
      <p className="text-dark break-words max-w-[180px] xs:max-w-none">{item.title}</p>
    </div>
    <div className="w-full xs:w-auto">
      <p className="text-dark text-right xs:text-left">
        {Number(item.discountedPrice * item.quantity).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
      </p>
    </div>
  </div>
))}

{/* <!-- total --> */}
<div className="flex items-center justify-between pt-5">
<div>
<p className="font-medium text-lg text-dark">Total</p>
</div>
<div>
<p className="font-medium text-lg text-dark text-right">
{Number(totalPrice).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
</p>
</div>
</div>

{/* <!-- checkout button --> */}
<button
type="button"
className="w-full flex justify-center font-medium text-white py-3 px-6 rounded-md ease-out duration-200 mt-7.5"
style={{ background: '#ff4500' }}
onClick={() => router.push("/checkout")}
>
Processus de paiement
</button>
</div>
</div>
</div>
);
};

export default OrderSummary;
