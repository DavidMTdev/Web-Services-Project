const utils = require('../utils')

class Route {
    constructor(method, path, handler) {
        this.method = method
        this.path = path
        this.handler = handler
    }

    match(url) {
        const pathname = utils.urlRegExp(this.path, url)
        if (pathname) {
            return pathname
        }
        return null
    }

    getHandler() {
        return this.handler
    }

    getPath() {
        return this.path
    }

    getMethod() {
        return this.method
    }

    handler(req, res) {
        this.handler(req, res)
    }
}

module.exports = Route