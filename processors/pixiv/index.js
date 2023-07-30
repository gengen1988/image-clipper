const util = require('../../lib/util')
const augmenter = require('./augmenter')

module.exports = {
    host: 'www.pixiv.net',
    init,
    validate,
    saveImage,
}

function init() {
    augmenter.init()
}

function validate(target) {
    if (document.documentElement.lang != 'en') {
        alert('please switch to english to acquire tag')
        return false
    }

    if (!selectImage()) {
        alert('please choose an image page')
        return false
    }

    return true
}

function saveImage() {

    console.log('received require pixiv')

    // collect information
    const href = selectImage().src

    const downloadOptions = {
        headers: {
            Referer: 'https://www.pixiv.net/'
        }
    }

    const saveOptions = {
        subFolder: 'pixiv'
    }

    const id = getPostId()

    // write image and meta
    return createMeta(id)
        .then(meta => Promise.all([
            util.downloadImageAsync(href, downloadOptions, saveOptions),
            util.writeMetaAsync(id, meta, 'pixiv'),
        ]))
        .then(() => {
            augmenter.refresh()
            alert('success')
        })
}

function selectTags() {
    return [...document.querySelectorAll('figcaption footer li > span')]
}

function selectImage() {
    return document.querySelector('body > [role=presentation] img')
}

function selectArtist() {
    return document.querySelector('aside div[role=img]')
}

function getTags() {
    const tagElements = selectTags()
    return tagElements.map(el => {
        // standard tag (with localization)
        var segments = [...el.getElementsByTagName('span')]

        // special tag: e.g. original or r-18
        if (segments.length == 0) {
            segments = [...el.getElementsByTagName('a')]
        }

        const tag = segments.map(segment => segment.textContent)
        if (tag.length == 1) {
            return { origin: tag[0] }
        }
        else {
            return { origin: tag[0], en: tag[1] }
        }
    })
}

function getArtistId() {
    const artistEl = selectArtist()
    return artistEl.closest('a').getAttribute('data-gtm-value')
}

function getCurrentPage() {
    const img = selectImage()
    const fileName = util.getFileName(img.src)
    const name = fileName.split('.')[0]
    const page = name.split('_')[1]
    return page
}

function getPostId() {
    const href = window.location.href
    return href.split('/').slice(-1)[0]
}

async function createMeta(id) {
    var pageSet
    try {
        const existMeta = await util.readMetaAsync(id, 'pixiv')
        const previousPages = existMeta.pages
        pageSet = new Set(previousPages)
    }
    catch {
        pageSet = new Set()
    }

    pageSet.add(getCurrentPage())

    return {
        artistId: getArtistId(),
        pages: [...pageSet],
        tags: getTags(),
    }
}