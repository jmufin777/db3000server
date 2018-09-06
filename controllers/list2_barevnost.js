//const {User} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const {pool, client } = require('../db')

var lErr= false


const tabname = 'list2_barevnost'
module.exports = {

    async all (req, res) {
    
    try {
      
    //  const {login, password} = req.body
//      console.log(login)  

        
        console.log('BBBB')

        const client = await pool.connect()

        
        // const myres = {
        //   data : {},
        //   info: 0
        // }
        
         await client.query(`select * from ${tabname} where 1=$1 order by id `  ,[1 ],(err, response) => {
          //console.log(response)
           if (response.rowCount == 0)   {
             res.status(403).send({error: `Data ${tabname} nejsou k dispozici`})
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
  },
  async update(req, res, next) {
    console.log('Update barevnost')
  },
  async insert (req, res, next ) {
    console.log(req.body.form)
    res.status(501).send({
      error: 'test'
    })
    return
    try{
      const {kod, nazev } = req.body.form
      const  user  = req.body.user
      const client = await pool.connect()
      
      if (!kod.match(/[0-9]{1}/i)) {
        res.status(412).send({error:' Kod neobsahuje cisla'})
      }
      const dotaz = `insert into list2_barevnost(kod,nazev,user_insert, user_insert_idefix) 
        values ('${kod}', '${nazev}', '${user}', login2idefix('${user}') )
      `

      await client.query(dotaz, (err, response) => {
        if (err) {
          lErr =true
          return next(err)
        }
         res.json({info:1});

      })
      //console.log('Insert barevnost', req.body, kod, nazev,"U",user)
      console.log(dotaz)
      await client.release()

    } catch (err) {
      console.log(err)
      res.status(411).send({
        error: 'Barevnost - nelze vlozit kod'

      })
    }
    // console.log('Insert barevnost', req)
    

  },
  async delete (req, res, next ) {
    console.log('Delete barevnost')
  }


}
