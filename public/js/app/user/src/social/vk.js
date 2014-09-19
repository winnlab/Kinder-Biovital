define(

    ['vk'],

    function (VK) {

        return {

            // {
            //    "session":{
            //       "mid":"5587005",
            //       "sid":"fbcd8839c0302267b891d5ba2a8fda77b2850f7fdc5825a730054f4751812e839015e1e81ab7bff81d917",
            //       "sig":"a002f53d3bdf9f2bd22905230f522556",
            //       "secret":"oauth",
            //       "expire":1410971518,
            //       "user":{
            //          "id":"5587005",
            //          "domain":"",
            //          "href":"https://vk.com/id5587005",
            //          "first_name":"Андрей",
            //          "last_name":"Сигида",
            //          "nickname":""
            //       }
            //    },
            //    "status":"connected"
            // }

            init: function (options) {
                this.options = options;

                VK.init({
					apiId: options.appId
				});
            },

            logIn: function (cb) {
                var self = this;
                VK.Auth.login(function (response) {
                    self.response = response;
                    if (typeof cb === 'function') {
                        cb();
                    }
                }, this.options.permissions);
            },

            logedIn: function (response) {
                var self = this;

				if (response.session) {

					VK.api("getProfiles", {
						uids: response.session.mid,
						fields: 'photo_200'
					}, function (profileData){

						if (profileData.response && profileData.response[0]){
							self.saveUser(profileData.response[0].first_name, profileData.response[0].photo_200, null, profileData.response[0]);
						}
					});

				}

            },

            getUser: function () {
                var response = this.response;
                if (response && response.session && response.session.user) {
                    return response.session.user;
                }
                return false;
            },

            share: function () {
                var self = this;

                VK.Api.call('wall.post', {
                    message: 'Kinder-Biovital'

                }, function () {
                    console.log(arguments);
                })
            },

            shareCanvas: function (image, message, cb) {
                var self = this;

                if (self.response && self.response.session) {
                    self.postImage(image, message, cb);
                } else {
                    self.logIn(function () {
                        self.shareCanvas(image, message, cb);
                    });
                }

            },

            postImage: function (imageData, message, cb) {

                // return VK.Auth.logout(function (res){
                //     console.log('logout', res)
                // });

                if (!imageData) {
                    return this.share(null, message, cb);
                }

                VK.api('wall.getPhotoUploadServer', {}, function (res) {
                    var fd = new FormData();
                    fd.append('photo', imageData);
                    fd.append('uploadUrl', res.response.upload_url);

                    can.ajax({
                        url: '/vk/upload',
                        type: 'POST',
                        // data: {
                        //     photo: imageData,
                        //     uploadUrl: res.response.upload_url
                        // },
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
                });

                //
                // can.ajax({
                //     url: 'https://graph.facebook.com/me/photos?access_token=' + accessToken,
                //     type: 'POST',
                //     data: fd,
                //     processData: false,
                //     contentType: false,
                //     success: function (data) {
                //         cb('success', data);
                //     },
                //     error: function (shr, status, data) {
                //         cb('error', data);
                //     },
                //     complete: function () {
                //         console.log('Ajax Complete', arguments);
                //     }
                // });
            }

        };

    }

);
