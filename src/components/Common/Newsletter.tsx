
"use client";
import React, { useState } from "react";
import Image from "next/image";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          customerName: "Valued Customer",
          customerEmail: email,
          unsubscribeLink: "https://protein.tn/unsubscribe?email=" + encodeURIComponent(email),
        }),
      });

      if (res.ok) {
        setStatus("success");
        setMessage("Merci de votre inscription ! Veuillez consulter votre boîte mail..");
        setEmail("");
      } else {
        const data = await res.json();
        setStatus("error");
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <section className="overflow-hidden w-full">
      <div className="w-full px-0">
        <div className="relative z-1 overflow-hidden rounded-none">
          {/* <!-- bg shapes --> */}
          <Image
            src="/images/shapes/newsletter-bg.jpg"
            alt="background illustration"
            className="absolute -z-1 w-full h-full left-0 top-0 object-cover"
            fill
            priority
          />
          <div className="absolute -z-1 max-w-[523px] max-h-[243px] w-full h-full right-0 top-0 bg-gradient-1"></div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 px-4 sm:px-7.5 xl:pl-12.5 xl:pr-14 py-11 w-full">
            <div className="max-w-[491px] w-full">
              <h2 className="max-w-[399px] text-white font-bold text-lg sm:text-xl xl:text-heading-4 mb-3">
                Ne manquez pas les dernières tendances et offres
              </h2>
              <p className="text-white">
                Inscrivez-vous pour recevoir des nouvelles sur les dernières offres et codes de réduction
              </p>
            </div>

            <div className="max-w-[477px] w-full">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    className="w-full bg-gray-1 border border-gray-3 outline-none rounded-none placeholder:text-dark-4 py-3 px-5"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === "loading"}
                  />
                  <button
                    type="submit"
                    className="inline-flex justify-center py-3 px-7 text-white bg-blue font-medium rounded-none ease-out duration-200 hover:bg-blue-dark"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? "Subscribing..." : "Subscribe"}
                  </button>
                </div>
                {message && (
                  <div
                    className={`mt-2 text-sm ${
                      status === "success"
                        ? "text-green-600"
                        : status === "error"
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
