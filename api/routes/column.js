const Router = require('../lib/router')
const { databases } = require('../db')

const router = new Router()

router.options('/:database/:table/columns/:column', (req, res) => {
    const response = {
        description: 'List of methods',
        methods: ['GET', 'PUT', 'DELETE']
    }

    res.status = 200
    res.message = response
})

router.get('/:database/:table/columns/:column', (req, res) => {
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

    if (!table.columnExists(req.params.column)) {
        const error = {
            message: 'Column not found'
        }

        res.status = 404
        res.message = error
        return
    }

    const response = {
        description: 'List of column details',
        column: table.getColumn(req.params.column)
    }

    res.status = 200
    res.message = response
})

router.put('/:database/:table/columns/:column', async (req, res) => {
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

    if (!table.columnExists(req.params.column)) {
        const error = {
            message: 'Column not found'
        }

        res.status = 404
        res.message = error
        return
    }
    
    const column = table.getColumn(req.params.column)
    const data = table.getData()

    if (data.length > 0) {
        const error = {
            message: 'Cannot update column with data'
        }

        res.status = 400
        res.message = error
        return
    }

    const typeArgument = {
        string: "string",
        int: "number",
        float: "number",
        bool: "boolean"
    }

    const updatedColumn = {}
    for (const key in body) {  
        let value = body[key]

        if (key === 'type') {
            if (typeArgument[value]) {
                value = typeArgument[value]
            } else {
                const error = {
                    message: `Type ${value} not allowed`
                }
                res.status = 400
                res.message = error
                return
            }
        }

        if (!column.hasOwnProperty(key)){
            const error = {
                message: `Column ${key} does not exist`
            }
            res.status = 400
            res.message = error
            return  
        }

        if (column[key] !== value) {
            column[key] = value
            updatedColumn[key] = value
        }
    }

    res.status = 200
    res.message = {
        message: 'Columns updated',
        column: updatedColumn
    }
})

router.delete('/:database/:table/columns/:column', async (req, res) => {
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

    if (!table.columnExists(req.params.column)) {
        const error = {
            message: 'Column not found'
        }

        res.status = 404
        res.message = error
        return
    }

    const data = table.getData()

    await data.forEach((row) => {
        if (row.hasOwnProperty(req.params.column)) {
            delete row[req.params.column]
        }
    })

    table.dropColumn(req.params.column)

    res.status = 200
    res.message = {
        message: 'Columns deleted'
    }
})
module.exports = router