import {readFile, readdir} from "fs/promises"
import * as fs from 'fs'

const fichero = process.argv[2];

const palabra = process.argv[3];
const files = await readdir(".")


/*const fs = require("fs")

for(const file of files){
    busca(file,palabra)
}





*/


async function busca(fichero,palabra){
    
    const filename = fs.readFile(fichero,"utf-8")
    if(filename.indexOf(palabra)){
        return 1
    }
    else {
        return -1;
    }
}

if(busca == 1){
    console.log()
}