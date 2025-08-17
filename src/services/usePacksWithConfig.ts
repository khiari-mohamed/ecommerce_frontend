import { useEffect, useState } from "react";
import { Pack } from "@/types/pack";

interface PackConfig {
  sectionTitle: string;
  sectionDescription: string;
  maxDisplay: number;
  showOnFrontend: boolean;
}

export function usePacksWithConfig() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [config, setConfig] = useState<PackConfig>({
    sectionTitle: "Nos Packs Exclusifs",
    sectionDescription: "Profitez de nos packs exclusifs pour faire des économies sur vos achats !",
    maxDisplay: 4,
    showOnFrontend: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleConfigChange = (event: any) => {
      setConfig({
        sectionTitle: event.detail.sectionTitle || "Nos Packs Exclusifs",
        sectionDescription: event.detail.sectionDescription || "Profitez de nos packs exclusifs pour faire des économies sur vos achats !",
        maxDisplay: event.detail.maxDisplay || 4,
        showOnFrontend: event.detail.showOnFrontend !== false,
      });
    };

    window.addEventListener('packConfigChanged', handleConfigChange);
    return () => window.removeEventListener('packConfigChanged', handleConfigChange);
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      setLoading(true);
      try {
        const [packsRes, configRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/admin/packs/raw`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/pack/config`)
        ]);

        let mapped: Pack[] = [];
        if (packsRes.ok) {
          const packsData = await packsRes.json();
          if (packsData.success && Array.isArray(packsData.data)) {
            mapped = packsData.data.filter((pack: any) => pack.publier === '1');
          }
        }

        if (configRes.ok) {
          const configData = await configRes.json();
          if (configData && isMounted) {
            setConfig({
              sectionTitle: configData.sectionTitle || "Nos Packs Exclusifs",
              sectionDescription: configData.sectionDescription || "Profitez de nos packs exclusifs pour faire des économies sur vos achats !",
              maxDisplay: configData.maxDisplay || 4,
              showOnFrontend: configData.showOnFrontend !== false,
            });
          }
        } else {
          const saved = localStorage.getItem('packConfig');
          if (saved && isMounted) {
            const configData = JSON.parse(saved);
            setConfig({
              sectionTitle: configData.sectionTitle || "Nos Packs Exclusifs",
              sectionDescription: configData.sectionDescription || "Profitez de nos packs exclusifs pour faire des économies sur vos achats !",
              maxDisplay: configData.maxDisplay || 4,
              showOnFrontend: configData.showOnFrontend !== false,
            });
          }
        }

        if (isMounted) {
          setPacks(mapped);
        }
      } catch (e) {
        console.error("Error fetching packs or config:", e);
        if (isMounted) setPacks([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayedPacks = config.showOnFrontend 
    ? packs.slice(0, config.maxDisplay) 
    : [];

  return { 
    packs: displayedPacks, 
    config, 
    loading,
    showSection: config.showOnFrontend 
  };
}