const Router = require('../lib/router')
const { databases } = require('../db')

const router = new Router()

router.options('/:database/:table/data/:document', (req, res) => {
    const response = {
        description: 'List of methods',
        methods: ['GET','PUT','DELETE']
    }

    res.status = 200
    res.message = response
})

router.get('/:database/:table/data/:document', (req, res) => {
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

    const data = table.getData()
    if (data.length === 0) {
        const error = {
            message: 'Table is empty'
        }

        res.status = 400
        res.message = error
        return
    }

    if (!data.some(row => row.getId() === req.params.document)) {
        const error = {
            message: 'Document not found'
        }

        res.status = 404
        res.message = error
        return
    }

    const response = {
        description: 'Values of Document',
        values: data.find(row => row.getId() === req.params.document).getValues()
    }

    res.status = 200
    res.message = response
})

router.put('/:database/:table/data/:document', (req, res) => {
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

    const data = table.getData()
    if (data.length === 0) {
        const error = {
            message: 'Table is empty'
        }

        res.status = 400
        res.message = error
        return
    }

    if (!table.findOne(row => row.getId() === req.params.document)) {
        const error = {
            message: 'Document not found'
        }

        res.status = 404
        res.message = error
        return
    }

    if (!body) {
        const error = {
            message: 'Body is empty'
        }

        res.status = 400
        res.message = error
        return
    }

    for (const key of Object.keys(body)) {
        console.log(key, body[key])

        if (!table.columnExists(key)) {
            const error = {
                message: `Column ${key} not exists`
            }
            res.status = 400
            res.message = error
            return
        }
        const column = table.getColumn(key)
        const row = table.findOne(row => row.getId() === req.params.document)

        if (!column.isNullable() && body[key] === null) {
            const error = {
                message: `Column ${key} cannot be null`
            }
            res.status = 400
            res.message = error
            return
        }

        if (!column.isNullable() && column.getType() !== typeof body[key]) {
            const error = {
                message: `Column ${key} must be ${column.getType()}`
            }
            res.status = 400
            res.message = error
            return
        }

        if (column.isUnique() && row.getValue(key) === body[key]) {
            const error = {
                message: `Column ${key} must be unique`
            }
            res.status = 400
            res.message = error
            return
        }
    }

    table.update(row => row.getId() === req.params.document, body)

    const response = {
        description: 'Document updated',
    }
    res.status = 200
    res.message = response
})

router.delete('/:database/:table/data/:document', (req, res) => {
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

    const data = table.getData()
    if (data.length === 0) {
        const error = {
            message: 'Table is empty'
        }

        res.status = 400
        res.message = error
        return
    }

    if (!table.findOne(row => row.getId() === req.params.document)) {
        const error = {
            message: 'Document not found'
        }
        res.status = 404
        res.message = error
        return
    }

    table.delete(row => row.getId() === req.params.document)

    const response = {
        description: 'Document deleted',
    }
    res.status = 200
    res.message = response
})


module.exports = router