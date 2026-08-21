import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PaperMaxing",
    short_name: "PaperMaxing",
    description: "Local-first research paper reader",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f3e9",
    theme_color: "#f7f3e9",
  };
}
