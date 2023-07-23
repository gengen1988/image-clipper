const util = require('./lib/util')
const fs = require('fs')

const SRC_DIR = '../next'

const allFiles = util.getAllFiles(SRC_DIR)

const clearList = ['.merge', '.tag', '.caption2', '.mirror', '.txt']
clearList.forEach(ext => {
    const files = allFiles.filter(file => file.endsWith(ext))
    files.forEach(fs.unlinkSync)
})