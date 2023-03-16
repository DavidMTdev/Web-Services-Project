const http = require('http')
const matchURL = require('./lib/utils').matchURL

class Route {
    constructor(method, path, handler) {
        this.method = method
        this.path = path
        this.handler = handler
    }

    match(url) {
        const pathname = matchURL(this.path, url)
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

class ServerHttp {

    constructor() {
        this.server = http.createServer((req, res) => {
            this.handlerRequest(req, res)
        })
        this.port = process.env.PORT || 3000
        this.router = new Router()
    }

    handlerRequest = (req, res) => {
        console.log(`method: ${req.method} host: ${req.headers.host} url: ${req.url}`)
        const url = new URL(`http://${req.headers.host}${req.url}`)

        console.log(this.router.routes[req.method]);

        const route = this.router.routes[req.method].find(route => route.match(url))
        console.log(route)

        const response = {
            status: null,
            message: null,
        }

        if (route) {
            route.handler(req, res)
            response.status = 200
            response.message = {
                message: 'OK'
            }
        } else {
            response.status = 404
            response.message = {
                error: 'Not found'
            }
        }
        
        res.setHeader('Content-Type', 'application/json')
        res.writeHead(response.status)
        res.end(JSON.stringify(response.message))
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`)
        })
    }

}

module.exports = {
    ServerHttp,
    Router,
    Route
}