const ServerHttp = require('./lib/server')
const rootRouter = require('./routes/index')
const databaseRouter = require('./routes/database')

const app = new ServerHttp()

app.route('/', rootRouter)
app.route('/:databse', databaseRouter)

// console.log(app.router.getRoutes())
app.listen()