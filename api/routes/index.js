const Router = require('../lib/router')
const { Database, databases } = require('../db')

const router = new Router()

router.options('/', (req, res) => {
    console.log(`${req.method} root`)

    const response = {
        description: 'List of methods',
        methods: ['GET', 'POST']
    }

    res.status = 200
    res.message = response
})

router.get('/', (req, res) => {
    console.log(`${req.method} root`)

    const response = {
        description: 'List of database',
        databases: databases()
    }

    res.status = 200
    res.message = response
})

router.post('/', async (req, res) => {
    console.log(`${req.method} root`)
    console.log(req.body)

    if (req.body.database) {
        const response = {
            description: 'Database created',
            database: req.body.database
        }

        const db = new Database(req.body.database)

        res.status = 201
        res.message = response
    } else {
        const error = {
            message: 'Database name is required'
        }
        
        res.status = 400
        res.message = error
    }
})

module.exports = router