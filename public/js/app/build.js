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
        include: [
            'components/listSlider/listSlider'
        ]
    }],

    removeCombined: true,
    findNestedDependencies: true
})
