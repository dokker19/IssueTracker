//  controllers/project/index.js

const express = require('express')
const router = express.Router()
const sequelize = require('../../sequelize')
const { Op } = require('sequelize')

const Users = sequelize.models.user
const Issues = sequelize.models.issue
const Projects = sequelize.models.project
const UsersProjects = sequelize.models.userproject
const UsersIssues = sequelize.models.userissue

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


// Show All Projects(HIDDEN)
router.get('/showAll', (req, res) => {
    //console.log('gotit')
    Projects.findAll()
        .then(projects => {
            console.log('logging issues...')
            console.log(projects)
            res.json(projects)
        })
        .catch(err => {
            console.log('oh no...')
            res.json(err)
        })
})

// Show all of the projects that user belongs to
router.get('/', (req, res, next) => {

    let users, projects, usersprojects
    let projectIDs = []
    let currentID = req.user.id
    Users.findOne({ where: {
        id: currentID
    }}).then(async (data) => {
        users = data
        usersprojects = await UsersProjects.findAll({where: {
            userID: users.dataValues.id
        }})
        usersprojects.forEach((UP) => {
            projectIDs.push(UP.dataValues.projectID)
        })
        return Projects.findAll({ where: {
            id: { [Op.in]: projectIDs},
        }})
    }).then((data) => {
        projects = data
        res.render('showProjects', {
            projects,
            style : './custom.css',
        })
    }).catch(err => console.log(err))
})

//New Project
router.get('/new', (req, res) => {
    let creatorID = req.user.id
    res.render('addProject', {
        creatorID: creatorID,
        style: './custom.css',
    })
})

//Create Project
router.post('/', (req, res) => {

    let proj

    Projects.findOne({
        order: [ [ 'id', 'DESC' ] ],
    }).then(async (project) => {
        req.body['id'] = project ? project.id + 1 : 201
        await Projects.create(req.body)
        return Projects.findOne({
            where: { id: req.body['id'] }
        })
    }).then((project) => {
        proj = project
        return Users.findOne({
            where: { id: req.user.id },
        })
    }).then( async (user) => {
        console.log('found user: ' + user)
        await proj.addUsers(user)
        res.redirect('/projects')
    }).catch(err => console.log(err))
})

//Add User to Project (FORM)
router.get('/:id/addUser', (req, res) => {
    let projectID = req.params.id
    res.render('addUser', {
        projectID: projectID,
        style: './custom.css',
    })
})

//Adds User to Project
router.post('/:id/addUser', (req, res) => {

    let projectID = req.params.id
    let user

    Users.findOne({
        where: { username: req.body.username }
    }).then((usr) => {
        user = usr
        return Projects.findOne({
            where: { id: projectID },
        })
    }).then(async (project) => {
        if (!user) {
            res.render('addUser', {
                projectID: projectID,
                style: './custom.css',
                err: 'no user found',
            })
        }else{
            await project.addUsers(user)
            res.redirect('/projects/' + projectID)
        }

    }).catch(err => console.log(err))
})

//Show All Issues of a project
router.get('/:id', (req, res) => {

    let issues, projectName, projectID
    Projects.findOne({ 
        where: { id: req.params.id },
    }).then((data) => {
        projectName = data.dataValues.projectTitle
        projectID = data.dataValues.id
         return Issues.findAll({ 
        where: { projectID: req.params.id},
        order: [[ 'urgency', 'ASC' ] ]})
    }).then((data) => {
        issues = data
        res.render('showIssues', {
            issues, 
            projectName: projectName,
            projectID: projectID,
            style: './custom.css',
        })
    }).catch(err => console.log(err))

})


module.exports = router