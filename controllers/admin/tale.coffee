Crud = require '../../lib/crud'

class Tale extends Crud
    _save: (req, cb) ->
        req.body.userId = req.user.id
        super req, cb

crud = new Tale
    modelName: 'Tale'

module.exports.rest = crud.request.bind crud
