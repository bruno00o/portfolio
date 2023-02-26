
const darkBlobsColors = [
    "#9E4770",
    "#44BBA4",
    "#5F758E",
    "#E01A4F",
    "#F15A29",
]

const lightBlobsColors = [
    "#FFBA08",
    "#E2C2FF",
    "#B0D0D3",
    "#9CDE9F",
    "#95B8D1",
]

const getFourRandomBlobs = (blobs) => {
    const randomBlobs = [];
    for (let i = 0; i < 4; i++) {
        const random = Math.floor(Math.random() * blobs.length);
        const blob = blobs[random];
        randomBlobs.push(blob);
        blobs.splice(random, 1);
    }
    return randomBlobs;
};

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const windowWidth = window.innerWidth;

const randomBlobSize = () => {
    if (windowWidth > 1200) return random(400, 800);
    if (windowWidth > 1400) return random(600, 1400);
    if (windowWidth > 1600) return random(800, 1600);
    if (windowWidth > 1800) return random(1000, 1800);
    if (windowWidth > 2000) return random(1200, 2000);
    if (windowWidth > 2200) return random(1400, 2200);
    if (windowWidth > 2400) return random(1600, 2400);
    return random(300, 600);
};

const setWidth = (blobs) => {
    for (let i = 0; i < blobs.length; i++) {
        const blob = blobs[i];
        blob.style.width = `${randomBlobSize()}px`;
    }
};

const setColors = (blobs) => {
    const colors = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? darkBlobsColors
        : lightBlobsColors

    const usedColors = [];

    const randomColor = () => {
        const random = Math.floor(Math.random() * colors.length);
        const color = colors[random];
        if (usedColors.includes(color)) return randomColor();
        usedColors.push(color);
        return color;
    };

    for (let i = 0; i < blobs.length; i++) {
        const blob = blobs[i];
        blob.style.fill = randomColor();
    }
};


const placeBlobs = () => {
    const blobs = Array.from(document.querySelectorAll('.blob'));

    const selectedBlobs = getFourRandomBlobs(blobs);

    for (let i = 0; i < 4; i++) {
        const blob = selectedBlobs[i];
        blob.style.display = 'block';
        blob.classList.add('active');
    }

    setWidth(selectedBlobs);

    const [blob1, blob2, blob3, blob4] = selectedBlobs;

    blob1.style.top = '-5%';
    blob1.style.left = '-5%';
    blob2.style.top = '-5%';
    blob2.style.right = '-5%';
    blob3.style.bottom = '-5%';
    blob3.style.left = '-5%';
    blob4.style.bottom = '-5%';
    blob4.style.right = '-5%';

    setColors(selectedBlobs);

    for (let i = 0; i < selectedBlobs.length; i++) {
        const blob = selectedBlobs[i];
        blob.classList.add('animate-scaling-up');
    }
};

placeBlobs();

/* window.addEventListener('resize', () => {
    const activeBlobs = Array.from(document.querySelectorAll('.blob.active'));
    setWidth(activeBlobs);
}); */

const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)');

const setColorScheme = e => {
    const activeBlobs = Array.from(document.querySelectorAll('.blob.active'));
    setColors(activeBlobs);
}

colorSchemeQueryList.addEventListener('change', setColorScheme);