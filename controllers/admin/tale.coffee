Crud = require '../../lib/crud'

class Tale extends Crud
    _save: (req, cb) ->
        if req.user
            req.body.userId = req.user.id
        if req.user and req.user.role is 'admin'
            req.body.type = 0
        super req, cb

    findTales: (req, res) ->
        query = req.query
        options = @_parseOptions req.query
        tales = @DataEngine 'find', null, query, null, options
        tales.populate("coverImgId coverColorId").exec (err, docs) =>
            @result err, docs, res

    findOne: (id, cb, options = {}, fields = null) ->
        tale = @DataEngine 'findById', null, id
        tale.populate("coverImgId coverColorId trackId userId frames.decorationId frames.heroes.heroId frames.heroes.replica.replicaId").exec cb


crud = new Tale
    modelName: 'Tale'

module.exports.rest = crud.request.bind crud
module.exports.findTales = crud.findTales.bind crud
