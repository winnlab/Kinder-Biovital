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
                , ok: ok
            };

        for (var key in network) {
            network[key].init(config.social[key]);
        }

        return can.Construct.extend({

            logIn: function () {
                if (this.nw) {
                    var nw = network[this.nw];
                    nw.logIn.apply(nw, arguments);
                }
            },

            share: function (image, cb) {
                network[this.nw].share(image, cb);
            },

            provider: function (nw) {
                this.nw = nw;
                return this;
            },

            makeLike: function (id, options) {
                var ogProps = ['title', 'desc', 'url', 'image'];

                for (var i = 0, ln = ogProps.length; i < ln; i += 1) {
                    if (options[ogProps[i]]) {
                        $('#og-' + ogProps[i]).attr('content', options[ogProps[i]]);
                    }
                }

                for (var key in network) {
                    network[key].makeLike(key + '-' + id, options);
                }
            },

            getProvider: function (key) {
                return network[key];
            },

            getUser: function (cb) {
                network[this.nw].getUser(cb);
            }

        });

    }
);
