import {open} from "lmdb";

const db = open("temp");
console.log(db.putSync("hello","world"));
console.log(db.get("hello"),db.get("world"));
console.log(db.removeSync("hello"));
console.log(db.get("hello"),db.get("world"));
console.log(db.removeSync("world"));
console.log(db.get("hello"),db.get("world"));
await db.close();


