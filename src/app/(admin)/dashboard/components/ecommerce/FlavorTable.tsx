import React, { useEffect, useState } from "react";
import { Aroma } from "@/types/aroma";
import { getFlavors } from "../../utils/fetchflavors";
import Button from "../ui/Button";

interface FlavorTableProps {
  onEdit: (flavor: Aroma) => void;
  onDelete: (flavor: Aroma) => void;
}

const FlavorTable: React.FC<FlavorTableProps> = ({ onEdit, onDelete }) => {
  const [flavors, setFlavors] = useState<Aroma[]>([]);

  useEffect(() => {
    getFlavors().then(setFlavors);
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Brand</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {flavors.map((flavor) => (
          <tr key={flavor._id}>
            <td>{flavor.designation_fr}</td>
            <td>
              {typeof flavor.brand === "string"
                ? flavor.brand
                : (flavor.brand as any)?.designation || (flavor.brand as any)?.name || "—"}
            </td>
            <td>
              <Button onClick={() => onEdit(flavor)}>Edit</Button>
              <Button variant="danger" onClick={() => onDelete(flavor)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default FlavorTable;