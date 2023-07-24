import ticketModel from "../models/MongoDB/ticketModel.js";
import nodemailer from 'nodemailer'

let transporter = nodemailer.createTransport({ //Genero la forma de enviar info desde mail (o sea, desde Gmail con x cuenta)
    host: 'smtp.gmail.com', //Defino que voy a utilizar un servicio de Gmail
    port: 465,
    secure: true,
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user: "mirkomelfi123@gmail.com", //Mail del que se envia informacion
        pass: "qpeokphyvruqpkrz",
        authMethod: 'LOGIN'
    }

})


export const findTickets = async () => {

    try {
        const tickets = await ticketModel.find()
        return tickets
    } catch (error) {
        throw new Error(error)
    }
}


export const findTicketById = async (id) => {
    try {
        const ticket = await ticketModel.findById(id)
        return ticket
    } catch (error) {
        throw new Error(error)
    }
}

export const createTicket = async (cart,email) => {
    try {
        const tickets = await ticketModel.find()
        
        const cantTickets=tickets.length
        const products=cart.products
        let total=0

        products.forEach(product => (total= total+product.subtotal))

        const ticket={
            code: cantTickets+1,
            purchase_datetime: new Date(),//.toString()
            amount: total,
            purchaser: email
        }

        const newTicket = await ticketModel(ticket)
        
        await newTicket.save()
        
        await transporter.sendMail({
            from: 'Test Coder mirkomelfi123@gmail.com',
            to: email,
            subject: "Mail de su compra",
            html: `
                <div>
                    <h2>Codigo de ticket: ${ticket.code} </h2>
                    <h2>Monto total: ${ticket.amount} </h2>
                </div>
            `,
            attachments: []
        })
        
        return newTicket

    } catch (error) {
        throw new Error(error)
    }
}