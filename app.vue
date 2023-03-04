<script setup lang="ts">

const i18n = useI18n()

const i18nHead = useLocaleHead({
    addSeoAttributes: true
})

useHead({
    htmlAttrs: {
        lang: i18nHead.value.htmlAttrs!.lang
    },
})

useServerSeoMeta({
    title: "Portfolio - Bruno Seilliebert",
    description: i18n.t('meta.description'),
    ogDescription: i18n.t('meta.description'),
})

useSeoMeta({
    title: "Portfolio - Bruno Seilliebert",
    description: i18n.t('meta.description'),
    ogDescription: i18n.t('meta.description'),
})

</script>
<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>