const http = require('http')
const Router = require('./router')

class ServerHttp {
    constructor() {
        this.server = http.createServer((req, res) => {
            try {
                this.handlerRequest(req, res)
            } catch (error) {
                console.error(error)
            }
        })
        this.port = process.env.PORT || 3000
        this.router = new Router()
        this.dbManager = null
    }

    use(dbManager) {
        this.dbManager = dbManager
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
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        res.setHeader('Access-Control-Allow-Credentials', true)
        
        const url = new URL(`http://${req.headers.host}${req.url}`)
        const route = this.router.routes[req.method].find(route => route.match(url))
        const params = route?.match(url)
        const request = {
            url,
            method: req.method,
            headers: req.headers,
            body: null,
            params: params?.groups || null,
        }
        const response = {
            status: null,
            message: null,
        }

        if (route) {
            console.log(route)
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

    listen(port, callback) {
        this.server.listen(port || this.port, () => callback(port))
    }

}

module.exports = ServerHttp