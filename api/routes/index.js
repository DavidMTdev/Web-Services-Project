const Router = require('../lib/router')
const { Database, databases, existsDatabase } = require('../db')

const router = new Router()

router.options('/', (req, res) => {
    const response = {
        description: 'List of methods',
        methods: ['GET', 'POST']
    }

    res.status = 200
    res.message = response
})

router.get('/', (req, res) => {
    const response = {
        description: 'List of database',
        databases: Object.keys(databases())
    }

    res.status = 200
    res.message = response
})

router.post('/', async (req, res) => {
    if (!req.body.database) {
        const error = {
            message: 'Database name is required'
        }
        
        res.status = 400
        res.message = error
        return
    }

    if (existsDatabase(req.body.database)) {
        const error = {
            message: 'Database already exists'
        }

        res.status = 400
        res.message = error
        return
    }

    const response = {
        description: 'Database created',
        database: req.body.database
    }

    const db = new Database(req.body.database)

    res.status = 201
    res.message = response
})

module.exports = router