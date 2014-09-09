define(
    [
        'canjs',
        'lib/model/baseModel'
    ],

    function (can, baseModel) {

        return can.Model.extend({
            id: "_id",
            resource: "/admin/tale",
            parseModel: baseModel.parseModel,
            parseModels: baseModel.parseModels
        }, {});

    }
);
