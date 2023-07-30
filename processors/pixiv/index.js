const commonUtil = require('../../lib/util')
const pixivUtil = require('./util')
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

    const meta = createMeta()

    // write image and meta
    return Promise
        .all([
            pixivUtil.updatePixivIndexAsync(href),
            commonUtil.downloadImageAsync(href, downloadOptions),
            commonUtil.writeMetaFileAsync(href, meta),
        ])
        .then(() => {
            augmenter.refresh()
            alert('success')
        })
        .catch(alert)
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

function createMeta() {
    return {
        name: 'pixiv',
        artistId: getArtistId(),
        tags: getTags(),
    }
}