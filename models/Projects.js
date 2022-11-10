// models/Projects.js
// Model for Projects table

const Sequelize = require('sequelize')
const db = require('../config/database')

const Projects = db.define('projects', {
    id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    projectTitle: {
        allowNull: false,
        type: Sequelize.STRING,
        valiate: {
            //require projectTitle to at least length 3, only use letters, numbers, underscores
            is: /^\w{3,}$/
        }
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    startDate:{
        type: Sequelize.DATE,
        allowNull: false,
    }
})

module.exports = Projects