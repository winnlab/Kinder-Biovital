Crud = require '../../lib/crud'

crud = new Crud
    modelName: 'CoverColor'

module.exports.rest = crud.request.bind crud
