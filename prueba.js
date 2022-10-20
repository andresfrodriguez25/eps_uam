import {readFile, readdir} from "fs/promises"

try {
    filename='texto.txt'

    const promise = readFile(fileName,"utf-8");

    await promise;
  } catch (err) {
    // When a request is aborted - err is an AbortError
    console.error(err);
  }