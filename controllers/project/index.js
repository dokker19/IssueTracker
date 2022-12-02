//  controllers/project/index.js

const express = require('express')
const router = express.Router()
const sequelize = require('../../sequelize')
const { Op } = require('sequelize')

const Users = sequelize.models.user
const Issues = sequelize.models.issue
const Projects = sequelize.models.project
const UserProjects = sequelize.models.userproject
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


// showAll (HIDDEN)

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


//Index
router.get('/', (req, res, next) => {

    let users, projects, usersprojects
    let projectIDs = []
    let currentID = req.user.id
    Users.findOne({ where: {
        id: currentID
    }}).then(async (data) => {
        users = data
        usersprojects = await UserProjects.findAll({where: {
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



module.exports = router