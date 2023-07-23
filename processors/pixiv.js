const util = require('../lib/util')
const AugmentDOM = require('../lib/augment-dom')

const augmenter = new AugmentDOM()
augmenter.getElements = selectThumbnails
augmenter.augment = augmentThumbnail

function selectThumbnails() {
    return [...document.querySelectorAll('div[type=illust] > div > a')]
}

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

function getAuthorId() {
    const authorEl = selectAuthor()
    return authorEl.closest('a').getAttribute('data-gtm-value')
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
            util.updatePixivIndexAsync(source),
            util.downloadImageAsync(source, downloadOptions),
            util.writeMetaFileAsync(fileName, meta),
        ])
        .then(() => {
            augmenter.refresh()
            alert('success')
        })
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

function init() {
    augmenter.init()
}

function augmentThumbnail(el) {
    const imageId = el.getAttribute('data-gtm-value')
    util.readPixivIndexAsync(imageId)
        .then(index => {
            if (index.length == 0) {
                return
            }

            createBadge(el)
        })
}

function createBadge(el) {
    // find previous added child
    const previousBadge = el.querySelector('.image-extractor-badge')

    // remove previous created image-extractor-badge
    if (previousBadge) {
        el.removeChild(previousBadge)
    }

    const badge = document.createElement('div')
    badge.class = 'image-extractor-badge'

    badge.style.position = 'absolute'
    badge.style.bottom = '0'
    badge.style.left = '0'
    badge.style.right = '0'
    badge.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    badge.style.height = '32px'

    badge.style.display = 'flex'
    badge.style.justifyContent = 'center'
    badge.style.alignItems = 'center'

    badge.textContent = 'in library'
    badge.style.color = 'white'
    badge.style.textShadow = '1px 1px 1px black'

    el.appendChild(badge)
}

module.exports = {
    host: 'www.pixiv.net',
    saveImage,
    validate,
    init,
}
