const process = require('process')
const fs = require('fs')
const path = require('path')
const v8 = require('v8')

const ServerHttp = require('./lib/server')
const { databases, Column, Database } = require('./db')
const rootRouter = require('./routes/index')
const databaseRouter = require('./routes/database')
const tableRouter = require('./routes/table')
const columnsRouter = require('./routes/columns')
const columnRouter = require('./routes/column')
const dataRouter = require('./routes/data')
const documentRouter = require('./routes/document')

// const dbManager = new DatabaseManager()
const app = new ServerHttp()

app.route('/', rootRouter)
app.route('/:databse', databaseRouter)
app.route('/:database/:table', tableRouter)
app.route('/:database/:table/columns', columnsRouter)
app.route('/:database/:table/columns/:column', columnRouter)
app.route('/:database/:table/data', dataRouter)
app.route('/:database/:table/data/:document', documentRouter)

app.listen(3000, async (port) => {
    console.log(`Server running on port ${port}`)

    const folders = fs.readdirSync('data')
    for (const folder of folders) {
        console.log(`Loading database ${folder}...`)
        const files = fs.readdirSync(`data/${folder}`)
        const db = new Database(folder)

        for (const file of files) {
            const fileExt = path.extname(file)
            const fileName = path.basename(file, fileExt)

            // const data = fs.readFileSync(`data/${folder}/${file}`, 'utf8')
            // const json = await JSON.parse(data)
            const data = fs.readFileSync(`data/${folder}/${file}`)
            const json = v8.deserialize(data)

            db.createTable(fileName)
            const table = db.getTable(fileName)

            for (const key in json.columns) {
                table.addColumn(json.columns[key])
            }

            for (const key in json.data) {
                table.insert(json.data[key].values, json.data[key].uuid)
            }
        }
        console.log(`Database ${folder} loaded`)
    }
    console.log('Databases loaded')
})

process.on('SIGINT', async () => {
    console.log('Closing databases...')
    const db = databases()
    for (const database in db) {
    
        fs.mkdirSync(`data/${database}`, { recursive: true })
        for (const table in db[database].tables) {

            // const j = JSON.stringify(db[database].tables[table], null, 2)
            // fs.writeFileSync(`data/${database}/${table}.json`, j)

            const s = v8.serialize(db[database].tables[table])
            fs.writeFileSync(`data/${database}/${table}.db`, s)
        }
    }

    console.log('Databases closed')
    process.exit(0)
});  // CTRL+C