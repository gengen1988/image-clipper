const fs = require('fs')
const path = require('path')
const util = require('./lib/util')

module.exports = getInvalidURLs
const SRC_DIR = 'output'

function getInvalidURLs() {
    const allFiles = util.getAllFiles(SRC_DIR)
    const jsonFiles = allFiles.filter(file => file.endsWith('.json'))

    const invalidFile = jsonFiles.filter(file => {
        const content = fs.readFileSync(file, 'utf8')
        const json = JSON.parse(content)
        const isValidJson = json.every(entry => Array.isArray(entry))
        const isValidEntry = !json.every(entry => entry.length == 1)
        return !isValidJson || !isValidEntry
    })

    const invalidURLs = invalidFile.map(file => {
        const id = path.parse(file).base.split('_')[0]
        return `https://www.pixiv.net/en/artworks/${id}`
    })

    return invalidURLs
}

