// models/Users.js
// Model for User table

const Sequelize = require('sequelize')
const db = require('../config/database')

const Users = db.define('users', {
    id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    username: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
        valiate: {
            //require username to at least length 3, only use letters, numbers, underscores
            is: /^\w{3,}$/
        }
    },
    password: {
        type: Sequelize.STRING,
    },
    contact_email: {
        type: Sequelize.STRING,
    }
})

module.exports = Users