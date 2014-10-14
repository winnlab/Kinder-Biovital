define(
    ['lib/preloader', 'modules/tales/taleConfig'],

    function (Preloader, taleConfig) {

        var width = 516,
            height = 274,
            textTop = 233;

        $('body').prepend('<canvas id="cover">');

        return {

            getCover: function (imgs, text, cb) {

                imgs.unshift('/img/coverBg.jpg')
                imgs.push('/img/coverTextBg.png');

                var self = this,
                    canvas = document.getElementById('cover'),
                    context = canvas.getContext('2d');

                context.canvas.width = width;
                context.canvas.height = height;

                new  Preloader({
                    images: imgs,
                    callback: function (images) {
                        var bg = images.shift(),
                            textBg = images.pop(),
                            ln = images.length;

                        context.drawImage(bg, 0, 0, width, height);
                        images.reverse();
                        _.each(images, function (img, i) {
                            var size = taleConfig.heroSize,
                                left;

                            if (ln * size.coverWidth < size.coverWrapWidth) {
                                left = (size.coverWrapWidth - size.coverWidth * ln) / 2 + (ln - i - 1) * size.coverWidth;
                            } else {
                                left = (ln - i - 1) * size.coverWidth + ((size.coverWrapWidth - size.coverWidth * ln) / (ln - 1)) * (ln - i - 1);
                            }

                            context.drawImage(img, left + 42, 75, size.coverWidth, size.coverHeight);

                        });

                        context.drawImage(textBg, 42, 187, 433, 82);

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
                    }
                });
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
