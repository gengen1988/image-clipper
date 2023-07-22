class Router {

    processorByHost = {}
    currentProcessor

    register(processor) {
        this.processorByHost[processor.host] = processor
    }

    updateURL(url) {
        var host = url.host
        var processor = this.processorByHost[host]
        if (!processor) {
            alert(`do not support: ${host}`)
            return
        }
        this.currentProcessor = processor
    }

    saveImage() {
        this.currentProcessor.saveImage()
    }

    validate(target) {
        return this.currentProcessor.validate(target)
    }
}

module.exports = Router