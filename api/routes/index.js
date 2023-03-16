const Router = require('../router')

const router = new Router()

router.options('/', (req, res) => {
    console.log('options root')
})

router.get('/', (req, res) => {
    console.log('get root')
})

router.post('/', (req, res) => {
    console.log('post root')
})

module.exports = router