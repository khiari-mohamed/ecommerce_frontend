
import React, { useEffect, useRef, useState } from "react";
import { QRCode } from "react-qrcode-logo";
import orderService from "@/services/orders";
import toast from "react-hot-toast";
import { useReactToPrint } from "react-to-print";
import "../styles/dashboard.css";

const COMPANY = {
  logo: "/images/logo/logo.png",
  name: "sobitas",
  email: "contact@protein.tn",
  address: "Rue Ribat, 4000 Sousse Tunisie",
  tel: "+216 73 200 169"
};

const ORANGE = "#FF4301";

interface BonLivraisonDetailProps {
  id: string;
  onClose: () => void;
}

const BonLivraisonDetail: React.FC<BonLivraisonDetailProps> = ({ id, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [bon, setBon] = useState<any>(null);
  const [edit, setEdit] = useState(false);
  const [editBon, setEditBon] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Bon de Livraison by ID
  useEffect(() => {
    setLoading(true);
    setError(null);
    orderService
      .fetchOrderById(id)
      .then((data) => {
        setBon(data);
        setEditBon(data);
      })
      .catch(() => setError("Erreur lors du chargement du bon de livraison."))
      .finally(() => setLoading(false));
  }, [id]);

  // Print/export using react-to-print v3+
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `BonLivraison_${bon?.numero_bl || bon?.numero || id}`,
  });

  // Save edits to backend
  const handleSave = async () => {
    setSaving(true);
    try {
      await orderService.updateOrder(editBon.id, editBon);
      setBon(editBon);
      setEdit(false);
      toast.success("Bon de livraison mis à jour !");
    } catch (err) {
      toast.error("Erreur lors de la mise à jour.");
    } finally {
      setSaving(false);
    }
  };

  // Helper for input fields
  const handleFieldChange = (field: string, value: any) => {
    setEditBon((prev: any) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600">
        {error}
        <button className="ml-4 px-3 py-1 bg-gray-200 rounded" onClick={onClose}>
          Fermer
        </button>
      </div>
    );
  }

  if (!bon) {
    return <div>Bon de livraison introuvable.</div>;
  }

  // Prepare data for display
  const cart = Array.isArray(edit ? editBon.cart : bon.cart) ? (edit ? editBon.cart : bon.cart) : [];
  const client = {
    nom: (edit ? editBon.nom : bon.nom) || "",
    prenom: (edit ? editBon.prenom : bon.prenom) || "",
    adresse1: (edit ? editBon.adresse1 : bon.adresse1) || "",
    adresse2: (edit ? editBon.adresse2 : bon.adresse2) || "",
    ville: (edit ? editBon.ville : bon.ville) || "",
    code_postale: (edit ? editBon.code_postale : bon.code_postale) || "",
    pays: (edit ? editBon.pays : bon.pays) || "",
    email: (edit ? editBon.email : bon.email) || "",
    phone: (edit ? editBon.phone : bon.phone) || "",
  };
  const delivery = {
    nom: (edit ? editBon.livraison_nom : bon.livraison_nom) || "",
    prenom: (edit ? editBon.livraison_prenom : bon.livraison_prenom) || "",
    adresse1: (edit ? editBon.livraison_adresse1 : bon.livraison_adresse1) || "",
    adresse2: (edit ? editBon.livraison_adresse2 : bon.livraison_adresse2) || "",
    ville: (edit ? editBon.livraison_ville : bon.livraison_ville) || "",
    code_postale: (edit ? editBon.livraison_code_postale : bon.livraison_code_postale) || "",
    pays: (edit ? editBon.livraison_pays : bon.livraison_pays) || "",
    phone: (edit ? editBon.livraison_phone : bon.livraison_phone) || "",
  };
  const dateCommande = (edit ? editBon.created_at : bon.created_at)
    ? new Date(edit ? editBon.created_at : bon.created_at).toLocaleDateString("fr-FR")
    : "";
  const dateLivraison = (edit ? editBon.date_livraison : bon.date_livraison)
    ? new Date(edit ? editBon.date_livraison : bon.date_livraison).toLocaleDateString("fr-FR")
    : "";

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Bon de Livraison #{bon.numero_bl || bon.numero}
      </h2>
      {edit ? (
        <div className="space-y-2 mb-6">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1">Numéro BL</label>
              <input
                className="border px-2 py-1 rounded w-full"
                value={editBon.numero_bl || ""}
                onChange={e => handleFieldChange("numero_bl", e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1">Date Commande</label>
              <input
                type="date"
                className="border px-2 py-1 rounded w-full"
                value={editBon.created_at ? editBon.created_at.slice(0, 10) : ""}
                onChange={e => handleFieldChange("created_at", e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1">Date Livraison</label>
              <input
                type="date"
                className="border px-2 py-1 rounded w-full"
                value={editBon.date_livraison ? editBon.date_livraison.slice(0, 10) : ""}
                onChange={e => handleFieldChange("date_livraison", e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1">Client - Prénom</label>
              <input
                className="border px-2 py-1 rounded w-full"
                value={editBon.prenom || ""}
                onChange={e => handleFieldChange("prenom", e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1">Client - Nom</label>
              <input
                className="border px-2 py-1 rounded w-full"
                value={editBon.nom || ""}
                onChange={e => handleFieldChange("nom", e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1">Client - Email</label>
              <input
                className="border px-2 py-1 rounded w-full"
                value={editBon.email || ""}
                onChange={e => handleFieldChange("email", e.target.value)}
              />
            </div>
          </div>
          {/* Add more editable fields as needed for client/delivery */}
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleSave} disabled={saving}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded" onClick={() => setEdit(false)}>
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <div><b>Numéro BL:</b> {bon.numero_bl || bon.numero}</div>
          <div><b>Date Commande:</b> {dateCommande}</div>
          <div><b>Date Livraison:</b> {dateLivraison}</div>
          <div><b>Client:</b> {client.prenom} {client.nom} ({client.email})</div>
          {/* Add more fields as needed */}
          <button className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded" onClick={() => setEdit(true)}>
            Modifier
          </button>
        </div>
      )}

      {/* --- Bon de Livraison Document Preview --- */}
      <main
        ref={printRef}
        className="bonlivraison-document-print-area bg-white py-8 px-1 font-sans print:py-0 print:px-0"
      >
        <div className="bonlivraison-document-root max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-6 relative border border-blue-200 print:shadow-none print:border-none print:rounded-none print:p-0">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col items-start">
              <img src={COMPANY.logo} alt="Logo" className="h-12 mb-1" />
              <div className="text-[11px] text-gray-700 leading-tight">
                <div className="mb-0.5 font-bold">{COMPANY.name}</div>
                <div className="mb-0.5">{COMPANY.address}</div>
                <div>{COMPANY.email}</div>
                <div>{COMPANY.tel}</div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-extrabold text-right" style={{ color: ORANGE, letterSpacing: "1px" }}>
                BON DE LIVRAISON
              </span>
              <span className="text-[11px] text-gray-500 mt-2">
                Date de la commande : {dateCommande}
              </span>
              <span className="text-[11px] text-gray-500">
                Date de livraison : {dateLivraison}
              </span>
              <span className="text-[11px] text-gray-500">
                N° : <span className="font-semibold">{bon.numero_bl || bon.numero}</span>
              </span>
            </div>
          </div>
          {/* Orange thin line */}
          <div className="w-full h-0.5 mb-4" style={{ background: ORANGE, borderRadius: 2 }} />
          {/* Client & Delivery */}
          <div className="flex flex-row justify-between gap-4 mb-4">
            {/* Client */}
            <div className="flex-1">
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
            {/* Delivery */}
            <div className="flex-1">
              <div className="font-semibold text-[13px] text-blue-700 mb-1">Adresse de livraison</div>
              <div className="text-[11px] text-gray-700 leading-tight">
                <div>{delivery.prenom} {delivery.nom}</div>
                <div>{delivery.adresse1}</div>
                {delivery.adresse2 && <div>{delivery.adresse2}</div>}
                <div>{delivery.ville}{delivery.code_postale ? `, ${delivery.code_postale}` : ""}</div>
                <div>{delivery.pays}</div>
                <div>Tél : {delivery.phone || "N/A"}</div>
              </div>
            </div>
          </div>
          {/* Table: Products */}
          <div className="overflow-x-auto mb-6">
            <table className="bonlivraison-table w-full border rounded-lg overflow-hidden shadow-sm text-[12px]">
              <thead>
                <tr className="bg-[#FF4301] text-white">
                  <th className="p-1 text-left font-semibold">Produit</th>
                  <th className="p-1 text-right font-semibold">Quantité</th>
                </tr>
              </thead>
              <tbody>
                {cart.length > 0 ? (
                  cart.map((item: any, idx: number) => (
                    <tr key={idx} className="border-t hover:bg-orange-50">
                      <td className="p-1">{item.title || item.name || item.product_name || "Produit"}</td>
                      <td className="p-1 text-right">{item.quantity ?? item.qty ?? 1}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center text-gray-400 py-2">
                      Aucun produit trouvé dans cette commande.<br />
                      <span className="text-xs text-red-400">Vérifiez la structure de la commande dans la console.</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Signature */}
          <div className="flex justify-between items-end mb-6">
            <div className="flex flex-col items-start">
              <div className="h-12 border-b border-gray-400 w-32 mb-1" />
              <span className="text-[11px] text-gray-500">Signature du client</span>
            </div>
            <div className="flex flex-col items-center">
              <QRCode value={`https://votresite.com/commande/${bon.numero_bl || bon.numero}`} size={48} logoImage={COMPANY.logo} />
              <span className="text-[11px] text-gray-500 mt-1">Scan pour vérifier</span>
            </div>
          </div>
          {/* Footer */}
          <div className="text-[10px] text-gray-400 mt-6 text-center border-t pt-3">
            &copy; {new Date().getFullYear()} {COMPANY.name}. Tous droits réservés.
          </div>
        </div>
      </main>
      <div className="mt-4 flex gap-2">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-orange-500 text-white rounded shadow hover:bg-orange-600"
        >
          Imprimer / Exporter PDF
        </button>
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded">
          Fermer
        </button>
      </div>
    </div>
  );
};

export default BonLivraisonDetail;
