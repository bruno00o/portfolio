// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            title: 'Bruno Seilliebert - Portfolio',
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
            link: [{
                rel: 'preconnect',
                href: 'https://fonts.googleapis.com'
            },
            {
                rel: 'preconnect',
                href: 'https://fonts.gstatic.com',
                crossorigin: ""
            },
            {
                href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap",
                rel: "stylesheet"
            },
            {
                href: 'https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@400;500;600;700&display=swap',
                rel: 'stylesheet'
            },
        ]
        },
    },
    modules: [
        '@nuxtjs/robots',
        '@nuxtjs/i18n',
        '@nuxtjs/tailwindcss',
        '@vueuse/nuxt',
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
        langDir: './lang/',
        defaultLocale: 'fr',
        baseUrl: 'http://localhost:3000',
    },
    tailwindcss: {
        cssPath: '~/assets/css/tailwind.css',
        configPath: 'tailwind.config.ts',
        exposeConfig: false,
    },
})
