import type { Config } from 'tailwindcss'
export default <Partial<Config>>{
    theme: {
        extend: {
            colors: {
                'dodger-blue': {
                    '50': '#f0f8fe',
                    '100': '#deeefb',
                    '200': '#c4e3f9',
                    '300': '#9bd1f5',
                    '400': '#6cb8ee',
                    '500': '#3d94e6',
                    '600': '#3480dc',
                    '700': '#2b6aca',
                    '800': '#2957a4',
                    '900': '#264a82',
                    '950': '#1c2f4f',
                },
                "fond-100": "#FAEBD7FF",

            }
        },
        fontFamily: {
            'body': ['Open Sans']
        },
    }
}