const ServerHttp = require('./lib/server')
// const DatabaseManager = require('./db')
const rootRouter = require('./routes/index')
const databaseRouter = require('./routes/database')
const tableRouter = require('./routes/table')
const columnsRouter = require('./routes/columns')
const columnRouter = require('./routes/column')

// const dbManager = new DatabaseManager()
const app = new ServerHttp()

app.route('/', rootRouter)
app.route('/:databse', databaseRouter)
app.route('/:database/:table', tableRouter)
app.route('/:database/:table/columns', columnsRouter)
app.route('/:database/:table/columns/:column', columnRouter)


// console.log(app.router.getRoutes())
app.listen()