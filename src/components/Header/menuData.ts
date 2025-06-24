
import { Menu } from "@/types/Menu";

export const menuData: Menu[] = [
  {
    id: 1,
    title: "Packs",
    newTab: false,
    path: "/packs",
  },
  {
    id: 99,
    title: "Promotions",
    newTab: false,
    path: "/promotions",
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
      },
      {
        id: 22,
        title: "Boutique sans barre latérale",
        newTab: false,
        path: "/shop-without-sidebar",
      },
      {
        id: 23,
        title: "Détails du produit",
        newTab: false,
        path: "/shop-details",
      },
      {
        id: 24,
        title: "Panier",
        newTab: false,
        path: "/cart",
      },
      {
        id: 25,
        title: "Paiement",
        newTab: false,
        path: "/checkout",
      },
      {
        id: 26,
        title: "Liste de souhaits",
        newTab: false,
        path: "/wishlist",
      }
    ],
  },
  {
    id: 3,
    title: "Contact",
    newTab: false,
    path: "/contact",
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
      },
      {
        id: 62,
        title: "Boutique sans barre latérale",
        newTab: false,
        path: "/shop-without-sidebar",
      },
      {
        id: 64,
        title: "Paiement",
        newTab: false,
        path: "/checkout",
      },
      {
        id: 65,
        title: "Panier",
        newTab: false,
        path: "/cart",
      },
      {
        id: 66,
        title: "Liste de souhaits",
        newTab: false,
        path: "/wishlist",
      },
      {
        id: 67,
        title: "Se connecter",
        newTab: false,
        path: "/signin",
      },
      {
        id: 68,
        title: "S'inscrire",
        newTab: false,
        path: "/signup",
      },
      {
        id: 69,
        title: "Mon compte",
        newTab: false,
        path: "/my-account",
      },
      {
        id: 70,
        title: "Contact",
        newTab: false,
        path: "/contact",
      },
      {
        id: 62,
        title: "Erreur",
        newTab: false,
        path: "/error",
      },
      {
        id: 63,
        title: "Mail envoyé",
        newTab: false,
        path: "/mail-success",
      },
    ],
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
      },
      {
        id: 72,
        title: "Blog grille",
        newTab: false,
        path: "/blogs/blog-grid",
      },
      {
        id: 73,
        title: "Détails du blog avec barre latérale",
        newTab: false,
        path: "/blogs/blog-details-with-sidebar",
      },
      {
        id: 74,
        title: "Détails du blog",
        newTab: false,
        path: "/blogs/blog-details",
      },
    ],
  },
];
