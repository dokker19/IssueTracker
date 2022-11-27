// server.js


const app = require('./express/app.js')
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`)
})