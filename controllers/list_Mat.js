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
var req_query_id = -10
var req_query_string_query = ''
var req_query_id_query = 0


const tabname = 'list_mat'
module.exports = {
  async saveone (req,res) {
  //   var  myres = {
  //    xdata: [],
  //    vlastnosti:[],
  //    rozmer: [],
  //    strojskup: [],
  //    info: []
  //  }


   console.log(req.body.form.data, req.body.form.vlastnosti,req.body.idefix, req.body.user, req.body.form.data.kod)

   //Dotavatel
   var idefix_dodavatel =req.body.form.data.idefix_dodavatel
   var dodavatel_expr=''
   var idefix_vyrobce   =req.body.form.data.idefix_vyrobce
   var vyrobce_expr=''
      //idefix_dodavatel=0
   
      if (idefix_vyrobce*1 > 0){
        console.log('idfx2',idefix_vyrobce*1 > 0)
        vyrobce_expr=idefix_vyrobce
      } else {
        vyrobce_expr=`fce_list2_mat_vyrobce_insert('${idefix_vyrobce}')`
      }
   
       if (idefix_dodavatel*1 > 0){
        console.log('idfx2',idefix_dodavatel*1 > 0)
        dodavatel_expr=idefix_dodavatel

        } else {
          dodavatel_expr=`fce_list_dodavatel_insert('${idefix_dodavatel}')`
        }

   
   dotaz = `update  ${tabname} set 
           kod ='${req.body.form.data.kod}'
          ,idefix_matskup ='${req.body.form.data.idefix_matskup}' 
          ,idefix_matsubskup='${req.body.form.data.idefix_matsubskup}'
          ,idefix_vyrobce=${vyrobce_expr}
          ,nazev1='${req.body.form.data.nazev1}'
          ,nazev2='${req.body.form.data.nazev2}'
          ,nazev3='${req.body.form.data.nazev3}'
          ,popis='${req.body.form.data.popis}'
          ,idefix_dodavatel= ${dodavatel_expr}
          ,sila_mm='${req.body.form.data.sila_mm}'
          ,vaha_gm2='${req.body.form.data.vaha_gm2}'
          ,cena_nakup_m2='${req.body.form.data.cena_nakup_m2}'
          ,koef_naklad='${req.body.form.data.koef_naklad}'
          ,koef_prodej='${req.body.form.data.koef_prodej}'
          ,cena_nakup_kg='${req.body.form.data.cena_nakup_kg}'
          ,cena_nakup_arch='${req.body.form.data.cena_nakup_arch}'
          ,cena_naklad_arch='${req.body.form.data.cena_naklad_arch}'
          ,cena_naklad_m2='${req.body.form.data.cena_naklad_m2}'
          ,cena_prodej_m2='${req.body.form.data.cena_prodej_m2}'
          ,cena_prodej_arch='${req.body.form.data.cena_prodej_arch}'
          
          ,user_update_idefix = login2idefix('${req.body.user}')`;
          dotaz += ` where idefix = ${req.body.idefix}`
          dotaz = dotaz.replace(/undefined/g,'0')
          dotaz = dotaz.replace(/null/g,'0')


          console.log(dotaz)
          //return
          
  //  req_query_id = req.query.id
  //  req_query_id_query = req.query.id_query
  //  req_query_string_query = req.query.string_query
  const client = await pool.connect()
   await client.query(dotaz,(err01,response01) => { 
     if (err01){
       console.log('Err - update' , 01, err01)
     }
   })
   var atmp = []
   var ctmp = ''
   await req.body.form.vlastnosti.forEach(element => {

        if ((element+'').match(/[0-9]/g)){
          atmp.push(element)
          console.log(" cislo cislo cislo cislo ")  
        } else {
          client.query(`select fce_list2_mat_vlastnost_insert('${element}') as id2`,(erra11,resa11)=>{
            if (erra11){
              console.log('Nelze pridati vlastnost')
            } else {
              console.log(resa11.rows)
             atmp.push(resa11.rows[0].id2)  
             ctmp = '('+atmp.join(',')+')'
             console.log("CTMP: ",ctmp)
             client.query(`insert into list_mat_vlastnosti (idefix_mat,idefix_vlastnost,user_insert_idefix) values (${req.body.idefix} ,${resa11.rows[0].id2}, login2idefix('${req.body.user}') )`)
            }
          })

        }
   })


   ctmp = '('+atmp.join(',')+')'
   console.log("CTMP: ",ctmp)

   if (atmp.length>0) {
    dotaz = `delete from list_mat_vlastnosti where idefix_mat = ${req.body.idefix}  and idefix_vlastnost not in ${ctmp}`
   } else {
    dotaz = `delete from list_mat_vlastnosti where idefix_mat = ${req.body.idefix} ` 
   }
   
  await client.query(dotaz,(err01,response01) => { 
    if (err01){
      console.log('Err - update' , 01, err01)
    }
  })

  await atmp.forEach(element => {
    dotaz  = ` insert into list_mat_vlastnosti (idefix_mat,idefix_vlastnost,user_insert_idefix)`
    dotaz +=  `select ${req.body.idefix} ,${element}, login2idefix('${req.body.user}')`
    client.query(dotaz,(err02, response01) =>{
      if (err02){
        console.log('Zaznam je vlozen? ')
      } else {
        console.log('Resp 02', 'OK')
      }
         
    })
    console.log(dotaz,"\n")
 
  })

  var atmp = []
  var ctmp = ''
  

  //Dodavatel
 // Barva
 var atmp = []
 var ctmp = ''
 await req.body.form.barva.forEach(element => {
   atmp.push(element)

 })
 ctmp = '('+atmp.join(',')+',0)'
 if (atmp.length>0) {
  dotaz = `delete from list_mat_barva where idefix_mat = ${req.body.idefix}  and idefix_barva not in ${ctmp}`
 } else {
  dotaz = `delete from list_mat_barva where idefix_mat = ${req.body.idefix} ` 
 }
 
 await client.query(dotaz,(err03,response03) => { 
  if (err03){
    console.log('Err - update' , 03, err03)
  }
})
await req.body.form.barva.forEach(element => {
  dotaz  = ` insert into list_mat_barva (idefix_mat,idefix_barva,user_insert_idefix)`
  dotaz +=  `select ${req.body.idefix} ,${element}, login2idefix('${req.body.user}')`
  client.query(dotaz,(err04, response04) =>{
    if (err04){
      console.log('04','Zaznam je vlozen? ')
    } else {
      console.log('Resp barva 04', 'OK')
    }
       
  })
  console.log(dotaz,"\n")

})



 // StrojSkup
 var atmp = []
 var ctmp = ''
 await req.body.form.strojskup.forEach(element => {
   atmp.push(element)

 })
 ctmp = '('+atmp.join(',')+',0)'
 if (atmp.length>0) {
  dotaz = `delete from list_mat_strojskup where idefix_mat = ${req.body.idefix}  and idefix_strojskup not in ${ctmp}`
 } else {
  dotaz = `delete from list_mat_strojskup where idefix_strojskup = ${req.body.idefix} ` 
 }
 
 await client.query(dotaz,(err04,response04) => { 
  if (err04){
    console.log('Err - update' , 04, err04)
  }
})
await req.body.form.strojskup.forEach(element => {
  dotaz  = ` insert into list_mat_strojskup (idefix_mat,idefix_strojskup,user_insert_idefix)`
  dotaz +=  `select ${req.body.idefix} ,${element}, login2idefix('${req.body.user}')`
  client.query(dotaz,(err05, response05) =>{
    if (err05){
      console.log('05','Zaznam strojskup je vlozen? ')
    } else {
      console.log('Resp strojskup 05', 'OK')
    }
       
  })
  console.log(dotaz,"\n")

})

   console.log(atmp,'/', ctmp, dotaz)  


   await client.release()

   res.json({info: 'Ok test'});
  }, 
    async one (req,res) {
       var  myres = {
        xdata: [],
        vlastnosti:[],
        rozmer: [],
        strojskup: [],
        info: []
      }

      console.log(req.query.id)
      req_query_id = req.query.id
      req_query_id_query = req.query.id_query
      req_query_string_query = req.query.string_query
      const client = await pool.connect()

      if (req_query_string_query=='edit'){
        req_query_string_query =''   //nema smysl nic jakoby s tim je to default
      }
      if (req.query.string_query=='copy'){
        await client.query(`select fce_list_mat_copy as new_idefix from fce_list_mat_copy(${req_query_id})`,(err88,response88) => {
          if (err88){
            console.log("Err",88);
          }
          
          console.log(88, response88.rows)
          req_query_id = response88.rows[0].new_idefix

          
        })  
          
        req_query_string_query =''   //napred ma smlysl, pusti se procedura na sql a ta nasype zpet nove idefix materialu a pak je mozne zase to jakoby smaznout
      }
      //return


      if (!req_query_id > 0 ) {
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

      var dotaz =`select * from ${tabname} where idefix = ${req_query_id}`
      var dotaz_vlastnosti =`select * from list_mat_vlastnosti where idefix_mat = ${req_query_id}`
      var dotaz_barva =`select * from list_mat_barva where idefix_mat = ${req_query_id}`
      var dotaz_rozmer = `select * from list_mat_rozmer  where idefix_mat = ${req_query_id}`
      var dotaz_strojskup = `select * from list_mat_strojskup where idefix_mat = ${req_query_id}`

      var enum_matskup        = `select * from list2_matskup order by kod `
      var enum_matsubskup     = `select * from list2_matsubskup order by kod `
      var enum_matvyrobce     = `select * from list2_matvyrobce order by kod `
      var enum_matvlastnosti  = `select * from list2_matvlastnosti order by kod `
      var enum_matbarva       = `select * from list2_matbarva order by kod `

      var enum_strojskup  = `select * from list2_strojskup order by kod`
      

      

      var enum_n1 =`select distinct nazev1 as value from list_mat order by nazev1`
      var enum_n2 =`select distinct nazev2 as value from list_mat order by nazev2`
      var enum_n3 =`select distinct nazev3 as value from list_mat order by nazev3`

      var enum_koef_naklad =`select distinct koef_naklad::text as value from list_mat order by value`
      var enum_koef_prodej =`select distinct koef_prodej::text as value from list_mat order by value`
      var enum_sirka        = `select distinct sirka_mm::text        as value from list_mat_rozmer order by value ` 
      var enum_vyska        = `select distinct vyska_mm::text        as value from list_mat_rozmer order by value ` 
      var enum_sirka_zbytek = `select distinct sirka_mm_zbytek::text as value from list_mat_rozmer order by value `
      var enum_vyska_zbytek = `select distinct vyska_mm_zbytek::text as value from list_mat_rozmer order by value `


      var enum_dodavatel  = `select * from list_dodavatel order by kod `   //Doplnit pominkove online dohledabvani pro kod ktery teprve vznikne

      
      var dotaz_romer2= `select idefix_mat,b.zkratka,array_agg(distinct replace(a.idefix::text||'~'||sirka_mm::numeric(10,2)::text||'x'||vyska_mm::numeric(10,2)::text,'.00','')) as rozmer, 
        array_agg(distinct sirka_mm_zbytek::numeric(10,2)::text||'x'||vyska_mm_zbytek::numeric(10,2)::text) as rozmer_zbytek, 
        array_agg(distinct sirka_mm::numeric(10,2)) as sirky, array_agg(distinct vyska_mm::int) as delky
      from list_mat_rozmer a join list2_matdostupnost b on a.idefix_dostupnost = b.idefix
      where a.idefix_mat = ${req_query_id}
      group by b.zkratka, idefix_mat order by zkratka desc`


      var enum_matdostupnost  = `select idefix,nazev,zkratka from list2_matdostupnost order by kod `
      

      
      //console.log(dotaz,dotaz_rozmer, dotaz_vlastnosti, dotaz_strojskup)
      
      
      try {
        if ( req.query.string_query >''){
          await client.query(req_query_string_query,(err99,response99) => {
            if (err99) {
              myres.info = -1
              console.log(99, 'Err', err99)
              return
            }
            console.log('OK',req_query_string_query)
    
          })

        }
       
      
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
      resObj.strojskup = []
        response4.rows.forEach(el => {
        resObj.strojskup.push(el.idefix_strojskup)
       })
      //resObj.strojskup=response4.rows
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
            console.log(7, "Err")
            return
          }
          resObj.enum_matsubskup=response7.rows
          console.log(7, "OK")
          
          
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
                    
                    console.log(12,"OK", response12.rowCount)
                    })                  
               await  client.query(enum_dodavatel,(err13,response13) => {
                 if (err13) {
                   myres.info = -1
                   console.log(13, "err")
                   return
                 }
                 resObj.enum_dodavatel = response13.rows
                 
                 
                 console.log(13,"Dodavatel")
                 }) 

                 await  client.query(dotaz_romer2,(err14,response14) => {
                  if (err14) {
                    myres.info = -1
                    console.log(14, "err")
                    return
                  }
                  resObj.rozmer2 = response14.rows
                  
                  
                  console.log(14, "Rozmer")
                  })  

                  await  client.query(enum_matdostupnost,(err15,response15) => {
                    if (err15) {
                      myres.info = -1
                      console.log(15, "err")
                      return
                    }
                    resObj.enum_matdostupnost = response15.rows
      
                    console.log(15, "Dostupnost ")
                    })   
                    await  client.query(enum_strojskup,(err16,response16) => {
                      if (err16) {
                        myres.info = -1
                        console.log(16, "err")
                        return
                      }
                      resObj.enum_strojskup = response16.rows
        
                      console.log(16, "Stroj Skup ")
                      })    
                      await  client.query(enum_matbarva,(err17,response17) => {
                        if (err17) {
                          myres.info = -1
                          console.log(17, "err")
                          return
                        }
                        resObj.enum_matbarva = response17.rows
          
                        console.log(17, "Stroj Skup ")
                        })      
                        await  client.query(dotaz_barva,(err18,response18) => {
                          if (err18) {
                            myres.info = -1
                            console.log(18, "err")
                            return
                          }
                            resObj.barva = []
                            response18.rows.forEach(el => {
                            resObj.barva.push(el.idefix_barva)
                          })
                          // resObj.barva = response18.rows
            
                          console.log(18, "Barva ",)
                          })        
                          await  client.query(enum_koef_naklad,(err19,response19) => {
                            if (err19) {
                              myres.info = -1
                              console.log(19, "err")
                              return
                            }
                            resObj.enum_koef_naklad = response19.rows
              
                            console.log(19, "enum koef naklad ")
                            })        
                            await  client.query(enum_koef_prodej,(err20,response20) => {
                              if (err20) {
                                myres.info = -1
                                console.log(20, "err koef prodej")
                                return
                              }
                              resObj.enum_koef_prodej = response20.rows
                
                              console.log(20, "enum koef prodej ")
                              })            
                              await  client.query(enum_sirka,(err21,response21) => {
                                if (err21) {
                                  myres.info = -1
                                  console.log(21, "err enum sirka")
                                  return
                                }
                                resObj.enum_sirka = response21.rows
                  
                                console.log(20, "enum koef prodej ")
                              })             
                              await  client.query(enum_vyska,(err22,response22) => {
                                  if (err22) {
                                    myres.info = -1
                                    console.log(22, "err enum vyska")
                                    return
                                  }
                                  resObj.enum_vyska = response22.rows
                    
                                  console.log(22, "enum vyska ")
                              })              
                              await  client.query(enum_sirka_zbytek,(err23,response23) => {
                                if (err23) {
                                  myres.info = -1
                                  console.log(23, "err enum sirka zbytek")
                                  return
                                }
                                resObj.enum_sirka_zbytek = response23.rows
                                console.log(23, "enum sirka zbytek ")
                              })              
                              await  client.query(enum_vyska_zbytek,(err24,response24) => {
                                if (err24) {
                                  myres.info = -1
                                  console.log(24, "err enum vyska zbytek")
                                  return
                                }
                                resObj.enum_vyska_zbytek = response24.rows
                                console.log(24, "enum vyska zbytek ")
                              })               
                 ///console.log(myres.info)                                     
                await  client.query('select 1',(errxx,responsexx) => {  //Podvodny dotaz, ktery vynuti wait na vsechny vysledky - zahada jako bejt, vubectro nechapu ale funguje to
                  console.log(200, "Vracim  Vysledek")
                  console.log(dotaz,dotaz_rozmer, dotaz_vlastnosti, dotaz_strojskup, " Par ",req_query_id_query, "String ", req.query.string_query)
                  

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
    try { 
      const client = await pool.connect()
      if (req.query.id=='nic'){
        dotaz=`select * from ${tabname} where 1=1 order by kod `
      } else if (req.query.id=='max'){
        dotaz = `select kod as kod from ${tabname} where 1=1 order by kod desc limit 1`
      }
      else if (req.query.id=='max'){
        dotaz = `select kod as kod from ${tabname} where 1=1 order by kod desc limit 1`
      }
      

      console.log(req.query.id, dotaz )
    
      

        
        console.log('BBBB')

        
        

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
    const client = await pool.connect()
    req.body.params.id
     await client.query(`select fce_list_mat_del(${req.body.params.id})` ,(err00, response00) => {
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


    console.log('Delete barevnost', req.body.params.id)
  }


}
