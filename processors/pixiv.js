const fs = require('fs')
const path = require('path')
const https = require('https')
const util = require('../lib/util')

const OUTPUT_DIRECTORY = 'output'

function selectTags() {
    return [...document.querySelectorAll('figcaption footer li > span')]
}

function selectImage() {
    return document.querySelector('body > [role=presentation] img')
}

function selectAuthor() {
    return document.querySelector('aside div[role=img]')
}

function extractTagCollection() {
    return selectTags().map(getTagText)
}

function getAuthorDirectoryName(node) {
    var pixivId = node.closest('a').getAttribute('data-gtm-value')
    var title = node.getAttribute('title')
    var id = `pixiv_${pixivId}`
    return `[${id}] ${title}`
}

function getTagText(node) {
    // standard tag (with localization)
    var segments = [...node.getElementsByTagName('span')]

    // original or r-18
    if (segments.length == 0) {
        segments = [...node.getElementsByTagName('a')]
    }

    return segments.map(tag => tag.textContent)
}

// Create a promise for write tag file
function writeTagFile(href) {
    var tagFileName = util.getFileName(href, 'json')
    var directory = ensureDirectory()
    var filePath = path.join(directory, tagFileName)
    var collection = extractTagCollection()
    var text = JSON.stringify(collection, null, 2)

    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, text, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    })
}

function ensureDirectory() {
    var authorNode = selectAuthor()
    var directoryName = getAuthorDirectoryName(authorNode)
    var directory = path.join(OUTPUT_DIRECTORY, directoryName)
    fs.mkdirSync(directory, { recursive: true })
    return directory
}

// Create a promise for downloading the image
function downloadImage(href) {
    var imageFileName = util.getFileName(href)
    var directory = ensureDirectory()
    var file = fs.createWriteStream(path.join(directory, imageFileName))
    var options = {
        headers: {
            Referer: 'https://www.pixiv.net/'
        }
    }

    return new Promise((resolve, reject) => {
        https.get(href, options, response => {
            response.pipe(file)
            response.on('end', () => {
                resolve();
            });
            response.on('error', err => {
                reject(err);
            });
        })
    })
}

function getHref() {
    return selectImage().src
}

function saveImage() {

    console.log('received require pixiv')
    // name
    var href = getHref()

    // Combine the two promises into a single promise
    return Promise
        .all([
            downloadImage(href),
            writeTagFile(href),
        ])
        .then(() => alert('success'))
        .catch(alert)
}

function validate(target) {
    if (document.documentElement.lang != 'en') {
        alert('please switch to english to acquire tag')
        return false
    }

    if (!selectImage()) {
        alert('please choose an image')
        return false
    }

    return true
}

module.exports = {
    host: 'www.pixiv.net',
    saveImage,
    validate,
}