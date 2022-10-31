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

await axios.get(server + '/room')
console.log("Cliente ejecutado")

/*****************************************************************************************/
/************************************ESPACIOS*********************************************/
/*****************************************************************************************/




//const espacio = new room("123", "room123")
//const str = JSON.stringify({ espacio })

//------------------LISTAR ESPACIOS------------------

/*
await axios.get(server + '/room')
await axios.get(server + '/room/' + rid)

*/
//------------------ASIGNAR ESPACIOS-----------------
function room(name) {
    this.name = name;
}

//const espacio1 = new room("process.argv.slice(3)")
//await axios.put(server +'/room/'+rid,espacio1)

//------------------BORRAR ESPACIOS------------------------------------------------------

//await axios.delete(server + '/room/'+rid)

/*****************************************************************************************/
/************************************USUARIOS*********************************************/
/*****************************************************************************************/

function user(email, password, id) {
    this.email = email
    this.password = password
    this.id = id
}

//------------------AÑADIR UN NUEVO USUARIO Y LOGIN------------------------------------
const usuario1 = new user("123@gmail.com", "123", "user1")
await axios.post(server + '/user', usuario1)


//------------------ELIMINAR UN USUARIO------------------------------------------------


/*****************************************************************************************/
/************************************RESERVAS*********************************************/
/*****************************************************************************************/
function booking(rid, uid, date, hours) {
    this.rid = rid
    this.uid = uid
    this.date = date
    this.hours = hours
}

//------------------LISTAR RESERVAS DE UN ESPACIO-------------------------------------------


const reserva1 = new booking(12,421221,"2022-10-31 18:00:00",5)

//------------------AÑADIR UNA RESERVA------------------------------------------------------
//await axios.put(server + '/booking/'+reserva1.rid+'/'+reserva1.uid, data)




//------------------ELIMINAR TODAS LAS RESERVAS DE UN ESPACIO ASOCIADAS A UN USUARIO--------
//await axios.delete(server+  '/booking/13/424131')





