//const {User} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const {pool, client } = require('../db/index')
var lErr = false

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
       
        console.log('Authorization Controller', req.body)

        const client = await pool.connect()
        // const myres = {
        //   data : {},
        //   info: 0
        // }
        var user = ''
        var level = 0
        var idefix = 0
         await client.query('select * from list_users where login=$1  and heslo = md5($2) ',[login , password ],(err, response) => {
          //console.log(response)
           if (response.rowCount == 0)   {
             res.status(403).send({error: 'Uzivatel ci heslo nenalezeno'})
           } else {
               user = response.rows[0].login
               level = response.rows[0].level
               idefix = response.rows[0].idefix
               console.log(response.rows[0].login)
               console.log(`User ${user} not available in database - Uzivatel neni pritomen v databazi  `)
               res.send({
                user: user ,
                level: level,
                idefix: idefix,
                token: jwtSignUser({user: user })
   
              })
           }
             if (err) return next(err);
         })
         await client.release() 
         if (!user) {
           console.log('User not available in database - Uzivatel neni pritomen v databazi  ')
         }
    } catch (err) {
        console.log(err)
        res.status(400).send({
          error: 'You must provide a valid email address'
        })
    }
  },

  async loginUpdate (req, res) {
    
    try {
      
      const {login, password} = req.body
       
        console.log('Authorization Controller - Update ', req.body)
        

        const client = await pool.connect()
        // const myres = {
        //   data : {},
        //   info: 0
        // }
        var user = ''
        var idefix = 0
        var level = ''
         await client.query('select level,idefix,login from list_users where login=$1   ',[login  ],(err, response) => {
          //console.log(response)
           if (response.rowCount == 0)   {
             res.status(403).send({error: 'Uzivatel ci heslo nenalezeno'})
           } else {
               user = response.rows[0].login
               level = response.rows[0].level
               idefix = response.rows[0].idefix
               console.log(response.rows[0].login)
    
               res.send({
                user: user ,
                level: level,
                idefix: idefix,
                token: jwtSignUser({user: user })
   
              })
           }
             if (err) return next(err);
         })
         await client.release() 
         if (!user) {
           console.log('User not available in database - Uzivatel neni pritomen v databazi  ')
         }
    } catch (err) {
        console.log(err)
        res.status(400).send({
          error: 'You must provide a valid email address'
        })
    }
  },
  async userMenu(req, res)  {

    const {login, idefix} = req.body
    console.log('Authorization Controller - MenuUpdate ', req.body)
    const client = await pool.connect()

    var dotaz = `select b.items from list_menu_users a join list_menu b on a.idefix_menu = b.idefix where a.idefix_user= ${idefix}`
    try {
      await client.query(dotaz, (err, response) => {
        if (err) {
          lErr = true
          res.status(412).send({
            error: 'Chyba po dotazu na polozky'
          })
        }
       if (response.rowCount == 0 )  {
         console.log('Nema menu polozky , pokracuji - skupiny - menu')

       } else {
         console.log(JSON.stringify(response.rows))
        res.send({
          items: response.rows[0].items,
          updateStatus: 1
          

        })
       }


      })

    } catch (err) {
      console.log(err)
      res.status(411).send({
        error: 'Chyba pri pokusu o zjisteni polozek mneu'
      })
    }
  }

}
