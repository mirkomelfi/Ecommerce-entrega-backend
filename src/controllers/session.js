import { createUser, findUserByEmail, isTokenExpired, modifyUser,currentUser, modifyConnection } from "../services/UserServices.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer'
import { validatePassword, createHash } from "../utils/bcrypt.js";
import { createCart } from "../services/CartServices.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateUserErrorInfo } from "../services/errors/info.js";

export const loginUser = async (req, res, next) => {

    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        try {
            if (err) {
                return res.status(401).send("Error en consulta de token")
            }
            console.log(user)
            if (!user) {
                //El token no existe, entonces consulto por el usuario
                const { email, password } = req.body
                const userBDD = await findUserByEmail(email)

                if (userBDD==-1) {
                    // UserBDD no encontrado en mi aplicacion
                    return res.status(401).send({
                        message: "Usuario no encontrado"
                    })
                }

                if (!validatePassword(password, userBDD.password)) {
                    // Contraseña no es válida
                    return res.status(401).send({
                        message: "Contraseña no valida"
                    })
                }

                // Ya que el usuario es valido, genero un nuevo token
                const token = jwt.sign({ user: { id: userBDD._id } }, process.env.JWT_SECRET,{ expiresIn: '3h' })
                res.cookie('jwt', token,{ httpOnly: true, maxAge: 3 * 60 * 60 * 1000 })
        
                await modifyConnection(userBDD.id,Date())

                return res.status(200).json({ token })
            } else {

                const token = req.cookies.jwt;
                jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
                    if (err) {
                        return res.status(401).json({
                            status: "error",
                            message: "Credenciales no validas",
                        })
                    }

                    return res.status(401).json({
                        status: "error",
                        message: "Primero debes cerrar la sesión",
                    })
                })
            }

        } catch (error) {
            res.status(500).send(`Ocurrio un error en Session, ${error}`)
        }
    })(req, res, next)
}

export const passwordRecovery= async (req,res) => {   
    try {

        const { email } = req.body
        
        const validEmail= await findUserByEmail(email)
        
        if (validEmail!=-1){

            let transporter = nodemailer.createTransport({ //Genero la forma de enviar info desde mail (o sea, desde Gmail con x cuenta)
                host: 'smtp.gmail.com', //Defino que voy a utilizar un servicio de Gmail
                port: 465,
                secure: true,
                tls: {
                    rejectUnauthorized: false
                },
                auth: {
                    user: "mirkomelfi123@gmail.com", //Mail del que se envia informacion
                    pass: "qpeokphyvruqpkrz",
                    authMethod: 'LOGIN'
                }
            
            })

            let url= `${process.env.DOMINIO_BACK}/api/session/newPass`

            await transporter.sendMail({
                from: 'Test Coder mirkomelfi123@gmail.com',
                to: email,
                subject: "Mail de recuperacion de contraseña",
                html: `
                    <div>
                        <h2> ${url} </h2>
                    </div>
                `,
                attachments: []
            })
            res.cookie("cookie cookie","cookie password",{maxAge:60*60*1000,signed:true})
            return res.status(200).send({
                message: "Email enviado"
            })
        }else{
            return res.status(401).send({
                message: "Email no existe en bdd"
            })
        }
        
    } catch (error) {
        throw new Error(error)
    }
}

export const createNewPassword= async (req,res) => { 
    try {
        const { email, password } = req.body // ingresa su mail y su nueva contra 
        if (!email||!password){
            return res.status(401).send({message:"Campos ingresados invalidos"})
        }
        const userBDD= await findUserByEmail(email)
        
        if (userBDD!=-1){
            const passwordCookie=req.signedCookies["cookie cookie"]
            
            if (passwordCookie){ 
                if (validatePassword(password, userBDD.password)) {
                    return res.status(401).send({message:"No puedes colocar la misma contraseña"})
                }else{
                    const hashPassword = createHash(password)
                    const userId= userBDD.id
                    await modifyUser(userId,hashPassword)
                    return res.status(200).send({message:"Contraseña restablecida correctamente"})
                }
            }else{
                res.status(401).send({message:"Token expiro"}) // en realidad hay que hacer un redirect
            }
        }else{
            res.status(401).send({message:"No tienes cuenta creada con este email"})
        }


    } catch (error) {
        throw new Error(error)
    }
}

export const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body
        if (first_name&&last_name&&email&&age&&password){

            let newUser={}
            const userBDD = await findUserByEmail(email)
            
            if (userBDD!=-1) {
                res.status(401).send({message:"Usuario ya registrado"} )
            } else {
                const hashPassword = createHash(password)

                const newCart= await createCart({products:[]})
                const idCartUser=newCart.id
                newUser = await createUser({ 
                    first_name:first_name, 
                    last_name:last_name, 
                    rol: "User",
                    email:email,
                    age:age,
                    last_connection:Date(),
                    password: hashPassword,
                    idCart:idCartUser
                })

                const token = jwt.sign({ user: { id: newUser._id } }, process.env.JWT_SECRET,{ expiresIn: '3h' })

                res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 60 * 60 * 1000 })
                res.status(200).json({ token });
            }

        }else{
            res.status(401).send({message:`Falta ingresar algun dato requerido`})
        }
    } catch (error) {
        res.status(500).send({message:`Ocurrio un error en Registro User, ${error}`})
    }

}


export const current = async (req, res, next) => {


    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        try {
            if (err) {
                return res.status(401).json({
                    status: "error",
                    message: "Error en consulta de token",
                })
            }

            if (!user) {
                return res.status(401).json({
                    status: "error",
                    message: "No se ha encontrado al usuario",
                })
            }

            return res.status(200).json({
                status: "success",
                message: "Se ha encontrado los datos del usuario",
                payload: user,
            })


        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Error en current",
            })
        }

    })(req, res, next)

};


/*
export const current = async(req,res) =>{
    try{
        const user= await currentUser(req)
        
        if(user) {
            return res.send({status:"success",payload:user})
        }else{
            return res.status(400).send(`No esta loggeado`)
        }
    }catch (error) {
        res.status(500).send(`Ocurrio un error en Current, ${error}`)
    }

}*/
/*
export const logoutUser = async(req,res) =>{
    try{

        const user=  req.user//await currentUser(req)
        //if (user!=-1){
        if (!user){
            await modifyConnection(user.id,Date())

            res.clearCookie("jwt")
            res.status(200).send(`Sesion cerrada`)
        }else{
            res.status(400).send(`No esta loggeado`)
        }
    }catch (error) {
        res.status(500).send(`Ocurrio un error en Current, ${error}`)
    }

}*/


export const logoutUser = async (req, res, next) => {

    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({
                status: "error",
                message: 'No se proporcionó ninguna token de autenticación'
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                return res.status(401).json({
                    status: "error",
                    message: 'Token no válida'
                });
            }

            await modifyConnection(decodedToken.user.id,Date())

            res.clearCookie('jwt');
            res.status(200).json({
                status: "success",
                message: 'Sesión cerrada exitosamente' 
            });
        });
    } catch (error) {
        
        res.status(401).json({
            status: "error" 
        });
    }
};
