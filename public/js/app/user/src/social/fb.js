define(

    ['canjs', 'fb'],

    function (can, FB) {


        if (!XMLHttpRequest.prototype.sendAsBinary) {

              XMLHttpRequest.prototype.sendAsBinary = function (sData) {
                var nBytes = sData.length, ui8Data = new Uint8Array(nBytes);
                for (var nIdx = 0; nIdx < nBytes; nIdx++) {
                    ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff;
                }
                /* send as ArrayBufferView...: */
                this.send(ui8Data);
                /* ...or as ArrayBuffer (legacy)...: this.send(ui8Data.buffer); */
            };
        }

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
                    // scope: this.options.permissions
                    scope: 'publish_actions'
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
            share: function (image, cb) {
				// FB.ui({
				// 	method: 'feed',
				// 	name: 'Kinder-Biovital',
				// 	link: window.location.origin,
				// 	// picture: ,
				// 	caption: 'Kinder-Biovital 2',
				// 	description: 'Kinder-Biovital 3',
				// 	message: 'test'
				// }, cb);
                this.postCanvasToFacebook(image);
			},

            postCanvasToFacebook: function(decodedPng) {
                var self = this;

            	FB.getLoginStatus(function(response) {
            	  if (response.status === "connected") {
            		self.postImageToFacebook(response.authResponse.accessToken, "kinder", "image/png", decodedPng, "http://localhost:3000");
            	  } else if (response.status === "not_authorized") {
            		 FB.login(function(response) {
            			self.postImageToFacebook(response.authResponse.accessToken, "kinder", "image/png", decodedPng, "http://localhost:3000");
            		 }, {scope: "publish_stream"});
            	  } else {
            		 FB.login(function(response)  {
            			self.postImageToFacebook(response.authResponse.accessToken, "kinder", "image/png", decodedPng, "http://localhost:3000");
            		 }, {scope: "publish_stream"});
            	  }
            	 });

            },

            postImageToFacebook: function ( authToken, filename, mimeType, imageData, message ){
                // this is the multipart/form-data boundary we'll use
                var boundary = '----ThisIsTheBoundary1234567890';
                // let's encode our image file, which is contained in the var
                var formData = '--' + boundary + '\r\n'
                formData += 'Content-Disposition: form-data; name="source"; filename="' + filename + '"\r\n';
                formData += 'Content-Type: ' + mimeType + '\r\n\r\n';
                for ( var i = 0; i < imageData.length; ++i )
                {
                    formData += String.fromCharCode( imageData[ i ] & 0xff );
                }
                formData += '\r\n';
                formData += '--' + boundary + '\r\n';
                formData += 'Content-Disposition: form-data; name="message"\r\n\r\n';
                formData += message + '\r\n'
                formData += '--' + boundary + '--\r\n';

                var xhr = new XMLHttpRequest();
                xhr.open( 'POST', 'https://graph.facebook.com/me/photos?access_token=' + authToken, true );
                xhr.onload = xhr.onerror = function() {
                    console.log( xhr.responseText );
                };
                xhr.setRequestHeader( "Content-Type", "multipart/form-data; boundary=" + boundary );

                xhr.sendAsBinary( formData );
            }

        };

    }

);
