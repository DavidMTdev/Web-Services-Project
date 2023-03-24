const { table } = require('console')
const http = require('http')

const host = 'localhost'
const port = 4004

const databases = {
    cinema: {
        films: {
            columns: {
                _id: 'number',
                name: 'string'
            },
            data: [
                {
                    _id: 1,
                    name:"Star wars"
                },
                {
                    _id: 2
                }
            ],
        },
    },
}

const hendlerRequest = (req, res) => {
    console.log(`method: ${req.method} url: ${req.url} host: ${req.headers.host}`)

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Request-Method', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, DELETE')

    const url = new URL(`http://${req.headers.host}${req.url}`)
    const pathname = url.pathname.match(/^\/(?<database>\w+)\/(?<table>\w+)\/(?<data>\w+)\/(?<columns>\w+)$/)

    if (pathname) {
        const { database, table, data, columns } = pathname.groups

        if (req.method === 'OPTIONS') {
            const response = {
                description: 'List of methods',
                methods: ['GET', 'PUT', 'DELETE']
            }

            res.writeHead(200)
            res.end(JSON.stringify(response))

        } else if (req.method === 'GET') {
            if (!databases[database][table]) {
                const error = {
                    message: 'table not found'
                }

                res.writeHead(404)
                res.end(JSON.stringify(error))
                return
            }
            let dataResponse = {}
            for(let x in databases[database][table][data]){
                if(databases[database][table][data][x]._id == columns){
                    dataResponse = databases[database][table][data][x]
                }
            }
            const response = {
                description: 'Data',
                data: dataResponse
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
            console.log(obj);

            
            let dataResponse = {}
            let element = null
            for(let x in databases[database][table][data]){
                if(databases[database][table][data][x]._id == columns){
                    dataResponse = databases[database][table][data][x]
                    element = x
                }
            }
            let putResponse = dataResponse
            for(let y in dataResponse){
                if(dataResponse[y] != obj[y]){
                    putResponse[y] = obj[y]
                }
            }

            const response = {
                description: 'Data updated',
                column: Object(databases[database][table][data][element])
            }
            databases[database][table][data][element] = putResponse
            res.writeHead(201)
            res.end(JSON.stringify(response))
            })
        } else if (req.method === 'DELETE') {
            if (!databases[database][table]) {
                const error = {
                    message: 'table not found'
                }

                res.writeHead(404)
                res.end(JSON.stringify(error))
                return
            }
            let dataResponse = {}
            let element = null
            for(let x in databases[database][table][data]){
                if(databases[database][table][data][x]._id == columns){
                    dataResponse = databases[database][table][data][x]
                    element = x
                }
            }
            const response = {
                description: 'Data deleted',
                data: dataResponse
            }
            delete databases[database][table][data][element]

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