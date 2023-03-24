const Router = require('../lib/router')
const { databases } = require('../db')

const router = new Router()

router.options('/:database/:table/columns', (req, res) => {
    const response = {
        description: 'List of methods',
        methods: ['GET', 'POST']
    }

    res.status = 200
    res.message = response
})

router.get('/:database/:table/columns', (req, res) => {
    const db = databases()[req.params.database]

    if (!db) {
        const error = {
            message: 'Database not found'
        }

        res.status = 404
        res.message = error
        return
    }

    const table = db.getTable(req.params.table)

    if (!table) {
        const error = {
            message: 'Table not found'
        }

        res.status = 404
        res.message = error
        return
    }

    const response = {
        description: 'List of columns',
        columns: Object.keys(table.getColumns())
    }

    res.status = 200
    res.message = response
})

router.post('/:database/:table/columns', async (req, res) => {
    const db = databases()[req.params.database]
    const body = req.body

    if (!db) {
        const error = {
            message: 'Database not found'
        }

        res.status = 404
        res.message = error
        return
    }

    const table = db.getTable(req.params.table)

    if (!table) {
        const error = {
            message: 'Table not found'
        }

        res.status = 404
        res.message = error
        return
    }

    const typeArgument = {
        string: "string",
        int: "number",
        float: "number",
        bool: "boolean"
    }

    const newColumns = []
    for (const key in body) {  
        const value = body[key]

        if (table.columnExists(key)) {
            const error = {
                message: `Column ${key} already exists`
            }
            res.status = 400
            res.message = error
            return
        }

        if (!value.type) {
            const error = {
                message: 'type is required'
            }
            res.status = 400
            res.message = error
            return
        }
        
        if (!typeArgument[value.type]) {
            const error = {
                message: 'type is invalid'
            }
            res.status = 400
            res.message = error
            return
        }

        newColumns.push([key, typeArgument[value.type], value?.default, value?.nullable, value?.primaryKey, value?.unique, value?.autoIncrement])
    }

    newColumns.forEach(column => {
        table.createColumn(...column)
    })

    res.status = 200
    res.message = {
        message: 'Columns created'
    }
})

module.exports = router