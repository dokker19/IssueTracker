const { DataTypes } = require("sequelize");

function applyExtraSetup(sequelize) {
	const { user,  project, issue } = sequelize.models;
    console.log(sequelize.models)


    //one-to-many between user(issue creator) and issue
    user.hasMany(issue, {
        onUpdate: 'CASCADE',
        foreignKey: 'issuerID',
    })
    issue.belongsTo(user, {
        foreignKey: 'issuerID',
    })


    //one-to-many between user(project creator) and project
    user.hasMany(project, {
        onUpdate: 'CASCADE',
        foreignKey: 'creatorID',
    })
    project.belongsTo(user, {
        foreignKey: 'creatorID',
    })


    //one-to-many between project and issue
    project.hasMany(issue, {
        foreignKey: 'projectID',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    issue.belongsTo(project, {
        foreignKey: 'projectID',
        onDelete: 'CASCADE',
    })


    //many-to-many between user(participants) and projects
    const UserProject = sequelize.define('userproject', {
        userprojectID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
    }, {
        timestamps: false,
    })
    
    user.belongsToMany(project, {
        through: UserProject,
        foreignKey: 'userID',
    })
    project.belongsToMany(user, {
        through: UserProject,
        foreignKey: 'projectID',
    })

    //many-to-many between user(issuees) and issues
    const UserIssue = sequelize.define('userissue', {
        userissueID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
    }, {
        timestamps: false,
    })

    user.belongsToMany(issue, {
        through: UserIssue,
        foreignKey: 'userID',
    })
    issue.belongsToMany(user, {
        through: UserIssue,
        foreignKey: 'issueID',
    })

    let User, Issue, Project
    sequelize.sync({alter: true}).then(() => {
        console.log('Sync successful!')
    }).catch((err) => console.log(err))

     
}
module.exports = { applyExtraSetup };