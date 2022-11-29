// sequelize/models/Issues.js
// Model for Issues table

const { Sequelize, DataTypes, Model } = require('sequelize')

module.exports = (sequelize) => {
    const Issue = sequelize.define('issue', {
        // issue_id: {
        //     allowNull: false,
        //     primaryKey: true,
        //     type: DataTypes.INTEGER
        // },
        issueTitle: {
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
            type: DataTypes.INTEGER,
        },
        issueDate:{
            type: DataTypes.DATE,
        },
        status: {
            type: DataTypes.INTEGER,
        },
    }, {
        sequelize,
        timestamps:  false,
    })
    
    return Issue
}