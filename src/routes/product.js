import { Router } from "express";
import { deleteProduct, updateProduct, addProduct, getProducts, getProductById} from "../controllers/products.js";
import { passportError } from "../middlewares/passportError.js";
import { roleValidation } from "../middlewares/autenticateRol.js";


const routerProduct = Router()

routerProduct.get("/", getProducts)
routerProduct.get("/:id", getProductById)

routerProduct.post("/", passportError("jwt"),roleValidation(["Admin"]), addProduct)
routerProduct.put("/:id", passportError("jwt"),roleValidation(["Admin"]), updateProduct)
routerProduct.delete("/:id", passportError("jwt"),roleValidation(["Admin"]), deleteProduct)



export default routerProduct