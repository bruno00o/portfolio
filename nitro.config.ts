import { defineNitroConfig } from 'nitropack'
export default defineNitroConfig({
    serverAssets: [{
        baseName: 'lang',
        dir: '../lang',
    }]
})