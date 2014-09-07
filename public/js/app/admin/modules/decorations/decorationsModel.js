define(
    [
        'canjs',
        'lib/model/baseModel'
    ],

    function (can, baseModel) {

        return can.Model.extend({
            id: "_id",
            resource: "/admin/decoration",
            parseModel: baseModel.parseModel,
            parseModels: baseModel.parseModels
        }, {
            uploaded: function (name, value) {
                if (typeof this.attr(name) === 'string') {
                    this.attr(name, value);
                } else {
                    this.attr(name).push(value);
                }
            },
            removeUploaded: function (name, index) {
                if (typeof this.attr(name) === 'string') {
                    this.attr(name, undefined);
                } else {
                    this.attr(name).splice(index, 1);
                }
            }
        });

    }
);
