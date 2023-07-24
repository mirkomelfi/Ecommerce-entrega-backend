import chai from "chai";
import mongoose from "mongoose";
import supertest from "supertest";
import 'dotenv/config.js'

const expect = chai.expect

const requester = supertest(process.env.DOMINIO_BACK) //Configuracion de la ruta inicial de mi app para testear

await mongoose.connect(process.env.MONGODBURL)

describe("Testing de la aplicacion Ecommerce", () => {
    let cookie = ""

        //Testing de Sesiones

        describe("Testing de la ruta de sessions", () => {
            
            it("Ruta: /api/session/register con el metodo POST", async function () {
                const newUser = {
                    first_name: "mirko",
                    last_name: "melfi",
                    email: "mirkomelfi123@gmail.com",
                    //rol: "Admin",
                    password: "coder",
                    age:32
                }

                const {statusCode}= await requester.post('/api/session/register').send(newUser)

                let ok=false
                if (statusCode===201||statusCode===401){
                    ok=true
                }

                expect(ok).to.be.ok
    
            })
    
             it("Ruta: /api/session/login con el metodo POST", async function () {
                const newUser = {
                    email: "mirkomelfi123@gmail.com",
                    password: "coder"
                }
    
                const result = await requester.post('/api/session/login').send(newUser)
                if (result.statusCode==200){
                    const cookieResult = result.headers['set-cookie'][0]
                    if (cookieResult){//Verificar existencia de cookie
                        cookie = {
                            name: cookieResult.split("=")[0],
                            value: cookieResult.split("=")[1],
                        }
            
                        expect(cookie.name).to.be.ok.and.equal('jwt') //Verificacion de nombre cookie
                        expect(cookie.value).to.be.ok //Verificion de valor correcto}
                    }
                }
                else{
                    expect(result.statusCode).to.be.ok.and.equal(401)
                }
    
            })
    
           it("Ruta: /api/session/current con el metodo GET", async function () {
                //.set() setear valores como si tratara de las cookies del navegador
                const { _body,statusCode } = await requester.get('/api/session/current').set('Cookie', [`${cookie.name}=${cookie.value}`])
                if (statusCode==200)expect(_body.payload._id).to.be.ok
                else{
                    expect(statusCode).to.be.ok.and.equal(401)
                }
            })

            it("Ruta: /api/session/logout con el metodo GET", async function () {
                //.set() setear valores como si tratara de las cookies del navegador
                const { _body,statusCode } = await requester.get('/api/session/logout').set('Cookie', [`${cookie.name}=${cookie.value}`])
                let ok=false
                if (statusCode==200||statusCode==401) ok=true
                expect(ok).to.be.ok
            })
    
    
        })

    describe("Testing de las rutas de productos", () => {

        //GET

        it("Ruta: /api/products con el metodo GET", async function () {

            const { statusCode, _body } = await requester.get('/api/products')

            expect(_body).to.be.ok
        })

        it("Ruta: /api/products/{pid} con el metodo GET", async function () {
            const pid = "647ce82bb34cfdf1b4005f30"
            const response = await requester.get(`/api/products/${pid}`)

            let ok=false
            if (response.statusCode===200||response.statusCode===400){
                ok=true
            }
            expect(ok).to.be.ok

        })

        //POST
        
        it("Ruta: /api/products con el metodo POST", async function () {
            //_body, StatusCode, Ok(true o false)
            const newProduct= {
                title:"Prod1",
                description:"desc1",
                code:"43gds232fsd",
                price:1111,
                stock:1111,
                category: "cat1"   
            }
            
            const { statusCode, _body } = await requester.post('/api/products').send(newProduct).set('Cookie', [`${cookie.name}=${cookie.value}`]) //requester.metodo(concatenacion de rutas)

            let ok=false
            if (statusCode===201||statusCode===401||statusCode===400){
                ok=true
            }
            expect(ok).to.be.ok

        })


        //PUT

        it("Ruta: /api/products/{pid} con el metodo PUT", async function () {
            const pid = "647ce94fd5b31ad0934c66"
            const updateProduct= {
                title:"Prod1",
                description:"desc1",
                code:"43gds232fsd",
                price:11000011,
                stock:1111,
                category: "cat1"   
            }
            const {statusCode,_body} = await requester.put(`/api/products/${pid}`).send(updateProduct).set('Cookie', [`${cookie.name}=${cookie.value}`])

            let ok=false
            if (statusCode===200||statusCode===400||statusCode===401){ // 401 por problema de roles (permisos)
                ok=true
            }
            expect(ok).to.be.ok
        })

        //DELETE
        it("Ruta: /api/products/{pid} con el metodo delete", async function () {
            const pid = "647ce94fd5b31ad0934c6604"

            const { statusCode, _body } = await requester.delete(`/api/products/${pid}`).set('Cookie', [`${cookie.name}=${cookie.value}`])

            let ok=false
            if (statusCode===200||statusCode===400||statusCode===401){ // 401 por problema de roles (permisos)
                ok=true
            }
            expect(ok).to.be.ok
        })

    })


    describe("Testing de las rutas de carts", () => {
        //get
        
        it("Ruta: /api/carts con el metodo GET", async function () {
            //_body, StatusCode, Ok(true o false)

            const { statusCode, _body } = await requester.get('/api/carts').set('Cookie', [`${cookie.name}=${cookie.value}`]) //requester.metodo(concatenacion de rutas)

            let ok=false
            if (statusCode===200||statusCode===400||statusCode===401){
                ok=true
            }
            expect(ok).to.be.ok

        })
        

        it("Ruta: /api/carts/product/{pid} con el metodo POST", async function () {
            //_body, StatusCode, Ok(true o false)
            const pid = "647ce94fd5b31ad0934c6604"

            const product= {
                quantity: 1
            }
            
            const { statusCode, _body } = await requester.post(`/api/carts/product/${pid}`).send(product).set('Cookie', [`${cookie.name}=${cookie.value}`]) //requester.metodo(concatenacion de rutas)
            
            let ok=false
            if (statusCode===200||statusCode===400||statusCode===401){
                ok=true
            }
            expect(ok).to.be.ok

        })

        it("Ruta: /api/carts/product/{pid} con el metodo PUT", async function () {
            //_body, StatusCode, Ok(true o false)
            const pid = "647ce94fd5b31ad0934c6604"

            const product= {
                quantity: 888 
            }
            
            const { statusCode, _body } = await requester.put(`/api/carts/product/${pid}`).send(product).set('Cookie', [`${cookie.name}=${cookie.value}`]) //requester.metodo(concatenacion de rutas)
            let ok=false
            if (statusCode===200||statusCode===400||statusCode===401){
                ok=true
            }
            expect(ok).to.be.ok

        })

        it("Ruta: /api/carts/ con el metodo PUT", async function () {
            //_body, StatusCode, Ok(true o false)

            const arrayProducts= [
                {
                    productId: "",
                    quantity: 8 
                },
                {
                    productId: "",
                    quantity: 4
                }
            ]
            
            const { statusCode, _body } = await requester.put(`/api/carts`).send(arrayProducts).set('Cookie', [`${cookie.name}=${cookie.value}`]) //requester.metodo(concatenacion de rutas)
            
            let ok=false
            if (statusCode===200||statusCode===400||statusCode===401){
                ok=true
            }
            expect(ok).to.be.ok

        })

        //purchase

        it("Ruta: /api/carts con el metodo POST", async function () {
            const { statusCode, _body } = await requester.post(`/api/carts`).set('Cookie', [`${cookie.name}=${cookie.value}`]) //requester.metodo(concatenacion de rutas)
            
            let ok=false
            if (statusCode===200||statusCode===400||statusCode===401){
                ok=true
            }
            expect(ok).to.be.ok

        })

        it("Ruta: /api/carts/product/{pid} con el metodo DELETE", async function () {
            //_body, StatusCode, Ok(true o false)
            const pid = "647ce94fd5b31ad0934c6604"
            
            const { statusCode, _body } = await requester.delete(`/api/carts/product/${pid}`).set('Cookie', [`${cookie.name}=${cookie.value}`]) //requester.metodo(concatenacion de rutas)
            
            let ok=false
            if (statusCode===200||statusCode===400||statusCode===401){
                ok=true
            }
            expect(ok).to.be.ok

        })

        it("Ruta: /api/carts con el metodo DELETE", async function () {
            //_body, StatusCode, Ok(true o false)
            
            const { statusCode, _body } = await requester.delete(`/api/carts`).set('Cookie', [`${cookie.name}=${cookie.value}`]) //requester.metodo(concatenacion de rutas)
            
            let ok=false
            if (statusCode===200||statusCode===400||statusCode===401){
                ok=true
            }
            expect(ok).to.be.ok

        })

    })



})