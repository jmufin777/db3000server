//const {User} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const {pool, client } = require('../db')
const _ = require('lodash')
const resObj = {
  mat: [],
  vlatnosti: [],
  rozmer: [],
  strojskup: [],


}

var lErr= false


const tabname = 'list_mat'
module.exports = {
    async one (req,res) {
       var  myres = {
        xdata: [],
        vlastnosti:[],
        rozmer: [],
        strojskup: [],

        info: []
       
      }
      console.log(req.query.id)
      if (!req.query.id > 0 ) {
        res.status(821).send({
          error: "Chybi Idefix materialu"
        })
        lErr = true
        return
      }
      if (lErr == true){
        return
      }
      
      // return

      var dotaz =`select * from ${tabname} where idefix = ${req.query.id}`
      var dotaz_vlastnosti =`select * from list_mat_vlastnosti where idefix_mat = ${req.query.id}`
      var dotaz_rozmer = `select * from list_mat_rozmer  where idefix_mat = ${req.query.id}`
      var dotaz_strojskup = `select * from list_mat_strojskup where idefix_mat = ${req.query.id}`

      var enum_matskup        = `select * from list2_matskup order by kod `
      var enum_matsubskup     = `select * from list2_matsubskup order by kod `
      var enum_matvyrobce     = `select * from list2_matvyrobce order by kod `
      var enum_matvlastnosti  = `select * from list2_matvlastnosti order by kod `

      

      var enum_n1 =`select distinct nazev1 as value from list_mat order by nazev1`
      var enum_n2 =`select distinct nazev2 as value from list_mat order by nazev2`
      var enum_n3 =`select distinct nazev3 as value from list_mat order by nazev3`

      var enum_dodavatel  = `select * from list_dodavatel order by kod `   //Doplnit pominkove online dohledabvani pro kod ktery teprve vznikne
      
      console.log(dotaz,dotaz_rozmer, dotaz_vlastnosti, dotaz_strojskup)
      
      const client = await pool.connect()
      try {
       
      
      await client.query(dotaz,(err,response) => {
        if (err) {
          myres.info = -1
          return
        }
        resObj.mat=response.rows

      })

      await  client.query(dotaz_vlastnosti,(err2,response2) => {
     
       if (err2) {
         myres.info = -1
         return
       }
        resObj.vlastnosti = []
        response2.rows.forEach(el => {
        resObj.vlastnosti.push(el.idefix_vlastnost)
       })

     })

     await  client.query(dotaz_rozmer,(err3,response3) => {
     if (err3) {
       myres.info = -1
       return
     }
     resObj.rozmer=response3.rows
     })

     await  client.query(dotaz_strojskup,(err4,response4) => {
      if (err4) {
        myres.info = -1
        return
      }
      resObj.strojskup=response4.rows
      //console.log(resObj)
      //console.log(resObj.vlatnosti)
      })

      await  client.query(enum_matskup,(err5,response5) => {
        if (err5) {
          myres.info = -1
          return
        }
        resObj.enum_matskup=response5.rows
        //console.log(resObj)
        //console.log(resObj.vlatnosti)
        })

        await  client.query(enum_matsubskup,(err7,response7) => {
          if (err7) {
            myres.info = -1
            return
          }
          resObj.enum_matsubskup=response7.rows
          
          
          //console.log(resObj)
          
          //console.log(resObj.vlatnosti)
          }) 
          await  client.query(enum_matvyrobce,(err8,response8) => {
            if (err8) {
              myres.info = -1
              console.log(8, "err")
              return
            }
            resObj.enum_matvyrobce=response8.rows
            console.log(8, "OK")
            
            //console.log(resObj)
            })   
            await  client.query(enum_matvlastnosti,(err9,response9) => {
              if (err9) {
                myres.info = -1
                console.log(9, "Err")
                return
              }
              resObj.enum_matvlastnosti=response9.rows
              console.log(9, "OK")
              
              //console.log(resObj)
              })               

               await  client.query(enum_n1,(err10,response10) => {
                if (err10) {
                  myres.info = -1
                  console.log(10, "err", err10)
                  return
                }
                resObj.enum_n1 = []
                // response10.rows.forEach(el => {
                //   resObj.enum_n1.push(el.nazev1)
                // })
                resObj.enum_n1=response10.rows
                console.log(10, "OK",resObj.enum_n1)
                
                //console.log(resObj)
                })                 
               await  client.query(enum_n2,(err11,response11) => {
                  if (err11) {
                    myres.info = -1
                    console.log(11, "err")
                    return
                  }
                  resObj.enum_n2=response11.rows
                  console.log(11, "OK")
                
                  //console.log(resObj)
                  })                   
               await  client.query(enum_n3,(err12,response12) => {
                    if (err12) {
                      myres.info = -1
                      console.log(12, "err")
                      return
                    }
                    resObj.enum_n3=response12.rows
                    
                    console.log(12)
                    })                  
               await  client.query(enum_dodavatel,(err13,response13) => {
                 if (err13) {
                   myres.info = -1
                   console.log(13, "err")
                   return
                 }
                 resObj.enum_dodavatel = response13.rows
                 
                 
                 console.log(13)
                 }) 
                 ///console.log(myres.info)                                     
                await  client.query('select 1',(errxx,responsexx) => {  //Podvodny dotaz, ktery vynuti wait na vsechny vysledky - zahada jako bejt, vubectro nechapu ale funguje to
                  res.json(resObj)
                })  
                
            //setTimeout(function(){
               await client.release() 
            //},2000)        
    } catch(e) {
      console.log(e)
      res.status(821).send({
        error: 'Mat ' + e
      });
    }
    
    

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
