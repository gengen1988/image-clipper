const util = require('../lib/util')
const fs = require('fs')
const path = require('path')

const SRC_DIR = 'output'
const DEST_DIR = 'test'

const allFiles = util.getAllFiles(SRC_DIR)
const jsonFiles = allFiles.filter(file => file.endsWith('.json'))

jsonFiles.forEach(filePath => {
    console.log(filePath)
    var fileName = path.basename(filePath).split('.')[0]
    var imageId = fileName.split('_')[0]
    var imagePage = fileName.split('_')[1]
    var index = readIndex(imageId)
    index.push(imagePage)
    writeIndex(imageId, index)
})

function readIndex(imageId) {
    try {
        var filePath = getIndexPath(imageId)
        var content = fs.readFileSync(filePath).toString()
        var json = JSON.parse(content)
        return json
    } catch {
        return []
    }

}

function writeIndex(imageId, index) {
    var filePath = getIndexPath(imageId)
    var content = JSON.stringify(index, null, 2)
    fs.writeFileSync(filePath, content)
}

function getIndexPath(imageId) {
    return path.join(DEST_DIR, `${imageId}.pixiv`)
}