define(
    [],

    function () {

        var width = 470,
            height = 246;

        $('body').prepend('<canvas id="cover">');

        return {

            getCover: function (img, color, cb) {
                var self = this,
                    canvas = document.getElementById('cover'),
                    context = canvas.getContext('2d'),
                    image = new Image();

                context.canvas.width = width;
                context.canvas.height = height;

                context.fillStyle = '#' + (color || 'ffffff');
                context.fillRect(0, 0, width, height);

                if (img) {
                    image.onload = function() {
                        self.drawImage(image, context, width, height);
                        self.getImageData(canvas, cb);
                    };

                    image.src = '/uploads/' + img;
                } else {
                    cb(null);
                }
            },

            drawImage: function (image, context) {
                var proportion = image.width / image.height,
                    imgWidth,
                    imgHeight,
                    top = 0,
                    left = 0;

                if (proportion > width / height) {
                    imgWidth = width;
                    imgHeight = ~~(imgWidth / proportion);
                    top = (height - imgHeight) / 2;
                } else {
                    imgHeight = height;
                    imgWidth = ~~(imgHeight * proportion);
                    left = (width - imgWidth) / 2;
                }

                context.drawImage(image, left, top, imgWidth, imgHeight);
            },

            getImageData: function (canvas, cb) {
                var mime = 'image/png',
                    data = canvas.toDataURL(mime),
                    encodedPng = data.split(',')[1];

                // convert base64 to raw binary data held in a string
                // doesn't handle URLEncoded DataURIs
                var byteString = window.atob(encodedPng);
                // separate out the mime component
                var ia = new Uint8Array(byteString.length);
                for (var i = 0, ln = byteString.length; i < ln; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }

                // write the ArrayBuffer to a blob, and you're done
                var blob = new Blob([ia], { type: mime });

                cb(blob);

            }
        }
    }
);
