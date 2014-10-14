define([
	'canjs',
	'underscore'
],
	function (can, _) {
		return can.Map.extend({

			namespace: 'preloader',
			loaded: 0,

			init: function () {
				var self = this;
				self.loadedImages = new Array(self.images.length);
				self.loadImages();
			},

			loadImages: function () {
				this.folder = this.folder || '/uploads/';

				if (this.images.length) {
					_.each(this.images, function(imgSrc, i) {
						if (imgSrc) {
							this.loadImage(imgSrc.indexOf('/') !== -1 ? imgSrc : this.folder + imgSrc, i);
						} else {
                            this.loaded += 1;
                        }
					}.bind(this));
				} else {
					this.callback && this.callback();
				}

			},

			loadImage: function (imgSrc, i) {
				var image = new Image(),
					self = this;

				$(image).on('load.' + this.namespace + ' error.' + this.namespace, function (ev) {
					self.imageIsLoaded(ev, i)
				});

				image.src = imgSrc;
			},

			imageIsLoaded: function (ev, i) {
				this.loaded += 1;

				this.loadedImages[i] = ev.target;

				if (this.loaded == this.images.length && this.callback) {
					this.callback(this.loadedImages);
					this.loadedImages = null;
				}
			}
		});
	}
);
