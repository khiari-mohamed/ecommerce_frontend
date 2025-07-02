"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";

const coordonnees = {
  logo: "img/logo/logo.webp",
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
    <footer className="bg-[#F2F2F2] p-8 w-full mt-10 fott">
      {/* Newsletter Subscription Section */}
      <div className="bg-[#000000] text-white p-6 rounded-lg flex flex-col md:flex-row justify-between items-center">
        <p className="text-xl font-semibold mb-4 md:mb-0 hhh">
          Abonnez-vous à la newsletter et recevez <br></br><span className="nom"> nos conseils et nos promotions</span>
        </p>
        <form className="flex items-center bg-white rounded-md overflow-hidden vvv" onSubmit={handleSubscribe} style={{ transform: "skewX(-32deg)" }}>
          <div style={{ transform: "skewX(2deg)" }} className="flex items-center">
            <input
              type="email"
              placeholder="Votre adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 w-64 text-black outline-none"
            />
            <button
              type="submit"
              className="bg-[#FF5000] text-white font-bold px-6 py-3 hover:bg-[#FF8000] transition-all"
            >
              S&apos;abonner
            </button>
          </div>
        </form>
      </div>

      {/* Footer Content Section */}
      <div className="flex flex-wrap mt-10 text-black ml-5">
        {/* Logo and Company Info */}
        <div className="w-full md:w-1/4 mb-6">
          <Image
            src={`/${coordonnees.logo}`}
            alt="SOBITAS Logo"
            width={150}
            height={60}
          />
          <p className="text-sm max-w-xs">
            PROTEINE TUNISIE - SOBITAS Votre expert en nutrition sportive en Tunisie, basé à Sousse depuis 2010. Nous proposons une vaste gamme de compléments alimentaires, incluant des protéines, de la créatine, et du matériel de musculation, pour vous aider à atteindre vos objectifs de musculation et de performance.

            Email: contact@protein.tn

            Adresse: Rue Ribat, 4000 Sousse Tunisie
          </p>
          <p className="text-sm ">
            <strong>Email:</strong> {coordonnees.email}
          </p>
          <p className="text-sm">
            <strong>Adresse:</strong> {coordonnees.adresse_fr}
          </p>
        </div>

        {/* Categories Section */}
        <div className="w-full md:w-1/4 mb-6">
          <h4 className="font-bold mb-4">OUR CATEGORIES</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/categorie/acides-amines" className="hover:underline">
                ACIDES AMINES
              </Link>
            </li>
            <li>
              <Link href="/categorie/perte-de-poids" className="hover:underline">
                PERTE DE POIDS
              </Link>
            </li>
            <li>
              <Link href="/categorie/prise-de-masse" className="hover:underline">
                PRISE DE MASSE
              </Link>
            </li>
            <li>
              <Link href="/categorie/proteines" className="hover:underline">
                PROTEINES
              </Link>
            </li>
            <li>
              <Link href="/categorie/pre-intra-and-post-workout" className="hover:underline">
                PRE, INTRA & POST WORKOUT
              </Link>
            </li>
            <li>
              <Link href="/categorie/vetements-et-accessoires" className="hover:underline">
                VÊTEMENTS ET ACCESSOIRES
              </Link>
            </li>
            <li>
              <Link href="/categorie/vetements-et-accessoires" className="hover:underline">
                MATÉRIEL ET ACCESSOIRES
              </Link>
            </li>
          </ul>
        </div>

        {/* Company Section */}
        <div className="w-full md:w-1/4 mb-6">
          <h4 className="font-bold mb-4">ENTREPRISE</h4>
          <ul className="space-y-2 mb-4">
            <li>
              <Link href="/qui-sommes-nous" className="hover:underline">
                À PROPOS DE NOUS
              </Link>
            </li>
            <li>
              <Link href="/condition-ventes" className="hover:underline">
                POLITIQUE DE CONFIDENTIALITÉ
              </Link>
            </li>
            <li>
              <Link href="/condition-ventes" className="hover:underline">
                CONDITIONS D&apos;UTILISATION
              </Link>

            </li>
            <li>
              <Link href="/remboursement" className="hover:underline">
                POLITIQUE DE RETOUR ET DE REMBOURSEMENT
              </Link>
            </li>
          </ul>
          <h4 className="font-bold mb-4">TÉLÉCHARGER NOTRE APPLICATION</h4>
          <div className="flex gap-3">
            <Link href={coordonnees.playstore_link} target="_blank">
              <Image
                src="/img/playstore-336-119.webp"
                width={150}
                height={50}
                alt="Disponible sur Google Play"
              />
            </Link>
            <Link href={coordonnees.appstore_link} target="_blank">
              <Image
                src="/img/appstore-336-119.webp"
                width={150}
                height={50}
                alt="Disponible sur App Store"
              />
            </Link>
          </div>
        </div>

        {/* Social Media & App Links Section */}
        <div className="w-full md:w-1/4 mb-6">
          <h4 className="font-bold mb-4">AVEZ-VOUS APPRÉCIÉ?</h4>
          <div className="gridd grid-cols-3 gap-3 mb-6">
            <Link href={coordonnees.facebook_link} target="_blank">
              <Image
                src="/img/icon/facebook.png"
                width={30}
                height={30}
                alt="Facebook"
              />
            </Link>
            <Link href={coordonnees.instagram_link} target="_blank">
              <Image
                src="/img/icon/instagram.png"
                width={30}
                height={30}
                alt="Instagram"
              />
            </Link>
            <Link href={coordonnees.youtube_link} target="_blank">
              <Image
                src="/img/icon/youtube.png"
                width={30}
                height={30}
                alt="YouTube"
              />
            </Link>
            <Link href={coordonnees.twitter_link} target="_blank">
              <Image
                src="/img/icon/twitter.png"
                width={30}
                height={30}
                alt="Twitter"
              />
            </Link>
            <Link href={coordonnees.whatsapp_link} target="_blank">
              <Image
                src="/img/icon/pinterest.png"
                width={30}
                height={30}
                alt="WhatsApp"
              />
            </Link>
            <Link href={coordonnees.tiktok_link} target="_blank">
              <Image
                src="/img/icon/communication.png"
                width={30}
                height={30}
                alt="TikTok"
              />
            </Link>
            <Link href={coordonnees.tiktok_link} target="_blank">
              <Image
                src="/img/icon/reddit.png"
                width={30}
                height={30}
                alt="TikTok"
              />
            </Link>
            <Link href={coordonnees.linkedin_link} target="_blank">
              <Image
                src="/img/icon/linkedin.png"
                width={30}
                height={30}
                alt="TikTok"
              />
            </Link>
            <Link href={coordonnees.youtube_link} target="_blank">
              <Image
                src="/img/icon/youtube.png"
                width={30}
                height={30}
                alt="TikTok"
              />
            </Link>

          </div>

          <h4 className="font-bold mb-4">GÉOLOCALISATION</h4>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3200.2782693572457!2d10.628494814994378!3d35.836371480160744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1302131b30e891b1%3A0x51dae0f25849b20c!2sPROTEINE%20TUNISIE%20(%20PROTEIN%20SOUSSE%20-%20TUNISIE%3A%20Vente%20Proteine%20%C3%A0%20Sousse%2C%20Tunisie)%20SOBITAS!5e0!3m2!1sfr!2stn!4v1693395736857!5m2!1sfr!2stn"
              width="100%"
              height="auto"
              style={{ border: "0" }}
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
