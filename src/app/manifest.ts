import { getLocale } from "@/i18n/api";
import { routes } from "@/lib/routes";
import type { MetadataRoute } from "next";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const locale = await getLocale();

  return {
    theme_color: "#ffffff",
    background_color: "#7c3aed",
    icons: [
      {
        purpose: "maskable",
        sizes: "512x512",
        src: "icon512_maskable.png",
        type: "image/png",
      },
      {
        purpose: "any",
        sizes: "512x512",
        src: "icon512_rounded.png",
        type: "image/png",
      },
    ],
    orientation: "any",
    display: "standalone",
    dir: "auto",
    lang: locale,
    name: "Deed Steps",
    short_name: "Deed Steps",
    start_url: routes.app,
    description:
      "Deed Steps is an application to track your deeds on group level.",
  };
}
