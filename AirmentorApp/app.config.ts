export default defineAppConfig({
    ui: {
        primary: 'dodger-blue',
        gray : 'neutral',
        tabs : {
            list: {
                background: 'bg-white ',
                marker: {
                    background: 'bg-primary ',
                }
            },
            tab: {
                active: 'text-white',
                inactive: 'text-white dark:text-gray-400 border-[1px] border-primary',
            },
        },
    },

})