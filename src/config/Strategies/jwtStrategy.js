import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { createUser, findUserById } from '../../services/UserServices.js'

const cookieExtractor=(req)=>{
    const cookieHeader= req.headers.Cookie;
    if (cookieHeader){
        const cookies=cookieHeader.split(";");
        for (const cookie of cookies){
            const [name,value]= cookie.trim().split("=");
            if (name==="jwt"){
                return value
            }
        }
    }
    console.log("req.cookies",req.cookies)
    console.log("req.cookies.jwt",req.cookies.jwt)
    const token=req.cookies?req.cookies.jwt:null
    console.log("token cookie ex",token)
    return token
}

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]), //.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

export const strategyJWT = new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        console.log("payload",payload)
        const user = await findUserById(payload.user.id)
        console.log("user",user)

        if (!user) {
            return done(null, false)
        }

        return done(null, user)

    } catch (error) {
        return done(error, false)
    }
})
