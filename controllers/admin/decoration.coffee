Crud = require '../../lib/crud'

crud = new Crud
    modelName: 'Decoration'
    files: [
        name: 'fg'
        replace: true
        type: 'string'
    ,
        name: 'plan'
        replace: true
        type: 'string'
    ,
        name: 'bg'
        replace: true
        type: 'string'
    ,
        name: 'preview'
        replace: true
        type: 'string'
    ]

module.exports.rest = crud.request.bind crud
module.exports.restFile = crud.fileRequest.bind crud
