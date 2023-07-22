const fs = require('fs')
const path = require('path')

module.exports = getInvalidURLs

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

function getInvalidURLs() {
    const outputDir = 'output'
    const allFiles = getAllFiles(outputDir)
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

