//const {User} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const {pool, client } = require('../db')
const _ = require('lodash')

var lErr= false


const tabname = 'list_stroj'
module.exports = {
    async saveone (req,res) {
  },

  async one (req,res) {
    var  myres = {
     xdata: [],
  
     strojskup: [],
     stroj: [],
     info: []
   }
  },


    async all (req, res) {
      var dotaz=''
      var where =' where true '
      var order =' order by idefix_stroj, podskupina '
      var tmp =''
    
    
      
       dotaz=`select a.*,b.nazev as nazev_skup from ${tabname}  a`
       dotaz = `${dotaz} join list2_strojskup b on a.idefix_strojskup = b.idefix ` 
       dotaz = `${dotaz} order by nazev_text `

      
      console.log(dotaz, 'id:',req.query.id, 'lim:',req.query.limit ,'off:',req.query.offset , 'lim: ',  where )
      if (req.query.id=='nic'){
        dotaz=`select * from ${tabname} where 1=1 order by kod `
        
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
  }


}
