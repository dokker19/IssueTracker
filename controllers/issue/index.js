// controllers/issue/index.js

const express = require('express')
const router = express.Router()
const sequelize = require('../../sequelize')



const Users = sequelize.models.user
const Issues = sequelize.models.issue
const Projects = sequelize.models.project
const UsersIssues = sequelize.models.userissue
const UsersProjects = sequelize.models.userproject


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

    //promise chaining for getting all isssues a user is part of
    let users, issues
    let currentID = req.user.id
    Users.findOne({ where: {
        id: currentID
    }}).then((data) => {
        users = data
        return UsersIssues.findAll({ where: {
            userID: currentID,
        }})
    }).then((data) => {
        issues = data
        idArray = []
        issues.forEach((issue) => {
            idArray.push(issue.dataValues.issueID)
        })
        console.log('loggin idArray...\n\n')
        console.log(idArray)
        console.log('type is..' + typeof idArray[0])
        return Issues.findAll({ 
            where: { id: idArray },
            order: [['urgency', 'ASC']] })
    }).then((data) => {
        issues = data
        res.render('showIssues', {
            issues,
            style : './custom.css',
            // layout: 'main'
        })
    }).catch(err => console.log(err))
})

//Show
// //Showing issues by ProjectID
// router.get('/:id', (req, res) => {
    
//     let issues, projectID
//     projectID = req.params.id
//     Issues.findAll({ 
//         where: { projectID: req.params.id },
//         order: [[ 'urgency', 'ASC']]
//     }).then((data) => {
//         issues = data
//         console.log('logging req.params.id...\n\n\n')
//         console.log(req.params.id)
//         res.render('showIssues', {
//             issues, 
//             style: './custom.css',
//             projectID: projectID,
//         })
//     }).catch(err => console.log(err))
// })




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
   
    const issueToUpdate = await Issues.findOne({ where: {
        id: req.params.id,
    }})


    issueToUpdate.set(req.body)
    //userToUpdate.issuedate = 
    await issueToUpdate.save()

    console.log('issueToUpdate...\n\n')
    console.log(issueToUpdate)

    // issueToUpdate.
    // projID = 
    res.redirect('/projects/' + issueToUpdate.dataValues.projectID)
})


module.exports = router