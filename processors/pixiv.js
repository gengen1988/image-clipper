const fs = require('fs')
const path = require('path')
const https = require('https')
const util = require('../lib/util')

function selectTags() {
    return [...document.querySelectorAll('figcaption footer li > span')]
}

function selectImage() {
    return document.querySelector('body > [role=presentation] img')
}

function selectAuthor() {
    return document.querySelector('aside div[role=img]')
}

function getTags() {
    return selectTags().map(getTagObject)
}

function getAuthorId() {
    const authorNode = selectAuthor()
    return authorNode.closest('a').getAttribute('data-gtm-value')
}

function getTagObject(node) {
    // standard tag (with localization)
    var segments = [...node.getElementsByTagName('span')]

    // special tag: e.g. original or r-18
    if (segments.length == 0) {
        segments = [...node.getElementsByTagName('a')]
    }

    const tags = segments.map(tag => tag.textContent)
    if (tags.length == 1) {
        return { origin: tags[0] }
    }
    else {
        return { origin: tags[0], en: tags[1] }
    }
}

function saveImage() {

    console.log('received require pixiv')

    // collect information
    const source = selectImage().src
    const fileName = util.getFileName(source)

    const downloadOptions = {
        headers: {
            Referer: 'https://www.pixiv.net/'
        }
    }

    const meta = {
        name: 'pixiv',
        authorId: getAuthorId(),
        tags: getTags(),
    }

    // write image and meta
    return Promise
        .all([
            util.downloadImage(source, downloadOptions),
            util.writeMetaFile(fileName, meta),
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