// controllers/issue/index.js

const express = require('express')
const router = express.Router()
const sequelize = require('../../sequelize')
const Users = require('../../sequelize/models/Users')

// const { Issues } = sequelize.models
Issues = [
    {
    dataValues: {
        id: 1,
        ticketname: 'myticket1',
        description: 'this is the first ticket',
        status: 3, 
        urgency: 2,
        issueDate: '2022-11-11'
    },},
    {
    dataValues: {
        id: 2,
        ticketname: 'myticket2',
        description: 'this is the second ticket',
        status: 1, 
        urgency: 2,
        issueDate: '2022-11-12'
    },},
    {
    dataValues: 
    {
        id: 3,
        ticketname: 'myticket3',
        description: 'this is the third ticket',
        status: 3, 
        urgency: 5,
        issueDate: '2022-11-13'
    },}, 
    {
    dataValues: 
    {
        id: 4,
        ticketname: 'myticket4',
        description: 'this is the third ticket',
        status: 3, 
        urgency: 5,
        issueDate: '2022-11-13'
    },}, 
]



function checkAuthenticated(req, res, next){
    if (req.isAuthenticated()){ 
        return next()
    } else{
        res.redirect('/login')
    }
}
function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return res.redirect('/dashboard')
    }
    next()
}



// showAll (HIDDEN)

router.get('/showAll', (req, res) => {
    console.log('gotit')
    Issues.findAll()
        .then(issues => {
            res.json(issues)
        })
        .catch(err => {
            console.log('oh no...')
            res.json(err)
        })
})

//Index
router.get('/', (req, res, next) => {
    res.render('showIssues', {
        issues: Issues,
        style: 'custom.css', 
    })



    // Issues.findAll()
    //     .then(issues => {
    //         res.render('showIssues', {
    //             issues
    //         })
    //     }).catch(err=>console.log(err))
})

//New
router.get('/new', (req, res, next) => {
    res.render('newIssue', { 
        style: 'custom.css', 
    })
})

//Create
router.post('/', (req, res, next) => {
    console.log(req.body)
    Issues.findOne({
        order: [ ['id', 'DESC' ]],
    }).then(async (issue) => {
        res.locals.lastID = issue?issue.id:0
        req.body['id'] = res.locals.lastID + 1

        await Issues.create(req.body)
        res.redirect('/issues')
    }).catch(err => res.json(err))
})

module.exports = router