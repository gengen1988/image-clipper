const fs = require('fs')
const path = require('path')
const https = require('https')

const root = 'output'

function getTagCollection() {
    return getTagList().map(getTagTexts)
}

function getTagTexts(tagRoot) {

    // standard tag (with localization)
    var segments = [...tagRoot.getElementsByTagName('span')]

    // original or r-18
    if (segments.length == 0) {
        segments = [...tagRoot.getElementsByTagName('a')]
    }

    return segments.map(tag => tag.textContent)
}

function getTagList() {
    return [...document.querySelectorAll('figcaption footer li > span')]
}

function getPresentationImg() {
    return document.querySelector('body > [role=presentation] img')
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
    var collection = getTagCollection()
    var text = JSON.stringify(collection, null, 2)
    var filePath = path.join(root, tagFileName)

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
    var imgFileName = getImageFileName(img)
    var file = fs.createWriteStream(path.join(root, imgFileName))
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
        var img = getPresentationImg()

        // Combine the two promises into a single promise
        return Promise.all([
            downloadImage(img),
            writeTagFile(img)
        ]).then(() => console.log('success')).catch(console.error)
    }
}
