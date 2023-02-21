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
            },
            animation: {
                'scaling-up': 'scaling-up 0.5s ease-in-out',
            },
        },
    },
}