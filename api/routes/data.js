const Router = require('../lib/router')
const { databases } = require('../db')

const router = new Router()

router.options('/:database/:table/data', (req, res) => {
    const response = {
        description: 'List of methods',
        methods: ['GET','POST','DELETE']
    }

    res.status = 200
    res.message = response
})

router.get('/:database/:table/data', (req, res) => {
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
        description: 'List of data',
        data: table.getData()
    }

    res.status = 200
    res.message = response
})

router.post('/:database/:table/data', async (req, res) => {
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
    const newData = {}
    for (const key in body) {  
        const value = body[key]

        if (!table.columnExists(key)) {
            const error = {
                message: `Column ${key} not exists`
            }
            res.status = 400
            res.message = error
            return
        }

        newData[key] = value
    }

    for (const key of Object.keys(table.getColumns())) {
        const column = table.getColumn(key)

        if (!newData[key]) {
            newData[key] = column.getDefault()
        } 

        if (column.isAutoIncrement()) {
            table.autoIncrement(key)
            newData[key] = column.getCount()
        }

        if (!column.isNullable() && newData[key] === null) {
            const error = {
                message: `Column ${key} cannot be null`
            }
            res.status = 400
            res.message = error
            return
        }

        if (!column.isNullable() && column.getType() !== typeof newData[key]) {
            const error = {
                message: `Column ${key} must be ${column.getType()}`
            }
            res.status = 400
            res.message = error
            return
        }

        if (column.isUnique() && data.some(row => row.getValue(key) === newData[key])) {
            const error = {
                message: `Column ${key} must be unique`
            }
            res.status = 400
            res.message = error
            return
        }
    }

    
    table.insert(newData)

    console.log(table);

    res.status = 200
    res.message = {
        message: 'Data created',
        data: newData
    }
})

router.delete('/:database/:table/data', (req, res) => {
    const db = databases()[req.params.database]

    if (!db) {
        const error = {
            message: 'Database not found'
        }

        res.status = 404
        res.message = error
        return
    }
    
    if (!db.tableExists(req.params.table)) {
        const error = {
            message: 'Table not found'
        }

        res.status = 404
        res.message = error
        return
    }

    const table = db.getTable(req.params.table)
    if (table.getData().length === 0) {
        const error = {
            message: 'Table is empty'
        }

        res.status = 400
        res.message = error
        return
    }

    table.truncate()

    res.status = 200
    res.message = {
        message: 'Data deleted'
    }
})


module.exports = router