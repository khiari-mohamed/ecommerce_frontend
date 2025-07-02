import { createSlice } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

type InitialState = {
  value: Product;
};

const initialState: InitialState = {
  value: {
    // Required fields from Product
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

export const productDetails = createSlice({
  name: "productDetails",
  initialState,
  reducers: {
    updateproductDetails: (_, action) => {
      return {
        value: {
          ...action.payload,
        },
      };
    },
  },
});

export const { updateproductDetails } = productDetails.actions;
export default productDetails.reducer;
