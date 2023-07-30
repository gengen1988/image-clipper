const util = require('../../lib/util')
const augmenter = require('./augmenter')

module.exports = {
    host: 'yande.re',
    init,
    validate,
    saveImage,
}

function init() {
    augmenter.init()
}

function validate() {
    const pattern = "https://yande.re/post/show/"
    if (!window.location.href.match(pattern)) {
        alert(`please go to a post page to clip: ${window.location.href}`)
        return false
    }
    return true
}

function saveImage() {
    console.log('receive yandere save request')

    // name
    const id = getPostId()
    const href = selectImage().href
    const meta = createMeta()

    const downloadOptions = {
        headers: {
            Referer: 'https://yande.re/'
        }
    }

    const saveOptions = {
        subFolder: 'yande.re',
        overrideName: id
    }

    // Combine the two promises into a single promise
    return Promise
        .all([
            util.downloadImageAsync(href, downloadOptions, saveOptions),
            util.writeMetaAsync(id, meta, 'yande.re'),
        ])
        .then(() => alert('success'))
}

function selectTags() {
    return [...document.querySelectorAll('#tag-sidebar > li')]
}

function selectImage() {
    return document.querySelector('.original-file-unchanged')
        || document.querySelector('.original-file-changed')
}

function getTags() {
    return selectTags()
        .map(el => {
            const textEl = [...el.querySelectorAll('a')].slice(-1)[0]
            return {
                type: el.className,
                text: textEl.textContent
            }
        })
}

function getPostId() {
    const href = window.location.href
    const id = href.split('/').slice(-1)[0]
    return id
}

function createMeta() {
    return {
        tags: getTags()
    }
}