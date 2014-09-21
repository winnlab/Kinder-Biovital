define(

    ['canjs', 'ok', 'core/appState'],

    function (can, OK, appState) {

        return {
            init: function (options) {
                this.options = options;
            },

            logIn: function (cb) {
                window.location.href = window.location.origin + '/auth/odnoklassniki'
            },

            logedIn: function (response, cb) {

            },

            saveUser: function (user) {

            },

            getUser: function () {

            },

            share: function (options, cb) {

            },

            makeLike: function (id, options) {
                setTimeout(function () {
                    OK.CONNECT.insertShareWidget(id, options.url, "{width: 165,height: 35,st: 'straight',sz: 30,ck: 1}");
                }, 0);

            }

        };

    }

);
