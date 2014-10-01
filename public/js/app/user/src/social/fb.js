define(

    ['canjs', 'fb', 'core/appState'],

    function (can, FB, appState) {

        return {
            init: function (options) {
                this.options = options;
                FB.init({
                    appId: options.appId,
                    cookie: true,
                    xfbml: true,
                    version: 'v2.1'
                });

                $('#fb-app_id').attr('content', options.appId);
            },

            logIn: function (cb) {
                var self = this;
                FB.login(function (response) {
                    self.logedIn(response, cb);
                }, {
                    scope: this.options.permissions
                });
            },

            logedIn: function (response, cb) {
                var self = this;
                if (response.status === 'connected') {
					FB.api('/me', function(userResponse) {
						FB.api('/me/picture', {
                            'redirect': false,
                            'height': '200',
                            'type': 'normal',
                            'width': '200'
                        }, function(imageResponse) {
                            var user = {
                                id: userResponse.id,
                                link: userResponse.link,
                                firstName: userResponse.first_name,
                                lastName: userResponse.last_name,
                                photo: imageResponse.data.url
                            };
                            self.saveUser(user);
                            cb(user);
						});
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

            getUser: function (cb) {
                var self = this;
                if (!self.user) {
                    FB.getLoginStatus(function(response) {
                        self.logedIn(response, cb);
                    });
                } else {
                    cb(self.user);
                }
            },

            share: function (options, cb) {
                var shareObj = {
                    method: 'feed',
                    name: appState.attr('locale.appName'),
                    link: options.link,
                    picture: options.img,
                    caption:  options.title,
                    description: options.desc
                };

                FB.ui(shareObj, function (response) {
                    if (response && response.post_id) {
                        cb(response.post_id);
                    }
                });
			},

            makeLike: function () {
                FB.XFBML.parse();
            }

        };

    }

);
