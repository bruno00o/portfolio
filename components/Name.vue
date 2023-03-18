<script setup>
onMounted(() => {
    const name = document.querySelector('#name')
    const words = document.querySelectorAll('#name .word')

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
})
</script>

<template>
    <h1 id="name" class="text-6xl sm:text-7xl"><span class="word">Bruno</span> <span class="word">Seilliebert</span></h1>
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