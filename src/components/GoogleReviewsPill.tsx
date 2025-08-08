"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

function GoogleReviewsPill() {
  const [data, setData] = useState<{ rating: string; count: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/google-reviews")
      .then((res) => res.json())
      .then((d) => {
        if (d.rating && d.count) setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (!data) return null;

  return (
    <a
      href="https://www.google.com/maps/place/PROTEINE+TUNISIE+%E2%80%93+SOBITAS+%7C+Creatine,+Mat%C3%A9riel+de+Musculation+%26+Whey+%C3%A0+Sousse/@35.836349,10.630565,16z/data=!4m6!3m5!1s0x1302131b30e891b1:0x51dae0f25849b20c!8m2!3d35.8363493!4d10.630565!16s%2Fg%2F11g4j5rl1d?hl=fr&entry=ttu&g_ep=EgoyMDI1MDcwOS4wIKXMDSoASAFQAw%3D%3D"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm mt-3 mb-1"
      style={{ fontSize: "15px", fontWeight: 500, color: "#222" }}
    >
      <Image
        src="/img/icon/google.svg"
        alt="Google"
        width={20}
        height={20}
        style={{ minWidth: 20, minHeight: 20 }}
      />
      <span style={{ color: "#222" }}>{data.rating}</span>
      <span style={{ color: "#fbbc04", fontSize: "18px", margin: "0 2px" }}>★</span>
      <span style={{ color: "#222" }}>
        {data.count} avis
      </span>
    </a>
  );
}

export default GoogleReviewsPill;
