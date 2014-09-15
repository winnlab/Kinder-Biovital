define(
    [
        'canjs',
        'lib/model/baseModel'
    ],

    function (can, baseModel) {

        return can.Model.extend({
            id: '_id',
            resource: baseModel.chooseResource('/cover'),
            parseModel: baseModel.parseModel,
            parseModels: baseModel.parseModels
        }, {
            uploaded: baseModel.simpleUploaded,
            removeUploaded: baseModel.simpleRemoveUploaded
        });

    }
);
