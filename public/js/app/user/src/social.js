define(

    [
        'core/config',
        'canjs',
        'src/social/fb',
        'src/social/vk'
    ],

    function (config, can, fb, vk) {

        var network = {
                fb: fb,
                vk: vk
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

            changeNw: function (nw) {
                this.nw = nw;
            }

        });

    }
);
