class Router {

    processorByHost = {}

    saveImage(url) {
        var host = url.host
        var processor = this.processorByHost[host]
        if (!processor) {
            alert(`no process registered: ${host}`)
            return
        }
        processor.saveImage()
    }

    register(processor) {
        this.processorByHost[processor.host] = processor
    }
}

module.exports = Router