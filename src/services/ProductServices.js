import productModel from "../models/MongoDB/productModel.js";
import {faker} from "@faker-js/faker"

export const findProducts = async (params) => {
    try {

        let {limit,page,sort,category}=params

        if (limit||page||sort||category){

            if (category){
                if (sort==="1"||sort==="-1"){
                    return await productModel.paginate({category},{sort:{price:parseInt(sort)},limit:limit||10,page:page||1})
                }else{
                    return await productModel.paginate({category},{limit:limit||10,page:page||1})
                }
            }else{
                if (sort==="1"||sort==="-1"){
                    return await productModel.paginate({},{sort:{price:parseInt(sort)},limit:limit||10,page:page||1})
                }else{
                    return await productModel.paginate({},{limit:limit||10,page:page||1})
                }
            }
        }
        else{
            return await productModel.paginate({},{limit:limit||10,page:page||1})
        }

    } catch (error) {
        throw new Error(error)
    }
}




export const findProductById = async (id) => {
    try {
        const product = await productModel.findById(id)
        
        if (product){
            return product
        } 
        return -1
    } catch (error) {
        throw new Error(error)
    }
}

export const findProductByCode = async (code) => {
    try {
        const product = await productModel.findOne({code:code}) 
        return product
    } catch (error) {
        throw new Error(error)
    }
}


export const createProduct = async (product) => {
    //Errores de datos a enviar a mi BDD
    try {
        const { title,description,code,price,status,stock,category,thumbnails } = product
        if (!title||!description||!code||!price||!stock||!category){
            return "Campos invalidos"
        }
        const productExists= await findProductByCode(code)
        if (productExists){
            return "Producto con este codigo ya existe"
        }
        const newproduct = await productModel(product)
        await newproduct.save()
        return newproduct
    } catch (error) {
        throw new Error(error)
    }
}


export const modifyProduct = async (idProduct, product,productsExistentes) => {
    const id  = idProduct
    const { title,description,code,price,status,stock,category,thumbnails } = product
    
    try {

        let productToAdd=undefined
        productsExistentes.forEach(product=>{ // checkeo que el id que ingresa exista en mi listado de productos
            if  (idProduct==product.id){
                productToAdd=idProduct
            }
        })  

        if (productToAdd){

            if (!title||!description||!code||!price||!stock||!category){
                return "Alguno de los campos requeridos es invalido. Fijese si ingreso todos los datos"
            }
        
            const productExists= await findProductByCode(code)

            if (productExists&&productExists.id!=idProduct){
                return "Error. Esta intentando utilizar un codigo ya utilizado por otro producto"
            }else{
                const product = await productModel.findByIdAndUpdate(id, {title,description,code,price,status,stock,category,thumbnails})
                if (product) {
                    return product
                }else{
                    return "Producto no encontrado"
                }
            }

        }else{
            return "Producto no existente"
        }
    } catch (error) {
        throw new Error(error)
    }

}


export const removeProduct = async (idProduct,productsExistentes) => {
    try {

        let productToAdd=undefined
        productsExistentes.forEach(product=>{ // checkeo que el id que ingresa exista en mi listado de productos
            if  (idProduct==product.id){
                productToAdd=idProduct
            }
        })  
        
        if (productToAdd){

            const product = await productModel.findByIdAndDelete(idProduct)
            if (product) {
                return product
            }
        }

        return -1
    } catch (error) {
        throw new Error(error)
    }
}
