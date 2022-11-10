const Sequelize = require('sequelize')
const db = new Sequelize('issuetrack', 'postgres', 'qwer1023', {
    host: 'localhost',
    dialect: 'postgres'
})

module.exports = db