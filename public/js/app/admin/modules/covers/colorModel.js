define(
    [
        'canjs',
        'lib/model/baseModel'
    ],

    function (can, baseModel) {

        return can.Model.extend({
            id: '_id',
            resource: baseModel.chooseResource('/coverColor'),
            parseModel: baseModel.parseModel,
            parseModels: baseModel.parseModels
        }, {});

    }
);
