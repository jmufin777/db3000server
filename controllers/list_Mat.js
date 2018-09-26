//const {User} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const {pool, client } = require('../db')
const _ = require('lodash')

var lErr= false


const tabname = 'list_mat'
module.exports = {
    async one (req,res) {
       var  myres = {
        xdata: [],
        vlastnosti:[],
        rozmer: [],
        info: 0
       
      }
      console.log(req.query.id)
      if (!req.query.id > 0 ) {
        res.status(821).send({
          error: "Chybi Idefix materialu"
        })
      }
      var dotaz =`select * from ${tabname} where idefix = ${res.query.id}`
      var dotaz_vlastnosti =`select * from list_mat_vlastnosti where idefix_mat = ${res.query.id}`
      var dotaz_rozmer = `select * from list_mat_rozmer  where idefix_mat = ${res.query.id}`
      
      const client = await pool.connect()
      await client.query(dotaz,(err,response) => {
        if (err) {
          myres.info = -1
          return
        }

      })

    },
    async all (req, res) {
      var dotaz=''
      if (req.query.id=='nic'){
        dotaz=`select * from ${tabname} where 1=1 order by kod `
        
      }
      if (req.query.id=='max'){
        dotaz = `select kod as kod from ${tabname} where 1=1 order by kod desc limit 1`
        
      }
      console.log(req.query.id, dotaz )
    try {
      

        
        console.log('BBBB')

        const client = await pool.connect()
        

         await client.query(dotaz ,(err, response) => {
          //console.log(response)
           if (response.rowCount == 0)   {
             console.log(response,'noic')
           
             res.json( {
              id: -1,
              kod: 100,
              nazev:'Nova'
            }) 
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
    console.log(req.body.form.data[0])
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

        /*
         kod 
         idefix_matskup
         idefix_matsubskup
         idefix_vyrobce
         nazev1
         nazev2
         nazev3
         popis
         idefix_dodavatel
         sila_mm
         vaha_gm2
         sirka_mm_zbytek
         vyska_mm_zbytek
         cena_nakup_m2
         koef_naklad
         koef_prodej
         cena_nakup_kg
         cena_nakup_arch
         cena_naklad_arch
         cena_naklad_m2
         cena_prodej_m2
         cena_prodej_arch

         */


        if (element[0].id < 0 ){
          dotaz = `insert into  ${tabname} (
          kod 
         ,idefix_matskup
         ,idefix_matsubskup
         ,idefix_vyrobce
         ,nazev1
         ,nazev2
         ,nazev3
         ,popis
         ,idefix_dodavatel
         ,sila_mm
         ,vaha_gm2
         ,sirka_mm_zbytek
         ,vyska_mm_zbytek
         ,cena_nakup_m2
         ,koef_naklad
         ,koef_prodej
         ,cena_nakup_kg
         ,cena_nakup_arch
         ,cena_naklad_arch
         ,cena_naklad_m2
         ,cena_prodej_m2
         ,cena_prodej_arch
            
            

     ,user_insert_idefix
            
            ) values `;
          dotaz += `( 
        '${element[0].kod}'
        ,'${element[0].idefix_matskup}' 
        ,'${element[0].idefix_matsubskup}'
        ,'${element[0].idefix_vyrobce}'
        ,'${element[0].nazev1}'
        ,'${element[0].nazev2}'
        ,'${element[0].nazev3}'
        ,'${element[0].popis}'
        ,'${element[0].idefix_dodavatel}'
        ,'${element[0].sila_mm}'
        ,'${element[0].vaha_gm2}'
        ,'${element[0].sirka_mm_zbytek}'
        ,'${element[0].vyska_mm_zbytek}'
        ,'${element[0].cena_nakup_m2}'
        ,'${element[0].koef_naklad}'
        ,'${element[0].koef_prodej}'
        ,'${element[0].cena_nakup_kg}'
        ,'${element[0].cena_nakup_arch}'
        ,'${element[0].cena_naklad_arch}'
        ,'${element[0].cena_naklad_m2}'
        ,'${element[0].cena_prodej_m2}'
        ,'${element[0].cena_prodej_arch}'
      
      ,login2idefix('${user}') 
             )`
        }
        if (element[0].id > 0 ){
          dotaz = `update  ${tabname} set 
           kod ='${element[0].kod}'
          ,idefix_matskup ='${element[0].idefix_matskup}' 
          ,idefix_matsubskup='${element[0].idefix_matsubskup}'
          ,idefix_vyrobce='${element[0].idefix_vyrobce}'
          ,nazev1='${element[0].nazev1}'
          ,nazev2='${element[0].nazev2}'
          ,nazev3='${element[0].nazev3}'
          ,popis='${element[0].popis}'
          ,idefix_dodavatel='${element[0].idefix_dodavatel}'
          ,sila_mm='${element[0].sila_mm}'
          ,vaha_gm2='${element[0].vaha_gm2}'
          ,sirka_mm_zbytek='${element[0].sirka_mm_zbytek}'
          ,vyska_mm_zbytek='${element[0].vyska_mm_zbytek}'
          ,cena_nakup_m2='${element[0].cena_nakup_m2}'
          ,koef_naklad='${element[0].koef_naklad}'
          ,koef_prodej='${element[0].koef_prodej}'
          ,cena_nakup_kg='${element[0].cena_nakup_kg}'
          ,cena_nakup_arch='${element[0].cena_nakup_arch}'
          ,cena_naklad_arch='${element[0].cena_naklad_arch}'
          ,cena_naklad_m2='${element[0].cena_naklad_m2}'
          ,cena_prodej_m2='${element[0].cena_prodej_m2}'
          ,cena_prodej_arch='${element[0].cena_prodej_arch}'
          
          ,user_update_idefix = login2idefix('${user}')`;
          dotaz += ` where id = ${element[0].id}`
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
