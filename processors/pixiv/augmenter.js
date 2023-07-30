const AugmentDOM = require('../../lib/augment-dom')
const pixivUtil = require('./util')

const BADEG_CLASS = 'image-extractor-badge'

const augmenter = new AugmentDOM()
augmenter.getElements = selectThumbnails
augmenter.augment = augmentThumbnail

module.exports = augmenter

function selectThumbnails() {
    return [...document.querySelectorAll('div[type=illust] a')]
}

function augmentThumbnail(el) {
    const imageId = el.getAttribute('data-gtm-value')
    pixivUtil.readPixivIndexAsync(imageId)
        .then(index => {
            if (index.length == 0) {
                return
            }

            createBadge(el)
        })
}

function createBadge(el) {
    // find previous added child
    const previousBadge = el.querySelector(`.${BADEG_CLASS}`)

    // remove previous created image-extractor-badge
    if (previousBadge) {
        el.removeChild(previousBadge)
    }

    const badge = document.createElement('div')
    badge.class = BADEG_CLASS

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
