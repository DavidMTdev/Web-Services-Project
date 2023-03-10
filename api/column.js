const http = require('http')

const host = 'localhost'
const port = 4004

const databases = {
    cinema: {
        films: {
            columns: {
                id: 'int',
                titre: 'string',
                duree: 'int',
            },
            data: [],
        },
    },
}

const hendlerRequest = async (req, res) => {
    console.log(`method: ${req.method} url: ${req.url} host: ${req.headers.host}`)

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Request-Method', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, DELETE')

    const url = new URL(`http://${req.headers.host}${req.url}`)
    const pathname = url.pathname.match(/^\/(?<database>\w+)\/(?<table>\w+)\/columns\/(?<column>\w+)$/)

    if (pathname) {
        const { database, table, column } = pathname.groups

        if (req.method === 'OPTIONS') {
            const response = {
                description: 'List of methods',
                methods: ['GET', 'PUT', 'DELETE']
            }

            res.writeHead(200)
            res.end(JSON.stringify(response))

        } else if (req.method === 'GET') {
            if (!databases[database][table].columns[column]) {
                const error = {
                    message: `Column ${column} not found`
                }

                res.writeHead(404)
                res.end(JSON.stringify(error))
                return
            }

            const response = {
                description: `Info of column ${column}`,
                type: databases[database][table].columns[column]
            }
            res.writeHead(200)
            res.end(JSON.stringify(response))

        } else if (req.method === 'PUT') {
            let body = ''
            req.on('data', chunk => {
                body += chunk.toString() // convert Buffer to string
            })
            req.on('end', () => {
                const obj = JSON.parse(body)

                if (!obj.type) {
                    const error = {
                        message: 'Type is required'
                    }

                    res.writeHead(400)
                    res.end(JSON.stringify(error))
                    return
                }

                if (!['int', 'string'].includes(obj.type)) {
                    const error = {
                        message: 'Type not allowed'
                    }

                    res.writeHead(400)
                    res.end(JSON.stringify(error))
                    return
                }	

                if (!databases[database][table].columns[column]) {
                    const error = {
                        message: `Column ${column} not exists`
                    }

                    res.writeHead(400)
                    res.end(JSON.stringify(error))
                    return
                }

                if (databases[database][table].data == []) {
                    const error = {
                        message: 'Table is not empty'
                    }

                    res.writeHead(400)
                    res.end(JSON.stringify(error))
                    return
                }

                databases[database][table].columns[column] = obj.type

                const response = {
                    description: `Column ${column} created`,
                    type: obj.type
                }

                res.writeHead(200)
                res.end(JSON.stringify(response))
            })
            req.on('error', (err) => {
                console.error(err)
            })

        } else if (req.method === 'DELETE') {
            if (!databases[database][table].columns[column]) {
                const error = {
                    message: `Column ${column} not exists`
                }

                res.writeHead(404)
                res.end(JSON.stringify(error))
                return
            }
            
            delete databases[database][table].columns[column]

            await databases[database][table].data.forEach((row, index) => {
                delete databases[database][table].data[index][column]
            })

            const response = {
                description: `Column ${column} deleted`,
                column: column
            }

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