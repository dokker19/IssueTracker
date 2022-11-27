// sequelize/models/Issues.js
// Model for Issues table

const { Sequelize, DataTypes, Model } = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('Issues', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        ticketname: {
            allowNull: false,
            type: DataTypes.STRING,
            valiate: {
                //require ticketname to at least length 3, only use letters, numbers, underscores
                is: /^\w{2,}$/
            }
        },
        description: {
            type: DataTypes.STRING,
        },
        //TODO: urgency type DataTypes Int? String?
        urgency: {
            type: DataTypes.STRING,
        },
        issueDate:{
            type: DataTypes.DATE,
        }
    }, {
        sequelize,
        createdAt: false,
        updatedAt: false,
    })
}