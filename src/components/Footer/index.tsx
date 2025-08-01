"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { toast } from "react-toastify";
import GoogleReviewsPill from "../GoogleReviewsPill";

const coordonnees = {
  logo: "images/logo/logo.png",
  email: "contact@protein.tn",
  adresse_fr: "Rue Ribat, 4000 Sousse Tunisie",
  phone_1: "+216 27 612 500",
  phone_2: "+216 73 200 169",
  facebook_link: "https://www.facebook.com/sobitass/",
  youtube_link: "https://www.youtube.com/@sobitas6850",
  twitter_link: "https://twitter.com/TunisieProteine",
  instagram_link: "https://www.instagram.com/sobitass/",
  linkedin_link: "https://www.linkedin.com/",
  whatsapp_link: "https://wa.me/21627612500",
  tiktok_link: "https://www.tiktok.com/@sobitassousse?_t=8fxdJ9IKeur&_r=1",
  playstore_link:
    "https://play.google.com/store/apps/details?id=io.abdelbari.sobitas",
  appstore_link:
    "https://play.google.com/store/apps/details?id=io.abdelbari.sobitas",
};

function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  // Categories for footer
  const [categories, setCategories] = useState<{ _id: string; slug: string; name: string }[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get("/categories?populate=subcategories");
        setCategories(res.data.data || []);
      } catch (error) {
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    if (!email || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(email)) {
      setStatus("error");
      setMessage("Veuillez entrer une adresse e-mail valide.");
      return;
    }
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          customerName: "Valued Customer",
          customerEmail: email,
          unsubscribeLink: "https://protein.tn/unsubscribe?email=" + encodeURIComponent(email),
        }),
      });
      if (res.ok) {
        setStatus("success");
        setMessage("Merci de votre inscription ! Veuillez consulter votre boîte mail.");
        setEmail("");
      } else {
        const data = await res.json();
        setStatus("error");
        setMessage(data.message || "Une erreur s'est produite. Veuillez réessayer.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Erreur réseau. Veuillez réessayer.");
    }
  };

  return (
    <footer className="bg-[#F2F2F2] w-full mt-10 fott pt-8 pb-4 px-2 sm:px-4 md:px-8">
      {/* Footer Content Section */}
      <div
        className="
          flex flex-col
          md:flex-row
          flex-wrap
          mt-10
          text-black
          gap-8
          md:gap-0
          container
          mx-auto
          px-0
          sm:px-2
          items-stretch
        "
      >
        {/* Social Follow Section (Left Top) */}
        <div className="w-full md:w-1/4 lg:w-1/4 mb-8 md:mb-6 pr-0 md:pr-2 flex flex-col items-start">
          <h4 className="text-lg font-bold mb-2">Suivez-nous</h4>
          <p className="text-sm text-gray-600 mb-4 max-w-xs">Nous facilitons la consolidation, le marketing et le suivi de votre site Web de médias sociaux.</p>
          <div className="flex flex-row items-center gap-3 mb-4">
            <Link href={coordonnees.facebook_link} target="_blank">
              <Image src="/img/icon/facebook.png" width={30} height={30} alt="Facebook" />
            </Link>
            <Link href={coordonnees.instagram_link} target="_blank">
              <Image src="/img/icon/instagram.png" width={30} height={30} alt="Instagram" />
            </Link>
            <Link href={coordonnees.youtube_link} target="_blank">
              <Image src="/img/icon/youtube.png" width={30} height={30} alt="YouTube" />
            </Link>
            <Link href={coordonnees.twitter_link} target="_blank">
              <Image src="/img/icon/twitter.png" width={30} height={30} alt="Twitter" />
            </Link>
            <Link href={coordonnees.whatsapp_link} target="_blank">
              <Image src="/img/icon/pinterest.png" width={30} height={30} alt="WhatsApp" />
            </Link>
            <Link href={coordonnees.tiktok_link} target="_blank">
              <Image src="/img/icon/communication.png" width={30} height={30} alt="TikTok" />
            </Link>
            <Link href={coordonnees.linkedin_link} target="_blank">
              <Image src="/img/icon/linkedin.png" width={30} height={30} alt="LinkedIn" />
            </Link>
            <Link href={coordonnees.youtube_link} target="_blank">
              <Image src="/img/icon/reddit.png" width={30} height={30} alt="Reddit" />
            </Link>
            <Link href={coordonnees.youtube_link} target="_blank">
              <Image src="/img/icon/youtube.png" width={30} height={30} alt="YouTube" />
            </Link>
          </div>
          <h4 className="text-base font-semibold mb-4">AVEZ-VOUS APPRÉCIÉ?</h4>
          <div className="flex flex-col items-start mt-2">
            <Image
              src={`/${coordonnees.logo}`}
              alt="SOBITAS Logo"
              width={150}
              height={60}
              className="mb-2"
            />
            <p className="text-sm max-w-xs mb-2">
              PROTEINE TUNISIE - SOBITAS : Spécialiste en compléments alimentaires sportifs et matériel de musculation en Tunisie depuis 2010. Boostez vos performances avec des produits certifiés : whey protéine, isolate, créatine, BCAA, oméga-3, brûleurs de graisse, etc. Découvrez notre équipement de musculation professionnel : bancs, haltères, barres, gants, machines cardio et accessoires fitness. 🎯 Objectifs : prise de masse, perte de poids, force, récupération musculaire. 🚚 Livraison rapide à Sousse, Tunis, Sfax, Gabès et dans toute la Tunisie.
            </p>
            <p className="text-sm "><strong>Email:</strong> {coordonnees.email}</p>
            <p className="text-sm"><strong>Adresse:</strong> {coordonnees.adresse_fr}</p>
          </div>
        </div>
        {/* Middle Newsletter Section */}
        <div className="w-full md:w-2/4 lg:w-2/4 mb-8 md:mb-6 flex flex-col items-center justify-start mx-auto">
          <p className="text-lg sm:text-xl font-semibold mb-4 text-center">
            Abonnez-vous à la newsletter et recevez <br />
            <span className="nom">nos conseils et nos promotions</span>
          </p>
          <form
  className="flex flex-col sm:flex-row items-center bg-white rounded-md overflow-hidden shadow w-full max-w-md transform sm:-skew-x-6"
  onSubmit={handleSubscribe}
>
            <div className="flex flex-col sm:flex-row items-center w-full transform sm:skew-x-6">
              <input
                type="email"
                placeholder="Votre adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 w-full sm:w-64 text-black outline-none mb-2 sm:mb-0"
                disabled={status === "loading"}
              />
              <button
                type="submit"
                className="bg-[#FF5000] text-white font-bold px-6 py-3 w-full sm:w-auto hover:bg-[#FF8000] transition-all"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Abonnement..." : "S'abonner"}
              </button>
            </div>
            {message && (
              <div
                className={`mt-2 text-sm ${
                  status === "success"
                    ? "text-green-600"
                    : status === "error"
                    ? "text-red-600"
                    : ""
                }`}
              >
                {message}
              </div>
            )}
          </form>
          {/* Services & Ventes and Navigation Sections */}
          <div className="flex flex-col sm:flex-row justify-center items-start gap-12 mt-8 w-full max-w-2xl">
            <div>
              <h4 className="font-bold mb-3 text-base sm:text-lg">Services & Ventes</h4>
              <ul className="space-y-2 text-sm sm:text-base">
                <li><Link href="/pages/conditions-generale-de-ventes-protein.tn" className="hover:underline">Conditions générale de ventes</Link></li>
                <li><Link href="/pages/politique-de-remboursement" className="hover:underline">Politique de remboursement</Link></li>
                <li><Link href="/pages/politique-des-cookies" className="hover:underline">Politique des cookies</Link></li>
                <li><Link href="/pages/qui-sommes-nous" className="hover:underline">Qui somme nous</Link></li>
                <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-base sm:text-lg">Navigation</h4>
              <ul className="space-y-2 text-sm sm:text-base">
                <li><Link href="#" className="hover:underline">Accueil</Link></li>
                <li><Link href="#" className="hover:underline">Nos produits</Link></li>
                <li><Link href="#" className="hover:underline">Qui somme nous</Link></li>
                <li><Link href="#" className="hover:underline">Packs</Link></li>
                <li><Link href="#" className="hover:underline">Blog</Link></li>
                <li><Link href="#" className="hover:underline">Contacter nous</Link></li>
              </ul>
            </div>
          </div>
        </div>
        {/* Right Side: Only ENTREPRISE, APP, GEOLOCALISATION */}
        <div className="w-full md:w-1/4 lg:w-1/4 mb-8 md:mb-6 flex flex-col items-end pl-0 md:pl-8 lg:pl-16">
          <div className="w-full max-w-md">
            <h4 className="font-bold mb-4">ENTREPRISE</h4>
            <h4 className="font-bold mb-4 mt-6">TÉLÉCHARGER NOTRE APPLICATION</h4>
            <div className="flex flex-row gap-3 mb-4 items-center justify-center">
              <Link href={coordonnees.playstore_link} target="_blank" className="flex items-center">
                <div style={{ width: '160px', height: '62px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    src="/img/icon/appstore-336-119.webp"
                    width={160}
                    height={62}
                    alt="Disponible sur Google Play"
                    className="rounded shadow object-contain"
                    style={{ width: '160px', height: '62px', objectFit: 'contain' }}
                  />
                </div>
              </Link>
              <Link href={coordonnees.appstore_link} target="_blank" className="flex items-center">
                <div style={{ width: '160px', height: '62px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    src="/img/icon/fr_badge_web_generic.png"
                    width={160}
                    height={62}
                    alt="Disponible sur App Store"
                    className="rounded shadow object-contain"
                    style={{ width: '160px', height: '62px', objectFit: 'contain' }}
                  />
                </div>
              </Link>
            </div>
            <h4 className="font-bold mb-4 mt-6">GÉOLOCALISATION</h4>
            <div className="map-container w-full rounded overflow-hidden relative"
  style={{ height: '250px', width: '100%', maxWidth: '1200px' }}
>
            <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3074.4748320799786!2d10.630564999999997!3d35.836349299999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1302131b30e891b1%3A0x51dae0f25849b20c!2sPROTEINE%20TUNISIE%20%E2%80%93%20SOBITAS%20%7C%20Creatine%2C%20Mat%C3%A9riel%20de%20Musculation%20%26%20Whey%20%C3%A0%20Sousse!5e1!3m2!1sfr!2sus!4v1752469342748!5m2!1sfr!2sus"
            width={800}
            height={600}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute left-3 bottom-3 z-10 bg-white/95 rounded-lg p-3 shadow flex flex-col gap-1" style={{ maxWidth: 400 }}>
            </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center mt-6">
        <Image
          src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://protein.tn"
          alt="QR Code"
          width={100}
          height={100}
          className="mx-auto rounded shadow"
          style={{ width: '80px', height: '80px', maxWidth: '120px', maxHeight: '120px' }}
        />
      </div>
      <Link href="/" className="text-center text-sm mt-6 block" style={{ color: '#FF4500', textDecoration: 'none' }}>
        <span>© 2025 SOBITAS-PROTEINE TUNISIE</span><br />
        <strong>Tous droits réservés</strong>
      </Link>
    </footer>
  );
}

export default Footer;
