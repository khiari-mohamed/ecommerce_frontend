import React from "react";
import { Truck, Shield, Award, Phone } from 'lucide-react';

const featureData = [
  {
    icon: Truck,
    title: "Livraison Rapide",
    description: "LIVRAISON SOUS 24 HEURES",
    bgColor: "#2c74ec"
  },
  {
    icon: Award,
    title: "Produits Certifiés",
    description: "CERTIFIÉ PAR LE MINSTÈRE DE SANTÉ",
    bgColor: "#7c3aed"
  },
  {
    icon: Shield,
    title: "Paiement à la livraison",
    description: "PAIEMENT SÉCURISÉ",
    bgColor: "#1cb45c"
  },
  {
    icon: Phone,
    title: "Service SOBITAS",
    description: "73 200 169",
    bgColor: "#ff8000"
  },
];

const HeroFeature = () => {
  return (
    <section className="py-10 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureData.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="text-center group">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: item.bgColor }}
                >
                  <Icon className="w-12 h-12" style={{ color: '#fff' }} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-xs mx-auto text-base">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroFeature;
