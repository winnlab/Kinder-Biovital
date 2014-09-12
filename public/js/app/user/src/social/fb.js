define(

    ['canjs', 'fb'],

    function (can, FB) {

        return {
            init: function (options) {
                this.options = options;
                FB.init({
                    appId: options.appId,
                    cookie: true,
                    xfbml: true,
                    version: 'v2.1'
                });
            },
            logIn: function () {
                FB.login(can.proxy(this.logedIn, this), {
                    scope: this.options.permissions
                });
            },
            logedIn: function (response) {
                var self = this;
                if (response.status === 'connected') {

					FB.api('/me', function(userResponse) {
						self.saveUser(userResponse)
					});

				} else if (response.status === 'not_authorized') {
					// The person is logged into Facebook, but not your app.
				} else {
					// The person is not logged into Facebook, so we're not sure if
					// they are logged into this app or not.
				}
            },
            saveUser: function (user) {
                this.user = user;
            },
            getUser: function () {
                return this.user;
            },
            share: function (cb) {
				FB.ui({
					method: 'feed',
					name: 'Kinder-Biovital',
					link: window.location.origin,
					picture: 'http://localhost:3000/img/smallX.jpg',
					caption: 'Kinder-Biovital 2',
					description: 'Kinder-Biovital 3',
					message: 'test'
				}, cb);
			}
        };

    }

);
