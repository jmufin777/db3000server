//const {User} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const {pool, client } = require('../db/index')

function jwtSignUser (user) {
  const ONE_WEEK = 60 * 60 * 24 * 7*52
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: ONE_WEEK
  })
}

module.exports = {
    async login (req, res) {
    
    try {
      
      const {login, password} = req.body
       
        console.log('Authorization Controller')

        const client = await pool.connect()
        // const myres = {
        //   data : {},
        //   info: 0
        // }
        var user = ''
         await client.query('select * from list_users where login=$1  and heslo = md5($2) ',[login , password ],(err, response) => {
          //console.log(response)
           if (response.rowCount == 0)   {
             res.status(403).send({error: 'Uzivatel ci heslo nenalezeno'})
           } else {
               user = response.rows[0].login
               res.send({
                user: user ,
                token: jwtSignUser({user: user })
   
              })
           }
             if (err) return next(err);
         })
         await client.release() 
         if (!user) {
           console.log('User not available in database - Uzivatel neni pritomen v databazi :-( smajlik ')
         }
    } catch (err) {
        console.log(err)
        res.status(400).send({
          error: 'You must provide a valid email address'
        })
    }
  }
}
