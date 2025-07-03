"use client";
import React, { useEffect, useRef, useState } from "react";
import { QRCode } from "react-qrcode-logo";
import n2words from "n2words";
import orderService from "@/services/orders";
import toast from "react-hot-toast";
import { useReactToPrint } from "react-to-print";
import "../styles/dashboard.css";
import "../styles/devis.css";
import "../styles/print.css";
import Image from "next/image";

const COMPANY = {
  logo: "/images/logo/logo.png",
  name: "sobitas",
  nif: "1234567A",
  email: "contact@protein.tn",
  address: "Rue Ribat, 4000 Sousse Tunisie",
  tel: "+216 73 200 169"
};

const ORANGE = "#FF4301";

function numberToFrenchWords(n: number): string {
  return n2words(n, { lang: "fr" });
}

interface DevisDetailProps {
  id: string;
  onClose: () => void;
}

const DevisDetail: React.FC<DevisDetailProps> = ({ id, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [devis, setDevis] = useState<any>(null);
  const [edit, setEdit] = useState(false);
  const [editDevis, setEditDevis] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

const handlePrint = useReactToPrint({
contentRef: printRef,
documentTitle: `Devis_${devis?.numero_devis || devis?.numero || id}`,
pageStyle: `
 @page { size: A4; margin: 10mm; }
    body { 
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      width: 100% !important;
      margin: 0 !important;
    }
    .document-print-area {
      padding: 15mm;
    }
`,
onAfterPrint: () => toast.success("Devis imprimé avec succès")
});

  useEffect(() => {
    setLoading(true);
    setError(null);
    orderService
      .fetchOrderById(id)
      .then((data) => {
        setDevis(data);
        setEditDevis(data);
      })
      .catch(() => setError("Erreur lors du chargement du devis."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await orderService.updateOrder(editDevis.id, editDevis);
      setDevis(editDevis);
      setEdit(false);
      toast.success("Devis mis à jour !");
    } catch (err) {
      toast.error("Erreur lors de la mise à jour.");
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setEditDevis((prev: any) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <div className="p-4 text-center">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        {error}
        <button 
          className="ml-4 px-3 py-1 bg-gray-200 rounded" 
          onClick={onClose}
        >
          Fermer
        </button>
      </div>
    );
  }

  if (!devis) {
    return <div className="p-4">Devis introuvable.</div>;
  }

  const cart = Array.isArray(edit ? editDevis.cart : devis.cart) 
    ? (edit ? editDevis.cart : devis.cart) 
    : [];
  
  const totalHT = Number((edit ? editDevis.prix_ht : devis.prix_ht) || 0);
  const totalTVA = cart.reduce(
    (sum: number, item: any) => sum + Number(item.tva ?? 0) * Number(item.quantity ?? item.qty ?? 1),
    0
  );
  const totalTTC = Number((edit ? editDevis.prix_ttc : devis.prix_ttc) || 0);
  const totalTTCInt = Math.floor(totalTTC);
  const totalTTCDec = Math.round((totalTTC - totalTTCInt) * 100);
  const totalTTCWords =
    numberToFrenchWords(totalTTCInt).charAt(0).toUpperCase() +
    numberToFrenchWords(totalTTCInt).slice(1) +
    (totalTTCDec > 0
      ? " dinars et " + numberToFrenchWords(totalTTCDec) + " millimes"
      : " dinars");
  
  const qrValue = `https://votresite.com/commande/${devis.numero_devis || devis.numero}`;
  
  const client = {
    nom: (edit ? editDevis.nom : devis.nom) || "",
    prenom: (edit ? editDevis.prenom : devis.prenom) || "",
    adresse1: (edit ? editDevis.adresse1 : devis.adresse1) || "",
    adresse2: (edit ? editDevis.adresse2 : devis.adresse2) || "",
    ville: (edit ? editDevis.ville : devis.ville) || "",
    code_postale: (edit ? editDevis.code_postale : devis.code_postale) || "",
    pays: (edit ? editDevis.pays : devis.pays) || "",
    email: (edit ? editDevis.email : devis.email) || "",
    phone: (edit ? editDevis.phone : devis.phone) || ""
  };
  
  const dateEmission = (edit ? editDevis.created_at : devis.created_at)
    ? new Date(edit ? editDevis.created_at : devis.created_at).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "";

  return (
    <div className="devis-detail-container">
      <h2 className="text-2xl font-bold mb-4">
        Devis #{devis.numero_devis || devis.numero}
      </h2>

      {/* Non-printable edit/view section */}
      <div className="no-print">
        {edit ? (
          <div className="space-y-2 mb-6">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-semibold mb-1">Numéro Devis</label>
                <input
                  className="border px-2 py-1 rounded w-full"
                  value={editDevis.numero_devis || ""}
                  onChange={(e) => handleFieldChange("numero_devis", e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold mb-1">Date démission</label>
                <input
                  type="datetime-local"
                  className="border px-2 py-1 rounded w-full"
                  value={editDevis.created_at ? editDevis.created_at.slice(0, 16) : ""}
                  onChange={(e) => handleFieldChange("created_at", e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold mb-1">Validité</label>
                <input
                  className="border px-2 py-1 rounded w-full"
                  value={editDevis.validite_devis || ""}
                  onChange={(e) => handleFieldChange("validite_devis", e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-semibold mb-1">Client - Prénom</label>
                <input
                  className="border px-2 py-1 rounded w-full"
                  value={editDevis.prenom || ""}
                  onChange={(e) => handleFieldChange("prenom", e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold mb-1">Client - Nom</label>
                <input
                  className="border px-2 py-1 rounded w-full"
                  value={editDevis.nom || ""}
                  onChange={(e) => handleFieldChange("nom", e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold mb-1">Client - Email</label>
                <input
                  className="border px-2 py-1 rounded w-full"
                  value={editDevis.email || ""}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                onClick={() => setEdit(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <div><b>Numéro Devis:</b> {devis.numero_devis || devis.numero}</div>
            <div><b>Date démission:</b> {dateEmission}</div>
            <div><b>Validité:</b> {devis.validite_devis || "30 jours"}</div>
            <div><b>Client:</b> {client.prenom} {client.nom} ({client.email})</div>
            <button
              className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded"
              onClick={() => setEdit(true)}
            >
              Modifier
            </button>
          </div>
        )}
      </div>

      {/* Printable content */}
      <main ref={printRef} className="document-print-area bg-white py-8 px-1 font-sans print:py-0 print:px-0">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-6 relative border border-blue-200
                print:max-w-full print:w-full print:mx-0 print:p-0 print:border-none print:rounded-none print:shadow-none">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col items-start">
              <Image src={COMPANY.logo} alt="Logo" width={48} height={48} className="h-12 mb-1" loading="lazy" />
              <div className="text-[11px] text-gray-700 leading-tight">
                <div className="mb-0.5 font-bold">{COMPANY.name}</div>
                <div className="mb-0.5">{COMPANY.address}</div>
                <div>NIF : {COMPANY.nif}</div>
                <div>{COMPANY.email}</div>
                <div>{COMPANY.tel}</div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-extrabold text-right" style={{ color: ORANGE }}>
                DEVIS
              </span>
              <span className="text-[11px] text-gray-500 mt-2">
                Date démission : {dateEmission}
              </span>
              <span className="text-[11px] text-gray-500">
                N° : <span className="font-semibold">{devis.numero_devis || devis.numero}</span>
              </span>
              <span className="text-[11px] text-gray-500">
                Validité : {devis.validite_devis || "30 jours"}
              </span>
            </div>
          </div>
          
          <div className="w-full h-0.5 mb-4" style={{ background: ORANGE }} />
          
          {/* Client Info */}
          <div className="mb-4">
            <div className="font-semibold text-[13px] text-blue-700 mb-1">Client</div>
            <div className="text-[11px] text-gray-700 leading-tight">
              <div>{client.prenom} {client.nom}</div>
              <div>{client.adresse1}</div>
              {client.adresse2 && <div>{client.adresse2}</div>}
              <div>{client.ville}{client.code_postale ? `, ${client.code_postale}` : ""}</div>
              <div>{client.pays}</div>
              <div>Email : {client.email}</div>
              <div>Tél : {client.phone}</div>
            </div>
          </div>
          
          {/* Products Table */}
          <div className="overflow-x-auto mb-6">
            <table className="devis-table w-full border">
              <thead>
                <tr className="bg-[#FF4301] text-white">
                  <th className="p-1 text-left font-semibold">Produit</th>
                  <th className="p-1 text-right font-semibold">Quantité</th>
                  <th className="p-1 text-right font-semibold">PU HT</th>
                  <th className="p-1 text-right font-semibold">TVA</th>
                  <th className="p-1 text-right font-semibold">Total HT</th>
                </tr>
              </thead>
              <tbody>
                {cart.length > 0 ? (
                  cart.map((item: any, idx: number) => (
                    <tr key={idx} className="border-t">
                      <td className="p-1">{item.title || item.name || "Produit"}</td>
                      <td className="p-1 text-right">{item.quantity ?? item.qty ?? 1}</td>
                      <td className="p-1 text-right">
                        {Number(item.price ?? 0).toLocaleString("fr-TN", {
                          style: "currency",
                          currency: "TND"
                        })}
                      </td>
                      <td className="p-1 text-right">
                        {item.tva
                          ? Number(item.tva).toLocaleString("fr-TN", {
                              style: "currency",
                              currency: "TND"
                            })
                          : "0,000 TND"}
                      </td>
                      <td className="p-1 text-right">
                        {Number((item.price ?? 0) * (item.quantity ?? 1)).toLocaleString("fr-TN", {
                          style: "currency",
                          currency: "TND"
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-400 py-2">
                      Aucun produit trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Totals */}
          <div className="flex flex-col items-end space-y-1 mb-6 text-[12px]">
            <div className="flex justify-between w-56">
              <span className="font-medium">Total HT :</span>
              <span>{totalHT.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</span>
            </div>
            <div className="flex justify-between w-56">
              <span className="font-medium">TVA :</span>
              <span>{totalTVA.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</span>
            </div>
            <div className="flex justify-between w-56 border-t pt-2">
              <span className="font-bold">Total TTC :</span>
              <span className="font-bold" style={{ color: ORANGE }}>
                {totalTTC.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
              </span>
            </div>
          </div>
          
          {/* Total in Words */}
          <div className="mb-4 flex flex-col items-end">
            <span className="text-[12px] font-medium">
              Arrêté le présent devis à la somme de :
            </span>
            <span className="italic text-orange-700 font-semibold text-[12px]">
              {totalTTCWords}
            </span>
          </div>
          
          {/* Signature & QR Code */}
          <div className="flex justify-between items-end mb-6">
            <div className="flex flex-col items-start">
              <div className="h-12 border-b border-gray-400 w-32 mb-1" />
              <span className="text-[11px] text-gray-500">Signature du client</span>
            </div>
            <div className="flex flex-col items-center">
              <QRCode 
                value={qrValue} 
                size={48} 
                logoImage={COMPANY.logo} 
                logoWidth={24}
                logoHeight={24}
              />
              <span className="text-[11px] text-gray-500 mt-1">Scan pour vérifier</span>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-[10px] text-gray-400 mt-6 text-center border-t pt-3">
            &copy; {new Date().getFullYear()} {COMPANY.name}. Tous droits réservés.
          </div>
        </div>
      </main>

      {/* Non-printable action buttons */}
      <div className="mt-4 flex gap-2 no-print">
        <button
  onClick={() => {
    if (!printRef.current) {
      toast.error("Rien à imprimer !");
      return;
    }
    handlePrint();
  }}
  className="px-4 py-2 bg-orange-500 text-white rounded shadow hover:bg-orange-600"
>
  Imprimer / Exporter PDF
</button>
        <button 
          onClick={onClose} 
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default DevisDetail;