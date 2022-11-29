
const { Sequelize } = require('sequelize');
const { applyExtraSetup } = require('./extra-setup');

// In a real app, you should keep the database connection URL as an environment variable.
// But for this example, we will just use a local SQLite database.
// const sequelize = new Sequelize(process.env.DB_CONNECTION_URL);

const fs = require('fs')

const sequelize = new Sequelize('issuetrack', 'postgres', 'qwer1023', {
    host: 'localhost',
    dialect: 'postgres'
})

const modelDefiners = [
	require('./models/Users'),
	require('./models/Issues'),
	require('./models/Projects'),
	// Add more models here...
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}
//console.log(sequelize.models)
// We execute any extra setup after the models are defined, such as adding associations.
applyExtraSetup(sequelize);

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize

