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
        this.router.routes.GET.push(...router.routes.GET)
        this.router.routes.POST.push(...router.routes.POST)
        this.router.routes.PUT.push(...router.routes.PUT)
        this.router.routes.DELETE.push(...router.routes.DELETE)
        this.router.routes.OPTIONS.push(...router.routes.OPTIONS)
    }

    handlerRequest = async (req, res) => {
        console.log(`method: ${req.method} host: ${req.headers.host} url: ${req.url}`)
        const url = new URL(`http://${req.headers.host}${req.url}`)
        const route = this.router.routes[req.method].find(route => route.match(url))
        const response = {
            status: null,
            message: null,
        }
        const request = {
            url,
            method: req.method,
            headers: req.headers,
            body: null,
        }

        if (route) {
            await req.on('data', chunk => {
                request.body = JSON.parse(chunk.toString())
            })

            await route.handler(request, response)

            await req.on('error', (err) => {
                console.error(err)
            })

        } else {
            response.status = 404
            response.message = {
                error: `Not a ${req.method} request into ${req.url}`
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