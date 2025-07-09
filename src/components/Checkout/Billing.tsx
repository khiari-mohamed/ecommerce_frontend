import React, { useEffect, useState } from "react";

export const initialState = {
  firstName: "",
  lastName: "",
  gouvernorat: "",
  delegation: "",
  localite: "",
  codePostal: "",
  phone: "",
  phone2: "",
  email: "",
  birthday: "",
};

interface BillingProps {
  value: typeof initialState;
  onChange: (val: typeof initialState) => void;
}

const Billing: React.FC<BillingProps> = ({ value, onChange }) => {
  const [tunisiaData, setTunisiaData] = useState<any>({});
  const [delegations, setDelegations] = useState<string[]>([]);
  const [localites, setLocalites] = useState<string[]>([]);

  // Load Tunisia data on mount
  useEffect(() => {
    fetch("/tunisia.json")
      .then((res) => res.json())
      .then((data) => setTunisiaData(data));
  }, []);

  // Update delegations when gouvernorat changes
  useEffect(() => {
    if (value.gouvernorat && tunisiaData[value.gouvernorat]) {
      const uniqueDelegations = Array.from(
        new Set(tunisiaData[value.gouvernorat].map((item: any) => item.delegation))
      );
      setDelegations(uniqueDelegations);
    } else {
      setDelegations([]);
    }
    setLocalites([]);
    onChange({ ...value, delegation: "", localite: "", codePostal: "" });
    // eslint-disable-next-line
  }, [value.gouvernorat, tunisiaData]);

  // Update localites when delegation changes
  useEffect(() => {
    if (
      value.gouvernorat &&
      value.delegation &&
      tunisiaData[value.gouvernorat]
    ) {
      const filtered = tunisiaData[value.gouvernorat].filter(
        (item: any) => item.delegation === value.delegation
      );
      const uniqueLocalites = Array.from(
        new Set(filtered.map((item: any) => item.localite))
      );
      setLocalites(uniqueLocalites);
    } else {
      setLocalites([]);
    }
    onChange({ ...value, localite: "", codePostal: "" });
    // eslint-disable-next-line
  }, [value.delegation]);

  // Auto-fill code postal when localite changes
  useEffect(() => {
    if (
      value.gouvernorat &&
      value.delegation &&
      value.localite &&
      tunisiaData[value.gouvernorat]
    ) {
      const found = tunisiaData[value.gouvernorat].find(
        (item: any) =>
          item.delegation === value.delegation &&
          item.localite === value.localite
      );
      if (found && found.cp) {
        onChange({ ...value, codePostal: found.cp });
      }
    }
    // eslint-disable-next-line
  }, [value.localite]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value: val } = e.target;
    if (name === "gouvernorat") {
      onChange({ ...value, gouvernorat: val, delegation: "", localite: "", codePostal: "" });
    } else if (name === "delegation") {
      onChange({ ...value, delegation: val, localite: "", codePostal: "" });
    } else if (name === "localite") {
      onChange({ ...value, localite: val });
    } else {
      onChange({ ...value, [name]: val });
    }
  };

  return (
    <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
      <h3 className="font-medium text-lg sm:text-xl text-dark mb-6">
        Détails de facturation
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block mb-2.5 text-[#000] font-medium">
            Prénom <span className="text-[#ff4301]">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={value.firstName}
            onChange={handleChange}
            required
            className="w-full border border-[#d3ced2] rounded bg-white px-3 py-2 text-[#515151] focus:outline-none focus:border-[#ff4301] transition"
          />
        </div>
        <div>
          <label className="block mb-2.5 text-[#000] font-medium">
            Nom <span className="text-[#ff4301]">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={value.lastName}
            onChange={handleChange}
            required
            className="w-full border border-[#d3ced2] rounded bg-white px-3 py-2 text-[#515151] focus:outline-none focus:border-[#ff4301] transition"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block mb-2.5 text-[#000] font-medium">
            Pays/région <span className="text-[#ff4301]">*</span>
          </label>
          <input
            type="text"
            value="Tunisie"
            disabled
            className="w-full border border-[#d3ced2] rounded bg-gray-100 px-3 py-2 text-[#515151] cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block mb-2.5 text-[#000] font-medium">
            Gouvernorat <span className="text-[#ff4301]">*</span>
          </label>
          <select
            name="gouvernorat"
            value={value.gouvernorat}
            onChange={handleChange}
            required
            className="w-full border border-[#d3ced2] rounded bg-white px-3 py-2 text-[#515151] focus:outline-none focus:border-[#ff4301] transition"
          >
            <option value="">Sélectionnez le gouvernorat</option>
            {Object.keys(tunisiaData).map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2.5 text-[#000] font-medium">
            Délégation <span className="text-[#ff4301]">*</span>
          </label>
          <select
            name="delegation"
            value={value.delegation}
            onChange={handleChange}
            required
            className="w-full border border-[#d3ced2] rounded bg-white px-3 py-2 text-[#515151] focus:outline-none focus:border-[#ff4301] transition"
            disabled={!value.gouvernorat}
          >
            <option value="">Sélectionnez la délégation</option>
            {delegations.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2.5 text-[#000] font-medium">
            Localité <span className="text-[#ff4301]">*</span>
          </label>
          <select
            name="localite"
            value={value.localite}
            onChange={handleChange}
            required
            className="w-full border border-[#d3ced2] rounded bg-white px-3 py-2 text-[#515151] focus:outline-none focus:border-[#ff4301] transition"
            disabled={!value.delegation}
          >
            <option value="">Sélectionnez la localité</option>
            {localites.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2.5 text-[#000] font-medium">
            Code Postal <span className="text-[#ff4301]">*</span>
          </label>
          <input
            type="text"
            name="codePostal"
            value={value.codePostal}
            onChange={handleChange}
            required
            className="w-full border border-[#d3ced2] rounded bg-white px-3 py-2 text-[#515151] focus:outline-none focus:border-[#ff4301] transition"
            readOnly
          />
        </div>
        <div>
          <label className="block mb-2.5 text-[#000] font-medium">
            Téléphone 1 <span className="text-[#ff4301]">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={value.phone}
            onChange={handleChange}
            required
            className="w-full border border-[#d3ced2] rounded bg-white px-3 py-2 text-[#515151] focus:outline-none focus:border-[#ff4301] transition"
          />
        </div>
        <div>
          <label className="block mb-2.5 text-[#000] font-medium">
            Téléphone 2 (facultatif)
          </label>
          <input
            type="tel"
            name="phone2"
            value={value.phone2}
            onChange={handleChange}
            className="w-full border border-[#d3ced2] rounded bg-white px-3 py-2 text-[#515151] focus:outline-none focus:border-[#ff4301] transition"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block mb-2.5 text-[#000] font-medium">
            E-mail <span className="text-[#ff4301]">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={value.email}
            onChange={handleChange}
            required
            className="w-full border border-[#d3ced2] rounded bg-white px-3 py-2 text-[#515151] focus:outline-none focus:border-[#ff4301] transition"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block mb-2.5 text-[#000] font-medium">
            Renseigne ta date d'anniversaire et gagne des points de fidélité chaque année (réservé aux clients enregistrés) ! (facultatif)
          </label>
          <input
            type="date"
            name="birthday"
            placeholder="Date de naissance"
            value={value.birthday}
            onChange={handleChange}
            className="w-full border border-[#d3ced2] rounded bg-white px-3 py-2 text-[#515151] focus:outline-none focus:border-[#ff4301] transition"
          />
        </div>
      </div>
    </div>
  );
};

export default Billing;
