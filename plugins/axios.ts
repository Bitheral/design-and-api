// Create a nuxt plugin to use axios

import axios from 'axios'

export default defineNuxtPlugin(nuxtApp => {
    // Create a custom axios instance
    const axiosInstance = axios.create({
        baseURL: 'http://34.68.126.214/wp-json/wp/v2/'
    })

    // Inject into nuxt as API
    nuxtApp.provide('api', axiosInstance);
})