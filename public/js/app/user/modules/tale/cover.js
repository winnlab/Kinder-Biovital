define(
    ['src/base64binary'],

    function (Base64Binary) {

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

                    if (color) {
                        context.fillStyle = '#' + color;
                        context.fillRect(0, 0, width, height);
                    }

                    if (image) {
                        image.onload = function() {
                            self.drawImage(image, context, width, height);
                            self.getImageData(canvas, cb);
                        };

                        image.src = '/uploads/' + img;
                    } else {
                        self.getImageData(canvas, cb);
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
                var data = canvas.toDataURL("image/png"),
                    encodedPng = data.substring(data.indexOf(',') + 1, data.length),
                    decodedPng = Base64Binary.decode(encodedPng);

                // cb(encodedPng);
                cb(decodedPng);
            }
        }
    }
);
