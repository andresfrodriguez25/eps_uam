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
    res.send(espacios)
    console.log(espacios)
})

// Listar espacios dependiendo del Room ID
app.get('/room/:rid', (req, res) => {
    const rid = req.params.rid
    const espaciosfiltrados = espacios.filter((room) => room.id === rid)
    console.log("-----------------------------------------------------------------------")
    console.log(espaciosfiltrados)
    res.send(espaciosfiltrados)

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

    res.send("ESPACIO ASIGNADO")
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
    const uid = req.params.uid  // ID DEL USUARIO


    const usuario_existe = usuarios.find((user) => user.email.split("@")[0] == uid)
    const reserva_existe = reservas.find((booking) => booking.userID == uid)

    if ((usuario_existe != undefined)) {    // EXISTE USUARIO
        if (reserva_existe != undefined) {  // EXISTE USUARIO, Y EXISTE RESERVA (!= UNDEFINED) BORARREMOS USUARIO Y RESERVA
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

function isValidDate(dateObject) {
    return new Date(dateObject).toString() !== 'Invalid Date';
}

//var today = new Date();
var fecha = "2022-10-18T16:30:00Z"
var fecha_date = new Date(Date.parse(fecha))
console.log(fecha_date +
    "\nyear: " + fecha_date.getFullYear() +
    "\nmonth: " + fecha_date.getMonth() +
    "\nday: " + fecha_date.getDay() +
    "\nhour: " + fecha_date.getUTCHours() +
    "\nminute: " + fecha_date.getMinutes() +
    "\nUnixTime: " + fecha_date.getTime()) // segundos transcurridos desde 1/1/1970.

console.log("Fecha en formato ISO:  " + fecha_date.toISOString() + " es válida: " + isValidDate(fecha_date))

console.log(fecha_date)
console.log('¿FECHA VALIDA?: ' + isValidDate(fecha_date))


console.log('-------------------------------------------------------------------------')
var fecha_date2 = new Date(Date.parse("2020-12-29T18:00:00.000Z"))
console.log(fecha_date2)
console.log("Fecha invalida:    " + fecha_date2 + " es válida: " + isValidDate(fecha_date2))

console.log('¿FECHA VALIDA: ' + isValidDate(fecha_date2))


if(isValidDate("2022-12-32 13:30:00") == true){ //SI LA FECHA ES VÁLIDA
  
    console.log("Existen el espacio y el usuario. Reserva realizada con éxito")

}
else{
    console.log("La fecha no es valida")
}
app.put('/booking/:rid/:uid', (req, res) => {
    const rid = req.params.rid  // ROOM ID
    const uid = req.params.uid  // USER ID
    const data_booking = req.body   // FECHA Y HORAS

    const espacio_existe = espacios.find((room) => room.id == rid)  // COMPRUEBA SI ESPACIO EXISTE
    const usuario_existe = usuarios.find((user) => user.email.split("@")[0] == uid) // COMPRUEBA SI USUARIO EXISTE

    if (espacio_existe != undefined) {    //ESPACIO EXISTE
        if (usuario_existe != undefined) {    //USUARIO EXISTE
            //if(isValidDate(data_booking.date))

            if(isValidDate(data_booking.date) == true){ //SI LA FECHA ES VÁLIDA
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
            else{
                console.log("La fecha no es válida , modificar el formato")
            }
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



// const usuario_existe = usuarios.find((user) => user.email.split("@")[0] == 'user1')
// const espacio_existe = espacios.find((room) => room.id == '1')
// const reserva_existe = reservas.filter(x => x.roomID == 5 & x.userID == 'user4')

// const reservas_filtradas = reservas.filter((x) => (x.roomID != 5 || x.userID != 'user4'))


// console.table(reservas)

// console.table(reserva_existe)
// console.table(reservas_filtradas)

//------------------ELIMINAR TODAS LAS RESERVAS DE UN ASOCIADAS A UN USUARIO--------

app.delete('/booking/:rid/:uid', (req, res) => {
    const rid = req.params.rid
    const uid = req.params.uid

    const reservas_filtradas = reservas.filter((x) => (x.roomID != rid || x.userID != uid))

    save('booking.json', reservas_filtradas)
    console.log('BORRADAS LAS RESERVAS ASOCIADAS A RID: ' + rid + ' y UID: ' + uid)
    res.send('OK')

})

const server = app.listen(PORT, () => console.log("listening at localhost:" + PORT))

