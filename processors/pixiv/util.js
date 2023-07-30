const commonUtil = require('../../lib/util')
const path = require('path')
const fsPromise = require('fs/promises')

module.exports = {
    readPixivIndexAsync,
    updatePixivIndexAsync,
}

async function updatePixivIndexAsync(imageSource) {
    const fileName = commonUtil.getFileName(imageSource)
    const name = path.parse(fileName).name
    const segments = name.split('_')
    const imageId = segments[0]
    const page = segments[1]

    const index = await readPixivIndexAsync(imageId)
    index.push(page)
    await writePixivIndexAsync(imageId, index)
}

async function readPixivIndexAsync(imageId) {
    try {
        const content = await fsPromise.readFile(getPixivIndexPath(imageId))
        return JSON.parse(content)
    }
    catch {
        return []
    }
}

async function writePixivIndexAsync(imageId, index) {
    const filePath = getPixivIndexPath(imageId)
    const content = JSON.stringify(index, null, 2)
    await fsPromise.writeFile(filePath, content)
}

function getPixivIndexPath(imageId) {
    return path.join(commonUtil.OUTPUT_DIR, `${imageId}.pixiv`)
}
