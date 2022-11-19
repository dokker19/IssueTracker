const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByUsername, getUserById){
    const authenticateUser = async (username, password, done) => {
        const user = getUserByUsername(username)
        if (!user) return done(null, false, { message: 'No user with that username'})
        try{
            if (await bcrypt.compare(password, user.password)){
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect'})
            }
        }catch(err){
            return done(err)
        }
    }
     passport.use(new LocalStrategy({ usernameField: 'username'}, authenticateUser))
     passport.serializeUser((user, done) => done(null, user)) 
     passport.deserializeUser((user, done) => done(null, getUserById(user.id)))
}


module.exports = initialize