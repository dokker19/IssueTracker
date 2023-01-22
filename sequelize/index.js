
const { Sequelize } = require('sequelize');
const { applyExtraSetup } = require('./extra-setup');


// In a real app, you should keep the database connection URL as an environment variable.
// But for this example, we will just use a local SQLite database.
// const sequelize = new Sequelize(process.env.DB_CONNECTION_URL);

const fs = require('fs')

// const sequelize = new Sequelize('issuetrack', 'postgres', 'qwer1023', {
//     host: 'localhost',
//     dialect: 'postgres',
// 	timezone: "+00:00",
// })
const sequelize = new Sequelize('df9j615lkn0oqc', 'cjsrxlmiusjgel', '852a9833cda4f519c352a61f547410d1b8982da7f43bdd1acb5c7874733196c2', {
    host: 'ec2-52-54-212-232.compute-1.amazonaws.com',
    dialect: 'postgres',
	timezone: "+00:00",
	dialectOptions:{
		ssl:{
			require:true,
			rejectUnauthorized:false
		}
	}
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

