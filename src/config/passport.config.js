const passport = require('passport')
const local = require('passport-local')
const GitHubStategy = require('passport-github2')
const Users = require('../models/usersDB.model')
const UsuariosDB = require('../service/users.service')
const userDao = new UsuariosDB()
const { isValidPassword } = require('../ultis/cryptPassword')
const UserDTO = require('../DTOs/users.dto')
const logger = require('../logger/factory')

const LocalStrategy = local.Strategy

const initializePassport = () => {

    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
        try {

            const newUserInfo = new UserDTO(req.body)

            logger.info(newUserInfo)

            const user = await Users.findOne({ email: username })
            if (user) {
                console.log(user)
                logger.error('existe');
                return done(null, false)
            }

            if (!newUserInfo.first_name || !newUserInfo.email) {
                return done(null, false, { message: 'Error en la información de usuario proporcionada.' });
            }
            

            const newUser = await userDao.crearUsuario(newUserInfo)

            done(null, newUser)
        } catch (error) {
            done(error.message)
        }
    }))

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await Users.findOne({ email: username })
            if (!user) {
                logger.error('el usuario no existe')
                return done(null, false)
            }

            if (!isValidPassword(password, user)) return done(null, false), logger.error('usuario diferente a contraseña')

            done(null, user)

        } catch (error) {
            logger.error(error)
            done(error)
        }

    }))

    passport.use('github', new GitHubStategy({
        clientID: 'Iv1.10c20809954d5e2e',
        clientSecret: '4719cf9ae71cfed0d86b97069e1cbbe197b26515',
        callbackURL: 'http://localhost:8080/auth/githubcallback',
    },
        async (accessToken, refreshToken, profile, done) => {
            try {

                const user = await Users.findOne({ email: profile._json.email })

                if (!user) {
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
            done(null, userId)


        } catch (error) {
            logger.error(error.message)
        }
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await Users.findById(id)
            done(null, user)
        } catch (error) {
            console.error(error)
        }
    })
}

module.exports = initializePassport