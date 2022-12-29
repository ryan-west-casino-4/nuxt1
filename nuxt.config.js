import * as path from 'path';
import { defineNuxtConfig } from '@nuxt/bridge';

export default defineNuxtConfig({
  ssr: false,

  srcDir: 'src',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Breeze-Nuxt',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/breeze.js', '~/plugins/mirage.js'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/axios'],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  vite: {
    optimizeDeps: {
      exclude: ['pinia'],
    },
    resolve: {
      alias: {
        pinia: path.resolve(__dirname, './node_modules/pinia/dist/pinia.mjs'),
      },
    },
  },
});
