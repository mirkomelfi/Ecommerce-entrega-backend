import { createUser, findUserByEmail,findUserById } from "../services/UserServices.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { createProduct, modifyProduct, removeProduct, findProducts, findProductById} from "../services/ProductServices.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateProductErrorInfo } from "../services/errors/info.js";


export const addProduct = async (req,res) => {
    console.log("llego al conroller addprod")
    const {title,description,code,price,status,stock,category,thumbnails}= req.body
    //Errores de datos a enviar a mi BDD
    try {
/*
        if (!title||!description||!code||!price||!stock||!category||!thumbnails){
            /*CustomError.createError({
                name:"Product creation error",
                cause:generateProductErrorInfo ({title,description,code,price,status,stock,category,thumbnails}),
                message:"Error Trying to create Product",
                code:EErrors.INVALID_TYPES_ERROR
            })
        }*/

        const newProduct = await createProduct(req.body)
        if (typeof newProduct==='object'){
            res.status(200).json({
                message: "Producto añadido correctamente"
            })
        }else{
            return res.status(400).json({
                message: newProduct
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


export const updateProduct = async (req, res) => {
    const { id } = req.params
    const product = req.body
    
    try {
        const products= await findProducts()

        const newProduct = await modifyProduct(id, product, products)

        if (typeof newProduct==='object') {
            return res.status(200).json({
                message: "Producto actualizado"
            })
        }else{
            res.status(400).json({
                message: newProduct
            })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}


export const deleteProduct = async (req, res) => {
    const { id } = req.params

    if (!id){
        req.logger.warning("No se ingreso un id")
    }

    try {

        const products= await findProducts()

        const product = await removeProduct(id,products)
        
        if (product!=-1) {
            return res.status(200).json({
                message: "Producto eliminado"
            })
        }else{
            res.status(400).json({
                message: "Producto no encontrado"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}




export const getProducts = async (req, res) => {
    try {
        
        const products = await findProducts(req.query)

        if (products.length!==0){
            res.status(200).send(products) 
        }else{
            res.status(400).send("No hay productos")
        }

    } catch (error) {
        res.status(500).send(error)
    }

}

export const getProductById = async (req, res) => {
    const {id}=req.params
    try {
        const product = await findProductById(id)
        if (product!=-1){
            return res.status(200).send({message:product}) 
        }else{
            return res.status(400).send({message:"Producto no existente"})
        }
      

    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }

}