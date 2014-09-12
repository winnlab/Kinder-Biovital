define(

    ['vk'],

    function (VK) {

        return {

            init: function (options) {
                this.options = options;

                VK.init({
					apiId: options.appId
				});
            },

            logIn: function () {
                var self = this;
                VK.Auth.login(can.proxy(self.logedIn, self), self.options.permission);
            },

            logedIn: function (response) {
                var self = this;
                var self = this;

				if (response.session) {
                    console.log(response);
					VK.api("getProfiles", {
						uids: response.session.mid,
						fields: 'photo_200'
					}, function (profileData){

						if (profileData.response && profileData.response[0]){
							self.saveUser(profileData.response[0].first_name, profileData.response[0].photo_200, null, profileData.response[0]);
						}
					});

				} else {
					alert('not auth');
				}
            },

            saveUser: function (user) {

                this.user = user;
            },

            getUser: function () {
                return this.user;
            },

            share: function () {
                var self = this;

                VK.Api.call('wall.post', {
                    message: 'Kinder-Biovital'

                }, function () {
                    console.log(arguments);
                })
            }

        };

    }

);
