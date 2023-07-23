const util = require('../lib/util')
const fs = require('fs')

const SRC_DIR = '../next'

const allFiles = util.getAllFiles(SRC_DIR)
const mergeFiles = allFiles.filter(file => file.endsWith('.merge'))

const database = {}
mergeFiles.forEach(fullPath => {
    util.readTags(fullPath).forEach(tag => {
        var entry = database[tag]
        if (entry) {
            entry.count++
            entry.files.push(fullPath)
        }
        else {
            entry = {
                count: 1,
                files: [fullPath]
            }
            database[tag] = entry
        }
    })
})

const toBeRemove = {}
const minorTags = Object.keys(database).filter(tag => database[tag].count < 3)
minorTags.forEach(tag => {
    const files = database[tag].files
    files.forEach(fullPath => {
        var removeTags = toBeRemove[fullPath]
        if (removeTags) {
            removeTags.push(tag)
        }
        else {
            removeTags = [tag]
            toBeRemove[fullPath] = removeTags
        }
    })
})

mergeFiles.forEach(fullPath => {
    const removeTags = toBeRemove[fullPath]
    const newFile = fullPath.replace('.merge', '.caption')
    if (removeTags) {
        const tags = util.readTags(fullPath)
        const tagSet = new Set(tags)
        removeTags.forEach(tag => {
            tagSet.delete(tag)
        })

        const toBeWrite = Array.from(tagSet).join(', ')
        fs.writeFileSync(newFile, toBeWrite)
    }
    else {
        // copy origin file
        fs.copyFileSync(fullPath, newFile)
    }
})