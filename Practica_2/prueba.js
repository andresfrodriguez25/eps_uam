const usuarios = [
  { mail: "luislopez@gmail.com", password: "123456789eaf", uid: "luidsadslopez51", token: 1234 },
  { mail: "luislopez3@gmail.com", password: "12345fdae6789", uid: "luislgsaopez51", token: 1234 },
  { mail: "luislopez5@gmail.com", password: "1234567dds89", uid: "luislopezafe51", token: 1234 },
  { mail: "luislope7@gmail.com", password: "123456ee789", uid: "lufafislopez51", token: 1234 }

]


import { readFile, writeFile } from 'fs/promises'
async function save(archivo, misDatos) {
    const str = JSON.stringify(misDatos)
    await writeFile(archivo, str, 'utf8')
}

for(let i=5;i<usuarios.length;i++)

    {
        const user = {
            email: usuarios[i].mail,
            contraseña:usuarios[i].password,
            userID:usuarios[i].uid,
            token: usuarios[i].token
        }
    try{
        save('user.json',usuarios[i])
    
    }catch(error){
        console.log("Error generando")
    }
        }