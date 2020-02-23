//const {User} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const {pool, client } = require('../db/index')
var lErr = false
var idefix = 0

var user = ''
var level = ''

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
      const client = await pool.connect()

//        var user = ''
  //      var level = 0
        
         await client.query('select * from list_users where login=$1  and heslo = md5($2) limit 1',[login , password ],(err, response) => {
          //console.log(response)
           if (response.rowCount == 0)   {
             res.status(403).send({error: 'Uzivatel ci heslo nenalezeno'})
           } else {
               user = response.rows[0].login
               level = response.rows[0].level
               idefix = response.rows[0].idefix
               console.log(response.rows[0].login)
               console.log('\n\n\n\n\n\n\n',`insert into list_users_sessions (idefix) values (${idefix})`,'\n\n\n\n\n\n\n')

               client.query(`update list_users set  idefix = id + 10000 where idefix = 0 or idefix is null `)
               client.query(`insert into list_users_sessions (idefix) values (${idefix})`)

               res.send({
                user: user ,
                level: level,
                idefix: idefix,
                token: jwtSignUser({user: user })
   
              })
           }
             if (err) return next(err);
         })
         await client.query(`insert into list_users_sessions (idefix) values (${idefix})`)
         await client.release() 
         if (!user) {
           console.log('User X ${idefix} not available in database - Uzivatel neni pritomen v databazi  ')
         }
    } catch (err) {
        console.log(err)
        res.status(400).send({
          error: 'You must provide a valid email address'
        })
    }
  },

  async logout (req, res, next) {
    
    try {
    const {idefix} = req.body
    console.log(req.body)
    console.log('\n\n\n\n\n--------------\n','Logout',idefix,'-------------------\n\n\n\n\n\n')

    
    const client = await pool.connect()
    console.log('\n\n\n\n\n\n',`update list_users_sessions set t_logout = now where idefix= 9 and t_logout is null`,'\n\n\n\n\n\n') 

    await client.query(`update list_users_sessions set t_logout = now() where idefix= ${idefix} and t_logout is null`,(err, response)=>{
      if (err) {
        return next(err)
      }
      res.json({info: 1})

    })
    await client.release()
   }  catch(err) {
     console.log(err)
     res.status(401).send({
       error: 'Chyba pri odhlaseni'
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
        user = ''
        idefix = 0
        level = ''
         await client.query(`select level,idefix,login from list_users where login='${login}'` ,(err, response) => {
          //console.log(response)
           if (response.rowCount == 0)   {
             console.log(`Login ${user}   X1 Update User not available in database - Uzivatel neni pritomen v databazi  `)
             res.status(403).send({error: 'Uzivatel ci heslo nenalezeno'})
           } else {
              console.log('Nalezeno: X1 ',response.rows[0].login)
               user = response.rows[0].login
               level = response.rows[0].level
               idefix = response.rows[0].idefix
    
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
      await client.release()  
    } catch (err) {
      console.log(err)
      res.status(411).send({
        error: 'Chyba pri pokusu o zjisteni polozek mneu'
      })
    }
  }

  

}
