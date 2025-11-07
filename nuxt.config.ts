// https://nuxt.com/docs/api/configuration/nuxt-config

import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { getLocalIP } from './utils/getLocalIP';

const devHost = getLocalIP();

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
      signaling: `http://${devHost}/signaling/`,
      url: 'http://' + devHost,
      rtcDataChannel: {
        maxPacketSize: 16 * 2 ** 10 // 16384
      },
      stun: {
        url: 'turn:relay1.expressturn.com:3480',
        username: '000000002077524954',
        password: '968HGcDZsppBD81gIJZ0v2RC3Qw=',
      }
    },
  },

  build: {
    transpile: ['vuetify']
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', config => {
        // @ts-expect-error
        config.plugins.push( vuetify({ autoImport: true } ) )
      })
    },
    '@pinia/nuxt'
  ],

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