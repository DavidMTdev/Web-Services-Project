const http = require('http')

const host = 'localhost'
const port = 4002

var databases = {
    films: {}
}

const hendlerRequest = (req, res) => {
    console.log(`method: ${req.method} url: ${req.url} host: ${req.headers.host}`)
    
    var path = req.url.split('?')[0]
    var pathDatabase = path.split('/')[1]
    if(!databases[pathDatabase]){
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
            console.log(body)
            const obj = JSON.parse(body)

            if (obj.table) {
                const response = {
                    description: 'Database created',
                    table: obj.table
                }
                databases[pathDatabase][obj.table] = {
                    columns: {},
                    data: {}
                }
                console.log(databases);
                res.writeHead(201)
                res.end(JSON.stringify(response))
            } else {
                const error = {
                    message: 'Table name is required'
                }

                res.writeHead(400)
                res.end(JSON.stringify(error))
            }
        })
    } 
    
    else if (req.method === 'GET'){
        const response = {
            description: 'List of tables',
            table: Object.keys(databases[pathDatabase])
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
            'Description': 'Database deleted',
            'database': pathDatabase
        }
        delete databases[pathDatabase]
        res.end(JSON.stringify(response))
    }
    
}

const server = http.createServer(hendlerRequest)

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`)
})