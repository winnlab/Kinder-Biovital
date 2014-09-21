async = require 'async'
_ = require 'underscore'
Crud = require '../../lib/crud'

class Tale extends Crud
    _save: (req, cb) ->
        if req.user
            req.body.userId = req.user.id
        if req.user and req.user.role is 'admin'
            req.body.type = 0
        super req, cb

    update: (id, data, cb) ->
        async.waterfall [
            (next) =>
                @DataEngine 'findById', next, id
            (doc, next) =>
                if doc.frames.length
                    doc.frames.splice(0)
                delete data.__v
                _.extend doc, data
                doc.save cb
        ], cb

    findTales: (req, res) ->
        query = req.query
        if query.type
            query.type = parseInt query.type
        if query.active
            query.active = parseInt query.active

        tales = @DataEngine 'find', null, query
        tales.populate("coverImgId coverColorId").exec (err, docs) =>
            @result err, docs, res

    findOne: (id, cb, options = {}, fields = null) ->
        tale = @DataEngine 'findById', null, id
        tale.populate("coverImgId coverColorId trackId userId frames.decorationId frames.heroes.heroId").exec cb

crud = new Tale
    modelName: 'Tale'
    files: [
        name: 'cover'
        replace: true
        type: 'string'
    ]

module.exports.rest = crud.request.bind crud
module.exports.restFile = crud.fileRequest.bind crud
module.exports.findTales = crud.findTales.bind crud
