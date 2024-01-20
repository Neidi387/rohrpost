// https://nuxt.com/docs/api/configuration/nuxt-config

import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0',
    // port: 3000
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
  routeRules: {
    'simpleRTCConnectionTest': {ssr: false}
  }
})
