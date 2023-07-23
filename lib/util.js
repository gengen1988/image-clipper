const path = require('path')
const fs = require('fs')
const fsPromise = require('fs/promises')
const https = require('https')

module.exports = {
    getFileName,
    getAllFiles,
    readTags,
    downloadImageAsync,
    writeMetaFileAsync,
    readPixivIndexAsync,
    updatePixivIndexAsync,
}

const OUTPUT_DIR = 'output'

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

function readTags(filePath) {
    const content = fs.readFileSync(filePath).toString()
    return content.split(',').map(tag => tag.trim())
}

function downloadImageAsync(href, options) {
    const fileName = getFileName(href)
    const filePath = fs.createWriteStream(path.join(OUTPUT_DIR, fileName))
    return new Promise((resolve, reject) => {
        https.get(href, options, response => {
            response.pipe(filePath)
            response.on('end', () => resolve())
            response.on('error', err => reject(err))
        })
    })
}

async function writeMetaFileAsync(fileName, meta) {
    const filePath = path.join(OUTPUT_DIR, `${fileName}.json`)
    const content = {
        processor: meta.name,
        date: Date.now(),
        referer: window.location.href,
        meta: [meta]
    }

    const toBeWrite = JSON.stringify(content, null, 2)
    await fsPromise.writeFile(filePath, toBeWrite)
}

async function updatePixivIndexAsync(imageSource) {
    const fileName = getFileName(imageSource)
    const name = path.parse(fileName).name
    const segments = name.split('_')
    const imageId = segments[0]
    const page = segments[1]

    const index = await readPixivIndexAsync(imageId)
    index.push(page)
    await writePixivIndexAsync(imageId, index)
}

async function readPixivIndexAsync(imageId) {
    try {
        const content = await fsPromise.readFile(getPixivIndexPath(imageId))
        return JSON.parse(content)
    }
    catch {
        return []
    }
}

async function writePixivIndexAsync(imageId, index) {
    const filePath = getPixivIndexPath(imageId)
    const content = JSON.stringify(index, null, 2)
    await fsPromise.writeFile(filePath, content)
}

function getPixivIndexPath(imageId) {
    return path.join(OUTPUT_DIR, `${imageId}.pixiv`)
}
