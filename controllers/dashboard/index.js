// controllers/dashboard/index.js

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


//Index - display dashboard
router.get('/', (req, res) => {

    let user, issues
    let issuesIDArray = []
    let userID = req.user.id
    let issueUrgencyCount = [0, 0, 0, 0, 0]
    let issueProgressCount = [0, 0, 0]
    Users.findOne({
        where: { id: userID }
    }).then((data) => {
        user = data
        return UsersIssues.findAll({
            where: { userID: userID }
        })
    }).then((data) => {
        console.log('logging data....\n\n\n\n')
        console.log(data)
        data.forEach((issue) => {
            issuesIDArray.push(issue.dataValues.issueID)
        })
        return Issues.findAll({
            where: { id: issuesIDArray }
        })
    }).then((data) => {

        issues = data
        issues.forEach((issue) => {
            issueUrgencyCount[issue.dataValues.urgency-1] += 1
            issueProgressCount[issue.dataValues.status-1] += 1
            console.log('\n\n\n')
        })
    }).then(()=>{
        console.log('logging issueUrgencyCOunt...\n\n')
        console.log(issueUrgencyCount)
        console.log('logging issueProgressCOunt...\n\n')
        console.log(issueProgressCount)
        res.render('dashboard', {
        name: req.user.username,
        style: './custom.css',

        urgencyArray: {
            dataValues: {
                array: issueUrgencyCount
            },
        }
    })
    }).catch(err => console.log(err))
    
})


module.exports = router