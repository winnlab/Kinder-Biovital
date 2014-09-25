define(
    [
        'canjs',
        'lib/model/baseModel'
    ],

    function (can, baseModel) {

        return can.Model.extend({
            id: '_id',
            resource: baseModel.chooseResource('/page'),
            parseModel: baseModel.parseModel,
            parseModels: baseModel.parseModels
        }, {});

    }
);
