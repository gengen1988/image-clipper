const path = require('path')
const fs = require('fs')

function sanitizeFileName(fileName) {
    const illegal = /[\/\?<>\\:\*\|"]/g
    return fileName.replace(illegal, '_')
}

function getFileName(href, ext) {
    const url = new URL(href)
    const pathname = url.pathname
    const pathObject = path.parse(pathname)
    const toBeDecode = ext ? `${pathObject.name}.${ext}` : pathObject.base
    const decoded = decodeURIComponent(toBeDecode)
    return sanitizeFileName(decoded)
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
    sanitizeFileName,
}
