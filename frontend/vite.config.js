import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';

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
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['logo.webp'],
            workbox: {
                navigateFallbackDenylist: [/^\/api/, /^\/admin/, /^\/uploads/, /^\/api-docs/]
            },
            manifest: {
                name: 'Canary Weather',
                short_name: 'CanaryWeather',
                description: 'Accurate weather forecasts, tide charts, and activity guides for the Canary Islands.',
                theme_color: '#ffffff',
                background_color: "#ffffff",
                display: "standalone",
                icons: [
                    {
                        src: 'logo.webp',
                        sizes: '192x192',
                        type: 'image/webp'
                    },
                    {
                        src: 'logo.webp',
                        sizes: '512x512',
                        type: 'image/webp'
                    }
                ]
            }
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
            '/admin': {
                target: 'http://localhost:85',
                changeOrigin: true,
                secure: false,
            },
            '/api-docs': {
                target: 'http://localhost:85',
                changeOrigin: true,
                secure: false,
            },
        }
    },
    preview: {
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
            '/admin': {
                target: 'http://localhost:85',
                changeOrigin: true,
                secure: false,
            },
            '/api-docs': {
                target: 'http://localhost:85',
                changeOrigin: true,
                secure: false,
            },
        }
    }
});