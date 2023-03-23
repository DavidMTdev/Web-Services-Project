const Route = require('./route')

class Router {
    constructor() {
        this.routes = {
            GET: [],
            POST: [],
            PUT: [],
            DELETE: [], 
            OPTIONS: []
        }
    }

    get(path, handler) {
        this.routes.GET.push(new Route('GET', path, handler))
    }

    post(path, handler) {
        this.routes.POST.push(new Route('POST', path, handler))
    }

    put(path, handler) {
        this.routes.PUT.push(new Route('PUT', path, handler))
    }

    delete(path, handler) {
       this.routes.DELETE.push(new Route('DELETE', path, handler))
    }

    options(path, handler) {
        this.routes.OPTIONS.push(new Route('OPTIONS', path, handler))
    }

    getRoutes() {
        return this.routes
    }
}

module.exports = Router