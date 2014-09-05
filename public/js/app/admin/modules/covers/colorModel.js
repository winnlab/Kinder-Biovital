define(
    [
        'canjs',
        'lib/model/baseModel'
    ],

    function (can, baseModel) {

        return can.Model.extend({
            id: "_id",
            resource: "/admin/coverColor",
            parseModel: baseModel.parseModel,
            parseModels: baseModel.parseModels
        }, {});

    }
);
