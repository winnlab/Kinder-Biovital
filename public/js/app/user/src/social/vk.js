define(

    ['vk'],

    function (VK) {

        function getPhotoId (taleId, cb) {
            VK.api('photos.getWallUploadServer', {}, function (res) {
                can.ajax({
                    url: '/vk/upload',
                    type: 'POST',
                    data: {
                        taleId: taleId,
                        uploadUrl: res.response.upload_url
                    },
                    success: function (data) {
                        data = JSON.parse(data);
                        VK.api('photos.saveWallPhoto', {
                            server: data.server,
                            photo: data.photo,
                            hash: data.hash
                        }, function (photoRes) {
                            cb(photoRes.response[0].id);
                        });
                    },
                    error: function (shr, status, data) {
                        console.log('error', data);
                    }
                });
            });
        }

        function shareIt (options, cb) {
            var attachments = '';

            if (options.link) {
                attachments += options.link;
            }

            if (options.img) {
                attachments += (attachments.length ? ',' : '') + options.img;
            }

            VK.Api.call('wall.post', {
                message: options.msg,
                attachments: attachments
            }, function (response) {
                if (response && !response.error) {
                    cb(response.response.post_id);
                }
            })
        }


        var MyVK = {

            init: function (options) {
                this.options = options;

                VK.init({
					apiId: options.appId
				});
            },

            logIn: function (cb) {
                var self = this;
                VK.Auth.login(function (response) {
                    self.logedIn(response, cb);
                }, this.options.permissions);
            },

            logedIn: function (response, cb) {
                var self = this;

				if (response.session) {
					VK.api("getProfiles", {
						uids: response.session.mid,
						fields: 'photo_200'
					}, function (profileData){
                        if (profileData.response && profileData.response[0]) {
                            var user = {
                                id: response.session.user.id,
                                link: response.session.user.href,
                                firstName: response.session.user.first_name,
                                lastName: response.session.user.last_name,
                                photo: profileData.response[0].photo_200
                            };
                            self.saveUser(user);
                            cb(user);
                        }
					});
				}
            },

            saveUser: function (user) {
                this.user = user;
            },

            getUser: function (cb) {
                var self = this;
                if (!self.user) {
                    VK.Auth.getLoginStatus(function(response) {
                        self.logedIn(response, cb);
                    });
                } else {
                    cb(self.user);
                }
            },

            share: function (options, cb) {
                var self = this;

                // if (!self.user) {
                //     return self.logIn(function () {
                //         self.share(options, cb);
                //     });
                // }

                if (options.img) {
                    getPhotoId(options.taleId, function (photoId) {
                        options.img = photoId;
                        shareIt(options, cb);
                    });
                } else {
                    shareIt(options, cb);
                }

            },

            makeLike: function (id, options) {
                VK.Widgets.Like(id, {
                        width: 500,
                        pageTitle: options.title,
                        pageDescription: options.desc,
                        pageUrl: options.url,
                        pageImage: options.image,
                        type: 'button',
                        width: 200,
                        height: 24
                    }
                );
            }

        };

        return MyVK;
    }
);
