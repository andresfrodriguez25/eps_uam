import axios from 'axios'
import { readFile, writeFile } from 'fs/promises'

const server = 'http://localhost:8080'


// FUNCIONES DE CARGAR UN ARCHIVO Y GUARDAR EN UN ARCHIVO
async function load(archivo) {
    const str = await readFile(archivo, 'utf8');
    const datos = JSON.parse(str);
    return datos;
}
async function save(archivo, misDatos) {
    const str = JSON.stringify(misDatos)
    await writeFile(archivo, str, 'utf8')
}

//await axios.get(server + '/room')
console.log("Cliente ejecutado")

/*****************************************************************************************/
/************************************ESPACIOS*********************************************/
/*****************************************************************************************/
const info = process.argv.slice(2)


//------------------LISTAR ESPACIOS------------------

//const rid = process.argv.slice(2)
//await axios.get(server + '/room/' )

//await axios.get(server + '/room/' + info)


//------------------ASIGNAR ESPACIOS-----------------
function room(name) {
    this.name = name;
}

const espacio1 = new room("Baño")

// await axios.put(server + '/room/' + info, espacio1)

//------------------BORRAR ESPACIOS------------------------------------------------------

//await axios.delete(server + '/room/'+info)

/*****************************************************************************************/
/************************************USUARIOS*********************************************/
/*****************************************************************************************/

function user(email, password, id) {
    this.email = email
    this.password = password
}

//------------------LISTAR USUARIOS----------------------------------------------------

//await axios.get(server + '/user/' + info)

//------------------AÑADIR UN NUEVO USUARIO Y LOGIN------------------------------------
const usuario1 = new user("pablito29@gmail.com", "12383")
//await axios.post(server + '/user', usuario1)


//------------------ELIMINAR UN USUARIO------------------------------------------------

//await axios.delete(server +'/user/'+info)


/*****************************************************************************************/
/************************************RESERVAS*********************************************/
/*****************************************************************************************/

//------------------LISTAR RESERVAS DE UN ESPACIO-------------------------------------------

//await axios.get(server + '/booking/')

//------------------AÑADIR UNA RESERVA------------------------------------------------------
function booking(date, hours) {
    this.date = date
    this.hours = hours
}

const reserva = new booking("2022-12-24 13:30:00", 2)

//await axios.put(server + '/booking/7/user5', reserva)


//---------------ELIMINAR TODAS LAS RESERVAS DE UN ESPACIO ASOCIADAS A UN USUARIO-----------
//await axios.delete(server+  '/booking/1/user3')





