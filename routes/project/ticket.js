// api/users.js

const express = require('express')
const router = express.Router()
const USERS = require('../models/user')

// Index
router.get('/', (req, res, next) => {
    const query = {}
    if (req.query.username) query.username = {$regex:req.query.username, $options:'i'}
    USERS.find(query)
    .sort({id:1})
    .exec((err, users) => {
        if (err) {
            res.json(err)
            //res.status(500)
            //res.json({success:false, message: err})
        } else {
            res.render('users/index', {users:users})
            //res.json({success: true, data: users})
        }
    })
})

// New
router.get('/new', (req, res) => {
    res.render('users/new')
})

// Show
router.get('/:id', (req, res, next) => {
    USERS.findOne({_id:req.params.id})
    .exec((err, user) => {
        if (err){
            return res.json(err);
            //res.status(500)
            //res.json({success: false, message:err})
        } else if (!user) {
            console.log(req.body._id)
            res.json({success: false, message: 'user not found'})
        } else {
            res.render('users/show', {user:user})
            //res.json({success: true, data: user})
        }
    })
})



//Create
router.post('/', (req, res, next) => {
    USERS.findOne({})
    .sort({id: -1})
    .exec((err, user) => {
        if (err) {
            return res.json(err)
            //res.status(500)
            //return res.json({success:false, message: err})
        } else {
            res.locals.lastID = user?user.id:0
            next()
        }
    })
}, (req, res, next) => {
    const newUser = new USERS(req.body)
    newUser.id = res.locals.lastID + 1
    newUser.save((err, user) => {
        if (err) {
            res.json(err)
            //res.status(500)
            //res.json({success:false, message: err})
        } else {
            res.redirect('/users')
        }
    })
})

//edit
router.get('/:id/edit', (req, res) => {
    USERS.findOne({_id:req.params.id}, (err, user) => {
        if (err) return res.json(err);
        res.render('users/edit', {user:user})
    })
})


// Update
router.put('/:id', (req, res, next) => {
    USERS.findOneAndUpdate({_id:req.params.id}, req.body)
    .exec((err, user) => {
        if (err) {
            res.json(err)
            //res.status(500)
            //res.json({success: false, message: err})
        } else if (!user) {
            res.json({success:false, message: 'user not found'})
        } else{
            //WTF
            //console.log('users/' + req.params.id)
            res.redirect(req.params.id)
        }
    })
})

//Destroy
router.delete('/:id', (req, res, next) => {
    USERS.findOneAndDelete({_id:req.params.id})
    .exec((err, user) => {
        if (err) {
            res.json(err)
            //res.status(500)
            //res.json({success: false, message: err})
        } else if (!user) {
            res.json({success: false, message: 'user not found'})
        } else {
            res.redirect('/users')
        }
    })
})

module.exports = router