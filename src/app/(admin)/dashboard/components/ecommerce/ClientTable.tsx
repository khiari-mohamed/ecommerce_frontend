import { Client } from "@/types/client";
import "../../styles/dashboard.css";
interface Props {
  clients: Client[];
  onEdit?: (client: Client) => void;
  onSendSms?: (client: Client) => void;
  onExport?: () => void;
  onToggleSubscribe?: (client: Client) => void;
  selectedClientIds?: string[];
  onSelectClient?: (id: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
}

export default function ClientTable({
  clients,
  onEdit,
  onSendSms,
  onExport,
  onToggleSubscribe,
  selectedClientIds = [],
  onSelectClient,
  onSelectAll,
}: Props) {
  const allSelected = clients.length > 0 && clients.every(c => selectedClientIds.includes(c._id));
  return (
    <div className="tableContainer">
      <button className="exportBtn" onClick={onExport}>Export CSV</button>
      <table className="table">
        <thead>
          <tr>
            <th className="th">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={e => onSelectAll?.(e.target.checked)}
              />
            </th>
            <th className="th">Name</th>
            <th className="th">Email</th>
            <th className="th">Phone</th>
            <th className="th">Adresse</th>
            <th className="th">Ville</th>
            <th className="th">Subscriber</th>
            <th className="th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client._id}>
              <td className="td">
                <input
                  type="checkbox"
                  checked={selectedClientIds.includes(client._id)}
                  onChange={e => onSelectClient?.(client._id, e.target.checked)}
                />
              </td>
              <td className="td">{client.name}</td>
              <td className="td">{client.email}</td>
              <td className="td">{client.phone_1}</td>
              <td className="td">{client.adresse}</td>
              <td className="td">{client.ville}</td>
              <td className="td">
                <button
                  className={`actionBtn ${client.subscriber ? "editBtn" : "smsBtn"}`}
                  onClick={() => onToggleSubscribe?.(client)}
                  title={client.subscriber ? "Unsubscribe" : "Subscribe"}
                >
                  {client.subscriber ? "✅" : "➕"}
                </button>
              </td>
              <td className="td">
                <button className={`actionBtn editBtn`} onClick={() => onEdit?.(client)}>Edit</button>
                <button className={`actionBtn smsBtn`} onClick={() => onSendSms?.(client)}>SMS</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}