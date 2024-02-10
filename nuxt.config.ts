// https://nuxt.com/docs/api/configuration/nuxt-config

import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { getLocalIP } from './utils/getLocalIP';

const devHost = getLocalIP();

console.log('Dev Host: ' + devHost);

export default defineNuxtConfig({
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  runtimeConfig: {
    public: {
      socketPort: 3001,
      url: 'http://' + devHost,
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
    }
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      }
    }
  },
  plugins: [
    // './plugins/signaling-socket.io'
  ],
  nitro: {
    plugins: [
      // './plugins/signaling-socket.io-server'
    ]
  },
  routeRules: {
    'simpleRTCConnectionTest': {ssr: false},
    'signaling-test-passive': {ssr: false},
    'signaling-test-active': {ssr: false},
    'first-working-version': {ssr: false},
  },
})
