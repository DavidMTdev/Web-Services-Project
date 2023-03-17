const Router = require('../lib/router')
const { databases, dropDatabase } = require('../db')

const router = new Router()

router.options('/:database', (req, res) => {
    const response = {
        description: 'List of methods',
        'Methods': ['GET','POST','DELETE']
    } 

    res.status = 200
    res.message = response
})

router.get('/:database', (req, res) => {
    const db = databases()[req.params.database]

    if (!db) {
        const error = {
            message: 'Database not found'
        }

        res.status = 404
        res.message = error
        return
    }

    const response = {
        description: 'List of tables',
        tables: Object.keys(db.getTables())
    }

    res.status = 200
    res.message = response
})

router.post('/:database', (req, res) => {
    const db = databases()[req.params.database]

    if (!db) {
        const error = {
            message: 'Database not found'
        }

        res.status = 404
        res.message = error
        return
    }

    if (!req.body.table) {
        const error = {
            message: 'Table name is required'
        }

        res.status = 400
        res.message = error
        return
    }

    if (db.tableExists(req.body.table)) {
        const error = {
            message: 'Table already exists'
        }

        res.status = 400
        res.message = error
        return
    }

    const response = {
        description: 'Database created',
        table: req.body.table
    }
    // const table = new Table(req.body.table)
    db.createTable(req.body.table)

    res.status = 201
    res.message = response
})

router.delete('/:database', (req, res) => {
    const db = databases()[req.params.database]

    if (!db) {
        const error = {
            message: 'Database not found'
        }

        res.status = 404
        res.message = error
        return
    }

    dropDatabase(req.params.database)

    const response = {
        'Description': 'Database deleted',
        'database': req.params.database
    }

    res.status = 200
    res.message = response
})

module.exports = router