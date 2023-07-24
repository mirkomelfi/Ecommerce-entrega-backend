import passport from 'passport';

export const passportError = (strategy) => {
    return async (req, res, next) => {
        console.log("llego a pass err")
        passport.authenticate(strategy, (error, user, info) => {
            if (error) {
                return res.status(500).send({ 
                    message: "Error de JWT" 
                });;
            }
            console.log(user)
            if (!user) {
                return res.status(401).send({ 
                    message: "No hay usuario logeado" 
                });
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};