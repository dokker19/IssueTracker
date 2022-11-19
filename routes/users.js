//routes/users.js

const express = require('express')
const router = express.Router()
const sequelize = require('../index2')

const { Users } = sequelize.models



// Index
router.get('/', (req, res, next) => {
    console.log('loggin sequelize.models!')
    console.log(sequelize.models)
    Users.findAll()
        .then(users =>{
            console.log(users)
            res.render('showUsers', {
                users
            })
        }).catch(err=>{console.log(err)})
})

router.get('/showAll', (req, res, next) => {
    const query = {}
    if (req.query.username) query.username = {$regex:req.query.username, $options:'i'}

    Users.findAll(query)
        .then((result) => {
            res.json(result)
        })
        .catch((err) => {
            res.json(err)
        })
})

//New
router.get('/new', (req, res, next) => {
    res.redirect('/registerUser')
})

//Create
router.post('/', (req, res, next) => {
    console.log('post received!')
    console.log(req.body)
    Users.findOne({
        order: [ ['id', 'DESC' ]],
    })
        .then(async (user) => {
            res.locals.lastID = user?user.id:0
            req.body['id'] = res.locals.lastID + 1
            console.log('req.body: ')
            console.log(req.body)

            await Users.create(req.body)
            res.render('dashboard')
            // const newUser = await new Users(req.body)

            // newUser.id = res.locals.lastID + 1
            // console.log('newID:' + newUser.id)
            // newUser.save((err, issue) => {
            //     console.log('inside callbacks')
            //     if (err) {

            //         res.json(err)
            //     } else {
            //         console.log('inside else!')
            //         res.render('dashboard', {
            //             style: 'custom.css',
            //         })
            //     }})

        }).catch((err) => {
            res.json(err)
        })
})





module.exports = router