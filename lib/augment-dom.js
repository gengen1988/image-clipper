class AugmentDOM {

    elementSet = new Set()
    dirtyCount = 0
    delay = 200

    // public
    init() {
        const observer = new MutationObserver(() => {
            this.dirtyCount++
            setTimeout(() => {
                if (--this.dirtyCount != 0) {
                    return
                }
                this.update()
            }, this.delay)
        })
        observer.observe(document.body, { childList: true, subtree: true })
        this.refresh()
    }

    // private
    update() {
        console.log('observer triggerred')
        const elements = this.getElements()
        elements
            .filter(el => !this.elementSet.has(el))
            .forEach(el => {
                this.augment(el)
            })

        this.elementSet = new Set(elements)
    }

    // public
    refresh() {
        this.elementSet = new Set()
        this.update()
    }

    // abstract
    getElements() {
        // to be implemented
    }

    /**
     * this method should also remove its added elements
     */
    // abstract
    augment(el) {
        // to be implemented
    }
}

module.exports = AugmentDOM