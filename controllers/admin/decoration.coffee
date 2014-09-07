Crud = require '../../lib/crud'

crud = new Crud
    modelName: 'Decoration'
    files: [
        name: 'header'
        replace: true
        type: 'string'
    ,
        name: 'footer'
        replace: true
        type: 'string'
    ,
        name: 'perspectives'
        type: 'array'
    ]

module.exports.rest = crud.request.bind crud
module.exports.restFile = crud.fileRequest.bind crud
