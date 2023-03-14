const http = require('http')

const host = 'localhost'
const port = 3000

const databases = {}

const hendlerRequest = (req, res) => {
    console.log(`method: ${req.method} host: ${req.headers.host} url: ${req.url}`)

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Request-Method', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')

    const url = new URL(`http://${req.headers.host}${req.url}`)
    console.log(url)

    // const pathname = url.pathname.match(/^\/$/)
    // console.log(pathname)

    // const pathname2 = url.pathname.match(/^\/(?<database>\w+)$/)
    // if (pathname2) {
    //     const database = pathname2.groups.database
    //     console.log(database)

    //     const d = pathname2.input.replace(`/${database}`, '/{database}')
    //     console.log(d)
    // }

    // const r = url.pathname.replace('/cinema', '/{database}')

    // if (r = '/{database}') {
    //     console.log(r)
    // }    

    const matchURL = (path) => {
        const array = path.split(/{(\w+)}/)

        let a = '^'
        array.forEach(row => {
            if (row === '/') {
                a += '\\/'
            } else if (row === '') {
                a += ''
            } else {
                a += `(?<${row}>\\w+)`
            }
        })
        a += '$'

        const regexp = new RegExp(a)
        const pathname = url.pathname.match(regexp)

        return pathname
    }


    const route = (method, path, handler) => {
        const pathname = matchURL(path)

        if (req.method === method) {
            if (pathname) {
                handler()
            }
        } else {
            console.log('Method not found')
        }
    }

    const rootRouter = {
        use: (path, router) => {
            const pathname = matchURL(path)

            if (pathname) {
                console.log(pathname.groups)
            }
        },
        get: (path, handler) => {
            route('GET', path, handler)
        },
        post: (path, handler) => {
            route('POST', path, handler)
        },
        put: (path, handler) => {
            route('PUT', path, handler)
        },
        delete: (path, handler) => {
            route('DELETE', path, handler)
        },
        options: (path, handler) => {
            route('OPTIONS', path, handler)
        }
    }

    // rootRouter.use('/', route)
    rootRouter.get('/', (req, res) => {
        console.log('Hello')
    })

    // route('GET', '/')
    // route('GET', '/{database}')
    // route('GET', '/{database}/{table}')



    
    // const pathname3 = url.pathname.match(/^\/(?<database>\w+)\/(?<table>\w+)$/)
    // console.log(pathname3)

    res.end('Hello')

    // route.use('/{database}', apiRouter)
  

    // if (req.method === 'OPTIONS') {
    //     const response = {
    //         description: 'List of methods',
    //         methods: ['GET', 'POST', 'PUT', 'DELETE']
    //     }

    //     res.writeHead(200)
    //     res.end(JSON.stringify(response))

    // } else if (req.method === 'GET') {
    //     const response = {}

    //     res.writeHead(200)
    //     res.end(JSON.stringify(response))

    // } else if (req.method === 'POST') {
    //     let body = ''
    //     req.on('data', chunk => {
    //         body += chunk.toString() // convert Buffer to string
    //     })
    //     req.on('end', () => {
    //         console.log(body)

    //         const response = {}

    //         res.writeHead(201)
    //         res.end(JSON.stringify(response)) 
    //     })
    // } else if (req.method === 'PUT') {
    //     let body = ''
    //     req.on('data', chunk => {
    //         body += chunk.toString() // convert Buffer to string
    //     })
    //     req.on('end', () => {
    //         console.log(body)

    //         const response = {}

    //         res.writeHead(200)
    //         res.end(JSON.stringify(response)) 
    //     })
    // } else if (req.method === 'DELETE') {
    //     const response = {}

    //     res.writeHead(200)
    //     res.end(JSON.stringify(response)) 

    // } else {
    //     const error = {
    //         message: 'Method not allowed'
    //     }

    //     res.writeHead(405)
    //     res.end(JSON.stringify(error))
    // }
}

const server = http.createServer(hendlerRequest)

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`)
})