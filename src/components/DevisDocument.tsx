import { QRCode } from "react-qrcode-logo";
import n2words from "n2words";

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

const DevisDocument = ({ order, printRef }) => {
  const cart = Array.isArray(order.cart) ? order.cart : [];

  const totalHT = Number(order.prix_ht || 0);
  // TVA is always 19% of totalHT (like Facture)
  const totalTVA = totalHT * 0.19;
  const totalTTC = Number(order.prix_ttc || 0);

  const totalTTCInt = Math.floor(totalTTC);
  const totalTTCDec = Math.round((totalTTC - totalTTCInt) * 100);
  const totalTTCWords =
    numberToFrenchWords(totalTTCInt).charAt(0).toUpperCase() +
    numberToFrenchWords(totalTTCInt).slice(1) +
    (totalTTCDec > 0
      ? " dinars et " + numberToFrenchWords(totalTTCDec) + " millimes"
      : " dinars");

  const qrValue = `https://votresite.com/commande/${order.numero_devis || order.numero}`;

  const client = {
    nom: order.nom,
    prenom: order.prenom,
    adresse1: order.adresse1,
    adresse2: order.adresse2,
    ville: order.ville,
    code_postale: order.code_postale,
    pays: order.pays,
    email: order.email,
    phone: order.phone
  };

  const dateEmission = order.created_at
    ? new Date(order.created_at).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "";

  return (
    <main
      ref={printRef}
      className="document-print-area bg-white py-8 px-1 font-sans print:py-0 print:px-0"
    >
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-6 relative border border-blue-200 print:shadow-none print:border-none print:rounded-none print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col items-start">
            <img src={COMPANY.logo} alt="Logo" className="h-12 mb-1" />
            <div className="text-[11px] text-gray-700 leading-tight">
              <div className="mb-0.5 font-bold">{COMPANY.name}</div>
              <div className="mb-0.5">{COMPANY.address}</div>
              <div>NIF : {COMPANY.nif}</div>
              <div>{COMPANY.email}</div>
              <div>{COMPANY.tel}</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span
              className="text-2xl font-extrabold text-right"
              style={{ color: ORANGE, letterSpacing: "1px" }}
            >
              DEVIS
            </span>
            <span className="text-[11px] text-gray-500 mt-2">
              Date d'émission : {dateEmission}
            </span>
            <span className="text-[11px] text-gray-500">
              N° : <span className="font-semibold">{order.numero_devis || order.numero}</span>
            </span>
            <span className="text-[11px] text-gray-500">
              Validité : {order.validite_devis || "30 jours"}
            </span>
          </div>
        </div>

        <div className="w-full h-0.5 mb-4" style={{ background: ORANGE, borderRadius: 2 }} />

        {/* Client Info */}
        <div className="flex flex-row justify-between gap-4 mb-4">
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
        </div>

        {/* Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border rounded-lg overflow-hidden shadow-sm text-[12px]">
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
                cart.map((item, idx) => (
                  <tr key={idx} className="border-t hover:bg-orange-50">
                    <td className="p-1">{item.title || item.name || item.product_name || "Produit"}</td>
                    <td className="p-1 text-right">{item.quantity ?? item.qty ?? 1}</td>
                    <td className="p-1 text-right">
                      {Number(item.price ?? item.unit_price ?? 0).toLocaleString("fr-TN", {
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
                        : "0,000 TND"}
                    </td>
                    <td className="p-1 text-right">
                      {Number((item.price ?? item.unit_price ?? 0) * (item.quantity ?? item.qty ?? 1)).toLocaleString("fr-TN", {
                        style: "currency",
                        currency: "TND"
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-2">
                    Aucun produit trouvé dans cette commande.<br />
                    <span className="text-xs text-red-400">Vérifiez la structure de la commande dans la console.</span>
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
            <span className="font-medium">TVA (19%) :</span>
            <span>{totalTVA.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</span>
          </div>
          <div className="flex justify-between w-56 pt-2" style={{ borderTop: `2px solid ${ORANGE}` }}>
            <span className="font-bold">Total TTC :</span>
            <span className="font-bold">
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

        {/* QR Code only (no signature line) */}
        <div className="flex justify-end items-end mb-6">
          <div className="flex flex-col items-center">
            <QRCode value={qrValue} size={48} logoImage={COMPANY.logo} />
            <span className="text-[11px] text-gray-500 mt-1">Scan pour vérifier</span>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="text-[10px] text-gray-500 mt-2">
          <p>
            Ce devis est établi sous réserve de disponibilité des produits au moment de la commande.
            Les prix indiqués sont valables pendant la durée de validité précisée ci-dessus. Toute commande passée
            implique l’acceptation des conditions générales de vente disponibles sur notre site.
          </p>
        </div>

        {/* Footer with RIB and copyright */}
        <div className="flex flex-row justify-between items-end mt-6 border-t pt-3 text-[10px]">
          {/* RIB bank info bottom left */}
          <div className="bg-white border border-orange-400 rounded-lg px-3 py-2 shadow text-[12px] text-gray-800 font-semibold flex items-center gap-2">
            <span className="text-orange-600 font-bold">Bank BAN RIB:</span>
            <span>03507065011500468753</span>
          </div>
          {/* Copyright right */}
          <div className="text-gray-400 text-right flex-1 ml-4">
            &copy; {new Date().getFullYear()} {COMPANY.name}. Tous droits réservés.
          </div>
        </div>
      </div>
    </main>
  );
};

export default DevisDocument;
