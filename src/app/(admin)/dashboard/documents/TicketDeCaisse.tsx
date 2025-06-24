import React, { useState, useRef } from "react";
import "./TicketDeCaisse.css";

const LOGO_DATA_URL = "";

const COMPANY = {
  logo: LOGO_DATA_URL || "/images/logo/logo.png",
  name: "SOBITAS",
  address: "Rue Ribat, 4000 Sousse Tunisie",
  tel: "+21627612500 / +21673200169",
  website: "WWW.PROTEIN.TN",
};

interface TicketDeCaisseProps {
  ticketNumber?: string;
  date?: string;
  time?: string;
  items?: { name: string; qty: number; price: number }[];
  total?: number;
  remise?: number;
  remisePourcentage?: number;
  totalHT?: number;
  footer?: string;
  logoUrl?: string;
  hidePrintButton?: boolean;
}

const TicketDeCaisse: React.FC<TicketDeCaisseProps> = ({
  ticketNumber = "12345",
  date = "01/06/2025",
  time = "18:35",
  items = [],
  total = 0,
  remise = 0,
  remisePourcentage = 0,
  totalHT = 0,
  footer,
  logoUrl,
  hidePrintButton = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  // Print only the ticket content, at 80mm width, auto height
  const handleActualPrint = () => {
    if (ticketRef.current) {
      const printWindow = window.open('', '', 'width=400,height=600');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Ticket de Caisse</title>
              <style>
                @media print {
                  @page {
                    size: 90mm auto;
                    margin: 0;
                  }
                  html, body {
                    width: 90mm !important;
                    min-width: 90mm !important;
                    max-width: 90mm !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    background: #f5f5f5 !important;
                  }
                  body {
                    box-sizing: border-box !important;
                  }
                  .ticket-paper-outer {
                    width: 90mm !important;
                    min-width: 90mm !important;
                    max-width: 90mm !important;
                    background: #f5f5f5 !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    display: flex !important;
                    justify-content: center !important;
                    align-items: flex-start !important;
                  }
                  .ticket-root {
                    width: 80mm !important;
                    min-width: 80mm !important;
                    max-width: 80mm !important;
                    margin: 10mm auto !important;
                    padding: 10px !important;
                    border: 1px dashed #bbb !important;
                    font-family: 'Courier New', Courier, monospace !important;
                    background: #fff !important;
                    color: #000 !important;
                    box-sizing: border-box !important;
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    text-align: center !important;
                    line-height: 1.2 !important;
                    box-shadow: 0 0 0.5mm #ccc !important;
                  }
                }
                html, body {
                  width: 90mm !important;
                  min-width: 90mm !important;
                  max-width: 90mm !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  background: #f5f5f5 !important;
                }
                .ticket-paper-outer {
                  width: 90mm !important;
                  min-width: 90mm !important;
                  max-width: 90mm !important;
                  background: #f5f5f5 !important;
                  padding: 0 !important;
                  margin: 0 !important;
                  display: flex !important;
                  justify-content: center !important;
                  align-items: flex-start !important;
                }
                .ticket-root {
                  width: 80mm !important;
                  min-width: 80mm !important;
                  max-width: 80mm !important;
                  margin: 10mm auto !important;
                  padding: 10px !important;
                  border: 1px dashed #bbb !important;
                  font-family: 'Courier New', Courier, monospace !important;
                  background: #fff !important;
                  color: #000 !important;
                  box-sizing: border-box !important;
                  display: flex !important;
                  flex-direction: column !important;
                  align-items: center !important;
                  text-align: center !important;
                  line-height: 1.2 !important;
                  box-shadow: 0 0 0.5mm #ccc !important;
                }
                .ticket-logo {
                  width: 100% !important;
                  text-align: center !important;
                  margin-bottom: 10px !important;
                }
                .ticket-logo img,
                .ticket-logo-img {
                  display: block !important;
                  margin: 0 auto !important;
                  max-height: 40px !important;
                  max-width: 60mm !important;
                  width: auto !important;
                  height: auto !important;
                  object-fit: contain !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  background: transparent !important;
                }
                .ticket-header-info {
                  text-align: center !important;
                  margin-bottom: 8px !important;
                }
                .ticket-welcome {
                  font-weight: bold !important;
                  font-size: 14px !important;
                  text-transform: uppercase !important;
                  margin-bottom: 5px !important;
                }
                .ticket-address,
                .ticket-tel {
                  font-size: 12px !important;
                  margin: 3px 0 !important;
                }
                .ticket-separator {
                  width: 100% !important;
                  text-align: center !important;
                  margin: 8px 0 !important;
                  border-bottom: 1px dashed #bbb !important;
                }
                .ticket-meta {
                  width: 100% !important;
                  text-align: center !important;
                  font-size: 12px !important;
                  margin-bottom: 8px !important;
                  display: flex !important;
                  justify-content: center !important;
                }
                .ticket-items-header,
                .ticket-item {
                  display: flex !important;
                  width: 100% !important;
                  font-size: 12px !important;
                  margin: 2px 0 !important;
                }
                .ticket-items-header {
                  font-weight: bold !important;
                  border-bottom: 1px solid #ccc !important;
                  margin-bottom: 4px !important;
                  padding-bottom: 2px !important;
                }
                .item-name {
                  flex: 2 !important;
                  text-align: left !important;
                }
                .item-qty {
                  flex: 1 !important;
                  text-align: center !important;
                }
                .item-price {
                  flex: 1 !important;
                  text-align: right !important;
                }
                .ticket-items {
                  width: 100% !important;
                  margin-bottom: 8px !important;
                }
                .ticket-totals {
                  width: 100% !important;
                  margin: 8px 0 !important;
                  font-size: 12px !important;
                }
                .ticket-totals > div {
                  display: flex !important;
                  justify-content: space-between !important;
                  width: 100% !important;
                  margin: 3px 0 !important;
                }
                .ticket-footer {
                  width: 100% !important;
                  text-align: center !important;
                  font-size: 12px !important;
                  margin: 8px 0 !important;
                  font-weight: bold !important;
                }
                .ticket-website {
                  width: 100% !important;
                  text-align: center !important;
                  font-size: 12px !important;
                  font-weight: bold !important;
                  margin-top: 5px !important;
                }
                .ticket-website div:first-child {
                  text-transform: uppercase !important;
                  margin-bottom: 3px !important;
                }

              </style>
            </head>
            <body>
              <div class="ticket-paper-outer">
                <div class="ticket-root">
                  ${ticketRef.current.innerHTML}
                </div>
              </div>
              <script>
                window.onload = function() {
                  setTimeout(function() {
                    window.print();
                    window.close();
                  }, 100);
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
    setShowModal(false);
  };

  return (
    <>
      <div className="ticket-paper-outer">
        <div className="ticket-root" ref={ticketRef}>
          {/* Logo */}
          <div className="ticket-logo">
            {(logoUrl || COMPANY.logo) && (
              <img
                src={logoUrl || COMPANY.logo}
                alt="Logo"
                className="ticket-logo-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
          </div>
          
          {/* Header Info */}
          <div className="ticket-header-info">
            <div className="ticket-welcome">BIENVENUE CHEZ {COMPANY.name}</div>
            <div className="ticket-address">Adresse: {COMPANY.address}</div>
            <div className="ticket-tel">Tel: {COMPANY.tel}</div>
          </div>
          
          <div className="ticket-separator">-----------------------</div>
          
          {/* Date & Time */}
          <div className="ticket-meta">
            <span>{date}</span>
            <span style={{ marginLeft: 8 }}>{time}</span>
          </div>
          
          {/* Items */}
          {items && items.length > 0 && (
            <>
              <div className="ticket-items-header">
                <span className="item-name">Produit</span>
                <span className="item-qty">Qte</span>
                <span className="item-price">Total</span>
              </div>
              <div className="ticket-items">
                {items.map((item, idx) => (
                  <div className="ticket-item" key={idx}>
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">{item.qty}</span>
                    <span className="item-price">{item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {/* Totals */}
          <div className="ticket-totals">
            <div>
              <span>Total</span>
              <span>{total.toFixed(2)}</span>
            </div>
            <div>
              <span>Remise</span>
              <span>{remise.toFixed(2)}</span>
            </div>
            <div>
              <span>Pourcentage Remise %</span>
              <span>{remisePourcentage.toFixed(2)}</span>
            </div>
            <div>
              <span>Total HT</span>
              <span>{totalHT.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="ticket-separator">--------------</div>
          
          <div className="ticket-footer">
            {footer || `${COMPANY.name} vous remercie de votre visite`}
          </div>
          
          <div className="ticket-separator">---------------</div>
          
          <div className="ticket-website">
            <div>NOTRE SITE WEB</div>
            <div>{COMPANY.website}</div>
          </div>
        </div>
        {!hidePrintButton && (
          <button className="print-button" onClick={() => setShowModal(true)}>
            Voir
          </button>
        )}
      </div>

      {showModal && (
        <div className="ticket-modal-overlay">
          <div className="ticket-modal-content">
            <button
              className="ticket-modal-close-btn"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            {/* Preview only, disables print button inside preview */}
            <TicketDeCaisse
              ticketNumber={ticketNumber}
              date={date}
              time={time}
              items={items}
              total={total}
              remise={remise}
              remisePourcentage={remisePourcentage}
              totalHT={totalHT}
              footer={footer}
              logoUrl={logoUrl}
              hidePrintButton={true}
            />
            <button className="print-confirm-button" onClick={handleActualPrint}>
              Imprimer
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const App = (props) => (
  <div style={{ background: "#eaeaea", minHeight: "100vh", padding: "40px 0" }}>
    <div className="ticket-paper-outer">
      <TicketDeCaisse {...props} />
    </div>
  </div>
);

export default App;