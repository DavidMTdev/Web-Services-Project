const http = require('http')
const { exit } = require('process')

const host = 'localhost'
const port = 4001


var databases = {
    films: {
        movies: {
            columns: {
                _id: 'number',
                name: 'string'
            },
            data: [
                {
                    _id: 1
                },
                {
                    _id: 2
                }
            ]
        }
    }
}

const hendlerRequest = (req, res) => {
    console.log(`method: ${req.method} url: ${req.url} host: ${req.headers.host}`)
    
    let path = req.url.split('?')[0]


    let split = path.split('/')
    let pathDatabase = split?.[1]
    let Table = split?.[2]
    let data = split?.[3]


    if(!databases[pathDatabase][Table][data]){
        res.writeHead(404, {'Content-type': 'application/json'});
        res.end('{message : "page not found"}');
        return
    }

    if (req.method === 'POST') {
        let columnsExist = true
        let columnsMissed = true
        let alreadyExist = true
        let AttributWrongType = true
        let body = ''
        req.on('data', chunk => {
            body += chunk.toString() // convert Buffer to string
        })
        req.on('end', () => {
            const obj = JSON.parse(body)
            for ( let attributename in obj)
            {
                if(databases[pathDatabase][Table]['columns'][attributename] == null) {
                    columnsExist = false
                    const error = {
                        message: 'Le champ existe pas en base. Ajouter la colone avant les datas'
                    }
    
                    res.writeHead(400)
                    res.end(JSON.stringify(error))
                }

                for (let inBd in databases[pathDatabase][Table]['data']){
                    if( attributename.includes("_") ){
                        if( databases[pathDatabase][Table]['data'][inBd][attributename] == obj[attributename] ){
                            alreadyExist = false
                            const error = {
                                message: 'Il y a un champ unique existant deja'
                            }
            
                            res.writeHead(400)
                            res.end(JSON.stringify(error))
                            exit
                        }
                    }
                }

                if(typeof obj[attributename] !=  databases[pathDatabase][Table]['columns'][attributename]){
                    AttributWrongType = false
                    const error = {
                        message: "Le champ "+ attributename + " n'a pas le bon type"
                    }
    
                    res.writeHead(400)
                    res.end(JSON.stringify(error))
                    exit
                }
            }

            if(Object.keys(databases[pathDatabase][Table]['columns']).length != Object.keys(obj).length){
                columnsMissed = false
                const error = {
                    message: 'Il y a un champ manquant. Ajouter toutes les datas'
                }

                res.writeHead(400)
                res.end(JSON.stringify(error))
                exit
            }

            if (columnsExist && columnsMissed && alreadyExist && AttributWrongType) {
                const response = {
                    description: 'Data added',
                    column: Object(databases[pathDatabase][Table][data])
                }
                databases[pathDatabase][Table][data].push(obj)
                console.log(databases);
                res.writeHead(201)
                res.end(JSON.stringify(response))
            }
        })
    } 
    
    else if (req.method === 'GET'){
        const response = {
            description: 'List of datas',
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