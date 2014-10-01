define(
    [],

    function () {

        var width = 516,
            height = 273,
            textTop = 144;

        $('body').prepend('<canvas id="cover">');

        return {

            getCover: function (img, color, text, cb) {

                img = '/img/coverBg2.jpg';

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

                        self.textRender({
                            text: text,
                            color: '#bb6920',
                            x: width / 2 + 1,
                            y: textTop + 2
                        }, context);

                        self.textRender({
                            text: text,
                            color: '#f59b06',
                            x: width / 2,
                            y: textTop
                        }, context);

                        self.getImageData(canvas, cb);
                    };

                    // image.src = '/uploads/' + img;
                    image.src = img;
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

            textRender: function (data, context) {
                context.fillStyle = data.color;
                context.baseLine = 'middle';
                context.textAlign = 'center';
                context.font = '30px Futura';
                context.fillText(data.text, data.x, data.y, width);
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
