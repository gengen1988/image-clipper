class Router {

    processorByHost = {}
    currentProcessor

    register(processor) {
        this.processorByHost[processor.host] = processor
    }

    updateURL(url) {
        const host = url.host
        const processor = this.processorByHost[host]
        if (!processor) {
            alert(`do not support: ${host}`)
            return
        }
        this.currentProcessor = processor
        processor.init()
    }

    validate(target) {
        return this.currentProcessor.validate(target)
    }

    saveImage() {
        return this.currentProcessor.saveImage()
            .catch(err => {
                console.error(err)
                alert(err)
            })
    }
}

module.exports = Router