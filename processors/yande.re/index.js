const commonUtil = require('../../lib/util')

module.exports = {
    host: 'yande.re',
    init,
    validate,
    saveImage,
}

function init() {

}

function validate() {

}

function saveImage() {
    console.log('receive yandere save request')
    // name
    const href = getHref()
    const meta = createMeta()

    // Combine the two promises into a single promise
    return Promise
        .all([
            commonUtil.downloadImageAsync(href),
            commonUtil.writeMetaFileAsync(href, meta)
        ])
        .then(() => alert('success'))
        .catch(alert)
}

function selectTags() {
    return [...document.querySelectorAll('#tag-sidebar > li')]
}

function selectImage() {
    return document.querySelector('.original-file-unchanged')
        || document.querySelector('.original-file-changed')
}

function getHref() {
    return selectImage().href
}

function getTags() {
    return selectTags()
        .map(el => el.textContent)
}

function createMeta() {
    return {
        name: 'yande.re',
        tags: getTags()
    }
}