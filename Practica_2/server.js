import express from 'express'
import bodyParser from 'body-parser'
import { readFile, writeFile } from 'fs/promises'
import { constants } from 'buffer'

const PORT = 8080
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

/*
async function load(archivo) {
    const str = await readFile(archivo, 'utf8');
    const datos = JSON.parse(str);
    return datos;
}
*/
async function save(archivo, misDatos) {
    const str = JSON.stringify(misDatos);
    await writeFile(archivo, str, 'utf8');
}

app.get('/', (req, res) => {
    console.log("DIRECTORIO PRINCIPAL")
    const resultado = "CONECTADO"
    res.send(resultado)
})


//************************************ESPACIOS*********************************************/      
//const espacios = await load('espacios.json')

const str_room = await readFile('room.json', 'utf8');
const espacios = JSON.parse(str_room);
//------------------LISTAR ESPACIOS------------------------------------------------------


// Lista TODOS los espacios
app.get('/room/', (req, res) => {
    res.send({ espacios })
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
    const espacio_nuevo = { //Constante que crea los elementos a añadir
        id: rid,
        name: data_room.name
    }

    espacios.push(espacio_nuevo)// Con push() se introduce un nuevo elemento al array

    save('room.json', espacios)
    res.send('Espacio creado')
    console.log(espacios)
})


//------------------BORRAR ESPACIOS------------------------------------------------------

/*
app.delete('room/:rid', async (req, res) => {

}
)*/



/*****************************************************************************************/
/************************************USUARIOS*********************************************/
/*****************************************************************************************/

function user_answer(id, token) {
    this.id == id
    this.token == token
}

var min = 1111;
var max = 9999;


//------------------AÑADIR UN NUEVO USUARIO Y LOGIN------------------------------------

//const str_user = await readFile('user.json', 'utf8');
//const usuarios = JSON.parse(str_user);

app.post('/user', (req, res) => {
    const data_user = req.body
    const randomtoken = Math.floor(Math.random() * (max - min + 1) + min);

    var usuario_existe = usuarios.find(users => users.email == data_user.email)

    if (usuario_existe != null) {  //Si ya existía un usuario con ese e-mail, y la contraseña coincide, devolverá
        const id_token = {                                                            //el ID del usuario y un token que sustituye a la clave y permitirá autenticar al usuario
            ID: data_user.id,
            token: randomtoken
        }

        if (users.password == data_user.password) {
            console.log("Usuario correcto")
            res.send(id_token)
        }
        else {
            console.log("Usuario existe, contraseña incorrecta")
            res.status.send("Usurario existente pero contraseña errónea")
        }

    }
    // Pero si no existe, lo creara al añadirlo al user.json y devolvera el nuevo id y token
    else {
        const usuario_nuevo = { // Estructura del nuevo usuario que se creará con los datos dados por req.body
            email: data_user.email,
            password: data_user.password,
            ID: data_user.id,
            token: randomtoken
        }

        const id_token = {  //  Objeto que se devolverá con el ID y el token de autenticación del NUEVO USUARIO QUE HA SIDO CREADO
            ID: usuario_nuevo.ID,
            token: usuario_nuevo.token
        }


        console.log("Usuario nuevo creado con ID: " + id_token.ID + " y token de autenticación: " + id_token.token)
        usuarios.push(usuario_nuevo)
        save('user.json', usuarios)


        res.send({ id_token })
        console.log(id_token)


    }
})

//------------------ELIMINAR UN USUARIO------------------------------------------------

app.delete('/user/:uid', (req, res) => {
    const uid = req.params.uid  // ID del usuario dada por el cliente

    const posicion = users.findIndex(x => x.id == uid)
    if (posicion >= 0) {
        const usuarios_filtrados = usuarios.splice(posicion, 1)

        save('user.json', usuarios_filtrados)
        res.send('Exito')
    } else {
        res.send('No existe')
    }

})






/*****************************************************************************************/
/************************************RESERVAS*********************************************/
/*****************************************************************************************/


//------------------LISTAR RESERVAS DE UN ESPACIO-------------------------------------------

//const reservas = load('booking.js')
const str_booking = await readFile('booking.json', 'utf8');
const reservas = JSON.parse(str_booking);

app.put('/booking/room/:rid', (req, res) => {
    const rid = req.params.rid
    const espaciosreservados = espacios.filter((x, y) => x.id == y.rid)
    res.send({ espaciosfiltrados })
    console.log("-----------------------------------------------------------------------")
    console.log(espaciosfiltrados)
})


//------------------AÑADIR UNA RESERVA------------------------------------------------------

app.put('/booking/:rid/:uid', (req, res) => {
    const archivo = 'booking.json'
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

    save('booking.json', reserva)

    res.send('Reserva realizada')

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

