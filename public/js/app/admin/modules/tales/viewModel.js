define(
    ['canjs', 'core/appState', 'lib/popUp/popUp'],

    function (can, appState, popUp) {

        return can.Map.extend({
            showText: false,
            showTracks: false,
            talePreview: '',
            interface: 'big',
            locale: appState.attr('locale'),

            collapsed: false,

            setBg: function (context, el, ev) {
                this.attr('frame.decorationId', context.attr('_id'));
                this.attr('frame.time', context.attr('time'));
            },

            setText: function (scope, el, ev) {
                var text = el.val().slice(0, 200);
                el.val(text);
                this.attr('frame.text', text);
            },

            setReplica: function (scope, el, ev) {
                var text = el.val().slice(0, 240);
                el.val(text);
                scope.attr('replica.text', el.val());
            },

            setTrack: function (context, el, ev) {
                this.attr('tale.trackId', context.attr('_id'));
                this.attr('showTracks', false);
            },

            changeCollapse: function () {
                this.attr('collapsed', !this.attr('collapsed'));
            },

            share: function (scope, el, ev) {
                var self = this,
                    network = el.data('nw'),
                    tale = scope.attr('tale'),
                    cover = tale.attr('cover'),
                    social = appState.attr('social');

                social.provider(network).logIn(function (user) {
                    social.provider(network).share({
                        msg: appState.attr('locale.shareUser').format(tale.attr('name')),
                        link: window.location.origin + '/fairy-tale/' + tale.attr('_id'),
                        img: window.location.origin + (cover ? '/uploads/' + cover : '/img/favicon.png'),
                        taleId: tale.attr('_id')
                    }, function (postId) {
                        // scope.attr('clearStorage', true);
                        tale.attr({
                            user: user,
                            network: network,
                            shared: 1,
                            postId: postId
                        });
                        self.saveTale();
                        popUp.show({
                            msg: appState.attr('locale.shared').format(self.attr('tale.name')),
                            choice: false
                        });
                    });
                });
            },

            saveTale: function (cb) {
                var self = this,
                    tale = this.attr('tale');

                tale.save()
                    .done(function () {
                        if (!self.attr('clearStorage')) {
                            localStorage.setItem('tale', JSON.stringify(tale.attr()));
                        } else {
                            localStorage.removeItem('tale');
                        }

                        if (typeof cb === 'function') {
                            cb();
                        }
                    })
                    .fail(function () {
                        appState.attr('notification', {
                            status: 'error',
                            msg: 'Невозможно сохранить сказку'
                        });
                    });
            }
        })

    }

);