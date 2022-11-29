//express/app.js

const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const path = require('path')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

const bcrypt = require('bcrypt')
const initializePassport = require('./passport-config')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const sequelize = require('../sequelize')


class App {
    constructor(){
        this.app = express()
        this.dbConnection()
        this.setMiddleWare()
        this.getRouting()

        console.log('constructed!')
    }

    async dbConnection(){
        try {
            await sequelize.authenticate()
            console.log('Connection to db successfully established!')
        } catch(err) {
            console.log('Unable to connect to th edb: ', err)
        }
    }
    
    setMiddleWare(){
        this.app.use(express.json())
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({extended:true}))
        this.app.use(express.static(path.join(__dirname, '../public')))
        this.app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}))
        this.app.set('view engine', 'handlebars') 

        this.app.use(methodOverride('_method'))
        this.app.use((req, res, next) => {
            //CORS
            res.header('Access-Control-Allow-Origin', '*')
            res.header('Access-Control-Allow-Methods', 'GET POST PUT DELETE')
            res.header('Access-Control-Allow-Headers', 'content-type')
            next()
        })
        this.app.use(flash())
        this.app.use(session({
            //secret: process.env.SESSION_SECRET,
            secret: "secret",
            resave: false,
            saveUninitialized: false,
        }))
        console.log('Middleware setup successful!')
        this.setPassport()
    }
    
    setPassport(){

        initializePassport(passport,
            async (username) => {
                const foundUser = await sequelize.models.user.findOne({where: {username: username}})
                return foundUser
            }, 
            async (id) => {
                const foundUser2 = await sequelize. models.user.findOne({where: {id: id}})
                return foundUser2
            })

        
        this.app.use(passport.initialize())
        this.app.use(passport.session())

        console.log('Passport setup successful!')


    }

    getRouting(){
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
        this.app.get('/login', checkNotAuthenticated, (req, res) => {
            res.render('login', {
                style: 'custom.css',
                layout: 'basic',
            })
        })
        this.app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
            successRedirect: '/dashboard',
            failureRedirect:  './login',
            failureFlash: true,
        }))
        this.app.get('/dashboard',checkAuthenticated, (req, res) =>{
            res.render('dashboard', { 
                name: req.user.username,
                style: './css/custom.css',
                layout: 'main'
            })
        })
        this.app.delete('/logout', (req, res) => {
            req.logout((err) => {
                if (err) console.log(err)
            })
            res.redirect('/login')
        })


        this.app.use(require('../controllers'))
        console.log('Routing setup successful!')
    }
}

 
// //Issues Routing
// app.use('/issues', require('../routes/issues'))

// //Users Routing
// app.use('/users', require('../routes/users'))

// //TEMP
// app.get('/dashboard', (req, res) =>{
//     res.render('dashboard')
// })

// app.get('/', (req, res) => {
//     res.redirect('/login')
// })


module.exports = new App().app