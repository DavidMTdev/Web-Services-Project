const http = require('http')

const host = 'localhost'
const port = 4000

const hendlerRequest = (req, res) => {
    console.log(`method: ${req.method} url: ${req.url} host: ${req.headers.host}`)
    if (req.method === 'POST') {

        let body = ''
        req.on('data', chunk => {
            body += chunk.toString() // convert Buffer to string
        })
        req.on('end', () => {
            console.log(body)
            res.end(`body: ${body}`)
        })
        req.on('error', (err) => {
            console.error(err)
        })

    } else {
        res.end(`Not a POST request`)
    }
}

const server = http.createServer(hendlerRequest)

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`)
})