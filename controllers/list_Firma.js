//const {User} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const {pool, client } = require('../db')
const _ = require('lodash')

var lErr= false


const tabname = 'list_dodavatel'
module.exports = {

    async all (req, res) {
      var dotaz=''
      var where ='  true '
      var order =' order by a.nazev, a.idefix '
      var tmp =''
      console.log(where, ' : ', req.query)

      if (req.query.id=='nic'){
        dotaz=`select * from ${tabname} where 1=1 order by kod `
        
      } else if (req.query.id=='max'){
        dotaz = `select kod as kod from ${tabname} where 1=1 order by kod desc limit 1`
        
      } else {
         where = `${where} and ${ req.query.id }` 
         dotaz=`select a.* from ${tabname}  a`
         
         dotaz = `${dotaz} where ${where} order by nazev,a.idefix `


      }
      //console.log("aaAAaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa \n ", dotaz ," \n EOF")
      // console.log(req.query.id, dotaz )
      // res.json({a: 1});
      //return
    try {
      
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

  async one(req, res, next) {
    var  resObj = {
      info: 0,
      xdata: [],
      firma: [],
      firmaosoba: [],
      firmaprovozovna: [],
      firmaprace: [],
      
 
    }
       req_query_id = req.query.id
       req_query_id_query = req.query.id_query
       req_query_string_query = req.query.string_query
       var dotaz =`select a.* from ${tabname} a where a.idefix = ${req_query_id}`
       var dotazosoba        =`select a.* from list_firmaosoba a where a.idefix_firma = ${req_query_id}`
       var dotazprovozovna   =`select a.* from list_firmaprovozovna a where a.idefix_firma = ${req_query_id}`
       var dotazprace        =`select a.* from list_firmaprace a where a.idefix_firma = ${req_query_id}`



      console.log('Dotaz na jednu firmu' )
    try {
      const client = await pool.connect()
  
      if (req_query_string_query=='edit'){
        req_query_string_query =''   //nema smysl nic jakoby s tim je to default
      }
      
       if (req.query.string_query=='copy'){
        console.log("req_query_id: ", req_query_id )
        console.log(`select fce_list_firma_new as new_idefix from fce_list_firma_new(${req_query_id})`)
        
        await client.query(`select fce_list_firma_new as new_idefix from fce_list_firma_new(${req_query_id})`,(err88,response88) => {
          if (err88){
            console.log("Err",88);
          }
          
          console.log(88, response88.rows)
          req_query_id = response88.rows[0].new_idefix
          resObj.newId = req_query_id
          console.log(88, 'New Id = :', req_query_id)
        //  res.json({newId: req_query_id})
        
          
        })
        // res.json(resObj)
        //  await client.release()
        console.log( resObj )
        // return

        req_query_string_query =''   //napred ma smlysl, pusti se procedura na sql a ta nasype zpet nove idefix materialu a pak je mozne zase to jakoby smaznout
      }      

      await client.query(dotaz,(err,response) => {
        if (err) {
          resObj.info = -1
          return
        }
        resObj.firma = response.rows
        //console.log(resObj.stroj )
  
      })
      await client.query(dotazosoba,(err,response) => {
        if (err) {
          resObj.info = -1
          return
        }
        resObj.firmaosoba = response.rows
        //console.log(resObj.stroj )
  
      })
      await client.query(dotazprovozovna,(err,response) => {
        if (err) {
          resObj.info = -1
          return
        }
        resObj.firmaprovozovna = response.rows
        //console.log(resObj.stroj )
  
      })
      await  client.query('select 1',(errxx,responsexx) => {  //Podvodny dotaz, ktery vynuti wait na vsechny vysledky - zahada jako bejk, vubectro nechapu ale funguje to
        console.log(200, "Vracim  Vysledek")
        // dotaz_rozmer, dotaz_vlastnosti, dotaz_strojskup,
        console.log(dotaz, " Par ",req_query_id_query, "String ", req.query.string_query)
        res.json(resObj)
      })  
      await client.release() 

    } catch(e)  {

    }
      //res.json({a: 1}); 
      

  },
  async saveone(req, res, next) {
    //console.log('Ulozeni jedne firmy',req.body)
    
    // user_insert_idefix: null,
    if (req.body.form.firma.datum_ares == null  || !req.body.form.firma.datum_ares.match(/[0-9]{4}/)){
      req.body.form.firma.datum_ares='19010101'
    }
    
    var dotaz = `update list_dodavatel set `
      dotaz = dotaz + `

        kod                      = '${req.body.form.firma.kod                }',
        ico                      = '${req.body.form.firma.ico                }',
        dic                      = '${req.body.form.firma.dic                }',
        nazev                    = '${req.body.form.firma.nazev              }',
        ulice                    = '${req.body.form.firma.ulice              }',
        obec                     = '${req.body.form.firma.obec               }',
        psc                      = '${req.body.form.firma.psc                }',
        tel                      = '${req.body.form.firma.tel                }',
        tel2                     = '${req.body.form.firma.tel2               }',
        mail                     = '${req.body.form.firma.mail               }',
        www                      = '${req.body.form.firma.www                }',
        mat                      = '${req.body.form.firma.mat                }',
        
        poznamka                 = '${req.body.form.firma.poznamka           }',
        splatnost                = '${req.body.form.firma.splatnost          }',
        hotovost                 = '${req.body.form.firma.hotovost           }',
        nazev2                   = '${req.body.form.firma.nazev2             }',
        ulice2                   = '${req.body.form.firma.ulice2             }',
        obec2                    = '${req.body.form.firma.obec2              }',
        psc2                     = '${req.body.form.firma.psc2               }',
        cp2                      = '${req.body.form.firma.cp2                }',
        ulice0                   = '${req.body.form.firma.ulice0             }',
        obec0                    = '${req.body.form.firma.obec0              }',
        aktivni                  = '${req.body.form.firma.aktivni            }',
        cp1                      = '${req.body.form.firma.cp1                }',
        datum_ares               = '${req.body.form.firma.datum_ares         }',
      
      `
      dotaz += `user_update_idefix = login2idefix('${req.body.user}')`;
      dotaz += ` where idefix = ${req.body.idefix}`
      dotaz = dotaz.replace(/undefined/g,'0')
      dotaz = dotaz.replace(/null/g,'')
      console.log(dotaz)

      try {
        const client = await pool.connect()
        await client.query(dotaz,(err01,response01) => { 
        if (err01){
          console.log('Err - update' , 01, err01)
        } 
        })

        await client.release()
        res.json({info: 'Ok test'});
  
        } catch (e) {
  
        }  
        
        
     // es.json({'a':1});
     //console.log(dotaz);
  },

  async update(req, res, next) {
    console.log('Update Stroj Skup')
  },
  async insert (req, res, next ) {
    console.log(req.body.form[0])
    var dotaz =""
    // res.status(501).send({
    //   error: 'test'
    // })
    // return
    try{
      const {kod, nazev, ico, dic, ulice, obec,psc, tel, mail,mat } = req.body.form
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
        
        if (element[0].id < 0 ){
          dotaz = `insert into  ${tabname} (kod,nazev, ico, dic, ulice, obec,psc, tel, mail ,mat, user_insert_idefix ) values `;
          dotaz += `( ${element[0].kod},'${element[0].nazev}',  
          '${element[0].ico}',  
          '${element[0].dic}',  
          '${element[0].ulice}',  
          '${element[0].obec}',  
          '${element[0].psc}',  
          '${element[0].tel}',  
          '${element[0].mail}',  
          '${element[0].mat}',  

          
          login2idefix('${user}')  )`
        }
        if (element[0].id > 0 ){
          dotaz = `update  ${tabname} set kod =${element[0].kod},nazev='${element[0].nazev}',
          ico    = '${element[0].ico}',  
          dic    = '${element[0].dic}',  
          ulice  = '${element[0].ulice}',  
          obec   = '${element[0].obec}',  
          psc    = '${element[0].psc}',  
          tel    = '${element[0].tel}',  
          mail   = '${element[0].mail}',
          mat    = '${element[0].mat}' 
          
          
          
          , user_update_idefix = login2idefix('${user}')`;
          dotaz += ` where id = ${element[0].id}`
        }
        dotaz = dotaz.replace(/undefined/g,'')
          dotaz = dotaz.replace(/null/g,'')
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
    const client = await pool.connect()
    // req.body.params.id
    console.log('Delete' ,req.body.params )
     //res.json({a: 1});
     //return
     await client.query(`select fce_list_firma_del(${req.body.params.id})` ,(err00, response00) => {
       if (err00){
         console.log('Err','00' )
         res.status(412).send({
          error: `${tabname} - Chyba pri vymazu`
  
        })
         return
       }
       res.json({info: 'Ok' })
       console.log('OK','00' )
     })
     await client.release()


    console.log('Delete Firma', req.body.params.id)
  }


}
