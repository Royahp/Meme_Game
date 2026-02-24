import sqlite from 'sqlite3'

const db = new sqlite.Database('./mydb.db',(err)=>{
    if(err) throw err
})


export default db