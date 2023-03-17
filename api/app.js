const ServerHttp = require('./lib/server')
// const DatabaseManager = require('./db')
const rootRouter = require('./routes/index')
const databaseRouter = require('./routes/database')
const tableRouter = require('./routes/table')

// const dbManager = new DatabaseManager()
const app = new ServerHttp()

app.route('/', rootRouter)
app.route('/:databse', databaseRouter)
app.route('/:database/:table', tableRouter)

// console.log(app.router.getRoutes())
app.listen()