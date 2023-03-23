// const http = require('http')
const serverHttp = require('./utils/server')

const host = 'localhost'
const port = 3000

const databases = {}

const matchURL = (path, url) => {
    const array = path.split(/:(\w+)/)

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


// const route = (method, path, handler) => {
//     const pathname = matchURL(path)
//     console.log(pathname)
//     if (req.method === method) {
//         if (pathname) {
//             handler()
//         }
//     } else {
//         console.log('Method not found')
//     }
// }

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

// const serverHttp = () => {
//     // const server = http.createServer()
//     const server = http.createServer((req, res) => {
//         handlerRequest(req, res)
//     })

//     let route = {
//         GET: {},
//         POST: {},
//         PUT: {},
//         DELETE: {},
//         OPTIONS: {}
//     }

//     const handlerRequest = async (req, res) => {
//         console.log(`method: ${req.method} host: ${req.headers.host} url: ${req.url}`)
//         const url = new URL(`http://${req.headers.host}${req.url}`)
//         const response = {
//             status: 200,
//             message: 'OK',
//             data: null,
//             error: null
//         }

//         for (const path in route[req.method]) {
//             const pathname = matchURL(path, url)
//             console.log(pathname)

//             if (pathname) {
//                 console.log(pathname.groups)
//                 const handler = route[req.method][path]
       
//                 if (handler) {
//                     await handler(req, res, response)
//                 } else {
//                     response.status = 404
//                     response.message = 'Not found'
//                 }
//             }
            
//         }

//         res.setHeader('Content-Type', 'application/json')
//         res.writeHead(response.status)
//         res.end(JSON.stringify(response.message))

//         // if (response.error) {
//         //     res.end(JSON.stringify({
//         //         message: response.message,
//         //         error: response.error
//         //     }))
//         // } else {
//         //     res.end(JSON.stringify({
//         //         message: response.message,
//         //         data: response.data
//         //     }))
//         // }
//     }

//     const use = () => {
//         console.log('Use')
//     }

//     const get = (path, handler) => {

//         if (!route['GET']) {
//             route['GET'] = {}
//         }

//         if (!route['GET'][path]) {
//             route['GET'][path] = handler
//         }
//     }

//     const post = (path, handler) => {
//         if (!route['POST']) {
//             route['POST'] = {}
//         }

//         if (!route['POST'][path]) {
//             route['POST'][path] = handler
//         }
//     }

//     const put = (path, handler) => {
//         if (!route['PUT']) {
//             route['PUT'] = {}
//         }

//         if (!route['PUT'][path]) {
//             route['PUT'][path] = handler
//         }
//     }

//     const deleted = (path, handler) => {
//         if (!route['DELETE']) {
//             route['DELETE'] = {}
//         }

//         if (!route['DELETE'][path]) {
//             route['DELETE'][path] = handler
//         }
//     }

//     const options = (path, handler) => {
//         if (!route['OPTIONS']) {
//             route['OPTIONS'] = {}
//         }

//         if (!route['OPTIONS'][path]) {
//             route['OPTIONS'][path] = handler
//         }
//     }

//     const listen = (port, host, callback) => {
//         server.listen(port, host, callback)
//     }

//     return {
//         use,
//         get,
//         post,
//         put,
//         delete: deleted,
//         options,
//         listen
//     }
// }


const app = serverHttp()

// app.use()
app.options('/', (req, res, response) => {
    console.log('options')
    response.status = 200
    response.message = {
        description: 'List of methods',
        methods: ['GET', 'POST']
    }
})

app.get('/', (req, res, response) => {
    console.log('root')
    response.status = 200
    response.message = {
        description: 'List of database',
        databases: Object.keys(databases)
    }
})

app.post('/', async (req, res, response) => {
    let body = ''
    req.on('data', chunk => {
        body += chunk.toString() // convert Buffer to string
    })

    await req.on('end', () => {
        const obj = JSON.parse(body)

        if (obj.database) {
            databases[obj.database] = obj.database

            response.status = 200
            response.message = {
                description: 'Database created',
                database: obj.database
            }
        } else {

            // response.error = true
            response.status = 400
            response.message = {
                message: 'Database name is required'
            }
        }
    })

    req.on('error', (err) => {
        console.error(err)
    })
})

app.get('/:database', (req, res, response) => {
    response.status = 200
    response.message = {
        description: 'List of tables',
        table: []
    }
})

app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`)
})