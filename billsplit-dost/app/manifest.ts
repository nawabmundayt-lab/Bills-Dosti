import type { MetadataRoute } from "next";

/**
 * PWA manifest — installability (plan Phase 3 / Phase 7 TWA source).
 * Icons live in /public/icons (from design/phase-02/icon).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BillSplit Dost",
    short_name: "BillSplit",
    description:
      "Split bills with friends in Pakistan & India — settle via Raast, JazzCash, Easypaisa or UPI. Money never touches our servers.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F6F8F6",
    theme_color: "#0E7A3D",
    orientation: "portrait",
    lang: "en",
    dir: "ltr",
    categories: ["finance", "social", "productivity"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "Add expense",
        url: "/expense/new",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Settle up",
        url: "/home?action=settle",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
