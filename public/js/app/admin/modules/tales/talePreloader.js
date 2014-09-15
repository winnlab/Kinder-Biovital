define(
    ['underscore', 'lib/preloader'],

    function (_, Preloader) {

        return {
            preload: function (data, cb) {
                var images = [],
                    self = this;

                this.pushImages(images, data.decorations, ['bg', 'fg', 'plan', 'preview']);
                this.pushImages(images, data.heroes, ['img', 'imgNight']);

                new Preloader({
                    images: images,
                    callback: function () {
                        cb();
                        self.lazyLoad(data);
                    }
                });
            },

            pushImages: function (images, data, attr) {
                _.each(data, function (item){
                    _.each(attr, function (image) {
                        images.push(item[image]);
                    });
                });
            },

            lazyLoad: function (data) {
                var images = [],
                    self = this;

                this.pushImages(images, data.coverImages, ['img']);

                new Preloader({
                    images: images
                });
            }
        };

    }

);
