import { writeFile } from 'fs/promises'
import { readFile } from 'fs/promises'

// FUNCIÓN PARA CONVERTIR UNA CADENA EN UN .JSON
async function save() {
    const str = JSON.stringify(misDatos)
    await writeFile('usuarios.txt', str, 'utf8')
}

// Función para leer un objeto desde un archivo, convirtiendo la cadena en objeto
// con el método JSON.parse(str)
async function load() {
    const str = await readFile('datos.txt', 'utf8')
    const datos = JSON.parse(str)
    return datos
}


