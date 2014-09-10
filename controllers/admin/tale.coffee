Crud = require '../../lib/crud'

class Tale extends Crud
    _save: (req, cb) ->
        if req.user
            req.body.userId = req.user.id
        super req, cb

    findOne: (id, cb, options = {}, fields = null) ->
        tale = @DataEngine 'findById', null, id
        tale.populate("coverImgId coverColorId trackId userId frames.decorationId frames.heroes.heroId frames.heroes.replica.replicaId").exec cb


crud = new Tale
    modelName: 'Tale'

module.exports.rest = crud.request.bind crud
