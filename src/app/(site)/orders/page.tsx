import { Metadata } from "next";
import OrdersClient from "./OrdersClient";
import orderService from "@/services/orders";
import { cookies } from "next/headers";
import { Order } from "@/types/order";

// Métadonnées optimisées pour la page des commandes
export const metadata: Metadata = {
  title: "Historique et Suivi de Commandes | Protein.tn",
  description: "Suivez vos commandes de compléments alimentaires et matériel de sport sur Protein.tn. Consultez l'historique, les statuts et les détails de vos achats.",
  keywords: ["suivi commande protein.tn", "historique achats compléments", "commandes protéines Tunisie", "statut livraison protein.tn"],
  alternates: {
    canonical: "https://www.protein.tn/orders",
  },
  openGraph: {
    title: "Historique et Suivi de Commandes | Protein.tn",
    description: "Suivez vos commandes de compléments alimentaires et matériel de sport sur Protein.tn. Consultez l'historique, les statuts et les détails de vos achats.",
    url: "https://www.protein.tn/orders",
    siteName: "Protein.tn",
    images: [
      {
        url: "https://www.protein.tn/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mes commandes sur Protein.tn",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  // TRES IMPORTANT: Empêche Google d'indexer les pages de commandes des utilisateurs
  robots: {
    index: false,
    follow: true,
  },
};

// Fonction pour récupérer les commandes de l'utilisateur connecté côté serveur
async function getUserOrders(): Promise<Order[]> {
  // MODIFIÉ : Ajout de 'await' pour résoudre la promesse
  const cookieStore = await cookies(); 
  const token = cookieStore.get('store-auth-token')?.value;

  // Si pas de token, l'utilisateur n'est pas connecté. Inutile d'appeler l'API.
  if (!token) {
    return [];
  }

  try {
    // Appel de la nouvelle fonction de service avec le token
    const orders = await orderService.fetchOrdersForUser(token);
    return orders;
  } catch (error) {
    console.error("Server-side error fetching user orders:", error);
    // En cas d'erreur réseau ou autre, on renvoie un tableau vide
    // pour que la page s'affiche correctement sans planter.
    return [];
  }
}

export default async function OrdersPage() {
  const userOrders = await getUserOrders();
  return <OrdersClient initialOrders={userOrders} />;
}