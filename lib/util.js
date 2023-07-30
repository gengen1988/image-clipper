const path = require('path')
const fs = require('fs')
const fsPromise = require('fs/promises')
const https = require('https')

const OUTPUT_DIR = 'output'

module.exports = {
    OUTPUT_DIR,
    getFileName,
    getAllFiles,
    readTags,
    downloadImageAsync,
    writeMetaAsync,
    readMetaAsync,
    isIndexExistsAsync,
}

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

function downloadImageAsync(href, downloadOptions, saveOptions = {}) {

    // override name
    var fileName = getFileName(href)
    if (saveOptions.overrideName) {
        fileName = saveOptions.overrideName + path.extname(fileName)
    }

    // sub folder
    var savePath = path.join(OUTPUT_DIR, fileName)
    if (saveOptions.subFolder) {
        savePath = path.join(OUTPUT_DIR, saveOptions.subFolder, fileName)
    }

    const fileStream = fs.createWriteStream(savePath)
    return new Promise((resolve, reject) => {
        https.get(href, downloadOptions, response => {
            console.log('https response:', href)
            response.pipe(fileStream)
            response.on('end', () => resolve())
            response.on('error', err => reject(err))
        })
    })
}

async function readMetaAsync(id, processorName) {
    const filePath = path.join(OUTPUT_DIR, processorName, `${id}.json`)
    const content = await fsPromise.readFile(filePath)
    const json = JSON.parse(content)
    return json.meta.find(entry => entry.name == processorName)
}

async function writeMetaAsync(id, meta, processorName) {
    const filePath = path.join(OUTPUT_DIR, processorName, `${id}.json`)

    var json
    try {
        const content = await fsPromise.readFile(filePath)
        json = JSON.parse(content)
    }
    catch {
        json = { meta: [] }
    }

    const remains = json.meta.filter(entry => entry.name != processorName)
    json.referer = window.location.href
    json.meta = [
        {
            name: processorName,
            date: Date.now(),
            ...meta,
        },
        ...remains,
    ]

    const toBeWrite = JSON.stringify(json, null, 2)
    await fsPromise.writeFile(filePath, toBeWrite)
}

async function isIndexExistsAsync(id, subFolder) {
    const filePath = path.join(OUTPUT_DIR, subFolder, `${id}.json`)

    try {
        const stat = await fsPromise.stat(filePath)
        return stat.isFile()
    } catch {
        return false
    }
}