module.exports = function (grunt) {
    // Configure grunt
    grunt.initConfig({
        sprite:{
            all: {
                src: 'public/img/sprites/*',
                destImg: 'public/img/spritesheet.png',
                destCSS: 'public/scss/base/_sprites.scss'
                , algorithm: 'binary-tree'
            }
        }
    });

    // Load in `grunt-spritesmith`
    grunt.loadNpmTasks('grunt-spritesmith');
};
