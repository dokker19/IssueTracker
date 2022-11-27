const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByUsername, getUserById){
    const authenticateUser = async (username, password, done) => {
        const user = await getUserByUsername(username)
        if (!user) return done(null, false, {message: 'username not found'})
        try{
            const equal = await bcrypt.compare(password, user.hashedPassword)
            if (equal) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect'})
            }
        }catch(err){
            console.log('error caught!')
            return done(err)
        }
    }
     passport.use(new LocalStrategy({ usernameField: 'username'}, authenticateUser))
     passport.serializeUser((user, done) => done(null, user)) 
     passport.deserializeUser(async (user, done) => done(null, await getUserById(user.id)))
}
 

module.exports = initialize