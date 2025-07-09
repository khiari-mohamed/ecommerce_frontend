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
    <div className="w-full" style={{ background: '#f08c14', borderRadius: '8px', padding: '12px', marginBottom: '32px' }}>
      <div
        onClick={() => setDropdown(!dropdown)}
        className="flex items-center justify-between cursor-pointer text-sm"
        style={{ fontWeight: 500, color: "#fff" }}
      >
        <span>
          Déjà client ?{" "}
          <span className="text-[#fff] underline hover:no-underline transition">
            Cliquez ici pour vous connecter
          </span>
        </span>
        <svg
          className={`ml-2 transition-transform duration-200 ${
            dropdown ? "rotate-180" : ""
          }`}
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
            fill="#515151"
          />
        </svg>
      </div>
    
      {dropdown && (
        <div className="pt-6">
          <p className="mb-4 text-sm" style={{ color: '#fff' }}>
            Si vous avez déjà un compte, connectez-vous ci-dessous.
          </p>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block mb-1 text-sm font-medium"
                style={{ color: '#fff' }}
              >
                Nom d&apos;utilisateur ou e-mail&nbsp;
                <span className="text-[#fff]">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Nom d'utilisateur ou e-mail"
                className="w-full border border-[#d3ced2] rounded bg-white px-3 py-2 text-[#515151] focus:outline-none focus:border-[#ff4301] transition"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-medium"
                style={{ color: '#fff' }}
              >
                Mot de passe&nbsp;
                <span className="text-[#fff]">*</span>
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
                className="w-full border border-[#d3ced2] rounded bg-white px-3 py-2 text-[#515151] focus:outline-none focus:border-[#ff4301] transition"
              />
            </div>
            <button
              type="submit"
              className="bg-[#3074fc] hover:bg-[#255dcc] text-white font-semibold rounded px-6 py-2 transition"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
