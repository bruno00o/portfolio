<script setup>
const { isMobileOrTablet } = useDevice();
onMounted(() => {
    const words = document.querySelectorAll('#top-name .word')

    if (!isMobileOrTablet) {
        words.forEach((word) => {
            const letters = word.textContent.split('')
            word.textContent = ''
            letters.forEach((letter) => {
                const span = document.createElement('span')
                span.textContent = letter
                span.addEventListener('mouseover', () => {
                    span.style.fontVariationSettings = '"wght" 700'
                    span.style.transition = 'all 0.15s ease-in-out'
                })
                span.addEventListener('mouseout', () => {
                    setTimeout(() => {
                        span.style.fontVariationSettings = '"wght" 400'
                        span.style.transition = 'all 0.15s ease-in-out'
                    }, 1000)
                })
                word.append(span)
            })
        })
    }
})
</script>

<template>
    <h1 v-if="!$device.isMobileOrTablet" id="top-name" class="text-6xl sm:text-7xl">
        <span class="word">Bruno</span> <span class="word">Seilliebert</span>
    </h1>
    <h1 v-else id="top-name" class="text-6xl sm:text-7xl font-bold">
        Bruno Seilliebert
    </h1>
</template>

<style lang="scss">
@use "sass:math";

h1 {
    cursor: default;

    span {
        font-variation-settings: "wght" 400;
        rotate: 0deg;
    }
}
</style>