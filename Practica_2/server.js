import express from 'express'
import bodyParser from 'body-parser'
import { readFile, writeFile } from 'fs/promises'

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

// const existe_email = usuarios.find((users) => users.email == "123@gmail.com")
// const id = existe_email.email.split("@")

// console.log(existe_email)
// console.log(id[0])

app.post('/user', (req, res) => {
    const data_user = req.body
    const randomtoken = Math.floor(Math.random() * (9999 - 1111 + 1) + 1111);
    const existe_email = usuarios.find((users) => users.email == data_user.email)

    if (existe_email != undefined) {   // SI EXISTE EMAIL
        const id = existe_email.email.split("@")
        if (existe_email.password === data_user.password) {   //COINCIDE EMAIL Y PASSWORD

            const respuesta = {
                id: id[0],
                token: randomtoken
            }
            console.log("--------------------------------------------------------------------")
            console.log("USUARIO CORRECTO")
            console.log(respuesta)
        }
        else {   // COINCIDE EMAIL PERO NO PASSWORD
            console.log("--------------------------------------------------------------------")
            console.log("EMAIL CORRECTO PERO CONTRASEÑA INCORRECTA")
        }
    }
    else { //NO EXISTE EMAIL == NO EXISTE USUARIO
        const id = data_user.email.split("@")

        const nuevo_usuario = {
            email: data_user.email,
            password: data_user.password
        }
        const respuesta = {
            id: id[0],
            token: randomtoken
        }

        usuarios.push(nuevo_usuario)

        save('user.json', usuarios)
        console.log("--------------------------------------------------------------------")
        console.log("USUARIO CREADO")
        console.log(respuesta)
    }
    res.send("OK")
})

//------------------ELIMINAR UN USUARIO------------------------------------------------

// const usuario_existe = usuarios.find((user) => user.email.split("@")[0] == 123)
// const reserva_existe = reservas.find((booking) => booking.userID == 123)

// console.table(usuario_existe)
// console.table(reserva_existe)


app.delete('/user/:uid', (req, res) => {
    const uid = req.params.uid  // ID DEL USUARIO   123


    const usuario_existe = usuarios.find((user) => user.email.split("@")[0] == uid)
    const reserva_existe = reservas.find((booking) => booking.userID == uid)

    if ((usuario_existe != undefined)) {    // EXISTE ESPACIO
        if (reserva_existe != undefined) {  // EXISTE ESPACIO, Y EXISTE RESERVA (!= UNDEFINED) BORARREMOS ESPACIO Y RESERVA
            const usuariosfiltrados = usuarios.filter((user) => user.email.split("@")[0] != uid)
            const reservasfiltradas = reservas.filter((booking) => booking.userID != uid)

            save('user.json', usuariosfiltrados)
            save('booking.json', reservasfiltradas)
            console.log("ID COMPARTE USUARIO Y RESERVA")

        } else {                            // EXISTE USUARIO, NO EXISTE RESERVA (== UNDEFINED) BORRAREMOS USUARIO

            const usuariosfiltrados = usuarios.filter((user) => user.email.split("@")[0] != uid)
            save('user.json', usuariosfiltrados)
            console.log("SOLO BORRADO USUARIO, NO EXISTÍA RESERVA")
        }
    }
    else {                                   // NO EXISTE USUARIO
        console.log("NO EXISTE UN USUARIO ASOCIADO AL ID DADO")
    }

    res.send('OK')


})


/*****************************************************************************************/
/************************************RESERVAS*********************************************/
/*****************************************************************************************/


//------------------LISTAR RESERVAS DE UN ESPACIO-------------------------------------------


app.get('/booking/room/:rid', (req, res) => {
    const rid = req.params.rid
    const reserva_existe = reservas.filter((booking) => booking.roomID === rid)

    console.log(reserva_existe)
    res.send({ reserva_existe })

})


//------------------AÑADIR UNA RESERVA------------------------------------------------------


app.put('/booking/:rid/:uid', (req, res) => {
    const rid = req.params.rid  // ROOM ID
    const uid = req.params.uid  // USER ID
    const data_booking = req.body   // FECHA Y HORAS

    const espacio_existe = espacios.find((room) => room.id == rid)  // COMPRUEBA SI ESPACIO EXISTE
    const usuario_existe = usuarios.find((user) => user.email.split("@")[0] == uid) // COMPRUEBA SI USUARIO EXISTE

    if (espacio_existe != undefined) {    //ESPACIO EXISTE
        if (usuario_existe != undefined) {    //USUARIO EXISTE
            const reserva_nueva = {
                roomID: rid,
                userID: uid,
                Fecha: data_booking.date,
                Horas: data_booking.hours
            }
            console.log("Existen el espacio y el usuario. Reserva realizada con éxito")
            reservas.push(reserva_nueva)
            save('booking.json', reservas)
        }
        else {  //USUARIO NO EXISTE
            console.log("Existe el espacio, pero no el usuario. Por favor, registrese antes de reservar")
        }

    }
    else {   //ESPACIO NO EXISTE
        console.log("No existe ningún espacio asociado a este Room ID")
    }
    res.send('OK')

})


//------------------ELIMINAR TODAS LAS RESERVAS DE UN ASOCIADAS A UN USUARIO--------

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

