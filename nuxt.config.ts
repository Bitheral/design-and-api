// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    '~/assets/styles.css',
  ],
  app: {
    head: {
      link: [{
        rel: 'stylesheet',
        href: 'https://cdn.bitheral.net/static_www/css/axiforma_font.css'
      }]
    }
  },
  plugins: [
    '~/plugins/axios.ts',
  ]
})
