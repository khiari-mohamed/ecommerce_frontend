import React from "react";

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

const GOUVERNORATS = [
  "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba", "Kairouan",
  "Kasserine", "Kébili", "Le Kef", "Mahdia", "La Manouba", "Médenine", "Monastir",
  "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan"
];

// For demo: static options. Replace with dynamic logic if needed.
const DELEGATIONS = ["Sélectionnez la délégation"];
const LOCALITES = ["Sélectionnez la localité"];

interface BillingProps {
  value: typeof initialState;
  onChange: (val: typeof initialState) => void;
}

const Billing: React.FC<BillingProps> = ({ value, onChange }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value: val } = e.target;
    onChange({
      ...value,
      [name]: val,
    });
  };

  return (
    <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
      <h3 className="font-medium text-lg sm:text-xl text-dark mb-6">
        Détails de facturation
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block mb-2.5 text-[#515151] font-medium">
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
          <label className="block mb-2.5 text-[#515151] font-medium">
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
          <label className="block mb-2.5 text-[#515151] font-medium">
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
          <label className="block mb-2.5 text-[#515151] font-medium">
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
            {GOUVERNORATS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2.5 text-[#515151] font-medium">
            Délégation <span className="text-[#ff4301]">*</span>
          </label>
          <select
            name="delegation"
            value={value.delegation}
            onChange={handleChange}
            required
            className="w-full border border-[#d3ced2] rounded bg-white px-3 py-2 text-[#515151] focus:outline-none focus:border-[#ff4301] transition"
          >
            {DELEGATIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2.5 text-[#515151] font-medium">
            Localité <span className="text-[#ff4301]">*</span>
          </label>
          <select
            name="localite"
            value={value.localite}
            onChange={handleChange}
            required
            className="w-full border border-[#d3ced2] rounded bg-white px-3 py-2 text-[#515151] focus:outline-none focus:border-[#ff4301] transition"
          >
            {LOCALITES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2.5 text-[#515151] font-medium">
            Code Postal <span className="text-[#ff4301]">*</span>
          </label>
          <input
            type="text"
            name="codePostal"
            value={value.codePostal}
            onChange={handleChange}
            required
            className="w-full border border-[#d3ced2] rounded bg-white px-3 py-2 text-[#515151] focus:outline-none focus:border-[#ff4301] transition"
          />
        </div>
        <div>
          <label className="block mb-2.5 text-[#515151] font-medium">
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
          <label className="block mb-2.5 text-[#515151] font-medium">
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
          <label className="block mb-2.5 text-[#515151] font-medium">
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
          <label className="block mb-2.5 text-[#515151] font-medium">
            Renseigne ta date d'anniversaire et gagne des points de fidélité chaque année (réservé aux clients enregistrés) ! (facultatif)
          </label>
          <input
            type="text"
            name="birthday"
            placeholder="jj/mm/aaaa"
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
