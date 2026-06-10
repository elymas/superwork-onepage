import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base must match the GitHub Pages repo path, or all assets 404 on deploy.
export default defineConfig({
  base: "/superwork-onepage/",
  plugins: [react()],
});
