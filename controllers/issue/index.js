// controllers/issue/index.js

const express = require('express')
const router = express.Router()
const sequelize = require('../../sequelize')



const Users = sequelize.models.user
const Issues = sequelize.models.issue
const Projects = sequelize.models.project


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
            console.log('logging issues...')
            console.log(issues)
            res.json(issues)
        })
        .catch(err => {
            console.log('oh no...')
            res.json(err)
        })
})

//Index
router.get('/', (req, res, next) => {

    let users, issues
    let currentID = req.user.id
    Users.findOne({ where: {
        id: currentID
    }}).then((data) => {
        users = data
        return users.getIssues()
    }).then((data) => {
        issues = data
        res.render('showIssues', {
            issues,
            style : './custom.css',
            // layout: 'main'
        })
    }).catch(err => console.log(err))
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


//Edit
router.get('/:id/edit', (req, res, next) => {
    let issueID = req.params.id
    Issues.findOne({ where: {
        id: issueID,
    }}).then((data) => {
        console.log('logging the isssue..')
        console.log(data)
        res.render('editIssue', {
            style: 'custom.css',
            issue : data,
        })
    }).catch(err => console.log(err))
})

//Update
router.put('/:id', async (req, res) => {
   
    const userToUpdate = await Issues.findOne({ where: {
        id: req.params.id,
    }})

    //d.setTime( d.getTime() + d.getTimezoneOffset()*60*1000 );

    console.log('reqissuedate: ' + req.body.issueDate)

    userToUpdate.set(req.body)
    //userToUpdate.issuedate = 
    await userToUpdate.save()

    res.redirect('/issues')
})


module.exports = router