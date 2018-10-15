//const {User} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const {pool, client } = require('../db')
const _ = require('lodash')

var lErr= false


const tabname = 'list_mat_projcena'
module.exports = {

    async all (req, res) {
      var dotaz=''
      var idefix_mat = req.query.id
      console.log('ProjCena')
      if (req.query.id=='nic'){
        dotaz=`select * from ${tabname} where 1=1 order by datum desc `
  
      }
      if (req.query.id=='max'){
        dotaz = `select kod as kod from ${tabname} where 1=1 order by datum  desc limit 1`
        
      }

      if ((req.query.id +'').match(/[0-9]/i)){
        dotaz=`select * from ${tabname} where idefix_mat = '${idefix_mat}' order by datum desc `

      }  
      
      console.log(req.query.id, dotaz )
    try {
      
    //  const {login, password} = req.body
//      console.log(login)  

        
        
        if (!idefix_mat) {
          console.log("ERR: ", dotaz)

          res.json({a: 1})
          return
        } 

        const client = await pool.connect()
        var q_init = `insert into list_mat_projcena (idefix_mat,datum) select * from (select ${idefix_mat} as idefix_mat,now()::date ) a 
        where a.idefix_mat>0 and not exists (select * from list_mat_projcena b where a.idefix_mat=b.idefix_mat)`
        await client.query(q_init ,(err, response) => {
          console.log(response)
          if (err) {
            //console.log(err.error)
            console.log('Chybka', q_init )
            //res.status(200).send({"error": err})
            return
          }
        }) 


        
        // const myres = {
        //   data : {},
        //   info: 0
        // }

         await client.query(dotaz ,(err, response) => {
          console.log(response)
          if (err) {
            console.log(err.error)
            return
          }
           if (response.rowCount == 0)   {
             console.log(response,'nic')
             
           
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
    console.log('Update Stroj Skup')
  },
  async insert (req, res, next ) {
     console.log('AAA')
    console.log(req.body.form.data[0])
    console.log('AAA EOF')
    //res.json({a:1})
    //return
    var dotaz =""
    //  res.status(501).send({
    //    error: 'test'
    //  })
    //  return

    try{
      // const {kod,idefix_strojskup, nazev } = req.body.form
      const  user  = req.body.user
      const client = await pool.connect()
      
      // if (!kod.match(/[0-9]{1}/i)) {
      //   res.status(412).send({error:' Kod neobsahuje cisla'})
      // }
      
      //console.log(req.body.form.del)
      var neco1 = JSON.parse(JSON.stringify(req.body.form.del))
      if (req.body.form.del.length > 0)  {
      dotaz=`delete from ${tabname} where id in ( ${neco1})`
      console.log(dotaz)
      //res.json({a: 1})
      //return

      await client.query(dotaz,(err, response)=>{
          if (err){
            console.log(err)
            return next(err)
          }
      })
      }

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
          dotaz = `insert into  ${tabname} (
            ,idefix_mat
            ,datum
            ,nabidka
            ,zakazka
            ,cena_m2
            ,mnozstvi
            ,faktura 
            ,popis
            ,kod
            ,user_insert_idefix
            ) values `;

          dotaz += `( ${element[0].idefix_mat},'${element[0].datum}', '${element[0].datum}'
     ,'${element[0].nabidka}'
     ,'${element[0].zakazka}'
     ,'${element[0].cena_m2}'
     ,'${element[0].mnozstvi}'
     ,'${element[0].faktura}'
     ,'${element[0].popis}'
     ,'${element[0].kod}'
     ,login2idefix('${user}') 
             )`
        }
        if (element[0].id > 0 ){
          dotaz = `update  ${tabname} set idefix_mat =${element[0].idefix_mat},datum='${element[0].datum}'
          ,nabidka                     ='${element[0].nabidka}'
          ,zakazka                     ='${element[0].zakazka}'
          ,cena_m2                     ='${element[0].cena_m2}'
          ,mnozstvi                    ='${element[0].mnozstvi}'
          ,faktura                     ='${element[0].faktura}'
          ,popis                       ='${element[0].popis}'
          ,kod                         ='${element[0].kod}'
          ,user_update_idefix = login2idefix('${user}')`;
          dotaz += ` where idefix = ${element[0].idefix}`
        }
          console.log(dotaz.replace(/undefined/g,'0'))

          dotaz = dotaz.replace(/undefined/g,'0')
          dotaz = dotaz.replace(/null/g,'0')

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
        error: `${tabname} - nelze vlozit kod`

      })
    }
    // console.log('Insert barevnost', req)
    

  },
  async delete (req, res, next ) {
    console.log('Delete barevnost')
  }


}
