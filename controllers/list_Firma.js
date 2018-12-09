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
      //console.log(where, ' : ', req.query)

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
    var start = new Date()
    var end = 0
    var  resObj = {
      info: 0,
      xdata: [],
      firma: [],
      firmaosoba: [],
      firmaprovozovna: [],
      firmaprace: [],
      firmanotice: [],
      firmanoticevalid: [],
      enumosoba: []
 
    }
       var req_query_id = req.query.id
       var req_query_id_query = req.query.id_query
       var req_query_string_query = req.query.string_query

       var dotaz =`select a.* from ${tabname} a where a.idefix = ${req_query_id}`
       var dotazosoba        =`select a.* from list_firmaosoba a where a.idefix_firma = ${req_query_id} order by case when aktivni then 1 else 2 end, idefix `
       var dotazprovozovna   =`select a.* from list_firmaprovozovna a where a.idefix_firma = ${req_query_id}`
       var dotazprace        =`select a.* from list_firmaprace a where a.idefix_firma = ${req_query_id}`
       var dotaznotice       =`select  extract(epoch from now() - a.datum)/60 < 60 as isedit ,a.*, idefix2fullname(user_insert_idefix)  as user_txt,zkratka(user_insert_idefix) as zkratka_login
                      from list_firmanotice a where a.idefix_firma = ${req_query_id} 
                     order by datum    desc`
        var dotaznoticevalid = `
        select firmaosoba(idefix_firma,idefix_osoba) as firmaosoba ,* from list_firmanotice 
        where (user_insert_idefix = login2idefix('${req.query.user}') or user_update_idefix = login2idefix('${req.query.user}') )  
        and (kdy <= now() + ' - 5 minutes '  or  
        ( kdy between now() + ' - 5 minutes ' and now() + ' + 15 minutes ' )
        )
        and zobrazeno = 0  
        and pripominka = true
        order by kdy `             


        // select * from list_firmanotice where (user_insert_idefix = 9 or user_update_idefix = 9 )

        var enum_osoba = `
        select 0 as idefix, 'firma'::text as nazev union 
        select idefix, coalesce(prijmeni,'') || ' ' || coalesce(jmeno) as nazev from list_firmaosoba where idefix_firma = ${req_query_id} and aktivni order by nazev`

       if (req_query_id_query == 1012) {
        // console.log(req.query, ":", req_query_id, ': \n ', enum_osoba )
       // res.json({'a':1})
        //return

       }
        
        
        // order by case when kdy is not null and kdy > now() and pripominka then kdy else datum end

       // var dotazosobanotice  =`select a.* from list_firmaosobanotice a where a.idefix_firmaosoba in  ${req_query_id} order by datum`


      //cconsole.log(dotaznoticevalid,"::::",req.query.user ," ::EOF::" )
    try {
      const client = await pool.connect()
  
      if (req_query_string_query=='edit'){
        req_query_string_query =''   //nema smysl nic jakoby s tim je to default
      }
      
       if (req.query.string_query=='copy'){
        //console.log("req_query_id: ", req_query_id )
        //console.log(`select fce_list_firma_new as new_idefix from fce_list_firma_new(${req_query_id})`)
        
        await client.query(`select fce_list_firma_new as new_idefix from fce_list_firma_new(${req_query_id})`,(err88,response88) => {
          if (err88){
            console.log("Err",88);
          }
          
          //console.log(88, response88.rows)
          req_query_id = response88.rows[0].new_idefix
          resObj.newId = req_query_id
          //console.log(88, 'New Id = :', req_query_id)
        //  res.json({newId: req_query_id})
        
          
        })
        // res.json(resObj)
        //  await client.release()
//        console.log( resObj )
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
      
      if (req_query_id_query==-1 || req_query_id_query==1012) {
        console.log('seznam osob')
        console.log(req.query, ":", req_query_id, ': \n ', enum_osoba )
      await client.query(enum_osoba,(err1012,response1012) => {
        if (err1012) {
          resObj.info = -1012
          return
        }
        resObj.enumosoba = response1012.rows
        console.log(resObj.enumosoba )
        })
    }

      if (req_query_id_query==-1 || req_query_id_query==103) {
      await client.query(dotazprovozovna,(err,response) => {
        if (err) {
          resObj.info = -1
          return
        }
        resObj.firmaprovozovna = response.rows
        //console.log(resObj.stroj )
  
      })
     }
      await client.query(dotazprace,(err,response) => {
        if (err) {
          resObj.info = -1
          return
        }
        resObj.firmaprace = response.rows
        //console.log(resObj.stroj )
  
      })
      if (req_query_id_query==-1 || req_query_id_query==101) {
        //console.log('req_query_id_query',req_query_id_query, dotaznotice)
      await client.query(dotaznotice,(err,response) => {
        if (err) {
          resObj.info = -1
          return
        }

        resObj.firmanotice = response.rows
        //console.log(resObj )
  
      })
     }
     if (req_query_id_query==1011) {
     // console.log('req_query_id_query',req_query_id_query, dotaznotice)
    await client.query(dotaznoticevalid,(err1011,response1011) => {
      if (err1011)  {
        resObj.info = -1
        return
      }

      resObj.firmanoticevalid = response1011.rows
      // console.log(resObj )

    })
   }

     if (req_query_id_query==-1 || req_query_id_query==102) {
      console.log('req_query_id_query',req_query_id_query, dotazosoba)
    await client.query(dotazosoba,(err102,response102) => {
      if (err102) {
        resObj.info = -102
        return
      }

      resObj.firmaosoba = response102.rows
      console.log(resObj )

    })
   }

      await  client.query('select 1',(errxx,responsexx) => {  //Podvodny dotaz, ktery vynuti wait na vsechny vysledky - zahada jako bejk, vubectro nechapu ale funguje to
        end = new Date()
        end.getTime()

        // console.log(200, "Vracim  Vysledek",req_query_id_query, resObj, enum_osoba)
        console.log(200, "Vracim  Vysledky",req_query_id_query, end.getTime() - start.getTime() )
        // dotaz_rozmer, dotaz_vlastnosti, dotaz_strojskup,
        // console.log(dotaz, " Par ",req_query_id_query, "String ", req.query.string_query)
        res.json(resObj)
        console.log(200, "Vracim  Vysledky 2 za : ", end.getTime() - start.getTime() )
      })  
      await client.release() 
      console.log(200, "Vracim  Vysledky 3 za : ", end.getTime() - start.getTime() )

    } catch(e)  {

    }
      //res.json({a: 1}); 
      

  },
  async saveone(req, res, next) {
    //console.log('Ulozeni jedne firmy',req.body)
    var start = new Date()
    var end   = new Date()
    // user_insert_idefix: null,
    if (req.body.id_query ){
      if (req.body.id_query  == 101 || req.body.id_query  == 1011 ){
        //console.log('notice only 2', req.body.id_query )
        //console.log(req.body.form, req.body.user)
        
        if (req.body.form.kdy == null) {
          req.body.form.kdy = '19991231'

        }
        if (req.body.id_query  == 101) {
            var q= `insert into list_firmanotice(user_insert_idefix,idefix_firma,txt, datum,kdy,pripominka,idefix_osoba ) 
            values (login2idefix('${req.body.user}'),${req.body.form.idefix_firma},'${req.body.form.txt}',now(),'${req.body.form.kdy}','${req.body.form.pripominka}','${req.body.form.idefix_osoba}')`
        }

        if (req.body.id_query  == 1011 && req.body.form.idefix > 0 ) {
          var q= `
          update list_firmanotice set 
          user_update_idefix = login2idefix('${req.body.user}'),
          idefix_osoba = ${req.body.form.idefix_osoba},
          kdy = '${req.body.form.kdy}',
          pripominka = '${req.body.form.pripominka}',
          txt = '${req.body.form.txt}',
          txt2 = replace('${req.body.form.txt2}','null',''),
          zobrazeno = '${req.body.form.zobrazeno}'
          where idefix = ${req.body.form.idefix}
          `
        }
        //console.log(req.body.form, req.body.user, 'q: ', q)
        try {
          const client = await pool.connect()
          await client.query(q,(err01,response01) => { 
          if (err01){
            console.log('Err - update' , 01, err01)
          } 
          })
          await client.query(`delete from list_firmanotice where txt='' or txt is null or idefix=0 or idefix=0 or idefix_firma = 0`,(err01d,response01d) => { 
            if (err01d){
              console.log('Err - update' , 01, err01d)
            } 
            })
          end = new Date()  
          console.log(200, "Vracim  Vysledky Save  za : ", end.getTime() - start.getTime() )
          res.json({info: 'Ok test'});
          await client.release()
          
    
          } catch (e) {
    
          }  
        
        return
      }

      ///102 -- vklad kontaktu
      if (req.body.id_query  == 102) {
        console.log('Kontakt only INSERT', req.body.id_query )
       
       
//        console.log(req.body.form, req.body.user)
        if (req.body.form.narozeniny == null) {
            req.body.form.narozeniny = '19001231'

        }
        var q= `insert into list_firmaosoba(

          idefix_firma,
          kod,
          jmeno, 
          prijmeni, 
          titul, 
          titulza, 
          funkce, 
          oddeleni, 
          prioritni, 
          tel, 
          tel2, 
          tel3, 
          mail, 
          www, 
          poznamka, 
          narozeniny, 
          mail_fakt, 
          psc, 
          obec, 
          ulice,
          aktivni,
          user_insert_idefix
         ) 
          values 
          (
          '${req.body.form.idefix_firma}',
          '${req.body.form.kod}',
          '${req.body.form.jmeno}',
          '${req.body.form.prijmeni}',
          '${req.body.form.titul}',
          '${req.body.form.titulza}',
          '${req.body.form.funkce}',
          '${req.body.form.oddeleni}',
          '${req.body.form.prioritni}',
          '${req.body.form.tel}',
          '${req.body.form.tel2}',
          '${req.body.form.tel3}',
          '${req.body.form.mail}',
          '${req.body.form.www}',
          '${req.body.form.poznamka}',
          '${req.body.form.narozeniny}',
          '${req.body.form.mail_fakt}',
          '${req.body.form.psc}',
          '${req.body.form.obec}',
          '${req.body.form.ulice}',
          '${req.body.form.aktivni}',
          login2idefix('${req.body.user}')
          
          )`

          //console.log(q)


        //console.log(req.body.form, req.body.user, 'q :102 ', q)
        try {
          const client = await pool.connect()
          await client.query(q,(err01,response01) => { 
          if (err01){
            console.log('Err - update' , 01, err01)
          } 
          })

          end = new Date()  
          console.log(200, "Vracim  Vysledky Save  za : ", end.getTime() - start.getTime() )
          res.json({info: 'Ok test'});
          await client.release()
          
    
          } catch (e) {
    
          }  
          
        
        return
      }


      ///102

      ///1021
      if (req.body.id_query  == 1021){
        //console.log('Kontakt only', req.body.id_query )
        
       
       
        //console.log(req.body.form, req.body.user)
        if (req.body.form.narozeniny == null) {
            req.body.form.narozeniny = '19001231'

        }
        var q1021= `update list_firmaosoba

          set idefix_firma                 ='${req.body.form.idefix_firma}',
              kod                 ='${req.body.form.kod}',
              jmeno                 ='${req.body.form.jmeno}',
              prijmeni                 ='${req.body.form.prijmeni}',
              titul                 ='${req.body.form.titul}',
              titulza                 ='${req.body.form.titulza}',
              funkce                 ='${req.body.form.funkce}',
              oddeleni                 ='${req.body.form.oddeleni}',
              prioritni                 ='${req.body.form.prioritni}',
              tel                 ='${req.body.form.tel}',
              tel2                 ='${req.body.form.tel2}',
              tel3                 ='${req.body.form.tel3}',
              mail                 ='${req.body.form.mail}',
              www                 ='${req.body.form.www}',
              poznamka                 ='${req.body.form.poznamka}',
              narozeniny                 ='${req.body.form.narozeniny}',
              mail_fakt                 ='${req.body.form.mail_fakt}',
              psc                 ='${req.body.form.psc}',
              obec                 ='${req.body.form.obec}',
              ulice                 ='${req.body.form.ulice}',
              aktivni                 ='${req.body.form.aktivni}',
              user_update_idefix                 =login2idefix('${req.body.user}')
              where idefix = '${req.body.form.idefix}'
              `

          //console.log(q1021)


        //console.log(req.body.form, req.body.user, 'q 1021: ', q1021)
        try {
          const client = await pool.connect()
          await client.query(q1021,(err01,response01) => { 
          if (err01){
            console.log('Err - update' , 01, err01)
          } 
          })
          end = new Date()  
          console.log(200, "Vracim  Vysledky Save  za : ", end.getTime() - start.getTime() )
          await client.release()
          res.json({info: 'Ok test'});
    
          } catch (e) {
    
          }  
          
        
        return
      }

      ///1021

      ///1022
      if (req.body.id_query  == 1022){
        //console.log('Kontakt only', req.body.id_query )
        
       
       
        //console.log(req.body.form, req.body.user)
        
        var q1022= `update list_firmaosoba

              set aktivni        =not aktivni ,
              user_update_idefix                 =login2idefix('${req.body.user}')
              where idefix = '${req.body.form.idefix}'
              `

         //console.log(q1022)


        //console.log(req.body.form, req.body.user, 'q 1022: ', q1022)
        try {
          const client = await pool.connect()
          await client.query(q1022,(err1022,response01) => { 
          if (err1022){
            console.log('Err - update' , 01, err1022)
          } 
          })

          end = new Date()  
          console.log(200, "Vracim  Vysledky Save  za : ", end.getTime() - start.getTime() )

          res.json({info: 'Ok test'});
          await client.release()
          
    
          } catch (e) {
    
          }  
          
        
        return
      }

      ///1022

      //Provozovny

      if (req.body.id_query  == 103) {
        //console.log('Provozovna only INSERT', req.body.id_query )
       
       
//        console.log(req.body.form, req.body.user)
        
        var q= `insert into list_firmaprovozovna(

          idefix_firma,
          kod,
          nazev,
          jmeno, 
          prijmeni, 
          titul, 
          titulza, 
          funkce, 
          oddeleni, 
          prioritni, 
          tel, 
          tel2, 
          tel3, 
          mail, 
          www, 
          poznamka, 

          psc, 
          obec, 
          ulice,
          aktivni,
          otevreno_od,
          otevreno_do,
          user_insert_idefix
         ) 
          values 
          (
          '${req.body.form.idefix_firma}',
          '${req.body.form.kod}',
          '${req.body.form.nazev}',
          '${req.body.form.jmeno}',
          '${req.body.form.prijmeni}',
          '${req.body.form.titul}',
          '${req.body.form.titulza}',
          '${req.body.form.funkce}',
          '${req.body.form.oddeleni}',
          '${req.body.form.prioritni}',
          '${req.body.form.tel}',
          '${req.body.form.tel2}',
          '${req.body.form.tel3}',
          '${req.body.form.mail}',
          '${req.body.form.www}',
          '${req.body.form.poznamka}',

          '${req.body.form.psc}',
          '${req.body.form.obec}',
          '${req.body.form.ulice}',
          '${req.body.form.aktivni}',
          '${req.body.form.otevreno_od}',
          '${req.body.form.otevreno_do}',
          login2idefix('${req.body.user}')
          
          )`

          //console.log(q)


        //console.log(req.body.form, req.body.user, 'q :103 ', q)
        try {
          const client = await pool.connect()
          await client.query(q,(err01,response01) => { 
          if (err01){
            console.log('Err - update' , 01, err01)
          } 
          })
          end = new Date()  
          console.log(200, "Vracim  Vysledky Save  za : ", end.getTime() - start.getTime() )
          await client.release()
          res.json({info: 'Ok test'});
    
          } catch (e) {
    
          }  
          
        
        return
      }


      ///102

      ///1021
      if (req.body.id_query  == 1031){
        //console.log('Kontakt only', req.body.id_query )
        
       
       
        //console.log(req.body.form, req.body.user)
        if (req.body.form.narozeniny == null) {
            req.body.form.narozeniny = '19001231'

        }
        var q1031= `update list_firmaprovozovna

          set idefix_firma                 ='${req.body.form.idefix_firma}',
              kod                 ='${req.body.form.kod}',
              nazev                 ='${req.body.form.nazev}',
              jmeno                 ='${req.body.form.jmeno}',
              prijmeni                 ='${req.body.form.prijmeni}',
              titul                 ='${req.body.form.titul}',
              titulza                 ='${req.body.form.titulza}',
              funkce                 ='${req.body.form.funkce}',
              oddeleni                 ='${req.body.form.oddeleni}',
              prioritni                 ='${req.body.form.prioritni}',
              tel                 ='${req.body.form.tel}',
              tel2                 ='${req.body.form.tel2}',
              tel3                 ='${req.body.form.tel3}',
              mail                 ='${req.body.form.mail}',
              www                 ='${req.body.form.www}',
              poznamka                 ='${req.body.form.poznamka}',

              psc                 ='${req.body.form.psc}',
              obec                 ='${req.body.form.obec}',
              ulice                 ='${req.body.form.ulice}',
              aktivni                 ='${req.body.form.aktivni}',
              po                 ='${req.body.form.po}',
              ut                 ='${req.body.form.ut}',
              st                 ='${req.body.form.st}',
              ct                 ='${req.body.form.ct}',
              pa                 ='${req.body.form.pa}',
              so                 ='${req.body.form.so}',
              ne                 ='${req.body.form.ne}',
              user_update_idefix                 =login2idefix('${req.body.user}')
              where idefix = '${req.body.form.idefix}'
              `

          //console.log(q1021)


        //console.log(req.body.form, req.body.user, 'q 1031: ', q1021)
        try {
          const client = await pool.connect()
          await client.query(q1031,(err01,response01) => { 
          if (err01){
            console.log('Err - update' , 01, err01)
          } 
          })
          end = new Date()  
          console.log(200, "Vracim  Vysledky Save  za : ", end.getTime() - start.getTime() )
          await client.release()
          res.json({info: 'Ok test'});
    
          } catch (e) {
    
          }  
          
        
        return
      }

      ///1021

      ///1022
      if (req.body.id_query  == 1032){
        //console.log('provozovnat only', req.body.id_query )
        
       
       
        //console.log(req.body.form, req.body.user)
        
        var q1022= `update list_firmaprovozovna

              set aktivni        =not aktivni ,
              user_update_idefix                 =login2idefix('${req.body.user}')
              where idefix = '${req.body.form.idefix}'
              `

          //console.log(q1022)


        //console.log(req.body.form, req.body.user, 'q 1032: ', q1032)
        try {
          const client = await pool.connect()
          await client.query(q1022,(err1022,response01) => { 
          if (err1022){
            console.log('Err - update' , 01, err1022)
          } 
          })
          end = new Date()  
          console.log(200, "Vracim  Vysledky Save  za : ", end.getTime() - start.getTime() )
          await client.release()
          res.json({info: 'Ok test'});
    
          } catch (e) {
    
          }  
          
        
        return
      }

      ///1022

      //Provozovny
      
      

    }
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
      //console.log(dotaz)

      try {
        const client = await pool.connect()
        await client.query(dotaz,(err01,response01) => { 
        if (err01){
          console.log('Err - update' , 01, err01)
        } 
        })
        end = new Date()  
        console.log(200, "Vracim  Vysledky Save  za : ", end.getTime() - start.getTime() )
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
      //console.log(dotaz)

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
          //console.log(dotaz)
           client.query(dotaz  ,[  ],(err, response ) => {
             if (err) {
               return next(err)
             } 
          
            })
        
      });
      
      // const dotaz = `insert into list2_barevnost(kod,nazev,user_insert, user_insert_idefix) 
      //   values ('${kod}', '${nazev}', '${user}', login2idefix('${user}') ) `
      //console.log('Insert barevnost', req.body, kod, nazev,"U",user)
      //console.log('Uvolnuji')
      end = new Date()  
      console.log(200, "Vracim  Vysledky Save  za : ", end.getTime() - start.getTime() )
      await client.release()
      res.json({info: 'Ok' })

    } catch (err) {
      //console.log(err)
      res.status(411).send({
        error: 'Barevnost - nelze vlozit kod'
      })
    }
    // console.log('Insert barevnost', req)
    

  },

  async delete (req, res, next ) {
    const client = await pool.connect()
    // req.body.params.id
    //console.log('Delete' ,req.body.params )
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


    //console.log('Delete Firma', req.body.params.id)
  }


}
