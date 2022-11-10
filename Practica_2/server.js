import express from 'express'
import bodyParser from 'body-parser'
import { readFile, writeFile } from 'fs/promises'
import e from 'express'
import { executionAsyncResource } from 'async_hooks'

const PORT = 8080
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


async function load(archivo) {
    const str = await readFile(archivo, 'utf8');
    const datos = JSON.parse(str);
    return datos;
}

async function save(archivo, misDatos) {
    const str = JSON.stringify(misDatos);
    await writeFile(archivo, str, 'utf8');
}

app.get('/', (req, res) => {
    console.log("DIRECTORIO PRINCIPAL")
    const resultado = "CONECTADO"
    res.send(resultado)
})

// CARGA DE FICHEROS

const espacios = await load('room.json')
const usuarios = await load('user.json')
const reservas = await load('booking.json')



//************************************ESPACIOS*********************************************/      
//------------------LISTAR ESPACIOS------------------------------------------------------


// Lista TODOS los espacios
app.get('/room/', (req, res) => {
    //res.send({espacios }

    readFile('room.json').then(resultado => res.send(resultado))
})

// Listar espacios dependiendo del Room ID
app.get('/room/:rid', (req, res) => {
    const rid = req.params.rid

    const espaciosfiltrados = espacios.filter((lambda) => lambda.id == rid)
    res.send({ espaciosfiltrados })
    console.log("-----------------------------------------------------------------------")
    console.log(espaciosfiltrados)


})

//------------------ASIGNAR ESPACIOS-----------------------------------------------------



app.put('/room/:rid', (req, res) => {
    const rid = req.params.rid
    const data_room = req.body
    const espacio_nuevo = {// CONSTRUCTOR DE NUEVOS USUARIOS CON ID Y NAME DADOS POR EL CLIENTE
        id: rid,
        name: data_room.name
    }
    const i_coincidencia = espacios.findIndex((room) => room.id == rid)// POSICION DEL ESPACIO SI HAY UNA COINCIDENCIA

    if (i_coincidencia != -1) {
        espacios[i_coincidencia] = espacio_nuevo
        save('room.json', espacios)
        console.log("ID EXISTIA")

    }
    else {
        espacios.push(espacio_nuevo)
        save('room.json', espacios)
        console.log("NO EXISTIA")
    }

    res.send("OK")
})




//------------------BORRAR ESPACIOS------------------------------------------------------

app.delete('/room/:rid', (req, res) => {
    const rid = req.params.rid
    const espacio_existe = espacios.find((room) => room.id == rid)
    const reserva_existe = reservas.find((booking) => booking.roomID == rid)

    if ((espacio_existe != undefined)) {    // EXISTE ESPACIO
        if (reserva_existe != undefined) {  // EXISTE ESPACIO, Y EXISTE RESERVA (!= UNDEFINED) BORARREMOS ESPACIO Y RESERVA
            const espaciosfiltrados = espacios.filter((room) => room.id != rid)
            const reservasfiltradas = reservas.filter((booking) => booking.roomID != rid)

            save('room.json', espaciosfiltrados)
            save('booking.json', reservasfiltradas)
            console.log("ID COMPARTE ESPACIO Y RESERVA")

        } else {                            // EXISTE ESPACIO, NO EXISTE RESERVA (== UNDEFINED) BORRAREMOS ESPACIO

            const espaciosfiltrados = espacios.filter((room) => room.id != rid)
            save('room.json', espaciosfiltrados)
            console.log("SOLO BORRADO ESPACIO, NO EXISTÍA RESERVA")
        }
    }
    else {                                   // NO EXISTE ESPACIO
        console.log("NO EXISTE UN ESPACIO ASOCIADO AL ID DADO")
    }

    res.send('OK')

})



/*****************************************************************************************/
/************************************USUARIOS*********************************************/
/*****************************************************************************************/

//------------------LISTAR USUARIOS----------------------------------------------------
app.get('/user', (req, res) => {
    res.send(usuarios)
})

app.get('/user/:email', (req, res) => {
    const email = req.params.email
    const infousuario = usuarios.filter((user) => user.email == email)
    res.send(infousuario)
})
//------------------AÑADIR UN NUEVO USUARIO Y LOGIN------------------------------------

const existe_email = usuarios.find((users) => users.email == "123@gmail.com")
const id = existe_email.email.split("@")

console.log(existe_email)
console.log(id[0])

app.post('/user', (req, res) => {
    const data_user = req.body
    const randomtoken = Math.floor(Math.random() * (9999 - 1111 + 1) + 1111);
    const existe_email = usuarios.find((users) => users.email == data_user.email)
    const id = existe_email.email.split("@")

    if (existe_email != null) {   // SI EXISTE EMAIL

        if(existe_email.password === data_user.password){

        }
        else{
            console.log("EMAIL CORRECTO PERO CONTRASEÑA INCORRECTA")
        }
        // if ((existe_email.email === data_user.email) & (existe_email.password === data_user.password)) { // COINCIDE CONTRASEÑA
        //     const respuesta = {
        //         id: id[0],
        //         token: randomtoken
        //     }
        //     console.log(respuesta)
        // }
       

    }
    else{ //NO EXISTE EMAIL

    }
    res.send("OK")
})

//------------------ELIMINAR UN USUARIO------------------------------------------------

app.delete('/user/:uid', (req, res) => {
    const uid = req.params.uid  // ID del usuario dada por el cliente
    const existencia = (x) => x.id == uid
    const posicion = usuarios.findIndex(existencia)


})






/*****************************************************************************************/
/************************************RESERVAS*********************************************/
/*****************************************************************************************/


//------------------LISTAR RESERVAS DE UN ESPACIO-------------------------------------------

app.get('/booking', (req, res) => {
    res.send(reservas)
    console.log(reservas)
})
app.get('/booking/room/:rid', (req, res) => {
    const rid = req.params.rid
    const espaciosreservados = espacios.filter((x, y) => x.id == rid)
    res.send({ espaciosfiltrados })
    console.log("-----------------------------------------------------------------------")
    console.log(espaciosfiltrados)
})


//------------------AÑADIR UNA RESERVA------------------------------------------------------

app.put('/booking/:rid/:uid', (req, res) => {
    const rid = req.params.rid
    const uid = req.params.uid
    const data = req.body

    const reserva = {
        roomID: rid,
        userID: uid,
        Fecha: data.date,
        Horas: data.hours
    }

    reservas.push(reserva)

    save('booking.json', reservas)

    res.send('Reserva realizada')

    console.log(reservas)

})



//------------------ELIMINAR TODAS LAS RESERVAS DE UN ESPACIO ASOCIADAS A UN USUARIO--------

app.delete('/booking/:rid/:uid', (req, res) => {
    const rid = req.params.rid
    const uid = req.params.uid
    const roomID = reservas.roomID
    const userID = reservas.userID

    const reservas_filtradas = reservas.filter((x) => (x.uid != userID))

    save('booking.json', reservas_filtradas)
    res.send(reservas_filtradas)

})

const server = app.listen(PORT, () => console.log("listening at localhost:" + PORT))

