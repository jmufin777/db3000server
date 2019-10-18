//const {User} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const {pool, client } = require('../db')
const _ = require('lodash')

var lErr= false
var hotovo=false

module.exports = {
    async all (req, res, next ) {
      var dotaz=''
      
        dotaz = ` ${req.query.query} `

        //return res.json({data: [{chyba_Q:dotaz }], fields: []})
      if (dotaz == 'undefined') {
        console.log('dotaz se pojjebl')
        return res.json({data: [{chyba_Q:dotaz }], fields: []})
      }
      


    try {
        const client = await pool.connect()
         await client.query(dotaz ,(err, response) => {
           if (err) {
             res.status(402).send({
              error: `Chyba 402 pri pozadavku na databazi :${err}`
            })
             return next(err)
           }
           if (response.rowCount == 0)   {
            //res.json({data: [{chyba_Q:dotaz }], fields: response.fields})
            res.json({data: [], fields: response.fields})

            console.log('Pravdne radky: ', dotaz ) 
            //console.log("Divn")
           } else {
            console.log(response.rows[0])
            res.json({data: response.rows, fields: response.fields})
           }
             
         })
         await client.release() 
    } catch (err) {
         //console.log(err)
        res.status(402).send({
          error: `Chyba 402 pri pozadavku na databazi :${dotaz}`
        })
    }
  },

  
  async post (req, res, next ) {

//    console.log(req.body.form[0])
    //console.log(req.body.params.query)
    //res.json({info: 'Ok' })
    //return
    var err2=false;
    //lErr = false;
    
    var dotaz = req.body.params.query
    try{
      const  user  = req.body.params.user
      const client = await pool.connect()
      console.log(dotaz)
      
      await client.query(dotaz,(err, response)=>{
        if (err) {
          console.log(dotaz,err )
          //return
          res.status(412).send({
           error: `Chyba 402 pri pozadavku na databazi :${err}`,
           data: dotaz
         })
          return next(err)
        } else {
          res.json({info: 'Ok', err: err2 , err0: lErr, hot: hotovo})
        }
            return
      })

      
      await client.release()
      // res.json({info: 'Ok', err: err2 , err0: lErr, hot: hotovo})
    } catch (err) {
      console.log(err)
      res.status(413).send({
        error: `Chyba 403 pri pozadavku na databazi :${err}`
      })
    }


  },
  

}
