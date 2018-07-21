//const {User} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const {pool, client } = require('../db/db2')

function jwtSignUser (user) {
  const ONE_WEEK = 60 * 60 * 24 * 7*52
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: ONE_WEEK
  })
}

const tabname = 'zak_list'
module.exports = {
    
      async all (req, res) {
        console.log(pool)
    
    try {
      
    //  const {login, password} = req.body
//      console.log(login)  

        
        console.log('BBBB')

        const client = await pool.connect()

        // const myres = {
        //   data : {},
        //   info: 0
        // }
        
         await client.query(`select * from ${tabname} where 1=$1 limit 100`  ,[1 ],(err, response) => {
          //console.log(response)
           if (response.rowCount == 0)   {
             res.status(403).send({error: 'Uzivatel ci heslo nenalezeno'})
           } else {
              res.json(response.rows); 
           }
             if (err) return next(err);
         })
         
         await client.release() 

    } catch (err) {
        console.log(err)
        res.status(400).send({
          error: 'Chyba 002 pri pozadavku na databazi : ${tabname}'
        })
    }
  }
}
