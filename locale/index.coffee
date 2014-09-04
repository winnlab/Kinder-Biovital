langs = [
    'ua'
    'ru'    
]

for lang in langs
    module.exports[lang] = require "./#{lang}"
