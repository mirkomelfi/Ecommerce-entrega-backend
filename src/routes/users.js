import { Router } from 'express'
import { deleteInactiveUsers, getUsers,updateRol ,getUserById,removeUser} from "../controllers/user.js";
import { passportError } from "../middlewares/passportError.js";
import { roleValidation } from "../middlewares/autenticateRol.js";


const routerUsers = Router()

routerUsers.get('/', passportError("jwt"),roleValidation(["Admin"]), getUsers)
routerUsers.get('/:id', passportError("jwt"),roleValidation(["Admin"]), getUserById)
routerUsers.put('/:id',passportError("jwt"),roleValidation(["Admin"]), updateRol)
routerUsers.delete('/',passportError("jwt"),roleValidation(["Admin"]), deleteInactiveUsers)
routerUsers.delete('/:id',passportError("jwt"),roleValidation(["Admin"]), removeUser)


export default routerUsers
