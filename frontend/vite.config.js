import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
    plugins: [
        react(),
        tailwind(),
        viteCompression({
            algorithm: 'gzip',
            ext: '.gz',
        }),
        viteCompression({
            algorithm: 'brotliCompress',
            ext: '.br',
        }),
    ],
    build: {
        minify: 'terser',
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    leaflet: ['leaflet', 'react-leaflet'],
                    i18n: ['i18next', 'react-i18next'],
                },
            },
        },
    },
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