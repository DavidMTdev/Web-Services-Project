const http = require('http')

const host = 'localhost'
const port = 4001

var databases = {
    films: {
        movies: {
            columns: {
                id: 'int',
                name: 'string'
            },
            data: [
                {
                    id: 1,
                },
                {
                    id: 2
                }
            ]
        }
    }
}

const hendlerRequest = (req, res) => {
    console.log(`method: ${req.method} url: ${req.url} host: ${req.headers.host}`)
    
    var path = req.url.split('?')[0]


    var split = path.split('/')
    var pathDatabase = split?.[1]
    var Table = split?.[2]
    var data = split?.[3]


    if(!databases[pathDatabase][Table][data]){
        res.writeHead(404, {'Content-type': 'application/json'});
        res.end('{message : "page not found"}');
        return
    }

    if (req.method === 'POST') {
        let body = ''
        req.on('data', chunk => {
            body += chunk.toString() // convert Buffer to string
        })
        req.on('end', () => {
            const obj = JSON.parse(body)
            console.log(databases[pathDatabase][Table]["columns"])

            if (databases[pathDatabase][Table]['columns'][obj.name] != null) {
                if (obj.name && obj.type) {
                    const response = {
                        description: 'Column added',
                        column: Object(databases[pathDatabase][Table][data])
                    }
                    databases[pathDatabase][Table][data][obj.name] = obj.type
                    console.log(databases);
                    res.writeHead(201)
                    res.end(JSON.stringify(response))
                } else {
                    const error = {
                        message: 'Name and Type are required'
                    }

                    res.writeHead(400)
                    res.end(JSON.stringify(error))
                }
            }else {
                const error = {
                    message: 'Le champ existe pas en base. Ajouter la colone avant les datas'
                }

                res.writeHead(400)
                res.end(JSON.stringify(error))
            }
        })
    } 
    
    else if (req.method === 'GET'){
        const response = {
            description: 'List of columns',
            data: Object(databases[pathDatabase][Table][data])
        }

        res.writeHead(200)
        res.end(JSON.stringify(response))
    }
    
    else if (req.method === 'OPTIONS'){
        var response = {
            'Description': 'List of methods',
            'Methods': ['GET','POST','DELETE']
        } 
        res.end(JSON.stringify(response))
    }
    else if (req.method === 'DELETE'){
        var response = {
            'Description': 'Data deleted',
            'data': databases[pathDatabase][Table][data]
        }
        databases[pathDatabase][Table][data] = []
        res.end(JSON.stringify(response))
    }
    
}

const server = http.createServer(hendlerRequest)

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`)
})