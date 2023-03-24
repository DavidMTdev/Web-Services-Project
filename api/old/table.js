const http = require('http')

const host = 'localhost'
const port = 4004

const databases = {
    cinema: {
        films: {
            columns: {},
            data: {},
        },
    },
}

const hendlerRequest = (req, res) => {
    console.log(`method: ${req.method} url: ${req.url} host: ${req.headers.host}`)

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Request-Method', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, DELETE')

    const url = new URL(`http://${req.headers.host}${req.url}`)
    const pathname = url.pathname.match(/^\/(?<database>\w+)\/(?<table>\w+)$/)

    if (pathname) {
        const { database, table } = pathname.groups

        if (req.method === 'OPTIONS') {
            const response = {
                description: 'List of methods',
                methods: ['GET', 'POST', 'DELETE']
            }

            res.writeHead(200)
            res.end(JSON.stringify(response))

        } else if (req.method === 'GET') {
            if (!databases[database][table]) {
                const error = {
                    message: 'Table not found'
                }

                res.writeHead(404)
                res.end(JSON.stringify(error))
                return
            }

            const response = {
                description: 'List of information',
                path: Object.keys(databases[database][table])
            }

            res.writeHead(200)
            res.end(JSON.stringify(response))

        } else if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => {
                body += chunk.toString() // convert Buffer to string
            })
            req.on('end', async () => {
                const obj = JSON.parse(body)

                if (obj.columns) {
                    await obj.columns.forEach(column => {
                        const {name, type} = column

                        if (!name) {
                            const error = {
                                message: 'Column name is required'
                            }

                            res.writeHead(400)
                            res.end(JSON.stringify(error))
                            return
                        } else if (!type) {
                            const error = {
                                message: 'Column type is required'
                            }

                            res.writeHead(400)
                            res.end(JSON.stringify(error))
                            return
                        } else {
                            databases[database][table].columns[name] = type
                        }
                    })

                    const response = {
                        description: 'Columns created',
                        columns: databases[database][table].columns
                    }

                    res.writeHead(201)
                    res.end(JSON.stringify(response))
                } else {
                    const error = {
                        message: 'Columns name is required'
                    }

                    res.writeHead(400)
                    res.end(JSON.stringify(error))
                }
            })
            req.on('error', (err) => {
                console.error(err)
            })

        } else if (req.method === 'DELETE') {
            if (!databases[database][table]) {
                const error = {
                    message: 'Table not found'
                }

                res.writeHead(404)
                res.end(JSON.stringify(error))
                return
            }
            
            const response = {
                description: 'Table deleted',
                table: table
            }

            delete databases[database][table]

            res.writeHead(200)
            res.end(JSON.stringify(response))

        } else {
            res.writeHead(404)
            res.end(`Not a ${req.method} request into ${req.url}`)
        }
    } else {
        res.writeHead(404)
        res.end(`Not Found: ${req.url}`)
    }
}

const server = http.createServer(hendlerRequest)

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`)
})