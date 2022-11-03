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
    const espacio_nuevo = {
        //Constante que crea los elementos a añadir
        id: rid,
        name: data_room.name
    }

    res.send("ESPACIO ASIGNADO")
    espacios.push(espacio_nuevo)// Con push() se introduce un nuevo elemento al array
    save('room.json', espacios)
    console.log(espacios)

})


//------------------BORRAR ESPACIOS------------------------------------------------------




/*****************************************************************************************/
/************************************USUARIOS*********************************************/
/*****************************************************************************************/

//------------------LISTAR USUARIOS----------------------------------------------------
app.get('/user', (req, res) => {
    res.send(usuarios)
})

app.get('/user/:email',(req,res) => {
    const email = req.params.email
    const infousuario = usuarios.filter((user) => user.email == email)
    res.send(infousuario)
})
//------------------AÑADIR UN NUEVO USUARIO Y LOGIN------------------------------------


app.post('/user', (req, res) => {
    const data_user = req.body
    const randomtoken = Math.floor(Math.random() * (9999 - 1111 + 1) + 1111);

    var email_existe = usuarios.find((users) => users.email == data_user.email)


    for (let i = 0; i < usuarios.length; i++) {
        if ((usuarios[i].email == data_user.email) & (usuarios[i].password == data_user.password)) {

            /*    if (usuarios[i].password == data_user.password) {
                console.log("El usuario con email: " + data_user.email + " existe")
                const respuesta = {
                    id: data_user.id,
                    token: randomtoken
                }

                console.log("ID USUARIO: "+respuesta.id + " Y TOKEN DE AUTENTICACIÓN: "+respuesta.token)
                return
            }
            else {
                console.log("EMAIL VÁLIDO, PRUEBE CON OTRA CONTRASEÑA")
            }
            */
            console.log("El usuario existe")
            const respuesta = {
                id: data_user.id,
                token: randomtoken
            }

            console.log("ID USUARIO: "+respuesta.id + " Y TOKEN DE AUTENTICACIÓN: "+respuesta.token)
            return
        }
        else {
            const nuevo_usuario = {
                email: data_user.email,
                password: data_user.password,
                respuesta: {
                    ID: data_user.id,
                    token: randomtoken
                }

            }
            console.log(nuevo_usuario.respuesta)
            usuarios.push(nuevo_usuario)
            save('user.json', usuarios)
            return
        }

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

