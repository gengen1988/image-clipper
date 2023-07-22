const path = require('path')

function getFileName(href, ext) {
    var url = new URL(href)
    var pathname = url.pathname
    var pathObject = path.parse(pathname)
    var toBeDecode = ext ? `${pathObject.name}.${ext}` : pathObject.base
    return decodeURIComponent(toBeDecode)
}

module.exports = {
    getFileName
}
