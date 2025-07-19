import { Menu } from "@/types/Menu";

export const menuData: Menu[] = [
  {
    id: 2,
    title: "Boutique",
    newTab: false,
    path: "/shop-with-sidebar",
    submenu: [
      {
        id: 21,
        title: "Boutique avec barre latérale",
        newTab: false,
        path: "/shop-with-sidebar",
        showBadge: undefined
      },
      {
        id: 22,
        title: "Boutique sans barre latérale",
        newTab: false,
        path: "/shop-without-sidebar",
        showBadge: undefined
      },
      {
        id: 23,
        title: "Détails du produit",
        newTab: false,
        path: "/shop-details",
        showBadge: undefined
      },
      {
        id: 24,
        title: "Panier",
        newTab: false,
        path: "/cart",
        showBadge: undefined
      },
      {
        id: 25,
        title: "Paiement",
        newTab: false,
        path: "/checkout",
        showBadge: undefined
      },
      {
        id: 26,
        title: "Liste de souhaits",
        newTab: false,
        path: "/wishlist",
        showBadge: undefined
      }
    ],
    showBadge: undefined
  },
  {
    id: 99,
    title: "Top Promo",
    newTab: false,
    path: "/promotions",
    showBadge: true,
  },
  {
    id: 1,
    title: "Packs",
    newTab: false,
    path: "/packs",
    showBadge: undefined
  },
  {
    id: 6,
    title: "Marques",
    newTab: false,
    path: "/brands",
    showBadge: undefined
  },
  {
    id: 7,
    title: "Blogs",
    newTab: false,
    path: "/blogs/blog-grid",
    showBadge: undefined
  },
  {
    id: 3,
    title: "Contact",
    newTab: false,
    path: "/contact",
    showBadge: undefined
  },
];
