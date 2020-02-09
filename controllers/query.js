//const {User} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const {pool, client } = require('../db')
var os = require("os");

const _ = require('lodash')
require('../utils/ostatni')()
require('../utils/soubory')()

var lErr= false
var hotovo=false

module.exports = {
    async all (req, res, next ) {
      var dotaz=''
      
        dotaz = ` ${req.query.query} `
        
      if (dotaz == 'undefined') {
        // console.log('dotaz se pojjebl')
        return res.json({data: [{chyba_Q:dotaz }], fields: []})
      }
    try {
        const client = await pool.connect()
         await client.query(dotaz ,(err, response) => {
           if (err) {
             logE('GET',__filename , err.message, dotaz)
              res.status(402).send({
              error: `Chyba 402 pri pozadavku na databazi :${err.message}`
            })
             return next(err)
           }
           if (response.rowCount == 0)   {
            res.json({data: [], fields: response.fields})
            console.log('Pravdne radky: ', dotaz ) 
           } else {
              res.json({data: response.rows, fields: response.fields})
           }
         })
         await client.release() 
    } catch (err) {
        res.status(402).send({
          error: `Chyba 402 pri pozadavku na databazi :${dotaz}`
        })
    }
  },

  
  async post (req, res, next ) {
    var err2=false;
    
    var dotaz = req.body.params.query
    try{
      const  user  = req.body.params.user
      const client = await pool.connect()
      //console.log(dotaz)
      
      await client.query(dotaz,(err, response)=>{
        if (err) {
         
         
          //console.log('POST', __filename , err.message, dotaz)
          logE('POST',__filename , err.message, dotaz)

          //return
          res.status(412).send({
           error: `Chyba 402 pri pozadavku na databazi :${err}`,
           data: dotaz
         })
         
          return next(err)
        } else {
          if (response.rowCount >0 ){
            
            res.json({info: 'Ok', err: err2 , err0: lErr, hot: hotovo,data: response.rows, fields: response.fields})
          } else {
            res.json({info: 'Ok', err: err2 , err0: lErr, hot: hotovo})
          }
          
        }
            return
      })
      await client.release()
      // res.json({info: 'Ok', err: err2 , err0: lErr, hot: hotovo})
    } catch (err) {
      logE(__filename , err.message, dotaz)
      //console.log("query 2 ", __filename , err, dotaz)
      res.status(413).send({
        error: `Chyba 403 pri pozadavku na databazi :${err}`
      })
    }


  },
  

}
