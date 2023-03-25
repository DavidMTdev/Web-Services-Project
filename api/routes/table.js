const Router = require('../lib/router')
const { Column, databases } = require('../db')

const router = new Router()

router.options('/:database/:table', (req, res) => {
    const response = {
        description: 'List of methods',
        methods: ['GET', 'POST', 'DELETE']
    }

    res.status = 200
    res.message = response
})

router.get('/:database/:table', (req, res) => {
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

    console.log(table)

    const response = {
        description: 'List of table',
        path: Object.keys(table)
    }

    res.status = 200
    res.message = response
})

router.post('/:database/:table', async (req, res) => {
    const db = databases()[req.params.database]
    const table = db.getTable(req.params.table)
    const columns = table.getColumns()

    if (!db) {
        const error = {
            message: 'Database not found'
        }

        res.status = 404
        res.message = error
        return
    }
    
    if (Object.keys(columns).length) {
        const error = {
            message: 'Columns already exists'
        }

        res.status = 400
        res.message = error
        return
    }  

    if (!req.body.columns) {
        const error = {
            message: 'Columns name is required'
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

    const newColumns = []
    await req.body.columns.forEach(column => {
        const value = column

        if (!value.name) {
            const error = {
                message: 'Column name is required'
            }
            res.status = 400
            res.message = error
            return
        }
        
        if (!value.type) {
            const error = {
                message: 'Column type is required'
            }
            res.status = 400
            res.message = error
            return
        }

        if (!typeArgument[value.type]) {
            const error = {
                message: 'Column type is invalid'
            }
            res.status = 400
            res.message = error
            return
        }

        // newColumns.push([value.name, typeArgument[value.type], value?.default, value?.nullable, value?.primaryKey, value?.unique, value?.autoIncrement])
        newColumns.push({
            name: value.name,
            type: typeArgument[value.type],
            default: value?.default,
            nullable: value?.nullable,
            primaryKey: value?.primaryKey,
            unique: value?.unique,
            autoIncrement: value?.autoIncrement
        })
    })
    
    newColumns.forEach(column => {
        table.createColumn(column.name, column.type, column.value, column.nullable, column.primaryKey, column.unique, column.autoIncrement)
    })

    console.log(table);

    const response = {  
        description: 'Columns created',
        Columns: table.getColumns()
    }

    res.status = 201
    res.message = response
})

router.delete('/:database/:table', (req, res) => {
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

    db.dropTable(req.params.table)

    const response = {

        description: 'Table deleted',
        tables: Object.keys(db.getTables())
    }

    res.status = 200
    res.message = response
})

module.exports = router