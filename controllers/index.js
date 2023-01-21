// controllers/index.js

const { Router } = require('express')
const router = Router()

router.get('/', (req, res) => {
    res.send('Welcome to the Issue Tracker')
})

router.use('/dashboard', require('./dashboard'))

router.use('/users', require('./user'))

router.use('/issues', require('./issue'))

router.use('/projects', require('./project'))


module.exports= router

