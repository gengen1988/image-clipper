const util = require('./lib/util')
const tagAlias = require('./tag-alias')
const fs = require('fs')

const SRC_DIR = '../next'

const allFiles = util.getAllFiles(SRC_DIR)
const captionFiles = allFiles.filter(file => file.endsWith('.txt'))

captionFiles.forEach(fullPath => {
    const tagSet = new Set()
    readTags(fullPath).forEach(tag => {
        tagSet.add(tag)
    })
    readTags(fullPath.replace('.txt', '.tag')).forEach(tag => {
        tagSet.add(tag)
    })
    const newFilePath = fullPath.replace('.txt', '.merge')
    const tagArray = Array.from(tagSet)
    const tagString = tagArray.join(', ')
    fs.writeFileSync(newFilePath, tagString)
})

function readTags(fullPath) {
    util.readTags(fullPath)
        .map(tag => {
            const alias = tagAlias[trimmed]
            if (alias) {
                return alias
            }

            return tag
        })
}

