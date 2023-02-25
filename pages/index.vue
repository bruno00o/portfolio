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

const schoolCareer = ref({} as any)

const schoolModal = ref(false)
const textSchoolModal = ref("")
const titleSchoolModal = ref("")

const darkBlobsColors = [
    "#9E4770",
    "#44BBA4",
    "#5F758E",
    "#E01A4F",
    "#F15A29",
]

const lightBlobsColors = [
    "#F15A29",
    "#E01A4F",
    "#5F758E",
    "#44BBA4",
    "#9E4770",
]

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

onBeforeMount(async () => {
    const blobs = document.querySelectorAll('#main-bg svg') as NodeListOf<SVGElement>
    const colors = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? darkBlobsColors
        : lightBlobsColors

    let usedColors = [] as string[]

    blobs.forEach((blob, i) => {
        const width = random(300, 600)
        let color = colors[random(0, colors.length - 1)]
        while (usedColors.includes(color)) {
            color = colors[random(0, colors.length - 1)]
        }
        usedColors.push(color)
        blob.style.fill = color
        blob.style.opacity = '0.5'
        blob.style.mixBlendMode = 'multiply'
        blob.style.position = 'absolute'
        blob.style.width = width + 'px'
        blob.style.animation = 'blob 50s linear infinite'
        blob.style.animationDelay = random(0, 100) + 's'
        blob.style.transition = 'all 0.5s ease-in-out'
        blob.style.transform = 'scale(1)'
        // blob.style.transformOrigin = 'center'
        // blob.style.transform = `translate(0, 0)`
    })

    const api = (await $fetch("/api")).api as any

    schoolCareer.value = api["school-career"] as any

    window.addEventListener('scroll', scroll)
})

/* const { x, y } = useMouse()

watchEffect(() => {
    const blobs = document.querySelectorAll('#main-bg svg')
    blobs.forEach((blob) => {
        blob.style.transform = `translate(${x.value / 40}px, ${y.value / 40}px)`
    })
}) */

const scroll = () => {
    const main = document.querySelector('#top') as HTMLElement
    /* blur main */
    const blur = (window.scrollY / 100)
    main.style.filter = `blur(${blur}px)`
    main.style.webkitFilter = `blur(${blur}px)`

    main.style.scale = 1 + (window.scrollY / 20000) + ''
}


</script>

<template>
    <main id="main">
        <header class="fixed relative w-full flex justify-center h-12 z-10 pt-4 animate-pop-in-late">
            <div
                class="text-slate-900 dark:text-slate-50 h-12 z-10 fixed w-full max-w-[90vw] sm:max-w-xl rounded-xl before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-slate-50 before:dark:bg-slate-800 z-0 before:rounded-xl before:opacity-90 before:border-2 before:border-slate-300 before:dark:border-slate-700 before:z-0">
                <nav class="h-full z-10 relative">
                    <ul class="flex justify-around items-center h-full">
                        <li class="flex justify-center items-center h-full">
                            <NuxtLink to="#main" class="flex justify-center items-center h-full w-full">
                                <span>{{ $t('nav.main') }}</span>
                            </NuxtLink>
                        </li>
                        <li class="flex justify-center items-center h-full">
                            <NuxtLink to="#about" class="flex justify-center items-center h-full w-full">
                                <span>{{ $t('nav.about') }}</span>
                            </NuxtLink>
                        </li>
                        <li class="flex justify-center items-center h-full">
                            <NuxtLink to="#projects" class="flex justify-center items-center h-full w-full">
                                <span>{{ $t('nav.projects') }}</span>
                            </NuxtLink>
                        </li>
                        <li class="flex justify-center items-center h-full">
                            <NuxtLink to="#contact" class="flex justify-center items-center h-full w-full">
                                <span>{{ $t('nav.contact') }}</span>
                            </NuxtLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
        <section id="top"
            class="grid justify-center items-center h-screen w-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 fixed min-h-screen overflow-hidden left-0 top-0">
            <div id="main-bg" class="h-screen w-screen absolute top-0 left-0 z-0 blur-xl overflow-hidden">
                <svg viewBox="0 0 440 440" xmlns="http://www.w3.org/2000/svg"
                    style="top: -5%; left: -5%; transform: scale(0);">
                    <path
                        d="M220,346.01827087294726C269.815088258292,348.8875808352422,324.1751194859037,365.8964161411004,361.6829462530463,332.9883792952603C405.39458125416854,294.6373411468981,429.2421458934569,231.8441287965166,414.1367785892759,175.68954714787242C399.4839995793432,121.21747382959852,342.1311454051558,96.39924018005317,291.40459224765254,71.72683638422642C240.30584543660277,46.87340487137676,182.74103360736163,11.811787550250624,132.75315114186407,38.83005156256792C83.82053049757967,65.2779504967618,84.3187511701291,132.25411515969844,77.32590428827636,187.4355686892834C71.5118985067382,233.31463558080452,66.47417966899552,283.38638396776935,97.4050853413221,317.7661820526049C126.9145359899585,350.56602844708743,175.95229113239682,343.4811574342484,220,346.01827087294726" />
                </svg>
                <svg viewBox="0 0 440 440" xmlns="http://www.w3.org/2000/svg"
                    style="top: -5%; left: 80%; transform: scale(0);">
                    <path
                        d="M220,358.4470763786093C249.15588683892003,352.83255814768546,277.1662394481185,348.4992987833333,303.7458444101828,335.2662661607675C335.5565685713992,319.4288467870175,370.7726563014045,305.60381841720186,388.26664233218236,274.6731463127038C407.5853069332158,240.5163064009727,412.05407278887355,198.7649671018821,402.4718657971788,160.71129679412903C392.48862222698756,121.06499612964504,369.87525070826354,82.9769938248768,334.734449600177,62.0815779151053C300.9129000877643,41.970615117158005,259.34854066831934,52.41086967599389,220,52.209913574761764C180.39268782190484,52.007635907015846,132.25407597324724,32.73546499102995,104.41093268607082,60.90529754498234C75.89311782010394,89.7577177366671,103.74797929252009,139.72046075355527,94.46996414964813,179.2128188833978C86.44144303966848,213.38664012057376,51.76365987238794,238.80333365406932,54.3930700873915,273.80895336126895C57.28592198115503,312.32180034288797,74.61831638248009,355.19051267133875,109.00855382861182,372.7666198372481C143.05884697901143,390.16898882000044,182.45031362157613,365.6779796916139,220,358.4470763786093" />
                </svg>
                <svg viewBox="0 0 440 440" xmlns="http://www.w3.org/2000/svg"
                    style="top: 70%; left: -5%; transform: scale(0);">
                    <path
                        d="M220,426.01304025078815C296.9150276536844,427.41305699092,330.51037080770186,336.59010045170527,349.0355506076594,261.9261919066865C363.00393553780685,205.62799527873597,343.0198149530553,149.2683299241702,297.6230357217302,113.16105702052255C244.02928908467652,70.53415554162302,170.35729486785834,35.18076150349815,115.51849085787411,76.19353979323424C61.92192599615223,116.27727377410392,85.50136956577033,193.34959165881153,104.65475264011769,257.4779427340824C126.19345171213028,329.592683531209,144.74991502301572,424.6433290008817,220,426.01304025078815" />
                </svg>
                <svg viewBox="0 0 440 440" xmlns="http://www.w3.org/2000/svg"
                    style="top: 80%; left: 80%; transform: scale(0);">
                    <path
                        d="M220,351.15103665200115C265.63396629230294,347.96403468359307,314.1148347456618,353.0858795556028,346.96742757765065,321.25314474803025C384.81229738144344,284.5831104998288,409.7116610845826,230.7424844093588,397.0605137891363,179.5870931554625C384.59422900611673,129.17920044304427,332.70411068703095,105.43393820442905,287.34321186300843,80.16037965255904C236.29781365096488,51.71961031241571,181.3206723650212,5.009731597469866,128.47101820960432,29.93811090576353C75.46914795921177,54.9382882345555,76.6675341916792,127.21138645860765,65.59153887237302,184.75727635699397C55.25384374213385,238.46729054695038,31.455026021394033,300.59692583300534,68.65991745120137,340.68968850393316C104.84825687844489,379.68699365260636,166.92789992905813,354.8575057831354,220,351.15103665200115" />
                </svg>
            </div>
            <div class="flex flex-col p-10 gap-2 relative animate-scaling-up">
                <h1 class="text-6xl font-bold sm:text-7xl">
                    Bruno Seilliebert
                </h1>
                <p class="text-xl sm:text-2xl sm:font-semibold">
                    {{ $t('main-text') }}
                </p>
            </div>
            <div class="flex gap-4 absolute bottom-4 md:right-8 left-4 md:left-auto">
                <NuxtLink to="https://github.com/bruno00o" target="_blank" aria-label="GitHub">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        class="h-8 w-8 fill-slate-900 hover:fill-slate-700 dark:fill-slate-100 dark:hover:fill-slate-300 animate-[pop-in-late_1s_ease-in-out]"
                        viewBox="0 0 496 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                        <path
                            d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                    </svg>
                </NuxtLink>
                <NuxtLink to="https://codepen.io/bruno00o" target="_blank" aria-label="Codepen">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        class="h-8 w-8 fill-slate-900 hover:fill-slate-700 dark:fill-slate-100 dark:hover:fill-slate-300 animate-[pop-in-late_1.5s_ease-in-out]"
                        viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                        <path
                            d="M502.285 159.704l-234-156c-7.987-4.915-16.511-4.96-24.571 0l-234 156C3.714 163.703 0 170.847 0 177.989v155.999c0 7.143 3.714 14.286 9.715 18.286l234 156.022c7.987 4.915 16.511 4.96 24.571 0l234-156.022c6-3.999 9.715-11.143 9.715-18.286V177.989c-.001-7.142-3.715-14.286-9.716-18.285zM278 63.131l172.286 114.858-76.857 51.429L278 165.703V63.131zm-44 0v102.572l-95.429 63.715-76.857-51.429L234 63.131zM44 219.132l55.143 36.857L44 292.846v-73.714zm190 229.715L61.714 333.989l76.857-51.429L234 346.275v102.572zm22-140.858l-77.715-52 77.715-52 77.715 52-77.715 52zm22 140.858V346.275l95.429-63.715 76.857 51.429L278 448.847zm190-156.001l-55.143-36.857L468 219.132v73.714z" />
                    </svg>
                </NuxtLink>
                <NuxtLink to="https://www.linkedin.com/in/bruno-seilliebert" target="_blank" aria-label="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        class="h-8 w-8 fill-slate-900 hover:fill-slate-700 dark:fill-slate-100 dark:hover:fill-slate-300 animate-[pop-in-late_2s_ease-in-out]"
                        viewBox="0 0 448 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                        <path
                            d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
                    </svg>
                </NuxtLink>
            </div>
        </section>
        <div class="absolute top-full w-full">
            <section id="about"
                class="flex flex-col items-center justify-center w-full h-full p-10 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-50 py-20">
                <h2 class="text-3xl font-bold sm:text-4xl mb-0 md:mb-10">
                    {{ $t('about-me') }}
                </h2>
                <table
                    class="max-w-5xl border-separate table-fixed border-spacing-y-5 flex flex-col w-full gap-5 mt-5 md:gap-0 md:block md:mt-0">
                    <tr class="text-xl font-bold sm:text-2xl self-start">
                        <td colspan="2">
                            <h3>{{ $t('school-career-title') }}</h3>
                        </td>
                    </tr>
                    <tr v-for="year in schoolCareer" :key="year.id"
                        class="flex flex-col md:table-row justify-center items-center w-full hover:animate-pulse hover:cursor-pointer"
                        @click="schoolModal = true, textSchoolModal = $t(`school-career.${year.id}.text`), titleSchoolModal = $t(`school-career.${year.id}.title`)">
                        <td
                            class="flex py-3 md:py-0 w-full gap-5 justify-center items-center md:h-40 px-10 bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-t-xl md:rounded-l-xl md:rounded-r-none w-full">
                            <div v-for="image in year.images" :key="image"
                                class="timeline-icon rounded-full overflow-hidden w-20 h-20 bg-white p-3">
                                <img :src="image.src" :alt="image.alt" />
                            </div>
                        </td>
                        <td
                            class="pb-3 md:pb-0 md:rounded-r-xl rounded-b-xl md:rounded-l-none bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-50 px-5 md:px-0 md:pr-10 w-full">
                            <p class="text-xl font-bold text-center md:text-left">
                                {{ $t(`school-career.${year.id}.title`) }}
                            </p>
                        </td>
                    </tr>
                </table>
            </section>
            <section id="projects"
                class="flex flex-col items-center justify-center w-full h-full p-10 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 sm:py-24">
                <h2 class="text-3xl font-bold sm:text-4xl mb-10">
                    {{ $t('projects-title') }}
                </h2>
            </section>
            <section id="contact"
                class="flex flex-col items-center justify-center w-full h-full p-10 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-50 sm:py-24">
                <h2 class="text-3xl font-bold sm:text-4xl mb-10">
                    {{ $t('contact-me-title') }}
                </h2>
            </section>
            <footer class="flex justify-center items-center w-full h-20 bg-slate-900 text-slate-50">
                Test
            </footer>
        </div>
    </main>
    <Teleport to="body">
        <Transition name="modal" appear>
            <div v-if="schoolModal" class="fixed inset-0 z-40 flex items-center justify-center">
                <div class="absolute inset-0 bg-black opacity-70" @click="schoolModal = false"></div>
                <div class="bg-white rounded-lg shadow-lg p-5 z-50 w-11/12 max-w-2xl dark:bg-slate-900 dark:text-slate-50">
                    <div class="flex flex-col gap-5">
                        <h3 class="text-xl font-bold sm:text-xl self-start">
                            {{ titleSchoolModal }}
                        </h3>
                        <p class="text-justify font-serif text-lg" v-html="textSchoolModal"></p>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped lang="scss">
.modal-enter-active,
.modal-leave-active {
    transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>