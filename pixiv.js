const fs = require('fs')
const path = require('path')
const https = require('https')

const root = 'output'

function selectTags() {
    return [...document.querySelectorAll('figcaption footer li > span')]
}

function selectImage() {
    return document.querySelector('body > [role=presentation] img')
}

function selectAuthor() {
    return document.querySelector('main div[role=img]')
}

function extractTagCollection() {
    return selectTags().map(getTagText)
}

function getAuthorInfo(el) {
}

function getTagText(el) {
    // standard tag (with localization)
    var segments = [...el.getElementsByTagName('span')]

    // original or r-18
    if (segments.length == 0) {
        segments = [...el.getElementsByTagName('a')]
    }

    return segments.map(tag => tag.textContent)
}

function getImageFileName(img) {
    return img.src.split('/').slice(-1)[0]
}

function getTagFileName(img) {
    return getImageFileName(img).split('.')[0] + '.json'
}

// Create a promise for write tag file
function writeTagFile(img) {
    var tagFileName = getTagFileName(img)
    var filePath = path.join(root, tagFileName)

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

// Create a promise for downloading the image
function downloadImage(img) {
    var imageFileName = getImageFileName(img)
    var file = fs.createWriteStream(path.join(root, imageFileName))
    var options = {
        headers: {
            Referer: 'https://www.pixiv.net/'
        }
    }

    return new Promise((resolve, reject) => {
        https.get(img.src, options, response => {
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


module.exports = {
    copyPixivTags() {
        // name
        var img = selectImage()

        // Combine the two promises into a single promise
        return Promise.all([
            downloadImage(img),
            writeTagFile(img)
        ]).then(() => console.log('success')).catch(console.error)
    }
}
