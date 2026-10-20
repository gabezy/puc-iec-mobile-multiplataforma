import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
/// <reference types="vitest" />

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['tests/**', 'node_modules/**'],
  },
  plugins: [
    react(),
    VitePWA({
      // TODO 3 (parte 1): hoje o app se atualiza SOZINHO. Troque para o modo em que
      // o usuário decide quando atualizar (veja a tabela do slide "Nova versão").
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'TMDB Popular Movies',
        short_name: 'TMDB Movies',
        description: 'Filmes populares do The Movie Database — funciona offline',
        theme_color: '#01b4e4',
        background_color: '#0d253f',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icons/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/pwa-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // TODO 2 — runtimeCaching: é AQUI que mora o PWA offline do app.
        //
        // Escreva DUAS regras (cada uma é um objeto { urlPattern, handler, options }):
        //
        //  (a) API de filmes  → https://api.themoviedb.org/...
        //      - estratégia que tenta a REDE primeiro e cai pro cache se falhar
        //      - desiste da rede após 3 segundos (networkTimeoutSeconds)
        //      - cacheName 'tmdb-api' · expiration: no máx. 50 entradas, 1 dia
        //
        //  (b) Pôsteres → qual é o HOST das imagens? Abra o app, DevTools → Network → Img
        //      e olhe a URL de um pôster (NÃO é o mesmo host da API!)
        //      - estratégia que serve do CACHE primeiro (imagem não muda)
        //      - cacheName 'tmdb-images' · expiration: no máx. 200 entradas, 7 dias
        //      - pôsteres vêm de outra origem SEM CORS → a resposta é "opaca" (status 0):
        //        só entra no cache se você liberar o status 0 em cacheableResponse
        //
        // Referências: slides "Cache strategies" e "vite-plugin-pwa" · web.dev/learn/pwa (módulo Caching)
        runtimeCaching: [
          // API de filmes
          {
            urlPattern: ({ url })  => url.pathname.includes('/movie/popular'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'tmdb-api',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60, // 1 dia
              },
              networkTimeoutSeconds: 3,
              cacheableResponse: {
                statuses: [0, 200],
              },
            }
          },
          // Pôsteres
          {
            urlPattern: ({ url }) => url.hostname === 'image.tmdb.org',
            handler: 'CacheFirst',
            options: {
              cacheName: 'tmdb-images',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 dias
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            }
          }
        ],
      },
    }),
  ],
});
