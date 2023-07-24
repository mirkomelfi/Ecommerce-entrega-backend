import routerCart from "./cart.js";
import routerProduct from "./product.js";
import routerSession from "./session.js";
import routerUsers from "./users.js";
import { Router } from "express";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'
import __dirname from "../path.js";

const router = Router()


const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: "Doc de mi aplicacion",
            description: "Aqui iria la descripcion de mi proyecto"
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}
const specs = swaggerJSDoc(swaggerOptions)


router.use('/api/users', routerUsers)
router.use('/api/session', routerSession)
router.use('/api/products', routerProduct)
router.use('/api/carts', routerCart)
router.use("/apidocs",swaggerUiExpress.serve,swaggerUiExpress.setup(specs))


router.use('*', (req, res) => {
    res.status(404).send({ error: "404 No se encuentra la pagina solicitada" })
})

export default router
