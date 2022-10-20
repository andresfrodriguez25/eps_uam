import axios from 'axios'
const server = 'http://localhost:8080'
async function testHelloWorld(){
    const result = await axios.get(server + '/')
    return result.data // el campo data contendrá el resultado
}
const hello = await testHelloWorld()
console.log('Prueba de conexión, resultado: ' + hello)

const resultado = await axios.put(server+'/booking/'+rid+'/'+uid, data)
