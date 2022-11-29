// sequelize/models/Projects.js
// Model for Projects table

const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    const Project = sequelize.define('project', {
        // project_id: {
        //     allowNull: false,
        //     primaryKey: true,
        //     type: DataTypes.INTEGER
        // },
        projectTitle: {
            allowNull: false,
            type: DataTypes.STRING,
            valiate: {
                //require projectTitle to at least length 3, only use letters, numbers, underscores
                is: /^\w{3,}$/
            }
        },
        startDate:{
            type: DataTypes.DATE,
            allowNull: false,
        }
    }, {
        timestamps: false,
    })
}