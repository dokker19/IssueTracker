
const express = require('express')
const router = express.Router()
const sequelize = require('../../sequelize')
const bcrypt = require('bcrypt')


const Users  = sequelize.models.user


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


// Index
router.get('/', (req, res, next) => {
    // console.log('loggin sequelize.models!')
    // console.log(sequelize.models)
    Users.findAll()
        .then(users =>{
            console.log("printing users!!!")
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
router.get('/new', checkNotAuthenticated, (req, res, next) => {
    res.render('registerUser', {
        style: 'custom.css',
        layout: 'basic',
    })
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
            req.body['hashedPassword'] = await bcrypt.hash(req.body.password, 10)


            // console.log('req.body: ')
            // console.log(req.body)

            await Users.create(req.body)
            res.redirect('/login')
        }).catch((err) => {
            res.json(err)
        })
})

//Delete
router.delete('/:id', (req, res, next) => {
    console.log('delete receieved!')
    Users.destroy({
        where: {id: req.params.id}
    })
    .then(console.log('user destroyed'))
    .catch((err) => {
        res.json(err)
    })
})





module.exports = router