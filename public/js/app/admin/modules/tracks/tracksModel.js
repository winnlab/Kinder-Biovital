define(
    [
        'canjs',
        'lib/model/baseModel'
    ],

    function (can, baseModel) {

        return can.Model.extend({
            id: "_id",
            resource: "/admin/track",
            parseModel: baseModel.parseModel,
            parseModels: baseModel.parseModels
        }, {
            uploaded: function (name, value) {
                if (!this.attr('sound')) {
					this.attr('sound', {});
				}
				var sound = this.attr('sound');
				sound.attr(name, value);
            },
            removeUploaded: function (name) {
                var sound = this.attr('sound');
				sound.attr(name, undefined);
            }
        });

    }
);
