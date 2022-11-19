
const { Sequelize, DataTypes, Model } = require('sequelize')

const sequelize = new Sequelize('issuetrack', 'postgres', 'qwer1023', {
    host: 'localhost',
    dialect: 'postgres'
})

//Issues Model
class Issues extends Model {}
Issues.init({
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
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    modelName: 'Issues'
})


//Users model
class Users extends Model {}
Users.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    username: {
        allowNull: false,
        type: DataTypes.STRING,
        valiate: {
            //require ticketname to at least length 3, only use letters, numbers, underscores
            is: /^\w{2,}$/
        }
    },
    password: {
        type: DataTypes.STRING,
    },
    contact_email: {
        type: DataTypes.STRING,
    },
}, {
    sequelize,
    timestamps: false,
    createdAt: true,
    updatedAt: true,
    modelName: 'Users'
})


module.exports = sequelize