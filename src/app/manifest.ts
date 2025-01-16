import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
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
    lang: "nl-NL",
    name: "Deed Steps",
    short_name: "Deed Steps",
    start_url: "/",
    description:
      "Deed Steps is an application to track your deeds on group level.",
  };
}
