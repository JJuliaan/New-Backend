const passport = require('passport')
const local = require('passport-local')
const GitHubStategy = require('passport-github2')
const Users = require('../dao/models/usersDB.model')
const UsuariosDB = require('../dao/usersDB.dao')
const userDao = new UsuariosDB()
const { createHash, isValidPassword } = require('../ultis/cryptPassword')

const LocalStrategy = local.Strategy

const initializePassport = () => {

    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
        try {
            const { first_name, email, password } = req.body

            const user = await Users.findOne({ email: username })
            if (user) {
                console.log('existe');
                return done(null, false)
            }

            const newUsuarioInfo = {
                first_name,
                email,
                password: createHash(password),
            }

            const newUser = await userDao.crearUsuario(newUsuarioInfo)

            done(null, newUser)
        } catch (error) {
            done(error)
        }
    }))

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await Users.findOne({ email: username })
            if (!user) {
                console.log('el usuario no existe')
                return done(null, false)
            }

            if (!isValidPassword(password, user)) return done(null, false)

            done(null, user)

        } catch (error) {
            console.log(error)
        }

    }))

    passport.use('github', new GitHubStategy({
        clientID: 'Iv1.10c20809954d5e2e',
        clientSecret: '4719cf9ae71cfed0d86b97069e1cbbe197b26515',
        callbackURL: 'http://localhost:8080/auth/githubcallback',
    }, 
    async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile)

            const user = await Users.findOne({ email: profile._json.email})

            if(!user){
                const newUserInfo = {
                    first_name: profile._json.name,
                    email: profile._json.email,
                    password: ''
                }
                const newUser = await userDao.crearUsuario(newUserInfo)
                return done(null, newUser)
            }

            done(null, user)
        } catch (error) {
            done(error)
        }
    }
    ))

    passport.serializeUser((newUser, done) => {
        try {
            const userId = newUser.id
            done(null, userId )
            
        } catch (error) {
            console.log(error.message)
        }
    })

    passport.deserializeUser( async (id, done) => {
        try {
            const user = await Users.findById(id)
            done(null, user)
          } catch (error) {
            console.error(error)
          }
    })
}

module.exports = initializePassport