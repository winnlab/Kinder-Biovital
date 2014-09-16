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

            share: function (img, message, cb) {
                // Do shearing
			},

            shareCanvas: function (image, message, cb) {
                var self = this;

            	FB.getLoginStatus(function(response) {

                    if (response.status === 'connected') {

                        self.postImage(response.authResponse.accessToken, image, message, cb);

                    } else if (response.status === 'not_authorized') {

                        FB.login(function (response) {
                            self.postImage(response.authResponse.accessToken, image, message, cb);
                        }, {scope: self.options.permissions});

                    } else {

                        FB.login(function (response) {
                            self.postImage(response.authResponse.accessToken, image, message, cb);
                        }, {scope: self.options.permissions});

                    }

                });

            },

            postImage: function (accessToken, imageData, message, cb) {

                if (!imageData) {
                    return this.share(null, message, cb);
                }

                var fd = new FormData();
                fd.append('access_token', accessToken);
                fd.append('source', imageData);
                fd.append('message', message);

                can.ajax({
                    url: 'https://graph.facebook.com/me/photos?access_token=' + accessToken,
                    type: 'POST',
                    data: fd,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        cb('success', data);
                    },
                    error: function (shr, status, data) {
                        cb('error', data);
                    },
                    complete: function () {
                        console.log('Ajax Complete', arguments);
                    }
                });
            }

        };

    }

);
