import React, { useEffect, useRef, useState } from "react";
import BonLivraisonDocument from "@/components/BonLivraisonDocument";
import DevisDocument from "@/components/DevisDocument";
import FactureDocument from "@/components/FactureDocument";
import orderService from "@/services/orders";
import toast from "react-hot-toast";
import "../styles/dashboard.css"; // Adjust path as needed

const DOC_TYPES = [
  { key: "facture", label: "Facture Client" },
  { key: "bon-livraison", label: "Bon de Livraison" },
  { key: "devis", label: "Devis" },
];

interface FactureDetailProps {
  id: string;
  onClose: () => void;
}

const FactureDetail: React.FC<FactureDetailProps> = ({ id, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [facture, setFacture] = useState<any>(null);
  const [edit, setEdit] = useState(false);
  const [editFacture, setEditFacture] = useState<any>(null);
  const [docType, setDocType] = useState<"facture" | "boutique" | "bon-commande" | "bon-livraison" | "devis">("facture");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    orderService
      .fetchOrderById(id)
      .then((data) => {
        setFacture(data);
        setEditFacture(data);
      })
      .catch(() => setError("Erreur lors du chargement de la facture."))
      .finally(() => setLoading(false));
  }, [id]);

  // Print only the modal content
const handlePrint = () => {
  if (!printRef.current) return;

  const printContents = printRef.current.innerHTML;
  const printWindow = window.open("", "_blank", "width=800,height=600");
  
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Document</title>
          <link rel="stylesheet" type="text/css" href="/styles/dashboard.css" />
        </head>
        <body>
          <div class="facture-detail-modal-overlay">
            <div class="facture-detail-modal-content">
              ${printContents}
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
};


  const handleSave = async () => {
    setSaving(true);
    try {
      await orderService.updateOrder(editFacture.id, editFacture);
      setFacture(editFacture);
      setEdit(false);
      toast.success("Facture mise à jour !");
    } catch (err) {
      toast.error("Erreur lors de la mise à jour.");
    } finally {
      setSaving(false);
    }
  };

  const renderDocument = () => {
    if (!editFacture) return null;
    if (docType === "facture") {
      return <FactureDocument order={editFacture} printRef={printRef} />;
    }
    if (docType === "bon-livraison") {
      return <BonLivraisonDocument order={editFacture} printRef={printRef} />;
    }
    if (docType === "devis") {
      return <DevisDocument order={editFacture} printRef={printRef} />;
    }
    return null;
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
  if (!facture) {
    return <div>Facture introuvable.</div>;
  }

  return (
    <div className="facture-detail-modal-overlay">
      <div className="facture-detail-modal-content">
        <button
          className="facture-modal-close-btn"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>
        <div className="facture-detail-root">
          <h2 className="text-2xl font-bold mb-4">
            Détail Document #{facture.numero} ({docType})
          </h2>
          <div className="facture-detail-tabs flex gap-2 mb-4">
            {DOC_TYPES.map((t) => (
              <button
                key={t.key}
                className={`facture-detail-tab-btn px-3 py-1 rounded ${
                  docType === t.key ? "facture-detail-tab-btn-active bg-orange-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setDocType(t.key as any)}
              >
                {t.label}
              </button>
            ))}
          </div>
          {edit ? (
            <div className="facture-detail-edit-form space-y-2 mb-6">
              <input
                className="facture-detail-input"
                value={editFacture.numero}
                onChange={e => setEditFacture((f: any) => ({ ...f, numero: e.target.value }))}
                placeholder="Numéro"
              />
              <input
                className="facture-detail-input"
                value={editFacture.created_at}
                onChange={e => setEditFacture((f: any) => ({ ...f, created_at: e.target.value }))}
                placeholder="Date d'émission"
              />
              <input
                className="facture-detail-input"
                value={editFacture.nom}
                onChange={e => setEditFacture((f: any) => ({ ...f, nom: e.target.value }))}
                placeholder="Nom client"
              />
              {/* Add more fields as needed */}
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
              <div><b>Numéro:</b> {facture.numero}</div>
              <div><b>Date:</b> {facture.created_at}</div>
              <div><b>Client:</b> {facture.nom} {facture.prenom}</div>
              {/* Add more fields as needed */}
              <button className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded" onClick={() => setEdit(true)}>
                Modifier
              </button>
            </div>
          )}
          {/* Only the document preview is printable */}
          <div className="my-8">
            <div ref={printRef}>
              {renderDocument()}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
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
      </div>
    </div>
  );
};

export default FactureDetail;