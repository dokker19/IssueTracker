// index.js

const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')


const app = express()

// view engine
// app.set('view engine', 'ejs')
// app.use(express.static(__dirname+'/public'))

//other settings
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
//Routing

app.use('/', (req, res) => {
    res.send("This is home")
})


//Port setting
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('server on! http://localhost:' + port)
})