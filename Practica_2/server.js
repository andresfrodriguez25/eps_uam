import express from 'express'
import bodyParser from 'body-parser'

const PORT = 8080
const app = express()

app.use(bodyParser.json())
     app.use(bodyParser.urlencoded({ extended: false }))
     app.get('/', (req, res) => {
         res.send('Hello World I am running locally')
         //Importante: Ejecutar res.send siempre para poder
         //completar la petición, y no dejar la conexión pendiente,
         //incluso si no se quiere enviar nada de vuelta
})
app.get('/room',(id,nm)=>   {


}

)

app.put('/booking/:rid/:uid', (req, res) => {
    const uid = req.params.uid // id usuario
    const rid = req.params.rid // id espacio
    const data = req.body
    // data será un objeto JS, no hace falta parsearlo
    // y tendrá los datos que envió el cliente
    // .... resto de código de la función
    res.send(resultado) // devolvemos resultado al cliente
})

app.post('/user',(user,login))
const server = app.listen(PORT, () => console.log("listening at localhost:"+PORT))