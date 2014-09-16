define(

    [
        'core/config',
        'canjs',
        'src/social/fb',
        'src/social/vk',
        'src/social/ok'
    ],

    function (config, can, fb, vk, ok) {

        var network = {
                fb: fb
                , vk: vk
                // , ok: ok
            };

        for (var key in network) {
            network[key].init(config.social[key]);
        }

        return can.Construct.extend({

            init: function (options) {
                this.nw = options;
            },

            logIn: function () {
                network[this.nw].logIn();
            },

            share: function (image, cb) {
                network[this.nw].share(image, cb);
            },

            shareCanvas: function (image, message, cb) {
                network[this.nw].shareCanvas(image, message, cb);
            },

            changeNw: function (nw) {
                this.nw = nw;
            }

        });

    }
);
