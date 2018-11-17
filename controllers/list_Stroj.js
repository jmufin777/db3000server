//const {User} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const {pool, client } = require('../db')
const _ = require('lodash')

var lErr= false
const resObj = {
  stroj: [],
  enum_nazev_text: [],
  enum_strojskup: [],

}

var req_query_id = -10
var req_query_string_query = ''
var req_query_id_query = 0




const tabname = 'list_stroj'
module.exports = {
    async saveone (req,res) {
  },

  async one (req,res) {
    var  myres = {
     xdata: [],
  
     strojskup: [],
     strojmod: [],
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


   }
      req_query_id = req.query.id
      req_query_id_query = req.query.id_query
      req_query_string_query = req.query.string_query

      var dotaz =`select a.*, b.typ_kalkulace from ${tabname} a join list2_strojskup b on a.idefix_strojskup = b.idefix where a.idefix = ${req_query_id}`

      var enum_strojskup        = `select * from list2_strojskup order by kod`                                                              // --  10   enum_strojskup    
      // var enum_strojskup        = `select nazev as label,idefix as value from list2_strojskup order by kod`                                                              // --  10   enum_strojskup    
      var enum_barevnost        = `select * from list2_barevnost order by kod`                                                              // --  11   enum_barevnost
      var enum_barevnosttxt        = `select nazev from list2_barevnost order by kod`                                                              // --  12   enum_barevnost

      
      var enum_nazev_text       = `select distinct nazev_text    as value from list_stroj order by nazev_text`                 //  -- 101   enum_nazev_text
      var enum_nazev            = `select distinct nazev         as value from list_stroj order by nazev`                      //  -- 102   enum_nazev
      var enum_strojmod         = `select distinct nazev         as value from list_strojmod order by nazev`                   //  -- 103   enum_strojmod
      var enum_strojmod_this    = `select idefix,nazev           as value from list_strojmod a where a.idefix_stroj = ${req_query_id} order by kod`    //  -- 109   enum_strojmod_this
      var enum_strojmod_text    = `select distinct nazev_text    as value from list_strojmod order by nazev_text`              //  -- 104   enum_strojmod_text
      var enum_strojceny_nazev  = `select distinct nazev         as value from list_strojceny order by nazev`              //  -- 1091   enum_strojceny_nazev
      var enum_strojinkoust     = `select distinct nazev         as value from list_strojinkoust order by nazev`               //  -- 105   enum_strojinkoust


      //var enum_prace        = `select idefix as value, nazev as label from list2_prace order by kod`                                                        // --  106   enum_prace    
      var enum_prace        = `select * from list2_prace order by kod`                                                        // --  106   enum_prace    
      var enum_jednotka      = `select * from list2_jednotka order by kod`                                                   //  --  107   enum_jednotka
      var enum_inkoust      = `
      select a.kod,a.idefix,concat2(' ',nazev1, nazev2, nazev3) as nazev  from list_mat a join list2_matskup b on a.idefix_matskup =b.idefix where b.zkratka = 'I' 
      and kalkulace =true
        union 
        select 0 as kod,0,'Ne'
        order by kod , idefix `;

     dotaz_list_strojmod               =  `select * from  list_strojmod              where idefix_stroj = ${req_query_id}`   //  -- 200   dotaz_list_strojmod              
     dotaz_list_strojmodbarevnost      =  `select * from  list_strojmodbarevnost     where idefix_stroj = ${req_query_id}`   //  -- 201   dotaz_list_strojmodbarevnost     
     dotaz_list_strojinkoust           =  `select * from  list_strojinkoust          where idefix_stroj = ${req_query_id}`   //  -- 202   dotaz_list_strojinkoust          
     dotaz_list_strojinkoustbarevnost  =  `select * from  list_strojinkoustbarevnost where idefix_stroj = ${req_query_id}`   //  -- 203   dotaz_list_strojinkoustbarevnost 
     dotaz_list_strojceny              =  `select * from  list_strojceny             where idefix_stroj = ${req_query_id}`   //  -- 204   dotaz_list_strojceny             

      console.log(dotaz)

   
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
    
    await client.query(dotaz,(err,response) => {
      if (err) {
        myres.info = -1
        return
      }
      resObj.stroj = response.rows
      console.log(resObj.stroj )

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
        
        res.json(resObj)
        console.log(resObj)
        await client.release()     
        return
      }
      }

      if (req_query_id_query==-1 || req_query_id_query==10) {
        await  client.query(enum_strojskup,(err10,response10) => {
          if (err10) {
            myres.info = -1
            console.log(10, "err")
            return
          }
          resObj.enum_strojskup = response10.rows
          })    
          if (req_query_id_query == 10) {
            console.log(resObj)
            res.json(resObj)
            await client.release()
            return
          }  
        }

        if (req_query_id_query==-1 || req_query_id_query==11) {
          await  client.query(enum_barevnost,(err11,response11) => {
            if (err11) {
              myres.info = -1
              console.log(11, "err")
              return
            }
            resObj.enum_barevnost = response11.rows
            })    
            if (req_query_id_query == 11) {
              console.log(resObj)
              res.json(resObj)
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
                console.log(resObj)
                res.json(resObj)
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
              console.log(resObj)
              res.json(resObj)
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
                console.log(resObj)
                res.json(resObj)
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
                  console.log(resObj)
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
                    console.log(resObj)
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
                  console.log(resObj)
                  res.json(resObj)
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
                    console.log(resObj)
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
                  console.log(resObj)
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
                console.log(resObj)
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
              console.log(resObj)
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
                    console.log(resObj)
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
                      console.log(resObj)
                      res.json(resObj)
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
                        res.json(resObj)
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
                  console.log(200, "Vracim  Vysledek")
                  // dotaz_rozmer, dotaz_vlastnosti, dotaz_strojskup,
                  console.log(dotaz, " Par ",req_query_id_query, "String ", req.query.string_query)
                  

                  res.json(resObj)
                })  
                await client.release() 

   } catch(e) {

    console.log(e)
      res.status(822).send({
        error: 'Mat ' + e
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
         dotaz = `${dotaz} where ${where} order by nazev_text `


      }
      console.log(req.query.id, dotaz )
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
