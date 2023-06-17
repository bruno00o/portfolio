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
                rel: 'icon',
                type: 'image/x-icon',
                href: '/favicon.ico'
            }
            ],
        },
    },
    modules: [
        '@nuxtjs/robots',
        '@nuxtjs/i18n',
        '@nuxtjs/tailwindcss',
        '@nuxtjs/color-mode',
        '@nuxtjs/device',
    ],
    colorMode: {
        classSuffix: '',
        preference: 'system',
        fallback: 'light',
    },
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
        precompile: {
            strictMessage: false
        },
        lazy: true,
        langDir: './lang/',
        defaultLocale: 'fr',
        baseUrl: 'https://brunoseilliebert.com',
    },
    tailwindcss: {
        cssPath: '~/assets/css/tailwind.css',
        configPath: 'tailwind.config.ts',
        exposeConfig: false,
    },
    plugins: [
        { src: '~/plugins/vercel.ts', mode: 'client' },
    ],
    runtimeConfig: {
        smtpHost: process.env.SMTP_HOST,
        smtpPort: process.env.SMTP_PORT,
        mailUser: process.env.MAIL_USER,
        mailPass: process.env.MAIL_PASS,
    },
})
