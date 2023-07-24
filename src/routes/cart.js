import { Router } from "express";
import { emptyCart, finalizarCompra,getCart, removeProductCart,addProductCart, updateProductCart, updateProductsCart } from "../controllers/cart.js";
import { passportError } from "../middlewares/passportError.js";
import { roleValidation } from "../middlewares/autenticateRol.js";

const routerCart = Router()

routerCart.get("/", passportError("jwt"),roleValidation(["User"]),getCart)


routerCart.post("/product/:pid", passportError("jwt"),roleValidation(["User"]), addProductCart) // agrega de a 1
routerCart.put("/product/:pid", passportError("jwt"),roleValidation(["User"]), updateProductCart) // reemplaza la cantidad del producto ingresado por la nueva
routerCart.put("/", passportError("jwt"),roleValidation(["User"]), updateProductsCart) // reemplaza todas las cantidades de los productos ingresados por las nuevas
routerCart.post("/", passportError("jwt"),roleValidation(["User"]), finalizarCompra)


routerCart.delete("/product/:pid",passportError("jwt"),roleValidation(["User"]),removeProductCart)
routerCart.delete("/",passportError("jwt"),roleValidation(["User"]), emptyCart)




export default routerCart