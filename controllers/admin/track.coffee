Crud = require '../../lib/crud'

crud = new Crud
    modelName: 'Track'
    files: [
        name: 'mp3'
        replace: true
        type: 'string'
        parent: 'sound'
    ,
        name: 'wav'
        replace: true
        type: 'string'
        parent: 'sound'    
    ]

module.exports.rest = crud.request.bind crud
module.exports.restFile = crud.fileRequest.bind crud
