import { addProductToCart,checkStock,deleteElementsCart,deleteProductCart,findCartById,findCarts,addProductToCartTESTSer, updateProductsCartSER } from "../services/CartServices.js"
import { findProductById, findProducts } from "../services/ProductServices.js"
import { createTicket } from "../services/TicketServices.js"
import { currentUser, findUserById, findUsers } from "../services/UserServices.js"


export const getCart= async (req, res) => {
    try {
        const user= req.user//await currentUser(req)
        if (user!=-1){
            const cart= await findCartById(user.idCart)

            if (cart!=-1){
                res.status(200).json({
                    status:200,
                    cart:cart
                })

            }else{
                res.status(400).send("No encuentra el carrito")
            }
           
        }else{
            res.status(401).json({
                message: "No esta loggeado",
            }) 
        }


    } catch (error) {
        req.logger.fatal("No encuentra los carts")
        res.status(500).send(error)
    }

}


export const updateProductCart = async (req, res) => {
    try {
        //idCart,idProduct,quantity
        console.log("addProductCart")
        const user = req.user//await currentUser(req)
        const products= await findProducts()

        const {pid}= req.params
        const {quantity}= req.body

        const cart = await addProductToCart(user.idCart,products,pid,quantity)

        if (cart!=-1){
            
        res.status(200).json({
            message: "Carrito actualizado",
        })
        }else{
            res.status(400).json({
                message: "El ID del producto ingresado no existe",
            })
        }


    } catch (error) {
        res.status(500).send(error)
    }

}

export const addProductCart = async (req, res) => {
    try {
        //idCart,idProduct,quantity
        

        const {pid}= req.params

        const products= await findProducts()

        const user = req.user//await currentUser(req)

        const cart = await addProductToCartTESTSer(user.idCart,products,pid)
        if (cart!=-1){
            res.status(200).json({
                message: "Producto agregado al carrito",
            })
        }else{
            res.status(400).json({
                message: "El ID del producto ingresado no existe",
            })
        }

    } catch (error) {
        res.status(500).send(error)
    }

}

export const updateProductsCart = async (req, res) => {
    try {
        //idCart,idProduct,quantity

        const user = req.user//await currentUser(req)
        const products= await findProducts()
        const newCart=req.body
        
        if (! Array.isArray(newCart)){

            return res.status(401).json({
                message: "Se solicita array de objetos cuyos atributos sean: productId y quantity",
            })
        }
        const cart = await updateProductsCartSER(user.idCart,products,newCart)
        if (cart==-1){
            res.status(401).json({
                message: "No se realizaron cambios en el carrito. Fijese si los datos ingresados son validos (Se solicita array de objetos cuyos atributos sean: productId y quantity)",
            })
        }else{
            res.status(200).json({
                message: "Carrito actualizado",
            })
        }

    } catch (error) {
        res.status(500).send(error)
    }

}



export const finalizarCompra = async (req, res) => {
    const user =  req.user//await currentUser(req)
    try {
        const [cartFinal,cartCancelado] = await checkStock(user.idCart)

        if (cartFinal.products.length!==0){

            const ticket= await createTicket(cartFinal,user.email)


            await deleteElementsCart(user.idCart)

            if (cartCancelado.length!==0){
                res.status(200).json({
                    message: "Carrito comprado, pero algunos productos no contaban con stock",
                    ticket_generado:ticket,
                    cart_comprado: cartFinal.products,
                    cart_sin_stock:cartCancelado
                })
            }else{
                res.status(200).json({
                    message: "Carrito comprado",
                    ticket_generado:ticket,
                    cart_comprado: cartFinal.products
                })
            }
        }else{
            res.status(400).json({
                message: "No se pudo realizar la compra, chequee si agreggo productos al carrito o si los productos agregados cuentan con stock suficiente",
            })
        }

    } catch (error) {
        res.status(500).send(error)
    }

}


export const removeProductCart = async (req, res) => {
    try {
        const user = req.user//await currentUser(req)
        if (user!=-1){
            const products= await findProducts()
            const {pid}= req.params

            const cart = await deleteProductCart(user.idCart,products,pid)

            if (cart!=-1){
                res.status(200).json({
                    message: "Producto eliminado del carrito",
                })
            }else{
                res.status(400).json({
                    message: "No se pudo eliminar del carrito",
                })
            }
        }else{
            res.status(400).json({
                message: "No esta loggeado",
            })
        }

    } catch (error) {
        res.status(500).send(error)
    }

}


export const emptyCart = async (req, res) => {
    try {
        const user =  req.user//await currentUser(req)
        if (user!=-1){
            const cart = await deleteElementsCart(user.idCart)
            if (cart){
                res.status(200).json({
                    message: "Carrito vaciado correctamente",
                })
            }else{
                res.status(400).json({
                    message: "No se pudo vaciar el carrito",
                })
            }
        }else{
            res.status(400).json({
                message: "No esta loggeado",
            })
        }
    } catch (error) {
        res.status(500).send(error)
    }

}