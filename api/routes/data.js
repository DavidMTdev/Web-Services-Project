const Router = require('../lib/router')
const { databases } = require('../db')
const { log } = require('console')

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
    let thereIsFilter = false
    let tableSort = false
    let errorName = ""

    verifFilter.forEach((value, key) => {
        if (key != "filter"){
            tableSort = true
            errorName = key
        }
        let filter
        filter = value
        thereIsFilter = true

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
    if (thereIsFilter) {
        for (elem in sortBy){
            let lookingFor
            await data.map(element => {
                let dataInDB = element.getValues()[elem].toString()
                if(sortBy[elem].endsWith("*") && sortBy[elem].startsWith("*")){
                    lookingFor = sortBy[elem].slice(1,-1)
                    if(dataInDB.includes(lookingFor)){
                        newData[element.getId()] = element.getValues()
                    }
                }
                else if(sortBy[elem].startsWith("*")){
                    lookingFor = sortBy[elem].slice(1, sortBy[elem].length)
                    if(dataInDB.endsWith(lookingFor)){
                        newData[element.getId()] = element.getValues()
                    }   
                }
                else if(sortBy[elem].endsWith("*")) {
                    lookingFor = sortBy[elem].slice(0, -1)
                    if(dataInDB.startsWith(lookingFor)){
                        newData[element.getId()] = element.getValues()
                    }       
                }
                else if (dataInDB == sortBy[elem]){
                    newData[element.getId()] = element.getValues()
                }
            })
        }
        for (x in newData){
            for (elem in sortBy){
                let lookingFor = sortBy[elem]
                let filter2 = ""
                if (newData[x] != null){
                    console.log(newData[x])
                    if(sortBy[elem].endsWith("*") && sortBy[elem].startsWith("*")){
                        lookingFor = sortBy[elem].slice(1,-1)
                        filter2 = "both"
                    }
                    else if(sortBy[elem].startsWith("*")){
                        lookingFor = sortBy[elem].slice(1, sortBy[elem].length)
                        filter2 = "start"
                    }
                    else if(sortBy[elem].endsWith("*")) {
                        lookingFor = sortBy[elem].slice(0, -1)
                        filter2 = "ends"
                    }
                    let dataInDB = newData[x][elem].toString()
                    switch (filter2) {
                        case "both":
                            if (!dataInDB.includes(lookingFor)){
                                delete newData[x]
                            }
                            break;

                        case "start":
                            if (!dataInDB.endsWith(lookingFor)){
                                delete newData[x]
                            }
                            break;

                        case "ends":
                            if (!dataInDB.startsWith(lookingFor)){
                                delete newData[x]
                            }
                            break;
                    
                        default:
                            if (!dataInDB.includes(lookingFor)){
                                delete newData[x]
                            }
                            break;
                    }
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