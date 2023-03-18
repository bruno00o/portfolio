<script setup lang="ts">
import { Carousel, Navigation, Slide } from 'vue3-carousel'

const schoolCareer = ref({} as any)
const projects = ref([] as any)

const schoolModal = ref(false)
const textSchoolModal = ref("")
const titleSchoolModal = ref("")
const status = ref("")

const projectTypeSelected = ref("")


const api = (await $fetch("/api") as any) as any
schoolCareer.value = api["school-career"] as any
projects.value = api.projects as any
status.value = api.status as any

projectTypeSelected.value = projects.value.school.id

onBeforeMount(async () => {
    window.addEventListener('scroll', () => {
        const main = document.querySelector('#top') as HTMLElement
        if (window.scrollY >= 0) {
            const blur = (window.scrollY / 100)
            main.style.filter = `blur(${blur}px)`
            main.style.scale = 1 + (window.scrollY / 20000) + ''
        }
    })
})

type Theme = 'light' | 'dark' | 'system'

const setColorTheme = (oldTheme: Theme) => {
    const themes = ['light', 'dark', 'system'] as Theme[]
    const newTheme = themes[(themes.indexOf(oldTheme) + 1) % themes.length]
    useColorMode().preference = newTheme
}

const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const langDropdown = ref(false)
const actualLanguage = computed(() => {
    return (locales.value as any[]).filter((i => i.code === locale.value))[0].name
})

const availableLocales = computed(() => {
    return (locales.value as any[])
})

const formName = ref("")
const formEmail = ref("")
const formTel = ref("")
const formMessage = ref("")
const formError = ref(false)
const formSuccess = ref(false)

const sendButtonBlock = ref(false)

const sendMail = async () => {
    sendButtonBlock.value = true
    if (formName.value === "" || formEmail.value === "" || formMessage.value === "") {
        formError.value = true
        return
    }
    formError.value = false
    const res = await $fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({
            lang: locale.value,
            name: formName.value,
            email: formEmail.value,
            tel: formTel.value,
            message: formMessage.value
        })
    })
    if (res.statusCode === 200) {
        formSuccess.value = true
        formName.value = ""
        formEmail.value = ""
        formTel.value = ""
        formMessage.value = ""
    } else {
        formError.value = true
        formSuccess.value = false
    }
    sendButtonBlock.value = false
}

const scrollTo = (id: string) => {
    const el = document.querySelector(id) as HTMLElement
    el.scrollIntoView({ behavior: 'smooth' })
}

</script>

<template>
    <main id="main">
        <header class="fixed w-full flex justify-center h-12 z-10 pt-4 animate-pop-in-late pointer-events-none">
            <div
                class="text-slate-900 dark:text-slate-50 h-12 z-10 fixed w-full max-w-[90vw] sm:max-w-xl rounded-xl before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-slate-50 before:dark:bg-slate-800 before:rounded-xl before:opacity-90 before:border-2 before:border-slate-300 before:dark:border-slate-700 before:z-0 font-medium">
                <nav class="h-full z-10 relative pointer-events-auto">
                    <ul class="flex justify-around items-center h-full">
                        <li class="flex justify-center items-center h-full">
                            <div @click="scrollTo('#main')"
                                class="flex justify-center items-center h-full w-full hover:font-bold cursor-pointer">
                                <span>{{ $t('nav.main') }}</span>
                            </div>
                        </li>
                        <li class="flex justify-center items-center h-full">
                            <div @click="scrollTo('#about')"
                                class="flex justify-center items-center h-full w-full hover:font-bold cursor-pointer">
                                <span>{{ $t('nav.about') }}</span>
                            </div>
                        </li>
                        <li class="flex justify-center items-center h-full">
                            <div @click="scrollTo('#projects')"
                                class="flex justify-center items-center h-full w-full hover:font-bold cursor-pointer">
                                <span>{{ $t('nav.projects') }}</span>
                            </div>
                        </li>
                        <li class="flex justify-center items-center h-full">
                            <div @click="scrollTo('#contact')"
                                class="flex justify-center items-center h-full w-full hover:font-bold cursor-pointer">
                                <span>{{ $t('nav.contact') }}</span>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
        <section id="top"
            class="min-h-full grid justify-center items-center w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 fixed overflow-hidden left-0 top-0">
            <div id="main-bg" class="h-full w-full absolute top-0 left-0 z-0 blur-xl overflow-hidden">
                <Blobs />
            </div>
            <div class="flex flex-col p-10 gap-2 relative animate-scaling-up">
                <Name />
                <p class="text-xl sm:text-2xl sm:font-semibold">
                    {{ $t('main-text') }}
                </p>
                <div v-if="!(status == '')"
                    class="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-50 rounded-xl p-3 sm:p-4 mt-4 w-fit flex items-center gap-4">
                    <div class="rounded-full bg-green-600 min-w-[0.5em] min-h-[0.5em] animate-pulse"></div>
                    {{ $t('status') }}
                </div>
            </div>
            <div class="flex gap-4 absolute bottom-4-env lg:right-4 left-4 lg:left-auto">
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
            <div
                class="flex justify-center items-end lg:items-center gap-4 absolute bottom-4-env lg:top-4 right-4 lg:left-auto h-12 z-20">
                <button @click="setColorTheme($colorMode.preference as Theme)" aria-label="Toggle color theme"
                    class="h-6 w-6 flex items-center justify-center animate-[pop-in-late_1s_ease-in-out]">
                    <div v-if="$colorMode.preference === 'system'">
                        <div class="system h-6 w-6 bg-slate-900 dark:bg-slate-100"></div>
                    </div>
                    <div v-else-if="$colorMode.preference === 'dark'">
                        <svg class="h-6 w-6 fill-slate-900 dark:fill-slate-100" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 384 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                            <path
                                d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" />
                        </svg>
                    </div>
                    <div v-else-if="$colorMode.preference === 'light'">
                        <svg class="h-6 w-6 fill-slate-900 dark:fill-slate-100" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                            <path fill-rule="evenodd"
                                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                </button>
                <div class="relative animate-[pop-in-late_1s_ease-in-out]">
                    <button @click="langDropdown ? langDropdown = false : langDropdown = true"
                        class="flex items-center gap-2">
                        <span>{{ actualLanguage }}</span>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4 fill-gray-900 dark:fill-gray-50 transition-all duration-300 ease-in-out origin-center"
                                :class="langDropdown ? 'transform rotate-180' : ''"
                                viewBox="0 0 384 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                                <path
                                    d="M169.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 274.7 54.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                            </svg>
                        </span>
                    </button>
                    <Transition name="dropdown">
                        <div v-show="langDropdown"
                            class="absolute bottom-full lg:bottom-auto lg:top-full right-0 w-32 bg-white dark:bg-gray-900 shadow-lg rounded-md py-2 flex flex-col gap-2 lg:mt-2 mb-2 lg:mb-0"
                            role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                            <NuxtLink v-for="locale in availableLocales" :key="locale.code"
                                :to="switchLocalePath(locale.code)"
                                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800">
                                {{
                                    locale.name
                                }}</NuxtLink>
                        </div>
                    </Transition>
                </div>
            </div>
        </section>
        <div class="absolute top-full w-full">
            <section id="about"
                class="flex flex-col items-center justify-center w-full h-full p-5 md:px-10 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-50 py-20">
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
                    <tr v-if="schoolCareer" v-for="year in schoolCareer" :key="year.id" :id="year.id"
                        class="flex flex-col md:table-row justify-center items-center w-full hover:animate-pulse hover:cursor-pointer"
                        @click="schoolModal = true, textSchoolModal = $t(`school-career.${year.id}.text`), titleSchoolModal = $t(`school-career.${year.id}.title`)">
                        <td
                            class="flex py-3 md:py-0 gap-5 justify-center items-center md:h-40 px-10 bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-t-xl md:rounded-l-xl md:rounded-r-none w-full">
                            <div v-if="year.images" v-for="image in year.images" :key="image"
                                class="timeline-icon rounded-full overflow-hidden h-14 w-14 md:w-20 md:h-20 bg-white p-3">
                                <picture>
                                    <source :srcset="image.src + '.webp'" type="image/webp" />
                                    <source :srcset="image.src + '.jpg'" type="image/jpeg" />
                                    <img :src="image.src + '.jpg'" :alt="image.alt" width="80" height="80" />
                                </picture>
                            </div>
                        </td>
                        <td
                            class="pb-3 md:pb-0 md:rounded-r-xl rounded-b-xl md:rounded-l-none bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-50 px-5 md:px-0 md:pr-10 w-full">
                            <p class="text-base md:text-xl font-bold text-center md:text-left">
                                {{ $t(`school-career.${year.id}.title`) }}
                            </p>
                        </td>
                    </tr>
                </table>
            </section>
            <section id="projects"
                class="flex flex-col items-center justify-center w-full h-full p-5 md:px-10 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 py-20">
                <h2 class="text-3xl font-bold sm:text-4xl mb-5 md:mb-10">
                    {{ $t('projects-title') }}
                </h2>
                <nav id="projects-nav" class="mb-5 md:mb-10">
                    <ul
                        class="flex gap-5 sm:flex-row sm:gap-10 md:gap-15 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-50 rounded-lg p-2">
                        <li v-for="project in projects" :key="project.id"
                            :class="project.id === projectTypeSelected ? 'active' : ''"
                            class="flex flex-col items-center justify-center gap-2 cursor-pointer py-2 px-5 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg w-30 sm:w-40 md:w-60 md:text-lg"
                            @click="projectTypeSelected = project.id">
                            {{ $t(`projects.${project.id}.small-title`) }}
                        </li>
                    </ul>
                </nav>
                <h3 class="text-lg font-bold sm:text-xl">
                    {{ $t(`projects.${projectTypeSelected}.text`) }}
                </h3>
                <Carousel class="w-screen h-full max-w-[95vw] md:max-w-3xl mt-5 md:mt-10">
                    <Slide v-for="project, index in projects[projectTypeSelected].projects" :key="project.id">
                        <div
                            class="w-full h-full bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-lg px-12 md:px-16 py-8 flex gap-3 items-start justify-center flex-col">
                            <h4 class="text-lg font-bold text-left sm:text-xl">
                                {{ $t(`projects.${projectTypeSelected}.projects[${index}].title`) }}
                            </h4>
                            <p class="text-left" v-html="$t(`projects.${projectTypeSelected}.projects[${index}].text`)">
                            </p>
                            <div class="flex flex-col sm:flex-row gap-3">
                                <NuxtLink v-for="link, index2 in project.links" :key="link.id"
                                    :to="link.href.replace('[at]', '@')" target="_blank"
                                    class="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-50 rounded-lg py-1 px-3 hover:bg-slate-300 dark:hover:bg-slate-600">
                                    <span>{{
                                        $t(`projects.${projectTypeSelected}.projects[${index}].links[${index2}].text`)
                                    }}</span>
                                </NuxtLink>
                            </div>
                        </div>
                    </Slide>
                    <template #addons>
                        <Navigation />
                    </template>
                </Carousel>
            </section>
            <section id="contact"
                class="relative flex flex-col items-center justify-center w-full h-full p-5 md:px-10 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-50 py-20">
                <h2 class="text-3xl font-bold sm:text-4xl mb-10">
                    {{ $t('contact-me-title') }}
                </h2>
                <div class="flex flex-col gap-5 md:gap-10 w-full max-w-[95vw] md:max-w-3xl mb-4">
                    <p v-html="$t('contact-me-linkedin')"></p>
                    <p>{{ $t('contact-me-text') }}</p>
                </div>
                <form class="flex flex-col gap-5 md:gap-10 w-full max-w-[95vw] md:max-w-3xl" @submit.prevent="sendMail">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="name" class="text-lg font-bold">
                                {{ $t('contact-me.name') }}
                            </label>
                            <input type="text" id="name" v-model="formName"
                                class="rounded-lg p-2 text-slate-900 focus:outline-slate-900" required />
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                            <label for="email" class="text-lg font-bold">
                                {{ $t('contact-me.email') }}
                            </label>
                            <input type="email" id="email" v-model="formEmail" class="rounded-lg p-2 text-slate-900 focus:outline-slate-900
                                                                        " required />
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                            <label for="tel" class="text-lg font-bold">
                                {{ $t('contact-me.tel') }}
                            </label>
                            <input type="tel" id="tel" v-model="formTel"
                                class="rounded-lg p-2 text-slate-900 focus:outline-slate-900" />
                        </div>
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label for="message" class="text-lg font-bold">
                            {{ $t('contact-me.message') }}
                        </label>
                        <textarea id="message" v-model="formMessage"
                            class="rounded-lg p-2 text-slate-900 h-36 focus:outline-slate-900" required></textarea>
                    </div>
                    <div class="flex flex-col gap-2 w-full justify-center items-center">
                        <button type="submit"
                            class="bg-slate-700 text-slate-50 rounded-lg py-1 px-3 hover:bg-slate-400 dark:hover:bg-slate-600 min-w-[150px] disabled:opacity-50"
                            :disabled="sendButtonBlock">
                            {{ $t('contact-me.send') }}
                        </button>
                    </div>
                </form>
                <p v-if="formSuccess" class="mt-8 text-lg font-bold">
                    {{ $t('contact-me.success') }}
                </p>
                <p v-if="formError" class="mt-8 text-lg font-bold">
                    {{ $t('contact-me.error') }}
                </p>
            </section>
            <footer class="w-full h-14 bg-slate-900 text-slate-50 flex items-center justify-center">
                <div class="text-sm text-center">
                    Made with<NuxtLink to="https://nuxt.com/" target="_blank" class="text-slate-50 hover:underline">
                        Nuxt
                    </NuxtLink>
                    <NuxtLink to="https://tailwindcss.com/" target="_blank" class="text-slate-50 hover:underline">Tailwind
                    </NuxtLink>
                    <NuxtLink to="https://brunoseilliebert.com" class="text-slate-50 hover:underline">Bruno
                        Seilliebert</NuxtLink>
                </div>
            </footer>
        </div>
    </main>
    <Teleport to="body">
        <Transition name="modal" appear>
            <div v-if="schoolModal" class="fixed inset-0 z-40 flex items-center justify-center">
                <div class="absolute inset-0 bg-black opacity-70" @click="schoolModal = false"></div>
                <div
                    class="bg-white rounded-lg shadow-lg p-5 md:p-10 z-50 w-11/12 max-w-2xl dark:bg-slate-800 dark:text-slate-50 relative">
                    <div class="flex flex-col gap-5">
                        <h3 class="text-lg font-bold sm:text-xl self-start">
                            {{ titleSchoolModal }}
                        </h3>
                        <p class="text-justify font-base sm:text-lg" v-html="textSchoolModal"></p>
                    </div>
                    <button
                        class="absolute top-[-8px] right-[-8px] bg-gray-500 rounded-full h-6 w-6 flex items-center justify-center hover:bg-gray-400"
                        @click="schoolModal = false">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-white"
                            viewBox="0 0 320 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                            <path
                                d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
                        </svg>
                    </button>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script lang="ts">

import 'vue3-carousel/dist/carousel.css';

export default defineComponent({
    name: 'WrapAround',
    components: {
        Carousel,
        Slide,
        Navigation,
    },
})
</script>

<style lang="scss">
.modal-enter-active,
.modal-leave-active {
    transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.carousel__item {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.carousel__slide {
    padding: 10px;
}

.carousel__prev,
.carousel__next {
    box-sizing: content-box;
}

.bottom-4-env {
    bottom: 1rem;
    padding-bottom: env(safe-area-inset-bottom);
}

.system {
    -webkit-mask: url('/img/display-solid.svg') no-repeat center;
    mask: url('/img/display-solid.svg') no-repeat center;
}
</style>