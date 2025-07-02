import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

type InitialState = {
  value: Product;
};

const initialState: InitialState = {
  value: {
    zone1: 0,
    zone2: 0,
    zone3: 0,
    zone4: 0,
    content_seo: "",
    meta: "",
    aroma_ids: [],
    title: "",
    price: 0,
    discountedPrice: 0,
    currency: "",
    id: 0,
    imgs: { thumbnails: [], previews: [] },
    _id: "",
    designation: "",
    slug: "",
    mainImage: { url: "" },
    images: [],
    type: "",
    reviews: [],
    // Optional fields (add as needed)
    designation_fr: "",
    promo: 0,
    prix: 0,
    gallery: false,
    cover: "",
    meta_description_fr: "",
    oldPrice: 0,
    inStock: false,
    features: [],
    brand: "",
    smallDescription: "",
    description: "",
    category: "",
    subCategory: [],
    sous_categorie_id: "",
    venteflashDate: undefined,
    isFlashSale: false,
    discountPercentage: 0,
    isNewProduct: false,
    isBestSeller: false,
    isOutOfStock: false,
    isPublished: false,
    aggregateRating: 0,
    promoExpirationDate: undefined,
    createdAt: "",
    nutrition_values: "",
    questions: "",
    sousCategorieId: "",
    designationFr: "",
    prixHt: null,
    promoHt: null,
    descriptionFr: "",
    publier: "",
    createdBy: null,
    updatedBy: null,
    updatedAt: "",
    codeProduct: "",
    pack: "",
    brandId: "",
    newProduct: "",
    bestSeller: "",
    note: "",
    metaDescriptionFr: "",
    altCover: "",
    descriptionCover: "",
    contentSeo: "",
    review: [],
    nutritionValues: null,
    aromaIds: [],
  },
};

export const quickView = createSlice({
  name: "quickView",
  initialState,
  reducers: {
    updateQuickView: (_, action) => {
      return {
        value: {
          ...action.payload,
        },
      };
    },

    resetQuickView: () => {
      return {
        value: initialState.value,
      };
    },
  },
});

export const { updateQuickView, resetQuickView } = quickView.actions;
export default quickView.reducer;
