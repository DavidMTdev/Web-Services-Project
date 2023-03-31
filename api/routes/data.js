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

router.get('/:database/:table/data', async (req, res) => {
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

    const verifFilter = req.url.searchParams
    const sortBy = {}
    let tableSort = false
    let errorName = ""

    verifFilter.forEach((value, key) => {
        if (key != "filter"){
            tableSort = true
            errorName = key
        }
        let filter
        filter = value

        let x = filter.split(',')
        for( element in x){
            let y = x[element].split('=')
            sortBy[y[0]] = y[1] 
        }
    });

    if (tableSort) {
        const error = {
            message: 'Immposible de trié par ' + errorName
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

    const newData = {}
    if (sortBy != {}) {
        for (elem in sortBy){
            await data.map(element => {
                if (element.getValues()[elem] == sortBy[elem]){
                    newData[element.getId()] = element.getValues()
                }
            })
        }
        for (x in newData){
            for (elem in sortBy){
                if (newData[x][elem] != sortBy[elem]){
                    delete newData[x]
                }
            }
        }
    }
    else{
        await data.map(element => {
            newData[element.getId()] = element.getValues()
    })
    }
    

    const response = {
        description: 'List of data',
        data: newData
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