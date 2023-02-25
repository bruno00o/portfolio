module.exports = {
    theme: {
        extend: {
            keyframes: {
                'scaling-up': {
                    '0%': {
                        transform: 'scale(0)',
                    },
                    '50%': {
                        transform: 'scale(1.1)',
                    },
                    '100%': {
                        transform: 'scale(1)',
                    },
                },
                'pop-in-late': {
                    '0%': {
                        transform: 'scale(0)',
                        opacity: 0,
                    },
                    '80%': {
                        transform: 'scale(0)',
                        opacity: 0,
                    },
                    '100%': {
                        transform: 'scale(1)',
                        opacity: 1,
                    },
                },
            },
            animation: {
                'scaling-up': 'scaling-up 0.5s ease-in-out',
                'pop-in-late': 'pop-in-late 0.5s ease-in-out',

            },
            fontFamily: {
                sans: ['Space Grotesk', 'sans-serif'],
                serif: ['Zilla Slab', 'serif'],
            },
        },
    },
}