const fs = require('fs')
const path = require('path')
const https = require('https')
const util = require('../lib/util')

const OUTPUT_DIR = 'output'

function selectAuthor() {
    return [...document.querySelectorAll('#tag-sidebar > li.tag-type-artist > a')].slice(-1)[0]
}

function selectTags() {
    return [...document.querySelectorAll('#tag-sidebar > li')]
}

function selectImage() {
    return document.querySelector('.original-file-unchanged')
        || document.querySelector('.original-file-changed')
}

function getAuthorDirectoryName(node) {
    var title = node.textContent
    var id = 'yandere'
    return `[${id}] ${title}`
}

function ensureDirectory() {
    var authorNode = selectAuthor()
    var directoryName = getAuthorDirectoryName(authorNode)
    var directory = path.join(OUTPUT_DIR, directoryName)
    fs.mkdirSync(directory, { recursive: true })
    return directory
}

// Create a promise for downloading the image
function downloadImage(href) {
    var imageFileName = getImageFileName(href)
    var directory = ensureDirectory()
    var file = fs.createWriteStream(path.join(directory, imageFileName))
    var options = {
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
    return selectImage().href
}

function saveImage() {
    console.log('receive yandere save request')
    // name
    var href = getHref()

    // Combine the two promises into a single promise
    return Promise
        .all([
            downloadImage(href),
        ])
        .then(() => alert('success'))
        .catch(alert)
}

module.exports = {
    host: 'yande.re',
    saveImage
}