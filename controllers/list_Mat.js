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

   console.log(req.body.form.data.dodavatel_priorita)
   // res.json({'value': 1})
    //return
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
          ,dodavatel_priorita= ${req.body.form.data.dodavatel_priorita}::int
          ,nakup_result = '${req.body.form.data.nakup_result}'
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
if ((req.body.form.barva+'').match(/[0-9]/) ) {
    var atmp = []
    var ctmp = ''
    var abarva = []
    
    abarva.push(req.body.form.barva)
    await abarva.forEach(element => {
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
        console.log('Err - BARVA 03 A ?' , "03 TOP ", dotaz ,"EOF ")
      }
    })
  
    await abarva.forEach(element => {
      dotaz  = ` insert into list_mat_barva (idefix_mat,idefix_barva,user_insert_idefix)`
      dotaz +=  `select ${req.body.idefix} ,${element}, login2idefix('${req.body.user}')`
      client.query(dotaz,(err04, response04) =>{
        if (err04){
          console.log('04 - Barva','Zaznam je vlozen? ')
        } else {
          console.log('Resp BARVA 04', 'OK')
        }
          
      })
      console.log(dotaz,"\n")

    })
  } else {

    dotaz = `delete from list_mat_barva where idefix_mat = ${req.body.idefix} ` 
  
  
    await client.query(dotaz,(err033,response033) => { 
    if (err033){
      console.log('Err - BARVA DEL 033 A ?' , "033 TOP ", dotaz ,"EOF ")
    }
  })

  }    
//Barva EOF


 // //Potisknutelnot
 console.log("P", req.body.form.potisknutelnost, 'Match: ',(req.body.form.potisknutelnost+'').match(/[0-9]/))
 //   res.json({a:1})
    //return
 if ((req.body.form.potisknutelnost+'').match(/[0-9]/) ) {
  var atmp = []
  var ctmp = ''
  var apotisk  = []
  apotisk.push(req.body.form.potisknutelnost)
  await apotisk.forEach(element => {
    atmp.push(element)

  })
  ctmp = '('+atmp.join(',')+',0)'
  console.log("P 2", req.body.form.potisknutelnost, 'Match: ',(req.body.form.potisknutelnost+'').match(/[0-9]/), ctmp)
    //return
  if (atmp.length>0) {
    dotaz = `delete from list_mat_potisknutelnost where idefix_mat = ${req.body.idefix}  and idefix_potisknutelnost not in ${ctmp}`
  } else {
    dotaz = `delete from list_mat_potisknutelnost where idefix_mat = ${req.body.idefix} ` 
  }
  
  await client.query(dotaz,(err031,response031) => { 
    if (err031){
      console.log('Err - update 031 A' , "031 ---\n\n", err031.error,"\n\n ---------(", dotaz,"  )" )
    }
  })
  await apotisk.forEach(element => {
    dotaz  = ` insert into list_mat_potisknutelnost (idefix_mat,idefix_potisknutelnost,user_insert_idefix)`
    dotaz +=  `select ${req.body.idefix} ,${element}, login2idefix('${req.body.user}')`
    client.query(dotaz,(err041, response04) =>{
      if (err041){
        console.log('041','Zaznam potisknutelnost je vlozen? ')
      } else {
        console.log('Resp potisknutelnost 041', 'OK')
      }
        
    })
    console.log(dotaz,"\n")

  })
}  else {
  dotaz = `delete from list_mat_potisknutelnost where idefix_mat = ${req.body.idefix} ` 
  await client.query(dotaz,(err044,response044) => { 
    if (err044){
      console.log('Err - POTISKNUTELNOST DEL 044 A ?' , "044 TOP ", dotaz ,"EOF ")
    }
  })

}     
//Potisknutelnot EOF


 // Stroj
 var atmp = []
 var ctmp = ''

 await req.body.form.stroj.forEach(element => {
   atmp.push(element)

 })
 ctmp = '('+atmp.join(',')+',0)'
 if (atmp.length>0) {

  dotaz = `delete from list_mat_stroj where idefix_mat = ${req.body.idefix}  and idefix_stroj not in ${ctmp}`
 } else {
  dotaz = `delete from list_mat_stroj where idefix_mat = ${req.body.idefix} ` 
 }
 
 await client.query(dotaz,(err06,response06) => { 
  if (err06){
    console.log('Err -update Stroj Skup' , 06, err05)
  }
})
await req.body.form.stroj.forEach(element => {
  dotaz  = ` insert into list_mat_stroj (idefix_mat,idefix_stroj,user_insert_idefix)`
  dotaz +=  `select ${req.body.idefix} ,${element}, login2idefix('${req.body.user}')`
  client.query(dotaz,(err07, response07) =>{
    if (err07){
      console.log('07','Zaznam je vlozen? ')
    } else {
      console.log('Resp stroj 07', 'OK')
    }
       
  })
  console.log(dotaz,"\n")

})
//// Stroj

 // StrojSkup
 var atmp = []
 var ctmp = ''
 await req.body.form.strojskup.forEach(element => {
   atmp.push(element)
 })
 ctmp = '('+atmp.join(',')+',0)'
 if (atmp.length>0) {
  dotaz = `delete from list_mat_strojskup where idefix_mat = ${req.body.idefix}  and idefix_strojskup not in ${ctmp}`
  //console.log(dotaz)
  //res.json({a:1})
 } else {
  dotaz = `delete from list_mat_strojskup where idefix_mat = ${req.body.idefix} ` 
  //console.log(dotaz)
  //res.json({a:1})

 }
 //return
 await client.query(dotaz,(err004,response04) => { 
  if (err004){
    console.log('Err - update' , 004, err004)
  }
})
await req.body.form.strojskup.forEach(element => {
  dotaz  = ` insert into list_mat_strojskup (idefix_mat,idefix_strojskup,user_insert_idefix)`
  dotaz +=  `select ${req.body.idefix} ,${element}, login2idefix('${req.body.user}')`
  client.query(dotaz,(err005, response005) =>{
    if (err005){
      console.log('005','Zaznam strojskup je vlozen? ')
    } else {
      console.log('Resp strojskup 005', 'OK')
    }
       
  })
  console.log(dotaz,"\n")

})

//Stroj Skup

await client.query(`select fce_list_mat_clean('') `,(err999, response999) =>{
  if (err999){
    console.log('999','fce_list_mat_clean: Zhavarovala ')
  } else {
    console.log('Resp fce_list_mat_clean ', 'OK')
  }
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
        stroj: [],
        info: []
      }

      console.log(req.query.id)
      req_query_id = req.query.id
      req_query_id_query = req.query.id_query
      req_query_string_query = req.query.string_query
      console.log(" Par ",req_query_id_query, "String ", req.query.string_query)
      //res.json({"a": 1})
      //return
    try {   
      const client = await pool.connect()

      if (req_query_string_query=='edit'){
        req_query_string_query =''   //nema smysl nic jakoby s tim je to default
      }
      if (req.query.string_query=='copy'){
        console.log("req_query_id: ", req_query_id )

        await client.query(`select fce_list_mat_copy as new_idefix from fce_list_mat_copy(${req_query_id})`,(err88,response88) => {
          if (err88){
            console.log("Err",88);
          }
          
          console.log(88, response88.rows)
          req_query_id = response88.rows[0].new_idefix
          resObj.newId = req_query_id
          console.log(88, 'New Id = :', req_query_id)
        //  res.json({newId: req_query_id})
          

          
        })  
          
        req_query_string_query =''   //napred ma smlysl, pusti se procedura na sql a ta nasype zpet nove idefix materialu a pak je mozne zase to jakoby smaznout
      }
      //return


      if (!req_query_id > 0 && req_query_id_query != 8 && req_query_id_query != 6) {
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
       var q_init = `insert into list_mat_projcena (idefix_mat,datum) select * from (select ${req_query_id} as idefix_mat,now()::date ) a 
        where a.idefix_mat>0 and not exists (select * from list_mat_projcena b where a.idefix_mat=b.idefix_mat)`
        await client.query(q_init ,(errinit, responseinit) => {
          console.log(responseinit)
          if (errinit) {
            //console.log(err.error)
            console.log('Chybka', q_init )
            //res.status(200).send({"error": err})
            return
          }
        }) 
       
  

      var dotaz =`select * from ${tabname} where idefix = ${req_query_id}`
      var dotaz_vlastnosti =`select * from list_mat_vlastnosti where idefix_mat = ${req_query_id}`
      var dotaz_barva =`select * from list_mat_barva where idefix_mat = ${req_query_id}`
      var dotaz_rozmer = `select * from list_mat_rozmer  where idefix_mat = ${req_query_id}`
      var dotaz_strojskup = `select * from list_mat_strojskup where idefix_mat = ${req_query_id}`
      var dotaz_stroj     = `select * from list_mat_stroj     where idefix_mat = ${req_query_id}`
      var dotaz_potisknutelnost     = `select * from list_mat_potisknutelnost     where idefix_mat = ${req_query_id}`
      var dotaz_projcena     = `select * from list_mat_projcena     where idefix_mat = ${req_query_id}`

      var enum_matskup        = `select * from list2_matskup order by kod `
      var enum_matsubskup     = `select * from list2_matsubskup order by kod `
      var enum_matvyrobce     = `select * from list2_matvyrobce order by kod `
      var enum_matvlastnosti  = `select * from list2_matvlastnosti order by kod `
      var enum_matbarva       = `select * from list2_matbarva order by kod `
      var enum_matpotisknutelnost       = `select * from list2_matpotisknutelnost order by kod `

      var enum_strojskup  = `select * from list2_strojskup order by kod`
      var enum_stroj      = `select * from list_stroj     order by kod`
      

      

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

      
      var dotaz_rozmer2= `select idefix_mat
        ,b.zkratka
        ,array_agg(distinct replace(a.idefix::text||'~'||(sirka_mm/1000)::numeric(10,2)::text||'x'||(vyska_mm/1000)::numeric(10,2)::text,'.00','')) as rozmer_deska 
        ,array_agg(distinct replace(a.idefix::text||'~'||(sirka_mm)::numeric(10,2)::text||'x'||(vyska_mm/1000)::numeric(10,2)::text,'.00','')) as rozmer 
        ,array_agg(distinct sirka_mm_zbytek::numeric(10,2)::text||'x'||vyska_mm_zbytek::numeric(10,2)::text) as rozmer_zbytek 
        ,array_agg(distinct sirka_mm::numeric(10,2)) as sirky, array_agg(distinct vyska_mm::int) as delky
      from list_mat_rozmer a join list2_matdostupnost b on a.idefix_dostupnost = b.idefix
      where a.idefix_mat = ${req_query_id}
      group by b.zkratka, idefix_mat order by case when zkratka ='X' then '111' || zkratka else '999' || zkratka end desc`
      

      var enum_matdostupnost  = `select idefix,nazev,zkratka from list2_matdostupnost order by kod `
      

      
      //console.log(dotaz,dotaz_rozmer, dotaz_vlastnosti, dotaz_strojskup)
      console.log(dotaz_projcena,req_query_id, req_query_id_query )
      //res.json({a: 1})
      //return
      
      
      
      
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

     if (req_query_id_query==-1 || req_query_id_query==100) {
        await  client.query(dotaz_vlastnosti,(err2,response2) => {
        if (err2) {
          myres.info = -1
          return
        }
          resObj.vlastnosti = []
          response2.rows.forEach(el => {
          resObj.vlastnosti.push(el.idefix_vlastnost)
            if (req_query_id_query == 1) {
              //console.log(resObj)
            //  res.json(resObj)
            }
          })  
        })
        if (req_query_id_query == 100) {
        
          res.json(resObj)
          console.log(resObj)
          await client.release()     
          return
        }
      }
      
      

     if (req_query_id_query==-1 || req_query_id_query==101) {
      await  client.query(dotaz_rozmer,(err3,response3) => {
      if (err3) {
        myres.info = -1
        return
      }
      resObj.rozmer=response3.rows
      })
      if (req_query_id_query == 101) {
        
        res.json(resObj)
        console.log(resObj)
        await client.release()     
        return
      }
      }

    if (req_query_id_query==-1 || req_query_id_query==2) {
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
    }


    if (req_query_id_query==-1 || req_query_id_query==3) { 
    await  client.query(dotaz_stroj,(err41,response41) => {
        if (err41) {
          myres.info = -1
          return
        }
        resObj.stroj = []
          response41.rows.forEach(el => {
          resObj.stroj.push(el.idefix_stroj)
         })
        //resObj.strojskup=response4.rows
        //console.log(resObj)
        //console.log(resObj.vlatnosti)
        })
        if (req_query_id_query == 3) {
          console.log(resObj)
          res.json(resObj)
          await client.release()
          return
        }
      }
          
      if (req_query_id_query==-1 || req_query_id_query==200) {
        await  client.query(dotaz_projcena,(err200,response200) => {
        if (err200) {
          myres.info = -1
          return
        }
        resObj.projcena=response200.rows
        })
        if (req_query_id_query == 200) {
          
          //res.json(resObj)
          //console.log(resObj)
          await client.release()     
          return
        }
        }
    if (req_query_id_query==-1 || req_query_id_query==4) {
      await  client.query(enum_matskup,(err5,response5) => {
        if (err5) {
          myres.info = -1
          return
        }
        resObj.enum_matskup=response5.rows
        //console.log(resObj)
        //console.log(resObj.vlatnosti)
        })
        if (req_query_id_query == 4) {
          console.log(resObj)
          res.json(resObj)
          await client.release()
          return
        }
     }   

     if (req_query_id_query==-1 || req_query_id_query==5) {
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
          if (req_query_id_query == 5) {
            console.log(resObj)
            res.json(resObj)
            await client.release()
            return
          }
        }   
        if (req_query_id_query==-1 || req_query_id_query==6) { 
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
            if (req_query_id_query == 6) {
              //console.log(resObj)
              res.json(resObj)
              await client.release()
              return
            }
          }
    
          if (req_query_id_query==-1 || req_query_id_query==7) {
            await  client.query(enum_matvlastnosti,(err9,response9) => {
              if (err9) {
                myres.info = -1
                console.log(7, "Err")
                return
              }
              resObj.enum_matvlastnosti=response9.rows
              console.log(7, "OK")
              
              //console.log(resObj)
              })               
             if (req_query_id_query == 7) {
               res.json(resObj)
               await client.release()
               return
             }
            }    

            if (req_query_id_query==-1 || req_query_id_query==102) {
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
              }
              
              if (req_query_id_query==-1 || req_query_id_query==103) {
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
               }   
               if (req_query_id_query==-1 || req_query_id_query==104) {
               await  client.query(enum_n3,(err12,response12) => {
                    if (err12) {
                      myres.info = -1
                      console.log(12, "err")
                      return
                    }
                    resObj.enum_n3=response12.rows
                    
                    console.log(12,"OK", response12.rowCount)
                    })   
               }

            if (req_query_id_query==-1 || req_query_id_query==8) {                    
               await  client.query(enum_dodavatel,(err13,response13) => {
                 if (err13) {
                   myres.info = -1
                   console.log(13, "err")
                   return
                 }
                 resObj.enum_dodavatel = response13.rows
                 
                 
                 console.log(13,"Dodavatel")
                 }) 
                 if (req_query_id_query == 8) {
        
                  res.json(resObj)
                  console.log(resObj)
                  await client.release()     
                  return
                }
              }

              if (req_query_id_query==-1 || req_query_id_query==105) {
                 await  client.query(dotaz_rozmer2,(err14,response14) => {
                  if (err14) {
                    myres.info = -1
                    console.log(14, "err")
                    return
                  }
                  resObj.rozmer2 = response14.rows
                  
                  
                  console.log(14, "Rozmer")
                  })  
                }
                if (req_query_id_query==-1 || req_query_id_query==9) { 
                await  client.query(enum_matdostupnost,(err15,response15) => {
                    if (err15) {
                      myres.info = -1
                      console.log(15, "err")
                      return
                    }
                    resObj.enum_matdostupnost = response15.rows
      
                    console.log(15, "Dostupnost ")
                    })   
                  }
                  if (req_query_id_query==-1 || req_query_id_query==10) {
                    await  client.query(enum_strojskup,(err16,response16) => {
                      if (err16) {
                        myres.info = -1
                        console.log(16, "err")
                        return
                      }
                      resObj.enum_strojskup = response16.rows
        
                      console.log(16, "Stroj Skup ")
                      })    
                      if (req_query_id_query == 10) {
                        //console.log(resObj)
                        res.json(resObj)
                        await client.release()
                        return
                      }  
                    }
                    if (req_query_id_query==-1 || req_query_id_query==11) {
                      await  client.query(enum_stroj,(err161,response161) => {
                        if (err161) {
                          myres.info = -1
                          console.log(161, "err", err161)
                          return
                        }
                        resObj.enum_stroj = response161.rows
          
                        console.log(161, "Stroje-technologie ")
                        })    
                        if (req_query_id_query == 11) {
                          //console.log(resObj)
                          res.json(resObj)
                          await client.release()
                          return
                        }

                      }
                      if (req_query_id_query==-1 || req_query_id_query==12) {
                      await  client.query(enum_matbarva,(err17,response17) => {
                        if (err17) {
                          myres.info = -1
                          console.log(17, "err")
                          return
                        }
                        resObj.enum_matbarva = response17.rows
          
                        console.log(17, "Barva ")
                        })      
                        if (req_query_id_query == 12) {
        
                          res.json(resObj)
                          console.log(resObj)
                          await client.release()     
                          return
                        }
                      }
                      if (req_query_id_query==-1 || req_query_id_query==13) {
                        await  client.query(dotaz_barva,(err18,response18) => {
                          if (err18) {
                            myres.info = -1
                            console.log(18, "err")
                            return
                          }
                            resObj.barva = 0
                            response18.rows.forEach(el => {
                            //resObj.barva.push(el.idefix_barva)
                            resObj.barva=el.idefix_barva
                          })
                          // resObj.barva = response18.rows
            
                          console.log(18, "Barva ",resObj.barva)
                          })        
                          if (req_query_id_query == 13) {
        
                            res.json(resObj)
                            console.log(resObj)
                            await client.release()     
                            return
                          }
                        }
                         
                        if (req_query_id_query==-1 || req_query_id_query==14) {
                          await  client.query(enum_matpotisknutelnost,(err171,response171) => {
                            if (err171) {
                              myres.info = -1
                              console.log(171, "err - potisknutelnost")
                              return
                            }
                            resObj.enum_matpotisknutelnost = response171.rows
              
                            console.log(17, "Enum potisknutelnost ")
                            })      
                            if (req_query_id_query == 14) {
        
                              res.json(resObj)
                              console.log(resObj)
                              await client.release()     
                              return
                            }
                          }

                          if (req_query_id_query==-1 || req_query_id_query==15) {
                            await  client.query(dotaz_potisknutelnost,(err181,response181) => {
                              if (err181) {
                                myres.info = -1
                                console.log(181, "err")
                                return
                              }
                                resObj.potisknutelnost = 0
                                
                                response181.rows.forEach(el => {
                                //resObj.potisknutelnost.push(el.idefix_potisknutelnost)
                                 resObj.potisknutelnost=el.idefix_potisknutelnost
                                 return
                              })
                              
                              // resObj.barva = response18.rows
                
                              console.log(181, "Postiknutenost ",resObj.potisknutelnost)
                              })   
                              if (req_query_id_query == 15) {
        
                                res.json(resObj)
                                console.log(resObj)
                                await client.release()     
                                return
                              }     
                            }
                        if (req_query_id_query==-1 || req_query_id_query==16) {
                          await  client.query(enum_koef_naklad,(err19,response19) => {
                            if (err19) {
                              myres.info = -1
                              console.log(19, "err")
                              return
                            }
                            resObj.enum_koef_naklad = response19.rows
              
                            console.log(19, "enum koef naklad ")
                            })
                            if (req_query_id_query == 16) {
        
                              res.json(resObj)
                              console.log(resObj)
                              await client.release()     
                              return
                            }        
                          }

                          if (req_query_id_query==-1 || req_query_id_query==17) {
                            await  client.query(enum_koef_prodej,(err20,response20) => {
                              if (err20) {
                                myres.info = -1
                                console.log(20, "err koef prodej")
                                return
                              }
                              resObj.enum_koef_prodej = response20.rows
                
                              console.log(20, "enum koef prodej ")
                              })            
                              if (req_query_id_query == 17) {
        
                                res.json(resObj)
                                console.log(resObj)
                                await client.release()     
                                return
                              } 
                            }
                            if (req_query_id_query==-1 || req_query_id_query==18) {
                              await  client.query(enum_sirka,(err21,response21) => {
                                if (err21) {
                                  myres.info = -1
                                  console.log(21, "err enum sirka")
                                  return
                                }
                                resObj.enum_sirka = response21.rows
                  
                                console.log(20, "enum koef prodej ")
                              }) 
                              if (req_query_id_query == 18) {
        
                                res.json(resObj)
                                console.log(resObj)
                                await client.release()     
                                return
                              }
                            }
                            if (req_query_id_query==-1 || req_query_id_query==19) {
                              await  client.query(enum_vyska,(err22,response22) => {
                                  if (err22) {
                                    myres.info = -1
                                    console.log(22, "err enum vyska")
                                    return
                                  }
                                  resObj.enum_vyska = response22.rows
                    
                                  console.log(22, "enum vyska ")
                              })              
                              if (req_query_id_query == 19) {
        
                                res.json(resObj)
                                console.log(resObj)
                                await client.release()     
                                return
                              }
                            }
                            if (req_query_id_query==-1 || req_query_id_query==20) { 
                            await  client.query(enum_sirka_zbytek,(err23,response23) => {
                                if (err23) {
                                  myres.info = -1
                                  console.log(23, "err enum sirka zbytek")
                                  return
                                }
                                resObj.enum_sirka_zbytek = response23.rows
                                console.log(23, "enum sirka zbytek ")
                              }) 
                              if (req_query_id_query == 20) {
        
                                res.json(resObj)
                                console.log(resObj)
                                await client.release()     
                                return
                              }
                            }
                            if (req_query_id_query==-1 || req_query_id_query==21) {
                              await  client.query(enum_vyska_zbytek,(err24,response24) => {
                                if (err24) {
                                  myres.info = -1
                                  console.log(24, "err enum vyska zbytek")
                                  return
                                }
                                resObj.enum_vyska_zbytek = response24.rows
                                console.log(24, "enum vyska zbytek ")
                              })               
                              if (req_query_id_query == 21) {
        
                                res.json(resObj)
                                console.log(resObj)
                                await client.release()     
                                return
                              }
                            }
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
      res.status(822).send({
        error: 'Mat ' + e
      });
    }
    
    

    },
    

    async all (req, res) {
      var dotaz=''
      var where =' where true '
      var order ='order by mattyp, podskupina '
      var tmp =''
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
      else {
        tmp = req.query.id
        where = `${where} and (${tmp})` 
      }
      
      console.log(req.query.id, req.query.limit ,req.query.offset , where )
      //res.json({a:1})
      //return

dotaz=`  
select 
a.idefix
,a.idefix_matsubskup
,ms.zkratka as mattyp
,ms.nazev as skupina ,mss.nazev  as podskupina

,a.nazev1,a.nazev2,a.nazev3
,a.popis
,a.cena_nakup_m2
,a.sila_mm
,mv.nazev
,replace(mrs.rozmers,',',chr(10) ) as rozmers
,mrs.sirkys,mrs.delkymms,mrs.navins

,replace(mro.rozmero,',', chr(10) ) as rozmero
,mro.sirkyo,mro.delkymmo,mro.navino

,replace(mrpp.rozmerpp,',', chr(10) ) as rozmerpp
,mrpp.sirkypp,mrpp.delkymmpp,mrpp.navinpp

,mv.nazev as vyrobce
,md.nazev as dodavatel
,mtech.technologie,mtech.technologie_text
,mtechskup.technologie_skup
,idefix_dodavatel,idefix_vyrobce
--a.*,md.* 
from list_mat a
--Enums
left join list2_matskup ms on a.idefix_matskup = ms.idefix
left join list2_matsubskup mss on a.idefix_matsubskup = mss.idefix
left join list2_matvyrobce mv on a.idefix_vyrobce = mv.idefix
---Propojky 1:1
left join 
(select * from list_dodavatel where mat =1 ) md
 on a.idefix_dodavatel = md.idefix

--Propojky n:n

left join 
(
	
select idefix_mat,b.zkratka
	         ,array_to_string(array_agg(distinct (sirka_mm/1000)::numeric(10,2)::text||'x'||(vyska_mm/1000)::numeric(10,2)::int::text),',') as rozmers 
			   , array_to_string(array_agg(distinct sirka_mm::int),',') as sirkys
			   , array_to_string(array_agg(distinct vyska_mm::int),',') as delkymms
			   , array_to_string(array_agg(distinct vyska_mm/1000::int),',') as navins
	
from list_mat_rozmer a join list2_matdostupnost b on a.idefix_dostupnost = b.idefix where b.zkratka='S' and idefix_mat >0
group by b.zkratka, idefix_mat
	
) mrs on a.idefix =mrs.idefix_mat

left join 
(
	
select idefix_mat,b.zkratka
	         ,array_to_string(array_agg(distinct (sirka_mm/1000)::numeric(10,2)::text||'x'||(vyska_mm/1000)::numeric(10,2)::int::text),',') as rozmerpp 
			   , array_to_string(array_agg(distinct sirka_mm::int),',') as sirkypp
			   , array_to_string(array_agg(distinct vyska_mm::int),',') as delkymmpp
			   , array_to_string(array_agg(distinct vyska_mm/1000::int),',') as navinpp
	
from list_mat_rozmer a join list2_matdostupnost b on a.idefix_dostupnost = b.idefix where b.zkratka='PP' and idefix_mat >0
group by b.zkratka, idefix_mat
	
) mrpp on a.idefix =mrpp.idefix_mat

left join 
(
	
select idefix_mat,b.zkratka
	           ,array_to_string(array_agg(distinct (sirka_mm/1000)::numeric(10,2)::text||'x'||(vyska_mm/1000)::numeric(10,2)::int::text),',') as rozmero 
			   , array_to_string(array_agg(distinct sirka_mm::int),',') as sirkyo
			   , array_to_string(array_agg(distinct vyska_mm::int),',') as delkymmo
			   , array_to_string(array_agg(distinct vyska_mm/1000::int),',') as navino
	
from list_mat_rozmer a join list2_matdostupnost b on a.idefix_dostupnost = b.idefix where b.zkratka='O' and idefix_mat >0
group by b.zkratka, idefix_mat
	
) mro on a.idefix =mro.idefix_mat




left join (
	select a.idefix_mat
,array_to_string(array_agg(distinct b.nazev) ,',') as technologie
,array_to_string(array_agg(distinct b.nazev_text) ,',') as technologie_text
from list_mat_stroj a join list_stroj b on a.idefix_stroj = b.idefix
group by idefix_mat
) mtech on a.idefix = mtech.idefix_mat
`

dotaz = `${ dotaz } 
left join (
	select a.idefix_mat
,array_to_string(array_agg(distinct b.nazev) ,',') as technologie_skup
from list_mat_strojskup a join list2_strojskup b on a.idefix_strojskup = b.idefix
group by idefix_mat
) mtechskup on a.idefix = mtechskup.idefix_mat
`

dotaz = `select * from ( ${dotaz} ) a ${where} ${order}`

//console.log(dotaz)
       console.log('BBBB')

         await client.query(dotaz ,(err, response) => {
          //console.log(response)
           if (err) {
             console.log(err)
             return
           }
           if (response.rowCount == 0)   {
             console.log(response,'nic')
           
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
         ,dodavatel_priorita
         ,nakup_result
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
        ,'${element[0].dodavatel_priorita}'
        ,'${element[0].nakup_result}'
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
          ,dodavatel_priorita='${element[0].dodavatel_priorita}'
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
