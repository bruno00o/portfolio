// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            title: 'My Nuxt App',
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            meta: [
                { hid: 'description', name: 'description', content: 'My custom Nuxt.js project' },
            ],
            htmlAttrs: {
                lang: 'en',
            },
        },
    },
    modules: [
        '@nuxtjs/robots',
        '@nuxtjs/i18n',
        '@nuxtjs/tailwindcss',
    ],
    i18n: {
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            redirectOn: 'root',  // recommended
        },
        locales: [
            {
                code: 'en',
                iso: 'en-US',
                name: 'English',
                file: 'en.json',
            },
            {
                code: 'fr',
                iso: 'fr-FR',
                name: 'Français',
                file: "fr.json",
            },
        ],
        lazy: true,
        langDir: 'lang/',
        defaultLocale: 'fr',
    },
    tailwindcss: {
        cssPath: '~/assets/css/tailwind.css',
        configPath: 'tailwind.config.js',
        exposeConfig: false,
    },
})
