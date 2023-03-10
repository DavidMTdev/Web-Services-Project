const http = require('http')

const host = 'localhost'
const port = 4000

const databases = {}

const hendlerRequest = (req, res) => {
    console.log(`method: ${req.method} url: ${req.url} host: ${req.headers.host}`)

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Request-Method', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')

    if (req.method === 'OPTIONS') {
        const response = {
            description: 'List of methods',
            methods: ['GET', 'POST']
        }

        res.writeHead(200)
        res.end(JSON.stringify(response))

    } else if (req.method === 'GET') {
        const response = {
            description: 'List of database',
            databases: Object.keys(databases)
        }

        res.writeHead(200)
        res.end(JSON.stringify(response))

    } else if (req.method === 'POST') {
        let body = ''
        req.on('data', chunk => {
            body += chunk.toString() // convert Buffer to string
        })
        req.on('end', () => {
            console.log(body)
            const obj = JSON.parse(body)

            if (obj.database) {
                const response = {
                    description: 'Database created',
                    database: obj.database
                }
                databases[obj.database] = obj.database

                res.writeHead(201)
                res.end(JSON.stringify(response))
            } else {
                const error = {
                    message: 'Database name is required'
                }

                res.writeHead(400)
                res.end(JSON.stringify(error))
            }
        })
        req.on('error', (err) => {
            console.error(err)
        })

    } else {
        res.writeHead(404)
        res.end(`Not a ${req.method} request into ${req.url}`)
    }
}

const server = http.createServer(hendlerRequest)

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`)
})