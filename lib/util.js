const path = require('path')
const fs = require('fs')

function getFileName(href, ext) {
    var url = new URL(href)
    var pathname = url.pathname
    var pathObject = path.parse(pathname)
    var toBeDecode = ext ? `${pathObject.name}.${ext}` : pathObject.base
    return decodeURIComponent(toBeDecode)
}

function getAllFiles(dirPath, fileList = []) {
    const files = fs.readdirSync(dirPath)

    files.forEach((file) => {
        const filePath = path.join(dirPath, file)
        const stat = fs.statSync(filePath)

        if (stat.isDirectory()) {
            getAllFiles(filePath, fileList)
        } else {
            fileList.push(filePath)
        }
    });

    return fileList
}

function readTags(fullPath) {
    const content = fs.readFileSync(fullPath).toString()
    return content.split(',').map(tag => tag.trim())
}

module.exports = {
    getFileName,
    getAllFiles,
    readTags,
}
