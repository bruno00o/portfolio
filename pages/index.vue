<script setup>

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

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

onBeforeMount(() => {
    const blobs = document.querySelectorAll('#main-bg svg')
    const colors = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? darkBlobsColors
        : lightBlobsColors

    let usedColors = []

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
        blob.style.transition = 'scale 0.5s ease-in-out'
        blob.style.transform = 'scale(1)'
        blob.style.transformOrigin = 'center'
        blob.style.transform = `translate(0, 0)`
    })
})

/* const { x, y } = useMouse()

watchEffect(() => {
    const blobs = document.querySelectorAll('#main-bg svg')
    blobs.forEach((blob) => {
        blob.style.transform = `translate(${x.value / 40}px, ${y.value / 40}px)`
    })
}) */

</script>

<template>
    <section id="main"
    class="grid justify-center items-center h-screen w-screen relative bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
        <div id="main-bg" class="h-screen w-screen absolute top-0 left-0 z-0 blur-xl overflow-hidden">
            <svg viewBox="0 0 440 440" xmlns="http://www.w3.org/2000/svg" style="top: -5%; left: -5%; transform: scale(0);">
                <path
                    d="M220,346.01827087294726C269.815088258292,348.8875808352422,324.1751194859037,365.8964161411004,361.6829462530463,332.9883792952603C405.39458125416854,294.6373411468981,429.2421458934569,231.8441287965166,414.1367785892759,175.68954714787242C399.4839995793432,121.21747382959852,342.1311454051558,96.39924018005317,291.40459224765254,71.72683638422642C240.30584543660277,46.87340487137676,182.74103360736163,11.811787550250624,132.75315114186407,38.83005156256792C83.82053049757967,65.2779504967618,84.3187511701291,132.25411515969844,77.32590428827636,187.4355686892834C71.5118985067382,233.31463558080452,66.47417966899552,283.38638396776935,97.4050853413221,317.7661820526049C126.9145359899585,350.56602844708743,175.95229113239682,343.4811574342484,220,346.01827087294726" />
            </svg>
            <svg viewBox="0 0 440 440" xmlns="http://www.w3.org/2000/svg" style="top: -5%; left: 80%; transform: scale(0);">
                <path
                    d="M220,358.4470763786093C249.15588683892003,352.83255814768546,277.1662394481185,348.4992987833333,303.7458444101828,335.2662661607675C335.5565685713992,319.4288467870175,370.7726563014045,305.60381841720186,388.26664233218236,274.6731463127038C407.5853069332158,240.5163064009727,412.05407278887355,198.7649671018821,402.4718657971788,160.71129679412903C392.48862222698756,121.06499612964504,369.87525070826354,82.9769938248768,334.734449600177,62.0815779151053C300.9129000877643,41.970615117158005,259.34854066831934,52.41086967599389,220,52.209913574761764C180.39268782190484,52.007635907015846,132.25407597324724,32.73546499102995,104.41093268607082,60.90529754498234C75.89311782010394,89.7577177366671,103.74797929252009,139.72046075355527,94.46996414964813,179.2128188833978C86.44144303966848,213.38664012057376,51.76365987238794,238.80333365406932,54.3930700873915,273.80895336126895C57.28592198115503,312.32180034288797,74.61831638248009,355.19051267133875,109.00855382861182,372.7666198372481C143.05884697901143,390.16898882000044,182.45031362157613,365.6779796916139,220,358.4470763786093" />
            </svg>
            <svg viewBox="0 0 440 440" xmlns="http://www.w3.org/2000/svg" style="top: 70%; left: -5%; transform: scale(0);">
                <path
                    d="M220,426.01304025078815C296.9150276536844,427.41305699092,330.51037080770186,336.59010045170527,349.0355506076594,261.9261919066865C363.00393553780685,205.62799527873597,343.0198149530553,149.2683299241702,297.6230357217302,113.16105702052255C244.02928908467652,70.53415554162302,170.35729486785834,35.18076150349815,115.51849085787411,76.19353979323424C61.92192599615223,116.27727377410392,85.50136956577033,193.34959165881153,104.65475264011769,257.4779427340824C126.19345171213028,329.592683531209,144.74991502301572,424.6433290008817,220,426.01304025078815" />
            </svg>
            <svg viewBox="0 0 440 440" xmlns="http://www.w3.org/2000/svg" style="top: 80%; left: 80%; transform: scale(0);">
                <path
                    d="M220,351.15103665200115C265.63396629230294,347.96403468359307,314.1148347456618,353.0858795556028,346.96742757765065,321.25314474803025C384.81229738144344,284.5831104998288,409.7116610845826,230.7424844093588,397.0605137891363,179.5870931554625C384.59422900611673,129.17920044304427,332.70411068703095,105.43393820442905,287.34321186300843,80.16037965255904C236.29781365096488,51.71961031241571,181.3206723650212,5.009731597469866,128.47101820960432,29.93811090576353C75.46914795921177,54.9382882345555,76.6675341916792,127.21138645860765,65.59153887237302,184.75727635699397C55.25384374213385,238.46729054695038,31.455026021394033,300.59692583300534,68.65991745120137,340.68968850393316C104.84825687844489,379.68699365260636,166.92789992905813,354.8575057831354,220,351.15103665200115" />
            </svg>
        </div>
        <div class="flex flex-col p-10 gap-2">
            <h1 class="text-6xl font-bold sm:text-7xl">
                Bruno Seilliebert
            </h1>
            <p class="text-xl sm:text-2xl sm:font-semibold">
                {{ $t('main-text') }}
            </p>
        </div>
    </section>
    <section class="flex flex-col items-center justify-center w-full h-full p-10 gap-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 py-20">
        <h2 class="text-3xl font-bold sm:text-4xl">
            {{ $t('about-me') }}
        </h2>
        <table class="max-w-5xl">
            <tr class="flex flex-col md:table-row gap-5 justify-center items-center w-full">
                <td class="flex gap-5 justify-center items-center md:pr-10 md:pb-10">
                    <div class="timeline-icon rounded-full overflow-hidden w-20 h-20 bg-white p-3">
                        <img src="~/assets/img/universite-gustave-eiffel.jpg" alt="Université Gustave Eiffel" />
                    </div>
                    <div class="timeline-icon rounded-full overflow-hidden w-20 h-20 bg-white p-3">
                        <img src="~/assets/img/logo-carre-kynova.jpg" alt="Kynova" />
                    </div>
                </td>
                <td class="pb-10">
                    <h3 class="text-xl font-bold">
                        {{ $t('l3-title') }}
                    </h3>
                    <p class="text-lg">
                        {{ $t('l3-text') }}
                    </p>
                </td>
            </tr>
            <tr class="flex flex-col md:table-row gap-5 justify-center items-center w-full">
                <td class="flex gap-2 justify-center items-center md:pr-10">
                    <div class="timeline-icon rounded-full overflow-hidden w-20 h-20 bg-white p-3">
                        <img src="~/assets/img/universite-gustave-eiffel.jpg" alt="Université Gustave Eiffel" />
                    </div>
                </td>
                <td>
                    <h3 class="text-xl font-bold">
                        {{ $t('l1-l2-title') }}
                    </h3>
                    <p class="text-lg">
                        {{ $t('l1-l2-text') }}
                    </p>
                </td>
            </tr>
        </table>
    </section>
    <section>
        Projects
    </section>
</template>