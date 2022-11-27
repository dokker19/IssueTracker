// sequelize/models/Users.js
// Model for User table

const { Sequelize, DataTypes, Model } = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('Users', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        username: {
            allowNull: false,
            unique: true,
            type: DataTypes.STRING,
            valiate: {
                //require username to at least length 3, only use letters, numbers, underscores
                is: /^\w{3,}$/
            }
        },
        password: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        hashedPassword: {
            type: DataTypes.STRING,
        }
    })
}
