import passport from 'passport'
import { strategyJWT } from './Strategies/jwtStrategy.js'
import { findUserById } from '../services/UserServices.js'

const initializePassport = () => {
    passport.use(strategyJWT)
}

passport.serializeUser((user, done) => {
    done(null, user._id)
});

passport.deserializeUser(async (id, done) => {
    const user = await findUserById(id);
    done(null, user)
})

export default initializePassport