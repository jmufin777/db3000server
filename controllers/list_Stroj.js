//const {User} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const {pool, client } = require('../db')
const _ = require('lodash')
const fs = require('fs');

var lErr= false
const resObj = {
  stroj: [],
  enum_nazev_text: [],
  enum_strojskup: [],

}

var req_query_id = -10
var req_query_string_query = ''
var req_query_id_query = 0
var b = false




const tabname = 'list_stroj'
module.exports = {
    async saveone (req,res) {
      console.log(req.body.form, "user: ", req.body.user, "idefix :", req.body.idefix)
      //res.json({'a': 1})
      //return
      //fce_strojmod_copy(idefix_stroj_to bigint, _idefix_mod bigint )
      //fce_strojmod_move(idefix_stroj_to bigint, _idefix_mod bigint )
      var cq=""
      var MoveOrCopy = false;
      if (req.body.moveMod && req.body.moveMod ==1 ){
        MoveOrCopy = true;
        cq= `select fce_strojmod_move(${req.body.form.idefix_stroj}, ${req.body.form.idefix_mod} )`
        console.log("MOve", req.body.form)

        //return
      }
      if (req.body.copyMod && req.body.copyMod ==1 ){
        console.log("Copy",req.body.form)
        MoveOrCopy = true;
        cq= `select fce_strojmod_copy(${req.body.form.idefix_stroj}, ${req.body.form.idefix_mod} )`

        //return
      }
      if (MoveOrCopy == true) {
      try {

          const client = await pool.connect()
          console.log(cq)  
          await client.release()
          await client.query(cq,(errcq01,cq01) => { 
            if (errcq01) {
              console.log("Err pri presunu", errcq0, "PADAVKA 55: ", cq)
            } else {
              console.log("Vysledek " ,cq01)
            }

          }
          )  
          res.json({info: 'Ok test'});
          return;
      
         } catch(e) {
          console.log("Chytiljsme chybku", e)

        }
        return
      }  

      var dotaz = `update list_stroj set `
      dotaz = dotaz + `

      kod             = '${req.body.form.data.kod}',
      idefix_strojskup             = '${req.body.form.data.idefix_strojskup}',
      nazev             = '${req.body.form.data.nazev}',
      sirka_mat_max_mm             = '${req.body.form.data.sirka_mat_max_mm}',
      delka_mat_max_mm             = '${req.body.form.data.delka_mat_max_mm}',
      sirka_tisk_max_mm             = '${req.body.form.data.sirka_tisk_max_mm}',
      delka_tisk_max_mm             = '${req.body.form.data.delka_tisk_max_mm}',
      tech_okraj_strana_mm             = '${req.body.form.data.tech_okraj_strana_mm}',
      tech_okraj_start_mm             = '${req.body.form.data.tech_okraj_start_mm}',
      tech_okraj_spacecopy_mm             = '${req.body.form.data.tech_okraj_spacecopy_mm}',
      tech_okraj_spacejobs_mm             = '${req.body.form.data.tech_okraj_spacejobs_mm}',
      tech_okraj_end_mm             = '${req.body.form.data.tech_okraj_end_mm}',
      bez_okraj             = '${req.body.form.data.bez_okraj}',
      spadavka_mm             = '${req.body.form.data.spadavka_mm}',
      space_znacky_mm             = '${req.body.form.data.space_znacky_mm}',
      user_insert_idefix             = coalesce('${req.body.form.data.user_insert_idefix}',0),
      nazev_text             = '${req.body.form.data.nazev_text}',
      priprava_minuta_naklad             = '${req.body.form.data.priprava_minuta_naklad}',
      priprava_minuta_prodej             = '${req.body.form.data.priprava_minuta_prodej}',
      priprava_cas_minuta             = '${req.body.form.data.priprava_cas_minuta}',
      priprava_celkem_naklad             = '${req.body.form.data.priprava_celkem_naklad}',
      priprava_celkem_prodej             = '${req.body.form.data.priprava_celkem_prodej}',
      sirka_lam_max_mm             = '${req.body.form.data.sirka_lam_max_mm}',
      delka_lam_max_mm             = '${req.body.form.data.delka_lam_max_mm}',
      `
      dotaz += `user_update_idefix = login2idefix('${req.body.user}')`;
      dotaz += ` where idefix = ${req.body.idefix}`
      dotaz = dotaz.replace(/null/g,'0')
      dotaz = dotaz.replace(/\n/g,' ')
      dotaz = dotaz.replace(/\\/g,' ')
      dotaz = dotaz.replace(/undefined/g,'0')

      try {
        const client = await pool.connect()
        
        await client.query(dotaz,(err01,response01) => { 
        if (err01){
          console.log('Err - update' , 01, err01, "PADAVKA 108: ", dotaz)
        }
        })
        //console.log(req.body.data.strojmod)
        var updatemod=''
        var insertmod =''
        var valuesmod= `
        (
        idefix_stroj,
        idefix_prace,
        kod,
        nazev,
        nazev_text,
        rychlost,
        idefix_jednotka,
        idefix_i1,
        i1spotreba,
        idefix_i2,
        i2spotreba,
        idefix_i3,
        i3spotreba,
        idefix_i4,
        i4spotreba,
        idefix_i5,
        i5spotreba,
        mod_priorita,
        user_insert_idefix ) values `
        

        var idefix_valid='0'

       await req.body.form.strojmod.forEach(element => {
          if (element.idefix >0 ){
            updatemod = `update list_strojmod set 
        
        idefix_prace ='${element.idefix_prace}',
        idefix_stroj ='${element.idefix_stroj}',
        kod ='${element.kod}',
        nazev ='${element.nazev}',
        nazev_text ='${element.nazev_text}',
        rychlost ='${element.rychlost}',
        idefix_jednotka ='${element.idefix_jednotka}',
        idefix_i1 ='${element.idefix_i1}',
        i1spotreba ='${element.i1spotreba}',
        idefix_i2 ='${element.idefix_i2}',
        i2spotreba ='${element.i2spotreba}',
        idefix_i3 ='${element.idefix_i3}',
        i3spotreba ='${element.i3spotreba}',
        idefix_i4 ='${element.idefix_i4}',
        i4spotreba ='${element.i4spotreba}',
        idefix_i5 ='${element.idefix_i5}',
        i5spotreba ='${element.i5spotreba}',
        mod_priorita ='${element.mod_priorita}',
        user_update_idefix= login2idefix('${req.body.user}'),
        time_update = now() 
        where idefix = ${element.idefix}
        `

        updatemod = updatemod.replace(/null/g,'0')
        updatemod = updatemod.replace(/\n/g,' ')
        updatemod = updatemod.replace(/\\/g,' ')
        updatemod = updatemod.replace(/undefined/g,'0')
        //console.log(updatemod)
        b = false
        try {
          client.query(updatemod, (errupdate, resupdate) => {
            console.log(errupdate  )
            if (errupdate){
              console.log(errupdate , "PADAVKA 172: ", updatemod )
            }
          })
          b = true
        } catch (e) {
          console.log(errupdate , "PADAVKA 172: ", updatemod )
          b = true
        }

         while (!b) {
           console.log('Cekma update \n')
         };

            //update

            if (idefix_valid > '') idefix_valid +=','
            idefix_valid += element.idefix
          }
          if (element.idefix <0 ){ //insert 
            if (insertmod >'') insertmod +=','
          insertmod+= ` (
        '${element.idefix_stroj}',
        '${element.idefix_prace}',
        '${element.kod}',
        '${element.nazev}',
        '${element.nazev_text}',
        '${element.rychlost}',
        '${element.idefix_jednotka}',
        '${element.idefix_i1}',
        '${element.i1spotreba}',
        '${element.idefix_i2}',
        '${element.i2spotreba}',
        '${element.idefix_i3}',
        '${element.i3spotreba}',
        '${element.idefix_i4}',
        '${element.i4spotreba}',
        '${element.idefix_i5}',
        '${element.i5spotreba}',
        '${element.mod_priorita}',
        login2idefix('${req.body.user}')
           
          )`
            

            console.log('Delam Insert' , insertmod)
          }


       // console.log(element)
       // console.log(idefix_valid)
          
       });
       
       if (idefix_valid > '') {
         
        var moddelete=`delete from list_strojmod  a where  idefix_stroj = ${req.body.idefix} and not exists
        ( select * from list_strojmod b where b.idefix in (${idefix_valid}) and idefix_stroj = ${req.body.idefix} and a.idefix = b.idefix )`
        await client.query(moddelete, (errmoddelete, resmoddelete) => {
          if (errmoddelete){
            console.log('delete',errmoddelete,  "PADAVKA 229 : ", moddelete )
          }
          
        }) 
       }

       if (insertmod > '') {
        insertmod='insert into list_strojmod '  + valuesmod + insertmod

        insertmod = insertmod.replace(/null/g,'0')
        insertmod = insertmod.replace(/undefined/g,'0')
        
       try {
        b=false
        await client.query(insertmod, (errmod, resmod) => {
//          console.log(resmod.Result)
            if (errmod){
              console.log('abc',errmod,  "PADAVKA 243: ", insertmod )
            }
              
          
        }) 
        b=true
      } catch(ex) {
        b=true
      }
        while (!b) {
          console.log('Cekma insert \n')
        };

       }

       //Stroj Ceny

       /*
       idefix: -10,
       idefix_stroj: '9183',
       idefix_strojmod: 0,
       idefix_inkoust: 0,
       idefix_jednotka: 9356,
       nazev: 'prdka',
       kod: '1',
       pocet_start: 0,
       pocet_stop: 0,
       cena_naklad: 0,
       cena_prodej: 0,
       start: '0',
       stop: '20',
       
       */

      var idefix_ceny_valid='0'
      var updateceny=''

      
      var insertceny =''
      var valuesceny= `
      (
        idefix_stroj,
        idefix_strojmod,
        idefix_jednotka,
        kod,
        nazev,
        pocet_start,
        pocet_stop,
        cena_naklad,
        cena_prodej,
        user_insert_idefix ) values `
      

     await req.body.form.strojceny.forEach(element => {
        if (element.idefix >0 ){
          updateceny = `update list_strojceny set 
      
      
      idefix_strojmod ='${element.idefix_strojmod}',
      idefix_jednotka ='${element.idefix_jednotka}',
      kod ='${element.kod}',
      nazev ='${element.nazev}',
      pocet_start ='${element.pocet_start}',
      pocet_stop ='${element.pocet_stop}',
      cena_naklad ='${element.cena_naklad}',
      cena_prodej ='${element.cena_prodej}',
      
      
      user_update_idefix= login2idefix('${req.body.user}'),
      time_update = now() 
      where idefix = ${element.idefix}
      `
      updateceny = updateceny.replace(/null/g,'0')
      updateceny = updateceny.replace(/undefined/g,'0')

      console.log(updateceny)
      client.query(updateceny, (errupdateceny, resupdateceny) => {
        if (errupdateceny){
          console.log(errupdateceny ,"PADAVKA 318: ", updateceny )
        }
        
      })



          //update

          if (idefix_ceny_valid > '') idefix_ceny_valid +=','
          idefix_ceny_valid += element.idefix
        }
        if (element.idefix <0 ){ //insert 
          if (insertceny >'') insertceny +=','

        insertceny+= ` (
          '${element.idefix_stroj}',
          '${element.idefix_strojmod}',
          '${element.idefix_jednotka}',
          '${element.kod}',
          '${element.nazev}',
          '${element.pocet_start}',
          '${element.pocet_stop}',
          '${element.cena_naklad}',
          '${element.cena_prodej}',
          login2idefix('${req.body.user}')
          )`

          console.log(insertmod)
        }
     
        
     });
     
     if (idefix_ceny_valid > '') {
       
      var cenydelete=`delete from list_strojceny  a where  idefix_stroj = ${req.body.idefix} and not exists
      ( select * from list_strojceny b where b.idefix in (${idefix_ceny_valid}) and idefix_stroj = ${req.body.idefix} and a.idefix = b.idefix )`
      // console.log(cenydelete)
      await client.query(cenydelete, (errcenydelete, rescenydelete) => {
        if (errcenydelete){
          console.log('delete',errcenydelete, "PADAVKA 356 ", cenydelete) 
        }
        
      }) 
     }

     if (insertceny > '') {
      insertceny='insert into list_strojceny '  + valuesceny + insertceny
      insertceny = insertceny.replace(/null/g,'0')

      insertceny = insertceny.replace(/undefined/g,'0')

      await client.query(insertceny, (errceny, resceny) => {
        console.log('abc',errceny,  "PADAVKA 367 ", insertceny )
      }) 
     }

      console.log(req.body.form.strojceny) 
      console.log('ahj')
      await req.body.form.strojceny.forEach(element => {
         if (element.idefix >0 ){
           updateceny = `update list_strojmod set  `
         }
        }
      )    
      await client.release()
      res.json({info: 'Ok test'});

      } catch (e) {

      }
      //console.log(dotaz)


  },

  async one (req,res) {
    var  myres = {
     xdata: [],
  
     strojskup: [],
     strojmod: [],
     strojmodfull: [],
     strojmod_text: [],
     strojbarevnost: [],
     strojmod_barevnost: [],
     strojinkoust: [],
     strojinkoustbarevnost: [],
     strojceny: [],
     stroj: [],
     info: [],

     enum_barevnost: [],
     enum_barevnosttxt: [],
     enum_nazev: [],
     enum_nazev_text: [],
     enum_strojmod: [],
     enum_strojmod_text: [],
     enum_strojinkoust: [],
     enum_prace: [],
     enum_jednotka: [],
     enum_inkoust: [],
     enum_strojmod_this: [],
     enum_strojmod_full: [],
     enum_format: [],
     enum_matspec: [],
     enum_strojmod_nema:[],


   }
   
      req_query_id = req.query.id
      req_query_id_query = req.query.id_query
      req_query_string_query = req.query.string_query
//    console.log('a::', req_query_id, ':', req_query_id_query,":",req_query_string_query)
  // res.json({'a':[]})
   //return
      try {
        const client = await pool.connect()
    
        if (req_query_string_query=='edit'){
          req_query_string_query =''   //nema smysl nic jakoby s tim je to default
        }
        if (req.query.string_query=='copy'){
          console.log("req_query_id: ", req_query_id )
          console.log(`select fce_list_stroj_copy as new_idefix from fce_list_stroj_copy(${req_query_id})`)
          
          await client.query(`select fce_list_stroj_copy as new_idefix from fce_list_stroj_copy(${req_query_id})`,(err88,response88) => {
            if (err88){
              console.log("Err",88, "PADAVKA  88 443");
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



      var dotaz =`select a.*, b.typ_kalkulace from ${tabname} a join list2_strojskup b on a.idefix_strojskup = b.idefix where a.idefix = ${req_query_id}`

      var enum_strojskup        = `select * from list2_strojskup order by kod`                                                              // --  10   enum_strojskup    
      // var enum_strojskup        = `select nazev as label,idefix as value from list2_strojskup order by kod`                                                              // --  10   enum_strojskup    
      var enum_barevnost        = `select * from list2_barevnost order by kod`                                                              // --  11   enum_barevnost
      var enum_barevnosttxt        = `select nazev from list2_barevnost order by kod`                                                              // --  12   enum_barevnost
      var enum_format           = `select idefix,nazev,kod,sirka,vyska from list2_format order by kod`                                                              // --  12   enum_barevnost

      
      var enum_nazev_text       = `select distinct nazev_text    as value from list_stroj order by nazev_text`                 //  -- 101   enum_nazev_text
      var enum_nazev            = `select distinct nazev         as value from list_stroj order by nazev`                      //  -- 102   enum_nazev
      var enum_strojmod         = `select distinct nazev         as value from list_strojmod order by nazev`                   //  -- 103   enum_strojmod
      var enum_strojmod_this    = `select idefix,nazev           as value from list_strojmod a where a.idefix_stroj = ${req_query_id} order by kod`    //  -- 109   enum_strojmod_this
      var enum_strojmod_text    = `select distinct nazev_text    as value from list_strojmod order by nazev_text`              //  -- 104   enum_strojmod_text
      var enum_strojceny_nazev  = `select distinct nazev         as value from list_strojceny order by nazev`              //  -- 1091   enum_strojceny_nazev
      var enum_strojinkoust     = `select distinct nazev         as value from list_strojinkoust order by nazev`               //  -- 105   enum_strojinkoust
      var enum_strojmod_nema =`select _idefixstroj as idefix_stroj ,_nazev as nazev from fce_stroj_nema(${req_query_id})`;
      
      var enum_strojmod_full=`select a.idefix ,b.idefix as idefix_mod,a.nazev as stroj,b.nazev,b.nazev_text, b.mod_priorita from list_stroj a join list_strojmod b on a.idefix=b.idefix_stroj  order by case when b.mod_priorita then 1 else 2 end`;
      var addA = `select a.idefix  from list_stroj a join list2_strojskup b on a.idefix_strojskup = b.idefix  where b.typ_kalkulace ~ 'A'  and tisk`
      var addV = `select a.idefix  from list_stroj a join list2_strojskup b on a.idefix_strojskup = b.idefix  where b.typ_kalkulace ~ 'V' and tisk `
      var addJine = `select a.idefix  from list_stroj a join list2_strojskup b on a.idefix_strojskup = b.idefix  where a.nazev_text like 'DTP' `
      var enum_strojmod_fullA=
      `select a.idefix ,b.idefix as idefix_mod,a.nazev as stroj,b.nazev,b.nazev_text, b.mod_priorita from list_stroj a join list_strojmod b on a.idefix=b.idefix_stroj  
       where a.idefix in (${addA}) 
      order by case when b.mod_priorita then 1 else 2 end`;
      var enum_strojmod_fullV=
      `select a.idefix ,b.idefix as idefix_mod,a.nazev as stroj,b.nazev,b.nazev_text, b.mod_priorita from list_stroj a join list_strojmod b on a.idefix=b.idefix_stroj  
       where a.idefix in (${addV}) 
      order by case when b.mod_priorita then 1 else 2 end`; 
      var enum_strojmod_fullJine=
      `select a.idefix ,b.idefix as idefix_mod,a.nazev as stroj,b.nazev,b.nazev_text, b.mod_priorita from list_stroj a join list_strojmod b on a.idefix=b.idefix_stroj  
       where a.idefix in (${addJine}) 
      order by case when b.mod_priorita then 1 else 2 end`; 


      //select * from list_stroj a join list2_strojskup b on a.idefix_strojskup = b.idefix  where b.typ_kalkulace = 'A' ;


      //var enum_prace        = `select idefix as value, nazev as label from list2_prace order by kod`                                                        // --  106   enum_prace    
      var enum_prace        = `select * from list2_prace order by kod`                                                        // --  106   enum_prace    
      var enum_jednotka      = `select * from list2_jednotka order by kod`                                                   //  --  107   enum_jednotka
      var enum_inkoust      = `
      select a.kod,a.idefix,concat2(' ',nazev1, nazev2, nazev3) as nazev  from list_mat a join list2_matskup b on a.idefix_matskup =b.idefix where b.zkratka = 'I' 
      and kalkulace =true
        union 
        select 0 as kod,0,'Ne'
        order by kod , idefix `;

     var dotaz_list_strojmod               =  `select *,fce_stroj_ma_txt(idefix) as ma from  list_strojmod              where idefix_stroj = ${req_query_id} order by kod`   //  -- 200   dotaz_list_strojmod              
     
     var dotaz_list_strojmodfull           =  `select * from  list_strojmod              where idefix_stroj = ${req_query_id}`   //  -- 200   dotaz_list_strojmod              
     var dotaz_list_strojmodbarevnost      =  `select * from  list_strojmodbarevnost     where idefix_stroj = ${req_query_id}`   //  -- 201   dotaz_list_strojmodbarevnost     
     var dotaz_list_strojinkoust           =  `select * from  list_strojinkoust          where idefix_stroj = ${req_query_id}`   //  -- 202   dotaz_list_strojinkoust          
     var dotaz_list_strojinkoustbarevnost  =  `select * from  list_strojinkoustbarevnost where idefix_stroj = ${req_query_id}`   //  -- 203   dotaz_list_strojinkoustbarevnost 
     var dotaz_list_strojceny              =  `select * from  list_strojceny             where idefix_stroj = ${req_query_id} order by kod`   //  -- 204   dotaz_list_strojceny             

     var dotaz_matspec = `      
     select c.zkratka,concat2(' ',b.nazev1,' ',b.nazev2,b.nazev3) as nazev,a.idefix as idefix_rozmer
     ,a.idefix_mat, sirka_mm,vyska_mm  from list_mat_rozmer a join list_mat b on a.idefix_mat = b.idefix 
     join list2_matskup c on b.idefix_matskup = c.idefix 
     where sirka_mm>0 and vyska_mm > 0 and c.zkratka = 'D'  or zkratka ='R'  
       `

/*
       if (req_query_id_query==600)  {
         console.log(enum_strojmod_nema)
          res.json({'a': 1});
          return
       }
*/
     
      
     

   
   
    //return
    
    await client.query(dotaz,(err,response) => {
      if (err) {
        myres.info = -1

        return
      }
      resObj.stroj = response.rows
      //console.log(resObj.stroj )

    })
    if (req_query_id_query==-1 || req_query_id_query==101) {
      await  client.query(`${enum_nazev_text}`,(err101,response101) => {
      if (err101) {
        myres.info = -1
        return
      }
        resObj.enum_nazev_text=response101.rows
      })
      if (req_query_id_query == 101) {
        setTimeout(function(){
          res.json(resObj)    
          
        },100)
        //console.log(resObj)
        await client.release()     
        return
      }
      }

      if ( req_query_id_query==600) {
        await  client.query(enum_strojmod_nema,(err600,response600) => {
          if (err600) {
            myres.info = -1
            console.log(600, "err: ",enum_strojmod_nema, err600)
            return
          }
          resObj.enum_strojmod_nema = response600.rows
          })    
          if (req_query_id_query == 600) {
            //console.log(resObj)
            setTimeout(function(){
              res.json(resObj.enum_strojmod_nema)
              
            },200)
            await client.release()
            
            return
          }  
        }

      // if (req_query_id_query==600)  {
      //   console.log(enum_strojmod_nema)
      //    res.json({'a': 1});
      //    return
      // }

      if (req_query_id_query==-1 || req_query_id_query==10) {
        await  client.query(enum_strojskup,(err10,response10) => {
          if (err10) {
            myres.info = -1
            //console.log(10, "err")
            return
          }
          resObj.enum_strojskup = response10.rows
          })    
          if (req_query_id_query == 10) {
            //console.log(resObj)
            setTimeout(function(){
              res.json(resObj)
              
            },200)
            await client.release()
            
            return
          }  
        }

        if (req_query_id_query==-1 || req_query_id_query==500) {
          await  client.query(enum_format,(err500,response500) => {
            if (err500) {
              myres.info = -1
              //console.log(10, "err")
              return
            }
            resObj.enum_format = response500.rows
            })    
            if (req_query_id_query == 10) {
              //console.log(resObj)
              
              setTimeout(function(){
                res.json(resObj)
              },100)
              await client.release()
              return
            }  
          }

          if (req_query_id_query==-1 || req_query_id_query==501) { //MatSpec
            await  client.query(dotaz_matspec,(err501,response501) => {
              if (err501) {
                myres.info = -1
                res.status(501).send({
                  error: `Chyba 501 pri pozadavku na databazi :${dotaz_matspec}`
                })
                // res.status(501);
                //console.log(10, "err")
                return
              }
              resObj.enum_matspec = response501.rows
              })    
              if (req_query_id_query == 501) {
                //console.log(resObj)
                setTimeout(function(){
                  res.json(resObj)
                },200)
                await client.release()
                return
              }  
            }

        if (req_query_id_query==-1 || req_query_id_query==11) {
          await  client.query(enum_barevnost,(err11,response11) => {
            if (err11) {
              myres.info = -1
              //console.log(11, "err")
              return
            }
            resObj.enum_barevnost = response11.rows
            })    
            if (req_query_id_query == 11) {
              //console.log(resObj)
              setTimeout(function(){
                res.json(resObj)
              },200)
              await client.release()
              return
            }  
          }
          if (req_query_id_query==-1 || req_query_id_query==12) {
            await  client.query(enum_barevnosttxt,(err12,response12) => {
              if (err12) {
                myres.info = -1
                console.log(11, "err")
                return
              }
              resObj.enum_barevnosttxt = response12.rows
              })    
              if (req_query_id_query == 12) {
                //console.log(resObj)
                setTimeout(function(){
                  res.json(resObj)
                },200)
                await client.release()
                return
              }  
            }
        if (req_query_id_query==-1 || req_query_id_query==102) {
          await  client.query(enum_nazev,(err102,response102) => {
            if (err102) {
              myres.info = -1
              console.log(102, "err")
              return
            }
            resObj.enum_nazev = response102.rows
            })    
            if (req_query_id_query == 102) {
              //console.log(resObj)
              setTimeout(function(){
                res.json(resObj)
              },200)
              await client.release()
              return
            }  
          }

          if (req_query_id_query==-1 || req_query_id_query==103) {
            await  client.query(enum_strojmod,(err103,response103) => {
              if (err103) {
                myres.info = -1
                console.log(103, "err")
                return
              }
              resObj.enum_strojmod = response103.rows
              })    
              if (req_query_id_query == 103) {
                //console.log(resObj)
                setTimeout(function(){
                  res.json(resObj)
                },200)
                await client.release()
                return
              }  
            }
            
          if (req_query_id_query==-1 || req_query_id_query==109) {
            
              await  client.query(enum_strojmod_this,(err109,response109) => {
                if (err109) {
                  myres.info = -1
                  console.log(109, "err - strojmod_this")
                  return
                }
                resObj.enum_strojmod_this = response109.rows
                })    
                if (req_query_id_query == 109) {
                  //console.log(resObj)
                  res.json(resObj)
                  await client.release()
                  return
                }  
              }

              if (req_query_id_query==-1 || req_query_id_query==1091) {
                await  client.query(enum_strojceny_nazev,(err1091,response1091) => {
                  if (err1091) {
                    myres.info = -1
                    console.log(1091, "err - strojmod_this")
                    return
                  }
                  resObj.enum_strojceny_nazev = response1091.rows
                  })    
                  if (req_query_id_query == 1091) {
                    //console.log(resObj)
                    res.json(resObj)
                    await client.release()
                    return
                  }  
              }
          
              


            
            if (req_query_id_query==-1 || req_query_id_query==104) {
              await  client.query(enum_strojmod_text,(err104,response104) => {
                if (err104) {
                  myres.info = -1
                  console.log(104, "err")
                  return
                }
                resObj.enum_strojmod_text = response104.rows
                })    
                if (req_query_id_query == 104) {
                  //console.log(resObj)
                  res.json(resObj)
                  await client.release()
                  return
                }  
            }  

            if (req_query_id_query==-1 || req_query_id_query==1041) {
              await  client.query(enum_strojmod_full,(err1041,response1041) => {
                if (err1041) {
                  myres.info = -1
                  console.log(1041, "err")
                  return
                }
                resObj.enum_strojmod_full = response1041.rows
                })    
                if (req_query_id_query == 1041) {
                  console.log(resObj)
                  res.json(resObj)
                  await client.release()
                  return
                }  
            }  
            if ( req_query_id_query==10410) {   //Archovy velkopploch bez tisku - naperu to do strjmod_full, kombinace by nemela nastat

              await  client.query(enum_strojmod_fullA,(err10410,response10410) => {
                if (err10410) {
                  myres.info = -1
                  console.log(10410, "err")
                  return
                }
                b = true
                resObj.enum_strojmod_full = response10410.rows
                if (response10410.rowCount > 0 ) {
                  console.log('A:',response10410.rows[0].stroj)
                }
                })    
                while (!b)
                if (req_query_id_query == 10410) {
                  setTimeout(function(){
                  if ( resObj.enum_strojmod_full.length > 0 ) {
                    console.log('Archo',10410,resObj.enum_strojmod_full[0].stroj)
                  }
                  b = false
                  
                    res.json(resObj)
                  },10)
                  
                  await client.release()
                  return
                }  
            }  
            if ( req_query_id_query==10411) {
              
              fs.appendFile('./reports/V.txt', enum_strojmod_fullV, function (errFile) {
                if (errFile) throw errFile;
                console.log('Saved!');
              });
              await  client.query(enum_strojmod_fullV,(err10411,response10411) => {
                if (err10411) {
                  myres.info = -1
                  console.log(10411, "err")
                  return
                }
                resObj.enum_strojmod_full = response10411.rows
                b = true
                if (response10411.rowCount > 0 ) {
                  console.log('V:',response10411.rows[0].stroj)
                }
                })    
                while (!b)
                if (req_query_id_query == 10411 ) {
                  setTimeout(function(){ 
                  try {
                    if (!resObj.enum_strojmod_full.length ){
                      console.log(resObj.enum_strojmod_full)
                    }
                  }  catch (e) {
                    console.log('Nelze zjistit ', e)
                  } 
                  if ( resObj.enum_strojmod_full.length > 0 ) {
                    console.log('Velko ',b,10411,resObj.enum_strojmod_full[0].stroj)
                
                  }
                  b = false  
                
                    res.json(resObj)
                  },200)
                  await client.release()
                  return
                }  
            }  

            if ( req_query_id_query==10412) {
              fs.appendFile('./reports/Externi.txt', enum_strojmod_fullJine, function (errFile) {
                if (errFile) throw errFile;
                console.log('Saved!');
              });
              await  client.query(enum_strojmod_fullJine,(err10412,response10412) => {
                if (err10412) {
                  myres.info = -1
                  console.log(10412, "err")
                  return
                }
                resObj.enum_strojmod_full = response10412.rows
                b = true
                if (response10412.rowCount > 0 ) {
                  console.log('V:',response10412.rows[0].stroj)
                }
                })    
                while (!b)
                if (req_query_id_query == 10412 ) {
                  setTimeout(function(){ 
                  try {
                    if (!resObj.enum_strojmod_full.length ){
                      console.log(resObj.enum_strojmod_full)
                    }
                  }  catch (e) {
                    console.log('Nelze zjistit ', e)
                  } 
                  if ( resObj.enum_strojmod_full.length > 0 ) {
                    console.log('Velko ',b,10412,resObj.enum_strojmod_full[0].stroj)
                
                  }
                  b = false  
                
                    res.json(resObj)
                  },20)
                  await client.release()
                  return
                }  
            }  

              
            if (req_query_id_query==-1 || req_query_id_query==105) {
                await  client.query(enum_strojinkoust,(err105,response105) => {
                  if (err105) {
                    myres.info = -1
                    console.log(105, "err")
                    return
                  }
                  resObj.enum_strojinkoust = response105.rows
                  })    
                  if (req_query_id_query == 105) {
                    //console.log(resObj)
                    res.json(resObj)
                    await client.release()
                    return
                 }  
            }    

            if (req_query_id_query==-1 || req_query_id_query==106) {
              await  client.query(enum_prace,(err106,response106) => {
                if (err106) {
                  myres.info = -1
                  console.log(106, "err")
                  return
                }
                resObj.enum_prace = response106.rows
                })    
                if (req_query_id_query == 106) {
                  //console.log(resObj)
                  res.json(resObj)
                  await client.release()
                  return
               }  
          }    

          if (req_query_id_query==-1 || req_query_id_query==107) {
            await  client.query(enum_jednotka,(err107,response107) => {
              if (err107) {
                myres.info = -1
                console.log(107, "err")
                return
              }
              resObj.enum_jednotka = response107.rows
              })    
              if (req_query_id_query == 107) {
                //console.log(resObj)
                res.json(resObj)
                await client.release()
                return
             }  
        }    

       if (req_query_id_query==-1 || req_query_id_query==108) {
          await  client.query(enum_inkoust,(err108,response108) => {
            if (err108) {
              myres.info = -1
              console.log(108, "err ", err108 )
              return
            }
            resObj.enum_inkoust = response108.rows
            })    
            if (req_query_id_query == 108) {
              //console.log(resObj)
              res.json(resObj)
              await client.release()
              return
           }  
       }     

          if (req_query_id_query==-1 || req_query_id_query==200) {

            await  client.query(dotaz_list_strojmod,(err200,response200) => {
              if (err200) {
                myres.info = -1
                console.log(200, "err", err200 )
                return
              }
              
              resObj.strojmod = response200.rows
              

              })    
              
              if (req_query_id_query == 200) {
              
                console.log(resObj)
                res.json(resObj)
                await client.release()
                return
                }  
            }

            if (req_query_id_query==-1 || req_query_id_query==2001) {
              
              await  client.query(dotaz_list_strojmodfull,(err2001,response2001) => {
                if (err2001) {
                  myres.info = -1
                  console.log(2001, "err", err2001 )
                  return
                }
                
                resObj.strojmodfull = response2001.rows
                
                })    
              
                if (req_query_id_query == 2001) {
                  
                  console.log(resObj)
                  res.json(resObj)
                  await client.release()
                  return
                  }  
              }
  
            if (req_query_id_query==-1 || req_query_id_query==201) {
              await  client.query(dotaz_list_strojmodbarevnost,(err201,response201) => {
                if (err201) {
                  myres.info = -1
                  console.log(201, "err")
                  return
                }
                resObj.strojmodbarevnost = response201.rows
                })    
                if (req_query_id_query == 201) {
                  console.log(resObj)
                  res.json(resObj)
                  await client.release()
                  return
                }  
              }

              if (req_query_id_query==-1 || req_query_id_query==202) {
                await  client.query(dotaz_list_strojinkoust,(err202,response202) => {
                  if (err202) {
                    myres.info = -1
                    console.log(202, "err")
                    return
                  }
                  resObj.strojinkoust = response202.rows
                  })    
                  if (req_query_id_query == 202) {
                    //console.log(resObj)
                    res.json(resObj)
                    await client.release()
                    return
                  }  
                }
               
                if (req_query_id_query==-1 || req_query_id_query==203) {
                  await  client.query(dotaz_list_strojinkoustbarevnost,(err203,response203) => {
                    if (err203) {
                      myres.info = -1
                      console.log(203, "err")
                      return
                    }
                    resObj.strojinkoustbarevnost = response203.rows
                    })    
                    if (req_query_id_query == 203) {
                      //console.log(resObj)
                      setTimeout(function(){
                        res.json(resObj)
                      },200)
                      await client.release()
                      return
                    }  
                  }
  
                  if (req_query_id_query==-1 || req_query_id_query==204) {
                    await  client.query(dotaz_list_strojceny,(err204,response204) => {
                      if (err204) {
                        myres.info = -1
                        console.log(204, "err")
                        return
                      }
                      resObj.strojceny = response204.rows
                      })    
                      if (req_query_id_query == 204) {
                        console.log(resObj)
                        setTimeout(function(){
                          res.json(resObj)
                        },200)
                        await client.release()
                        return
                      }  
                  }
    

// --  10   enum_strojskup    
// -- 101   enum_nazev_text
// -- 102   enum_nazev
// -- 103
// -- 200   dotaz_list_strojmod              
// -- 201   dotaz_list_strojmodbarevnost     
// -- 202   dotaz_list_strojinkoust          
// -- 203   dotaz_list_strojinkoustbarevnost 
// -- 204   dotaz_list_strojceny             

                await  client.query('select 1',(errxx,responsexx) => {  //Podvodny dotaz, ktery vynuti wait na vsechny vysledky - zahada jako bejk, vubectro nechapu ale funguje to
                  //console.log(200, "Vracim  Vysledek")
                  // dotaz_rozmer, dotaz_vlastnosti, dotaz_strojskup,
                  console.log(dotaz, " Par ",req_query_id_query, "String ", req.query.string_query)
                  

                  res.json(resObj)
                })  
                await client.release() 

   } catch(e) {

    console.log(e)
      res.status(822).send({
        error: 'Stroj  ' + e,
        req_query_id_query: req_query_id_query
      });

   }

  },


    async all (req, res) {
      var dotaz=''
      var where ='  true '
      var order =' order by idefix_stroj, podskupina '
      var tmp =''
      console.log(where, ' : ', req.query)
       
      
      console.log(dotaz, 'id:',req.query.id, 'lim:',req.query.limit ,'off:',req.query.offset , 'lim: ',  where )
      if (req.query.id=='nic'){
        dotaz=`select * from ${tabname} where 1=1 order by kod `
        
      } else if (req.query.id=='max'){
        dotaz = `select kod as kod from ${tabname} where 1=1 order by kod desc limit 1`
        
      } else {
         where = `${where} and ${ req.query.id }` 
         dotaz=`select a.*,b.nazev as nazev_skup, b.typ_kalkulace from ${tabname}  a`
         dotaz = `${dotaz} join list2_strojskup b on a.idefix_strojskup = b.idefix ` 
         dotaz = `${dotaz} where ${where} order by nazev_text,a.idefix `


      }
      console.log(req.query.id, dotaz )
       //res.json({a:1});
       // return
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
     sirka_mat_max_mm
     delka_mat_max_mm
     sirka_tisk_max_mm
     delka_tisk_max_mm
     tech_okraj_strana_mm
     tech_okraj_start_mm
     tech_okraj_spacecopy_mm
     tech_okraj_spacejobs_mm
     tech_okraj_end_mm
     bez_okraj
     spadavka_mm
     space_znacky_mm
     */

        if (element[0].id < 0 ){
          dotaz = `insert into  ${tabname} (kod,nazev,nazev_text,idefix_strojskup
     ,sirka_mat_max_mm
     ,delka_mat_max_mm
     ,sirka_tisk_max_mm
     ,delka_tisk_max_mm
     ,tech_okraj_strana_mm
     ,tech_okraj_start_mm
     ,tech_okraj_spacecopy_mm
     ,tech_okraj_spacejobs_mm
     ,tech_okraj_end_mm
     ,bez_okraj
     ,spadavka_mm
     ,space_znacky_mm
     ,user_insert_idefix
            
            ) values `;
          dotaz += `( ${element[0].kod},'${element[0].nazev}','${element[0].nazev_text}', '${element[0].idefix_strojskup}'
     ,'${element[0].sirka_mat_max_mm}'
     ,'${element[0].delka_mat_max_mm}'
     ,'${element[0].sirka_tisk_max_mm}'
     ,'${element[0].delka_tisk_max_mm}'
     ,'${element[0].tech_okraj_strana_mm}'
     ,'${element[0].tech_okraj_start_mm}'
     ,'${element[0].tech_okraj_spacecopy_mm}'
     ,'${element[0].tech_okraj_spacejobs_mm}'
     ,'${element[0].tech_okraj_end_mm}'
     ,'${element[0].bez_okraj}'
     ,'${element[0].spadavka_mm}'
     ,'${element[0].space_znacky_mm}'

          ,login2idefix('${user}') 
             )`
        }
        if (element[0].id > 0 ){
          dotaz = `update  ${tabname} set kod =${element[0].kod},nazev='${element[0].nazev}',nazev_text='${element[0].nazev_text}'
          ,idefix_strojskup            ='${element[0].idefix_strojskup}'
          ,sirka_mat_max_mm            ='${element[0].sirka_mat_max_mm}'
          ,delka_mat_max_mm            ='${element[0].delka_mat_max_mm}'
          ,sirka_tisk_max_mm           ='${element[0].sirka_tisk_max_mm}'
          ,delka_tisk_max_mm           ='${element[0].delka_tisk_max_mm}'
          ,tech_okraj_strana_mm        ='${element[0].tech_okraj_strana_mm}'
          ,tech_okraj_start_mm         ='${element[0].tech_okraj_start_mm}'
          ,tech_okraj_spacecopy_mm     ='${element[0].tech_okraj_spacecopy_mm}'
          ,tech_okraj_spacejobs_mm     ='${element[0].tech_okraj_spacejobs_mm}'
          ,tech_okraj_end_mm           ='${element[0].tech_okraj_end_mm}'
          ,bez_okraj                   ='${element[0].bez_okraj}'
          ,spadavka_mm                 ='${element[0].spadavka_mm}'
          ,space_znacky_mm             ='${element[0].space_znacky_mm}'
          ,user_update_idefix = login2idefix('${user}')`;
          dotaz += ` where id = ${element[0].id}`
        }
          console.log(dotaz.replace(/undefined/g,'0'))

          dotaz = dotaz.replace(/undefined/g,'0')
          dotaz = dotaz.replace(/null/g,'0')
           client.query(dotaz  ,[  ],(err, response ) => {
             if (err) {
              console.log(dotaz.replace(/undefined/g,'0'))

               return next(err)
             } 
          
            })

        
      });
//      res.json({'a': 1})
      
      
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
    console.log('Delete')
     await client.query(`select fce_list_stroj_del(${req.body.params.id})` ,(err00, response00) => {
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
  },

  async setTisk (req, res, next ) {
    const client = await pool.connect()
    var q = `update list_stroj set tisk = case when '${req.body.params.anone}' = 'A' then true
    when '${req.body.params.anone}' = 'N' then false end
    where idefix = ${req.body.params.id}`
    //req.body.params.id
    console.log('Set tisk', req.body.params.id , req.body.params.anone , q)
    
    
     await client.query( q,(err00, response00) => {
       if (err00){
         console.log('Err','00' )
         res.status(412).send({
          error: `${tabname} - Chyba pri zmene tisk mereni`
  
        })
         return
       }
       res.json({info: 'Ok' })
       console.log('OK','00' )
     })
     await client.release()


    console.log('Delete barevnost', req.body.params.id)
  },
  async setMereni (req, res, next ) {
    const client = await pool.connect()
    var q = `update list_stroj set mereni = case when '${req.body.params.anone}' = 'A' then true
    when '${req.body.params.anone}' = 'N' then false end
    where idefix = ${req.body.params.id}`
    //req.body.params.id
    console.log('Set tisk', req.body.params.id , req.body.params.anone , q)
    
    
     await client.query( q,(err00, response00) => {
       if (err00){
         console.log('Err','00' )
         res.status(412).send({
          error: `${tabname} - Chyba pri zmene stavu mereni`
  
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
