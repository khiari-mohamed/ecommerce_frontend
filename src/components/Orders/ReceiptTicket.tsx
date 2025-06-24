import React, { useRef } from "react";

interface ReceiptTicketProps {
  order: any;
}

const ReceiptTicket: React.FC<ReceiptTicketProps> = ({ order }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const win = window.open('', '', 'height=600,width=400');
    if (win) {
      win.document.write('<html><head><title>Ticket de caisse</title>');
      win.document.write('<style>body{font-family:monospace;} .receipt-ticket{width:320px;margin:0 auto;} .receipt-header{text-align:center;} .receipt-items{width:100%;border-collapse:collapse;} .receipt-items th,.receipt-items td{border-bottom:1px dashed #ccc;padding:4px 0;text-align:left;} .receipt-total{font-weight:bold;font-size:1.1em;} .receipt-footer{text-align:center;margin-top:1em;font-size:0.95em;color:#888;}</style>');
      win.document.write('</head><body>');
      win.document.write(printContents);
      win.document.write('</body></html>');
      win.document.close();
      win.focus();
      win.print();
      win.close();
    }
  };

  // Example: order.items = [{ name, quantity, price }]
  const items = order?.items || [];
  const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  const total = order?.total || subtotal;
  const date = order?.created_at || order?.createdAt || new Date().toISOString();

  return (
    <div>
      <div ref={printRef} className="receipt-ticket" style={{ background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px #eee', width: 320, margin: '0 auto' }}>
        <div className="receipt-header">
          <h2>Ticket de caisse</h2>
          <div style={{ fontSize: '0.95em', marginBottom: 8 }}>Commande #{order?._id?.slice(-8) || 'N/A'}</div>
          <div style={{ fontSize: '0.9em', color: '#888' }}>{new Date(date.replace(' ', 'T')).toLocaleString('fr-TN')}</div>
        </div>
        <hr />
        <table className="receipt-items" style={{ width: '100%', marginTop: 8 }}>
          <thead>
            <tr>
              <th>Article</th>
              <th>Qté</th>
              <th style={{ textAlign: 'right' }}>Prix</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? items.map((item: any, idx: number) => (
              <tr key={idx}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td style={{ textAlign: 'right' }}>{item.price.toFixed(2)} DT</td>
              </tr>
            )) : (
              <tr><td colSpan={3} style={{ textAlign: 'center', color: '#aaa' }}>Aucun article</td></tr>
            )}
          </tbody>
        </table>
        <hr />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span>Sous-total</span>
          <span>{subtotal.toFixed(2)} DT</span>
        </div>
        {order?.tax && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>TVA</span>
            <span>{order.tax.toFixed(2)} DT</span>
          </div>
        )}
        <div className="receipt-total" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span>Total</span>
          <span>{total.toFixed(2)} DT</span>
        </div>
        <div style={{ marginTop: 8, fontSize: '0.95em' }}>
          <div>Client: {order?.nom || order?.prenom || order?.client?.name || 'N/A'}</div>
          {order?.payment_method && <div>Mode de paiement: {order.payment_method}</div>}
        </div>
        <div className="receipt-footer">
          Merci pour votre achat !
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <button onClick={handlePrint} style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>
          Imprimer
        </button>
      </div>
    </div>
  );
};

export default ReceiptTicket;
