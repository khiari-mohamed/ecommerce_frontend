"use client";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { PreviewSliderProvider } from "@/app/context/PreviewSliderContext";
import ProductDetails from "@/components/ProductDetails";

export default function ProductDetailsPage() {
  return (
    <Provider store={store}>
      <PreviewSliderProvider>
        <ProductDetails />
      </PreviewSliderProvider>
    </Provider>
  );
}