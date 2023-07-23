const util = require('../lib/util')
const Jimp = require('jimp')
const fs = require('fs')
const path = require('path')

const SRC_DIR = 'output'
const DEST_DIR = '../next'

const allFiles = util.getAllFiles(SRC_DIR)
const jsonFiles = allFiles.filter(file => file.endsWith('.json'))

jsonFiles.forEach(fullPath => {
    const content = fs.readFileSync(fullPath)
    const json = JSON.parse(content)
    const jsonPathObject = path.parse(fullPath)

    const captionFileOrigin = path.join(DEST_DIR, `${jsonPathObject.name}.origin.tag`)

    const tags = getTags(json)
    fs.writeFileSync(captionFileOrigin, tags.join(', '))

    const imageFile = getImageFile(fullPath)
    const imagePathObject = path.parse(imageFile)
    const destFileOrigin = path.join(DEST_DIR, `${imagePathObject.name}.origin${imagePathObject.ext}`)
    fs.copyFileSync(imageFile, destFileOrigin)
})

function getImageFile(fullPath) {
    const jpgFile = fullPath.replace('.json', '.jpg')
    const pngFile = fullPath.replace('.json', '.png')
    return fs.existsSync(jpgFile) ? jpgFile : fs.existsSync(pngFile) ? pngFile : null
}

function getTags(jsonArray) {
    const tags = []
    jsonArray.forEach(entry => {
        if (entry.length > 1) {
            tags.push(entry[1])
        }
        else if (isASCII(entry[0])) {
            tags.push(entry[0])
        }
    })

    return tags.map(tag => tag.toLowerCase())
}

function isASCII(text) {
    return /^[\x00-\x7F]*$/.test(text);
}
