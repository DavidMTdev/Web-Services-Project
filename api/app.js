const ServerHttp = require('./lib/server')

const rootRouter = require('../api/lib/routes/index')

console.log(rootRouter.getRoutes());

const app = new ServerHttp()

app.route('/', rootRouter)

// app.router.options('/', (req, res) => {
//     console.log('options root')
// })

// app.router.get('/', (req, res) => {
//     console.log('get root')
// })

// app.router.post('/', (req, res) => {
//     console.log('post root')
// })

// app.router.get('/:database', (req, res) => {
//     console.log('get database')
// })

console.log(app.router.getRoutes())

app.listen()