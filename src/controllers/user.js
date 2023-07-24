import { findUsers, createUser, deleteUsers,modifyRol, findUserById,deleteUser } from "../services/UserServices.js";

export const getUsers = async (req, res) => {
    try {
        const users = await findUsers()
        res.status(200).send(users)

    } catch (error) {
        res.status(500).send(error)
    }
}

export const getUserById = async (req, res) => {
    const { id } = req.params
    try {
        const user= await findUserById(id)
        if (user){
            res.status(200).send(user)
        }
        res.status(400).send({message:"User not found",status:400})

    } catch (error) {
        res.status(500).send(error)
    }
}

export const updateRol = async (req, res) => {
    const { id } = req.params
    const rol = req.body
    
    try {
        console.log(rol)
        const userUpdated= await modifyRol(id, rol.rol)

        if (userUpdated!=-1) {
            return res.status(200).json({
                message: "Rol actualizado"
            })
        }else{
            res.status(400).json({
                message: userUpdated
            })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}

export const deleteInactiveUsers = async (req, res) => {
    try {
        const users = await findUsers()
        const deletedUsers= await deleteUsers(users)
        
        if (deletedUsers.length!=0){
            res.status(200).send({
                message: "Usuarios eliminados",
                usuarios_eliminados: deletedUsers
            })
        }else{
            res.status(400).send({
                message: "No hay usuarios para eliminar"
            })
        }

    } catch (error) {
        res.status(500).send(error)
    }
}


export const removeUser= async (req, res) => {
    const { id } = req.params
    try {
        const deletedUser= await deleteUser(id)
        
        if (deletedUser){
            res.status(200).send({
                message: "Usuario eliminado",
            })
        }else{
            res.status(400).send({
                message: "No se encuentra el usuario que desea eliminar"
            })
        }

    } catch (error) {
        res.status(500).send(error)
    }
}



