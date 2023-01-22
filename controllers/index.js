// controllers/index.js

const { Router } = require('express')
const router = Router()

router.get('/', (req, res) => {
    res.send(`Welcome to the Issue Tracker\n\n
    <a href="/login" class="nav-link px-0 align-middle text-white">Get started</a>
    <br/>
    <a href="https://github.com/dokker19/IssueTracker">View github</a>`)
})

router.use('/dashboard', require('./dashboard'))

router.use('/users', require('./user'))

router.use('/issues', require('./issue'))

router.use('/projects', require('./project'))


module.exports= router

