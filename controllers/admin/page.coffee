async = require 'async'
_ = require 'underscore'
Crud = require '../../lib/crud'

class Page extends Crud

    update: (id, data, cb) ->
        async.waterfall [
            (next) =>
                @DataEngine 'findById', next, id
            (doc, next) =>
                _.extend doc, data
                if doc.frames
                    doc.frames.splice 0
                else
                    doc.frames = []
                _.each data.frames, (frame) ->
                    doc.frames.push frame
                doc.save cb
        ], cb

    findOne: (id, cb, options = {}) ->
        @DataEngine 'findOne', cb, options

crud = new Page
    modelName: 'Page'

module.exports.rest = crud.request.bind crud
module.exports.crud = crud
