const http = require('http')
const Router = require('./router')

class ServerHttp {
    constructor() {
        this.server = http.createServer((req, res) => {
            this.handlerRequest(req, res)
        })
        this.port = process.env.PORT || 3000
        this.router = new Router()
    }

    route(path, router) {
        this.router = {...this.router, ...router}
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

module.exports = ServerHttp