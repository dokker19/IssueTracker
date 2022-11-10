// app.js

//bringing in db from config/database.js
const db = require('./config/database');

//Test DB connection with async IIFE
(async () => {
    try{
        await db.authenticate()
        console.log('Connection to db successfully established')
    } catch (err) {
        console.error('Unable to connect to the db: ', err)
    }
})()

const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const path = require('path')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')


//Importing Users Model
const { Users } = require('./models/Users')


const app = express()

//other settings
app.use(express.static(path.join(__dirname, 'public')))
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars') 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use((req, res, next) => {
    //CORS
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET POST PUT DELETE')
    res.header('Access-Control-Allow-Headers', 'content-type')
    next()
})


//Register New User Page Rendering
app.get('/registerUser', (req, res) => {
    res.render('registerUser', {
        style: 'custom.css',
    })
})
//Login Page Rendering
app.get('/', (req, res) => {
    res.render('login', {
        style: 'custom.css',
    })
})


//Port setting
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('server on! http://localhost:' + port)
})