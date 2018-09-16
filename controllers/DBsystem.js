//const {User} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const {pool, client } = require('../db')
const _ = require('lodash')
var lErr= false

const tabname = 'db_system'
module.exports = {

    async all (req, res) {
      var dotaz=''
      if (req.query.id=='nic'){
        dotaz=`select * from ${tabname} where 1=1 order by id `
      }
      if (req.query.id=='max'){
        dotaz = `select kod as kod from ${tabname} where 1=1 order by kod desc limit 1`
      }
      console.log(req.query.id, dotaz )
    try {
      
    //  const {login, password} = req.body
//      console.log(login)  

        
        console.log('BBBB')

        const client = await pool.connect()

        
        // const myres = {
        //   data : {},
        //   info: 0
        // }

         await client.query(dotaz ,(err, response) => {
          //console.log(response)
           if (response.rowCount == 0)   {
             console.log(response,'noic')
             
           
             res.json( {
              id: -1,
              kod: 100,
              nazev:'Nova'
            }) 
          

          

            // res.status(403).send({error: `Data ${tabname} nejsou k dispozici`})
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
    
    console.log(req.body.form.data)
    /*
    res.json({a:'ahoj'})
    return 
    var dotaz =""

     res.status(501).send({
       error: 'test'
     })
     return
     */
    try{
      const {kod, name } = req.body.form
      const  user  = req.body.user
      const client = await pool.connect()
      
      // if (!kod.match(/[0-9]{1}/i)) {
      //   res.status(412).send({error:' Kod neobsahuje cisla'})
      // }
      
      //console.log(req.body.form.del)
      var neco1 = JSON.parse(JSON.stringify(req.body.form.del))
      if (req.body.form.del.length > 0)  {
      dotaz=`delete from db_system where id in ( ${neco1})`
      console.log(dotaz)

      await client.query(dotaz,(err, response)=>{
          if (err){
            console.log(err)
            return next(err)
          }
      })
      }
      
      //res.json({a:'ahoj'})
      //return
      

      

      await req.body.form.data.forEach(element => {

        if( typeof element[0].id == 'undefined' ) {
          console.log('Id je prazdne', element)
        }

        if (!element[0].id){
          
          return
        } else {
          console.log(element[0].id)
        }
        
        if (element[0].id < 0 ){
            var idx = JSON.stringify(element[0].index_name)
            var inittxt = JSON.stringify(element[0].initq)
            idx = idx.replace(/"/g,"'")
    //inittxt = inittxt.replace(/'/g,"\\'")
            inittxt = inittxt.replace(/"/g,"$$$")
          
          var  cq = 'insert into db_system (name, struct, index_name,initq, reindex) values '

          var cq2=` 
            ('${element[0].name}','${element[0].struct}'
            ,array${idx}
            ,array${inittxt}
            ,${element[0].reindex}
            
            ) `
            cq2=cq2.replace(/array\[\]/g,'null')
            cq2=cq2.replace(/arraynull/g,'null')
     

           dotaz = `${cq} ${cq2}`

         // dotaz += `( ${element[0].kod},'${element[0].nazev}',  login2idefix('${user}')  )`
        }
        if (element[0].id > 0 ){
          dotaz = `update  db_system set kod =${element[0].kod},name='${element[0].name}', struct='${element[0].struct}', user_update_idefix = login2idefix('${user}')`;
          dotaz += ` where id = ${element[0].id}`
        }
          console.log(dotaz)
           client.query(dotaz  ,[  ],(err, response ) => {
             if (err) {
               return next(err)
             } 
          
            })

        
      });
      
      
      // const dotaz = `insert into list2_barevnost(kod,nazev,user_insert, user_insert_idefix) 
      //   values ('${kod}', '${nazev}', '${user}', login2idefix('${user}') ) `


      
      //console.log('Insert barevnost', req.body, kod, nazev,"U",user)
      console.log('Uvolnuji')
      await client.release()
      res.json({info: 'Ok' })

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
