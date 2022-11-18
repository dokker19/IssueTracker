const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const path = require('path')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

const app = express()

//setting middlewares

app.use(express.static(path.join(__dirname, '../public')))
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
        layout: 'basic',
    })
})
//Login Page Rendering
app.get('/login', (req, res) => {
    res.render('login', {
        style: 'custom.css',
        layout: 'basic',
    })
})

//Issues Routing
app.use('/Issues', require('../routes/issues'))

app.get('/', (req, res) => {
    res.redirect('/login')
})


module.exports = app