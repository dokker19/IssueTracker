// index.js

const app = require('./express/app')
const sequelize = require('./sequelize')
const port = process.env.PORT || 3000;

//Test DB connection with async IIFE
(async () => {
    try{
        await sequelize.authenticate()
        console.log('Connection to db successfully established')
    } catch (err) {
        console.error('Unable to connect to the db: ', err)
    }
})()

app.listen(port, () => {
    console.log('server on! http://localhost:' + port)
})