import React, { useRef } from "react";
import  Button  from "../ui/Button";

interface BulkImportExportProps {
  entityName: string;
  onImport: (file: File) => void;
  onExport: () => void;
}

const BulkImportExport: React.FC<BulkImportExportProps> = ({ entityName, onImport, onExport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
      <Button onClick={() => fileInputRef.current?.click()}>
        Import {entityName} CSV
      </Button>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={e => {
          if (e.target.files && e.target.files[0]) {
            onImport(e.target.files[0]);
          }
        }}
      />
      <Button onClick={onExport}>
        Export {entityName} CSV
      </Button>
    </div>
  );
};

export default BulkImportExport;