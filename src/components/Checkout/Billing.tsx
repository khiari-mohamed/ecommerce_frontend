import React from "react";

// Liste mondiale des pays (ISO 3166, en français)
const COUNTRIES = [
  "Afghanistan", "Afrique du Sud", "Albanie", "Algérie", "Allemagne", "Andorre", "Angola", "Antigua-et-Barbuda", "Arabie saoudite", "Argentine", "Arménie", "Australie", "Autriche", "Azerbaïdjan",
  "Bahamas", "Bahreïn", "Bangladesh", "Barbade", "Belgique", "Belize", "Bénin", "Bhoutan", "Biélorussie", "Birmanie", "Bolivie", "Bosnie-Herzégovine", "Botswana", "Brésil", "Brunei", "Bulgarie", "Burkina Faso", "Burundi",
  "Cambodge", "Cameroun", "Canada", "Cap-Vert", "Chili", "Chine", "Chypre", "Colombie", "Comores", "Congo", "République démocratique du Congo", "Corée du Nord", "Corée du Sud", "Costa Rica", "Côte d'Ivoire", "Croatie", "Cuba",
  "Danemark", "Djibouti", "Dominique",
  "Égypte", "Émirats arabes unis", "Équateur", "Érythrée", "Espagne", "Estonie", "Eswatini", "États-Unis", "Éthiopie",
  "Fidji", "Finlande", "France",
  "Gabon", "Gambie", "Géorgie", "Ghana", "Grèce", "Grenade", "Guatemala", "Guinée", "Guinée-Bissau", "Guinée équatoriale", "Guyana",
  "Haïti", "Honduras", "Hongrie",
  "Inde", "Indonésie", "Irak", "Iran", "Irlande", "Islande", "Israël", "Italie",
  "Jamaïque", "Japon", "Jordanie",
  "Kazakhstan", "Kenya", "Kirghizistan", "Kiribati", "Koweït",
  "Laos", "Lesotho", "Lettonie", "Liban", "Libéria", "Libye", "Liechtenstein", "Lituanie", "Luxembourg",
  "Macédoine du Nord", "Madagascar", "Malaisie", "Malawi", "Maldives", "Mali", "Malte", "Maroc", "Marshall", "Maurice", "Mauritanie", "Mexique", "Micronésie", "Moldavie", "Monaco", "Mongolie", "Monténégro", "Mozambique",
  "Namibie", "Nauru", "Népal", "Nicaragua", "Niger", "Nigéria", "Norvège", "Nouvelle-Zélande",
  "Oman", "Ouganda", "Ouzbékistan",
  "Pakistan", "Palaos", "Palestine", "Panama", "Papouasie-Nouvelle-Guinée", "Paraguay", "Pays-Bas", "Pérou", "Philippines", "Pologne", "Portugal",
  "Qatar",
  "Roumanie", "Royaume-Uni", "Russie", "Rwanda",
  "Saint-Christophe-et-Niévès", "Saint-Marin", "Saint-Vincent-et-les-Grenadines", "Sainte-Lucie", "Salomon", "Salvador", "Samoa", "Sao Tomé-et-Principe", "Sénégal", "Serbie", "Seychelles", "Sierra Leone", "Singapour", "Slovaquie", "Slovénie", "Somalie", "Soudan", "Soudan du Sud", "Sri Lanka", "Suède", "Suisse", "Suriname", "Syrie",
  "Tadjikistan", "Tanzanie", "Tchad", "Tchéquie", "Thaïlande", "Timor oriental", "Togo", "Tonga", "Trinité-et-Tobago", "Tunisie", "Turkménistan", "Turquie", "Tuvalu",
  "Ukraine", "Uruguay", "Vanuatu", "Vatican", "Venezuela", "Viêt Nam",
  "Yémen",
  "Zambie", "Zimbabwe"
];

export const initialState = {
  firstName: "",
  lastName: "",
  companyName: "",
  countryName: "",
  address: "",
  addressTwo: "",
  town: "",
  country: "",
  phone: "",
  email: "",
  createAccount: false,
};

interface BillingProps {
  value: typeof initialState;
  onChange: (val: typeof initialState) => void;
}

const Billing: React.FC<BillingProps> = ({ value, onChange }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value: val, type } = e.target;
    onChange({
      ...value,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : val,
    });
  };

  return (
    <div className="mt-9">
      <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">
        Détails de facturation
      </h2>

      <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
          <div className="w-full">
            <label htmlFor="firstName" className="block mb-2.5">
              Prénom <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Prénom"
              value={value.firstName}
              onChange={handleChange}
              required
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>
          <div className="w-full">
            <label htmlFor="lastName" className="block mb-2.5">
              Nom <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Nom"
              value={value.lastName}
              onChange={handleChange}
              required
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="companyName" className="block mb-2.5">
            Société
          </label>
          <input
            type="text"
            name="companyName"
            id="companyName"
            placeholder="Nom de la société (optionnel)"
            value={value.companyName}
            onChange={handleChange}
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="countryName" className="block mb-2.5">
            Pays / Région <span className="text-red">*</span>
          </label>
          <div className="relative">
            <select
              name="countryName"
              value={value.countryName}
              onChange={handleChange}
              required
              className="w-full bg-gray-1 rounded-md border border-gray-3 text-dark-4 py-3 pl-5 pr-9 duration-200 appearance-none outline-none focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            >
              <option value="">Sélectionnez un pays</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-4">
              <svg
                className="fill-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.41469 5.03569L2.41467 5.03571L2.41749 5.03846L7.76749 10.2635L8.0015 10.492L8.23442 10.2623L13.5844 4.98735L13.5844 4.98735L13.5861 4.98569C13.6809 4.89086 13.8199 4.89087 13.9147 4.98569C14.0092 5.08024 14.0095 5.21864 13.9155 5.31345C13.9152 5.31373 13.915 5.31401 13.9147 5.31429L8.16676 10.9622L8.16676 10.9622L8.16469 10.9643C8.06838 11.0606 8.02352 11.0667 8.00039 11.0667C7.94147 11.0667 7.89042 11.0522 7.82064 10.9991L2.08526 5.36345C1.99127 5.26865 1.99154 5.13024 2.08609 5.03569C2.18092 4.94086 2.31986 4.94086 2.41469 5.03569Z"
                  fill=""
                  stroke=""
                  strokeWidth="0.666667"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="address" className="block mb-2.5">
            Adresse <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="address"
            id="address"
            placeholder="Numéro et nom de rue"
            value={value.address}
            onChange={handleChange}
            required
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
          <div className="mt-5">
            <input
              type="text"
              name="addressTwo"
              id="addressTwo"
              placeholder="Appartement, suite, unité, etc. (optionnel)"
              value={value.addressTwo}
              onChange={handleChange}
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="town" className="block mb-2.5">
            Ville <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="town"
            id="town"
            placeholder="Ville"
            value={value.town}
            onChange={handleChange}
            required
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="country" className="block mb-2.5">
            Gouvernorat / Région
          </label>
          <input
            type="text"
            name="country"
            id="country"
            placeholder="Gouvernorat ou région"
            value={value.country}
            onChange={handleChange}
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="phone" className="block mb-2.5">
            Téléphone <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="phone"
            id="phone"
            placeholder="Numéro de téléphone"
            value={value.phone}
            onChange={handleChange}
            required
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="mb-5.5">
          <label htmlFor="email" className="block mb-2.5">
            Adresse e-mail <span className="text-red">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Adresse e-mail"
            value={value.email}
            onChange={handleChange}
            required
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div>
          <label
            htmlFor="checkboxLabelTwo"
            className="text-dark flex cursor-pointer select-none items-center"
          >
            <div className="relative">
              <input
                type="checkbox"
                id="checkboxLabelTwo"
                name="createAccount"
                checked={value.createAccount}
                onChange={handleChange}
                className="sr-only"
              />
              <div className="mr-2 flex h-4 w-4 items-center justify-center rounded border border-gray-4">
                <span className={value.createAccount ? "opacity-100" : "opacity-0"}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="4"
                      y="4.00006"
                      width="16"
                      height="16"
                      rx="4"
                      fill="#3C50E0"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16.3103 9.25104C16.471 9.41178 16.5612 9.62978 16.5612 9.85707C16.5612 10.0844 16.471 10.3024 16.3103 10.4631L12.0243 14.7491C11.8635 14.9098 11.6455 15.0001 11.4182 15.0001C11.191 15.0001 10.973 14.9098 10.8122 14.7491L8.24062 12.1775C8.08448 12.0158 7.99808 11.7993 8.00003 11.5745C8.00199 11.3498 8.09214 11.1348 8.25107 10.9759C8.41 10.8169 8.62499 10.7268 8.84975 10.7248C9.0745 10.7229 9.29103 10.8093 9.4527 10.9654L11.4182 12.931L15.0982 9.25104C15.2589 9.09034 15.4769 9.00006 15.7042 9.00006C15.9315 9.00006 16.1495 9.09034 16.3103 9.25104Z"
                      fill="white"
                    />
                  </svg>
                </span>
              </div>
            </div>
            Créer un compte
          </label>
        </div>
      </div>
    </div>
  );
};

export default Billing;
