// index.js

const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const exphbs = require('express-handlebars')
const Issues = require('./models/Issues')

const app = express()

//Handlebar Middleware for template engine
//below line sets the app's engine (templating engine) to express-handlebars
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars') 

//other settings
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'))
app.use((req, res, next) => {
    //CORS
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET POST PUT DELETE')
    res.header('Access-Control-Allow-Headers', 'content-type')
    next()
})

//Homepage rendering
app.get('/', (req, res) => {
    res.render('login', {
        style: 'custom.css',
        Issues
    })
})




//Port setting
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('server on! http://localhost:' + port)
})