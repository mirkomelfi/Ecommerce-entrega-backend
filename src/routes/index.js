import routerCart from "./cart.js";
import routerProduct from "./product.js";
import routerSession from "./session.js";
import routerUsers from "./users.js";
import { Router } from "express";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'
import __dirname from "../path.js";
import mercadopago from "mercadopago";
const router = Router()
mercadopago.configure({
	access_token: "TEST-6145854761539976-011322-8f066c178639618446668d0e650bb426-20214640",
});

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

router.post("/create_preference", (req, res) => {
    console.log(req.body)
	let preference = {
		items: [
			{
				title: req.body[0].productId.title,
				unit_price: req.body[0].productId.price,
				quantity: req.body[0].quantity,
			}
		],
		back_urls: {
			"success": "http://localhost:4000/feedback",
			"failure": "http://localhost:4000/feedback",
			"pending": "http://localhost:4000/feedback"
		},
		auto_return: "approved",
	};

	mercadopago.preferences.create(preference)
		.then(function (response) {
			res.json({
				id: response.body.id
			});
		}).catch(function (error) {
			console.log(error);
		});
});

router.get('/feedback', function (req, res) {
	res.json({
		Payment: req.query.payment_id,
		Status: req.query.status,
		MerchantOrder: req.query.merchant_order_id
	});
});


router.use('*', (req, res) => {
    res.status(404).send({ error: "404 No se encuentra la pagina solicitada" })
})

export default router
