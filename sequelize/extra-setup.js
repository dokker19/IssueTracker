function applyExtraSetup(sequelize) {
	const { users, projects, issues } = sequelize.models;

    users.hasMany(issues, {
        foreignKey: 'userID'
    })
    issues.belongsTo(users)
     
}
module.exports = { applyExtraSetup };