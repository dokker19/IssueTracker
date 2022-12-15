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

//Index - show all issues user is assigned to
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
        res.render('showMyIssues', {
            issues,
            style : './custom.css',
            // layout: 'main'
        })
    }).catch(err => console.log(err))
})



//New Issue (FORM)
router.post('/new', (req, res, next) => {
    res.render('newIssue', { 
        style: 'custom.css', 
        projectID: req.body.projectID,
        projectName: req.body.projectName,
    })
})

//Create Issue
router.post('/', (req, res, next) => {
    console.log(req.body)
    Issues.findOne({
        order: [ ['id', 'DESC' ]],
    }).then(async (issue) => {
        console.log('logging req.body...\n\n')
        res.locals.lastID = issue?issue.id:0
        req.body['id'] = res.locals.lastID + 1
        req.body['issuerID'] = req.user.id
        console.log(req.body)

        
        await Issues.create(req.body)

        res.redirect('/projects/' + req.body.projectID)
    }).catch(err => res.json(err))
})

//Assign user to Issue FORM (given user is in the project)
router.get('/:id/assignUser', (req, res) => {
    res.render('assignUser', {
        style: 'custom.css',
        issueID: req.params.id,
    })
})
//Assign user to Issue (given user is in the project)
router.post('/:id/assignUser', (req, res) => {

    let user, project, issue, projectID, users
    let idArray = []

    Issues.findOne({ 
        where: { id: req.params.id }
    }).then((data) => {
        issue = data
        return issue.getProject()
    }).then((data) => {
        project = data
        projectID = data.dataValues.id
        return project.getUsers()
    }).then((data) => {
        users = data
        //gets all users in that issue's project, save their ids
        users.forEach((usr) => {
            idArray.push(usr.dataValues.id)
        })
        return Users.findOne({
            where: { username : req.body.username }
        })
    }).then((data) => {
        user = data
        if (!user) {
            //user to be added does not exist
            res.render('assignUser', {
                style: 'custom.css',
                issueID: req.params.id,
                err: 'user not found',
            })
        }else if (!idArray.includes(user.dataValues.id)) {
            //user to be added exists, but not in the project
            res.render('assignUser', {
                style: 'custom.css',
                issueID: req.params.id,
                err: 'User not in the Project. Please add user to the project first',
            })
        }else{
            issue.addUsers(user)
            res.redirect('/projects/' + projectID)
        }
    }).catch(err => console.log(err))
})



//Edit
router.get('/:id/editIssue', (req, res, next) => {

    let issue, users, projectID, project
    let userIdArray = []

    Issues.findOne({
        where: { id: req.params.id }
    }).then(async(data) => {
        issue = data
        project = await issue.getProject()
        projectID = project.dataValues.id
        return issue.getUsers()
    }).then((data) => {
        users = data
        users.forEach((usr) => {
            userIdArray.push(usr.dataValues.id)
        })
        if (!userIdArray.includes(req.user.id)){
            res.redirect('/projects/' + projectID)
        } else{
            res.render('editIssue', {
                style: 'custom.css',
                issue: issue
            })
        }
    }).catch(err => console.log(err))
})

//Edit for My Issues
router.get('/:id/editMyIssue', (req, res, next) => {
    let issueID = req.params.id
    Issues.findOne({ where: {
        id: issueID,
    }}).then((data) => {
        console.log('logging the datavalue id....\n\n\n')
        console.log(data.dataValues.id)
        res.render('editMyIssue', {
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

//Update for My Issues
router.put('/edit/:id', async (req, res) => {


    const issueToUpdate = await Issues.findOne({ where: {
        id: req.params.id,
    }})


    issueToUpdate.set(req.body)
    await issueToUpdate.save()

    res.redirect('/issues')
})


module.exports = router