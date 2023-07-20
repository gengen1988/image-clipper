function selectTags() {
    return [...document.querySelectorAll('#tag-sidebar > li')]
}

function selectImage() {
    return document.querySelector('.original-file-unchanged')
        || document.querySelector('.original-file-changed')
}