<script setup lang="ts">

const i18n = useI18n()

const i18nHead = useLocaleHead({
    addSeoAttributes: {
        canonicalQueries: ['foo']
    }
})

const meta = i18nHead.value.meta || []
meta.push({ hid: 'description', name: 'description', content: i18n.t('meta.description') })
meta.push({ hid: 'og:description', name: 'og:description', content: i18n.t('meta.description') })

useHead({
    htmlAttrs: {
        lang: i18nHead.value.htmlAttrs!.lang
    },
    link: [...(i18nHead.value.link || [])],
    meta: [...meta]
})

</script>
<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>