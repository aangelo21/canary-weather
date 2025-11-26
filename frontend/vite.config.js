import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwind()],
    server: {
        allowedHosts: ['canaryweather.xyz'],
        hmr: {
            host: 'canaryweather.xyz',
            clientPort: 443,
        },
        proxy: {
            '/api': {
                target: 'http://localhost:85',
                changeOrigin: true,
                secure: false,
            },
            '/uploads': {
                target: 'http://localhost:85',
                changeOrigin: true,
                secure: false,
            },
        }
    }
});