
import { Menu } from "@/types/Menu";

export const menuData: Menu[] = [
  {
    id: 1,
    title: "Packs",
    newTab: false,
    path: "/packs",
    showBadge: undefined
  },
  {
    id: 99,
    title: "Promotions",
    newTab: false,
    path: "/promotions",
     showBadge: true, // Add this line
  },
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
    id: 3,
    title: "Contact",
    newTab: false,
    path: "/contact",
    showBadge: undefined
  },
  {
    id: 6,
    title: "Pages",
    newTab: false,
    path: "/",
    submenu: [
      {
        id: 61,
        title: "Boutique avec barre latérale",
        newTab: false,
        path: "/shop-with-sidebar",
        showBadge: undefined
      },
      {
        id: 62,
        title: "Boutique sans barre latérale",
        newTab: false,
        path: "/shop-without-sidebar",
        showBadge: undefined
      },
 
      {
        id: 65,
        title: "Panier",
        newTab: false,
        path: "/cart",
        showBadge: undefined
      },
      {
        id: 70,
        title: "Contact",
        newTab: false,
        path: "/contact",
        showBadge: undefined
      },
     
     
    ],
    showBadge: undefined
  },
  {
    id: 7,
    title: "Blogs",
    newTab: false,
    path: "/",
    submenu: [
      {
        id: 71,
        title: "Blog grille avec barre latérale",
        newTab: false,
        path: "/blogs/blog-grid-with-sidebar",
        showBadge: undefined
      },
      {
        id: 72,
        title: "Blog grille",
        newTab: false,
        path: "/blogs/blog-grid",
        showBadge: undefined
      },
      {
        id: 73,
        title: "Détails du blog avec barre latérale",
        newTab: false,
        path: "/blogs/blog-details-with-sidebar",
        showBadge: undefined
      },
      {
        id: 74,
        title: "Détails du blog",
        newTab: false,
        path: "/blogs/blog-details",
        showBadge: undefined
      },
    ],
    showBadge: undefined
  },
];
