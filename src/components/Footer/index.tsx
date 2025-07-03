"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";

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

  const handleSubscribe = async (e: any) => {
    e.preventDefault();
    try {
      if (!email) return;
      const res = await fetch(
        "https://admin.protein.tn/public/api/newsletter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (data?.success) toast.success(data?.success);
      if (data?.error) toast.error(data?.error);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <footer className="bg-[#F2F2F2] w-full mt-10 fott pt-8 pb-4 px-2 sm:px-4 md:px-8">
      {/* Newsletter Subscription Section */}
      <div className="bg-[#000000] text-white p-4 sm:p-6 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-lg sm:text-xl font-semibold mb-4 md:mb-0 text-center md:text-left hhh">
          Abonnez-vous à la newsletter et recevez <br /><span className="nom"> nos conseils et nos promotions</span>
        </p>
        <form
          className="flex flex-col sm:flex-row items-center bg-white rounded-md overflow-hidden vvv w-full max-w-md md:max-w-none"
          onSubmit={handleSubscribe}
          style={{ transform: "skewX(-8deg)" }}
        >
          <div style={{ transform: "skewX(8deg)" }} className="flex flex-col sm:flex-row items-center w-full">
            <input
              type="email"
              placeholder="Votre adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 w-full sm:w-64 text-black outline-none mb-2 sm:mb-0"
            />
            <button
              type="submit"
              className="bg-[#FF5000] text-white font-bold px-6 py-3 w-full sm:w-auto hover:bg-[#FF8000] transition-all"
            >
              S&apos;abonner
            </button>
          </div>
        </form>
      </div>

      {/* Footer Content Section */}
      <div className="flex flex-wrap mt-10 text-black gap-6 md:gap-0 container mx-auto px-0 sm:px-2">
        {/* Logo and Company Info */}
        <div className="w-full md:w-1/2 lg:w-1/4 mb-6 pr-2">
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

        {/* Categories Section */}
        <div className="w-full md:w-1/2 lg:w-1/4 mb-6">
          <h4 className="font-bold mb-4">NOS CATÉGORIES</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/categorie/acides-amines" className="hover:underline">ACIDES AMINES</Link>
            </li>
            <li>
              <Link href="/categorie/perte-de-poids" className="hover:underline">PERTE DE POIDS</Link>
            </li>
            <li>
              <Link href="/categorie/prise-de-masse" className="hover:underline">PRISE DE MASSE</Link>
            </li>
            <li>
              <Link href="/categorie/proteines" className="hover:underline">PROTEINES</Link>
            </li>
            <li>
              <Link href="/categorie/pre-intra-and-post-workout" className="hover:underline">PRE, INTRA & POST WORKOUT</Link>
            </li>
            <li>
              <Link href="/categorie/vetements-et-accessoires" className="hover:underline">VÊTEMENTS ET ACCESSOIRES</Link>
            </li>
            <li>
              <Link href="/categorie/vetements-et-accessoires" className="hover:underline">MATÉRIEL ET ACCESSOIRES</Link>
            </li>
          </ul>
        </div>

        {/* Company Section */}
        <div className="w-full md:w-1/2 lg:w-1/4 mb-6">
          <h4 className="font-bold mb-4">ENTREPRISE</h4>
          <ul className="space-y-2 mb-4">
            <li>
              <Link href="/qui-sommes-nous" className="hover:underline">À PROPOS DE NOUS</Link>
            </li>
            <li>
              <Link href="/condition-ventes" className="hover:underline">POLITIQUE DE CONFIDENTIALITÉ</Link>
            </li>
            <li>
              <Link href="/condition-ventes" className="hover:underline">CONDITIONS DUTILISATION</Link>
            </li>
            <li>
              <Link href="/remboursement" className="hover:underline">POLITIQUE DE RETOUR ET DE REMBOURSEMENT</Link>
            </li>
          </ul>
          <h4 className="font-bold mb-4">TÉLÉCHARGER NOTRE APPLICATION</h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={coordonnees.playstore_link} target="_blank">
              <Image
                src="/img/icon/icon-app.jpg"
                width={150}
                height={50}
                alt="Disponible sur Google Play"
                className="mb-2 sm:mb-0 rounded shadow"
              />
            </Link>
            <Link href={coordonnees.appstore_link} target="_blank">
              <Image
                src="/img/icon/icon1-app.jpg"
                width={150}
                height={50}
                alt="Disponible sur App Store"
                className="mb-2 sm:mb-0 rounded shadow"
              />
            </Link>
          </div>
        </div>

        {/* Social Media & App Links Section */}
        <div className="w-full md:w-1/2 lg:w-1/4 mb-6">
          <h4 className="font-bold mb-4">AVEZ-VOUS APPRÉCIÉ?</h4>
          <div className="grid grid-cols-3 gap-3 mb-6">
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
            <Link href={coordonnees.tiktok_link} target="_blank">
              <Image src="/img/icon/reddit.png" width={30} height={30} alt="TikTok" />
            </Link>
            <Link href={coordonnees.linkedin_link} target="_blank">
              <Image src="/img/icon/linkedin.png" width={30} height={30} alt="TikTok" />
            </Link>
            <Link href={coordonnees.youtube_link} target="_blank">
              <Image src="/img/icon/youtube.png" width={30} height={30} alt="TikTok" />
            </Link>
          </div>

          <h4 className="font-bold mb-4">GÉOLOCALISATION</h4>
          <div className="map-container w-full rounded overflow-hidden" style={{ minHeight: '180px', height: '180px', maxWidth: '100%' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3200.2782693572457!2d10.628494814994378!3d35.836371480160744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1302131b30e891b1%3A0x51dae0f25849b20c!2sPROTEINE%20TUNISIE%20(%20PROTEIN%20SOUSSE%20-%20TUNISIE%3A%20Vente%20Proteine%20%C3%A0%20Sousse%2C%20Tunisie)%20SOBITAS!5e0!3m2!1sfr!2stn!4v1693395736857!5m2!1sfr!2stn"
              width="100%"
              height="100%"
              style={{ border: "0", minHeight: '180px', height: '180px', maxWidth: '100%' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
      <p className="text-center text-sm text-gray-500 mt-6">
        © 2024 PROTEINE TUNISIE
      </p>
    </footer>
  );
}

export default Footer;
