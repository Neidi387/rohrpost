// https://nuxt.com/docs/api/configuration/nuxt-config

import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { getLocalIP } from './utils/getLocalIP';

const devHost = getLocalIP();
const isDev = process.env.NODE_ENV === 'development';

console.log('Dev Host: ' + devHost);

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,

  devServer: {
    host: '0.0.0.0',
    port: 3000
  },

  runtimeConfig: {
    public: {
      signaling: `/signaling/`,
      rtcDataChannel: {
        maxPacketSize: 16 * 2 ** 10 // 16384
      },
      stun: {
        urls: [
          "stun:stun.cloudflare.com:3478",
          "turn:turn.cloudflare.com:3478?transport=udp",
          "turn:turn.cloudflare.com:3478?transport=tcp",
          "turns:turn.cloudflare.com:5349?transport=tcp"
        ],
        username: '000000002078146487',
        password: 'CmZBT4LXDOAjUhQila07n1m6D/w=',
      }
    },
  },

  build: {
    transpile: ['vuetify']
  },

  modules: [(_options, nuxt) => {
    nuxt.hooks.hook('vite:extendConfig', config => {
      // @ts-expect-error
      config.plugins.push( vuetify({ autoImport: true } ) )
    })
  }, '@pinia/nuxt', '@nuxtjs/device'],

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      }
    }
  },

  plugins: [
  ],

  nitro: {
    static: true,
    plugins: [
    ]
  },

  routeRules: {
    '': {ssr: false},
    'first-working-version': {ssr: false},
  },

  compatibilityDate: '2024-11-24',
})