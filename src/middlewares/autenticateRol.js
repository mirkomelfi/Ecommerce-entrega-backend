export const roleValidation = (roles) => {
    return async (req, res, next) => {
        console.log("llego a rol val")
        if (!req.user) {
            return res.status(401).send({
                message: "Usuario no autorizado"
            })
        }

        if (!roles.includes(req.user.rol)) {
            return res.status(401).send({ 
                message: "No posee los permisos de rol necesarios" 
            });
        }
        next()
    }
}
