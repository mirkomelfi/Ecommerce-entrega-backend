import 'dotenv/config.js'
import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import router from './routes/index.js'
import passport from 'passport'
import initializePassport from './config/passport.js'
import cors from 'cors'
import mercadopago from 'mercadopago'
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'
import errorHandler from "./services/errors/index.js"
import { addLogger } from './utils/logger.js'
import __dirname from './path.js'

const PORT = process.env.PORT || 4000
const whiteList = [process.env.DOMINIO_FRONT] //Rutas validas a mi servidor

const corsOptions = { //Reviso si el cliente que intenta ingresar a mi servidor esta o no en esta lista
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1||!origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by Cors'))
        }
    },
    credentials:true
}

const app = express()

// REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel



app.use(express.json())
app.use(cors(corsOptions))

const connectionMongoose = async () => {
    await mongoose.connect(process.env.MONGODBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .catch((err) => console.log(err));
}

connectionMongoose()

app.use(cookieParser(process.env.JWT_SECRET))
app.use(passport.initialize())
initializePassport(passport)

app.use(addLogger)

app.use("/", router)
//app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Server on port 4000`)
})



