({
    appDir: "../app",
    baseUrl: '../../js/lib',
    dir: "../dist",
    optimizeCss: "standard",

    mainConfigFile: "./user/req.config.js",
    normalizeDirDefines: "all",

    optimize: "uglify2",

    preserveLicenseComments: false,

    modules: [{
        name: "core/core",
        include: ['lib/preloader', 'lib/viewport', 'underscore', 'modules/tales/talesModel'],
        insertRequire: [
            'can/route/pushstate',
            'can/map/define',
            'can/map/delegate',
            'can/map/sort',
            'can/list/promise',
            'can/construct/super'
        ]
    }, {
        name: "app/modules/rating/rating",
        // include: [
        //     'modules/tales/talesModel'
        // ],
        exclude: [
            'canjs',
            'underscore',
            'modules/tales/talesModel',
            'core/appState'
        ],
        insertRequire: [
            'custom-scrollbar'
        ]
    }, {
        name: "app/modules/simplePage/simplePage",
        exclude: [
            'canjs',
            'core/appState'
        ]
    }, {
        name: "app/modules/tales/tales",
        exclude: [
            'canjs',
            'core/appState'
        ]
    }, {
        name: "app/modules/tale/tale",
        exclude: [
            'canjs',
            'core/appState'
        ]
    }, {
        name: "app/modules/tale/view",
        exclude: [
            'canjs',
            'core/appState'
        ]
    }],

    removeCombined: true,
    findNestedDependencies: true
})
