/*
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const Login = () => {
  const [dropdown, setDropdown] = useState(false);
  const [form, setForm] = useState({ name: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, {
        username: form.name,
        password: form.password,
      });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        toast.success("Connexion réussie !");
        setDropdown(false);
      } else {
        toast.error(res.data.message || "Échec de la connexion.");
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Échec de la connexion. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-1 rounded-[10px] mb-7.5">
      <div
        onClick={() => setDropdown(!dropdown)}
        className={`cursor-pointer flex items-center gap-0.5 py-5 px-5.5 ${
          dropdown && "border-b border-gray-3"
        }`}
      >
        Déjà client ?
        <span className="flex items-center gap-2.5 pl-1 font-medium text-dark">
          Cliquez ici pour vous connecter
          <svg
            className={`${dropdown && "rotate-180"} fill-current ease-out duration-200`}
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.06103 7.80259C4.30813 7.51431 4.74215 7.48092 5.03044 7.72802L10.9997 12.8445L16.9689 7.72802C17.2572 7.48092 17.6912 7.51431 17.9383 7.80259C18.1854 8.09088 18.1521 8.5249 17.8638 8.772L11.4471 14.272C11.1896 14.4927 10.8097 14.4927 10.5523 14.272L4.1356 8.772C3.84731 8.5249 3.81393 8.09088 4.06103 7.80259Z"
              fill=""
            />
          </svg>
        </span>
      </div>

      {/* <!-- dropdown menu --> 
      <div
        className={`${
          dropdown ? "block" : "hidden"
        } pt-7.5 pb-8.5 px-4 sm:px-8.5`}
      >
        <p className="text-custom-sm mb-6">
          Si vous n&apos;êtes pas connecté, veuillez vous connecter d&apos;abord.
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label htmlFor="name" className="block mb-2.5">
              Nom d&apos;utilisateur ou e-mail
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Nom d'utilisateur ou e-mail"
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block mb-2.5">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="on"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Mot de passe"
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <button
            type="submit"
            className="inline-flex font-medium text-white bg-blue py-3 px-10.5 rounded-md ease-out duration-200 hover:bg-blue-dark"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
*/
