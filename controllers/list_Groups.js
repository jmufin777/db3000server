//const {User} = require('../models')
const config = require('../config/config')
const {pool, client } = require('../db')
const tabname = 'list_groups'
const resObj = {}
module.exports = {
      async all (req, res, next) {
         
      //var typ   = req.query.typ
      var typ = req.query.typ

      var dotaz = `select * from ${tabname}  order  by id`
      if (typ.match(/[0-9]/i)){
        
        dotaz = `select * from ${tabname}  where idefix = '${typ}' order by  id limit 1`
        


      } 
      var dotaz_modules = 'select idefix_group, idefix_module from list_modules_groups order by idefix_group, id'
      var dotaz_menu = 'select idefix_group, idefix_menu  from list_menu_groups order by idefix_group, id'
      console.log(dotaz)
      
    //  console.log(req)
    try {
          
        const client = await pool.connect()

         await client.query(`${dotaz}`  ,(err, response) => {

           if (response.rowCount == 0)   {
              // res.send({info: 0})
              res.json({info: 0, data: '433' }); 
           } else {
              //res.json({info: 1, data: response.rows}); 
              resObj.info = 1
              neco =response.rows  
              console.log('Skupiny - 1: ',response.rowCount)
              resObj.data= response.rows 
              
              
           }
             if (err) {
               console.log(err)
                return next(err)
              } ;
         })

         await client.query(`${dotaz_modules}`  ,(err, response) => {
             resObj.info = 1
             neco =response.rows  
             resObj.dataModules= response.rows 
             console.log('Moduly :2 : ',response.rowCount)
            if (err) {
              console.log(err)
               return next(err)
             } ;
        })
        await client.query(`${dotaz_menu}`  ,(err, response) => {
          resObj.info = 1
          neco =response.rows  
          resObj.dataMenu= response.rows 
          res.json({info:1, data: resObj.data, dataModules: resObj.dataModules, dataMenu: resObj.dataMenu  })
          console.log('Menu :3 : ',response.rowCount)
         if (err) {
           console.log(err)
            return next(err)
          } ;
        })
         
         await client.release() 
         console.log( 'Ukoncuji:' )
         
         console.log( 'Odeslano' )
         
    } catch (err) {
        console.log(err)
        res.status(400).send({
          error: 'Chyba 002 pri pozadavku na databazi : ${tabname}'
         })
    }
  },
  async updateMenus(req, res ,next) {
    console.log('jsem tu 1', req.body.form.items)
   
    console.log(Math.round(Math.random()*10000000000))
    const tmpTable = 'tmp_' +Math.round(Math.random()*10000000000)
    console.log(tmpTable)
    
    const qdel = `delete from list_menu_groups where idefix_group = ${req.body.form.idefix} `
    
    const qtest = `select '${req.body.user}' as user_insert,${req.body.form.idefix} as idefix_group,unnest(array[${req.body.form.items}])  as idefix_menu`
    const q1 = `create table ${tmpTable} without oids as ${qtest}`
    const qinsert= `insert into list_menu_groups (user_insert,idefix_group,idefix_menu) select * from ${tmpTable}`
    

    const client = await pool.connect()
    console.log (qtest)
    await client.query(qdel, [], (err, result)=> {
      if (err) {
        console.log(err)
        return next.err
      }
    })
    if ( !req.body.form.items >  0 ) {
        res.json({info: -1})
        await client.release()
        return
    }
    await client.query(q1, [], (err, result)=> {
      if (err) {
        console.log(err)
        return next.err
      }
    })

    await client.query(qinsert, [], (err, result)=> {
      if (err) {
        console.log(err)
        return next.err
      }
    })
    await client.query(`drop table ${tmpTable}`, [], (err, result)=> {
      if (err) {
        console.log(err)
        return next.err
      }
    })

    
    await client.release()
    res.json({info: -1})
 //   select * from list_menu_groups;
 // id | idefix_menu | idefix_group | menu_name | group_name | time_insert | time_update | user_insert | user_update 

  },
  async updateModules(req, res ,next) {
    console.log('jsem tu 1', req.body.form.items)
    

    
    console.log(Math.round(Math.random()*10000000000))
    const tmpTable = 'tmp_' +Math.round(Math.random()*10000000000)
    console.log(tmpTable)
    
    const qdel = `delete from list_modules_groups where idefix_group = ${req.body.form.idefix} `
    
    const qtest = `select '${req.body.user}' as user_insert,${req.body.form.idefix} as idefix_group,unnest(array[${req.body.form.items}])  as idefix_module`
    const q1 = `create table ${tmpTable} without oids as ${qtest}`
    const qinsert= `insert into list_modules_groups (user_insert,idefix_group,idefix_module) select * from ${tmpTable}`
    const qstart='begin work'
    const qend='commit'
    

    const client = await pool.connect()
    console.log (qtest)
    try {
    await client.query(qstart)
    await client.query(qdel, [], (err, result)=> {
      if (err) {
        console.log(err)
        return next.err
      }
    })
    if ( !req.body.form.items >  0 ) {
        res.json({info: -1})
        await client.release()
        return
    }
    await client.query(q1, [], (err, result)=> {
      if (err) {
        console.log(err)
        return next.err
      }
    })

    await client.query(qinsert, [], (err, result)=> {
      if (err) {
        console.log(err)
        return next.err
      }
    })
    await client.query(`drop table ${tmpTable}`, [], (err, result)=> {
      if (err) {
        console.log(err)
        return next.err
      }
    })
    await client.query(qend)
   
    await client.release()
    res.json({info: 1})
  } catch(e) {
    res.status(460).send({
      error: 'Transakce pri ukladani poradi zhavarovala'
    })
  }
 //   select * from list_menu_groups;
 // id | idefix_menu | idefix_group | menu_name | group_name | time_insert | time_update | user_insert | user_update 

  },
  async update (req, res , next ){
    const user = req.body.user
    
    const id = req.body.form.Id
    const idefix = req.body.form.IdeFix
    const nazev  = req.body.form.Nazev.toString().replace(/'/g,'xxxxx')
    const popis  = req.body.form.Popis.toString().replace(/'/g,'xxxxx')

    const dotaz = `update list_groups set popis = '${popis}', nazev='${nazev}', user_update='${user}',idefix=${idefix},time_update= now() where idefix = ${idefix} `
    console.log(dotaz)
        
        
    const client = await pool.connect()
    try {
     await  client.query(dotaz,[],(err, response ) => {
      if (err) {
        // res.json({info: 'error', data: '433' }); 
        res.status(506).send(`Neuspesna zmena id ${id} ${nazev}`)
      }
    })

    await client.query('select * from list_groups order by id',(err,response) =>{
      if (response.rowCount == 0)   {
        res.send({info: 0})
     } else {
        res.json({info: response.rowCount , data: response.rows}); 
     }
     if (err) {
       res.status(505).send('Neuspesny dotaz na ulozena menu')
       console.log('Nejde nasypat zpatky vubec zadny radky')
     }
    })
    await client.release()
   
   } catch(err) {
      res.status(400).send({
        error: 'Chyba 402 pri pozadavku na zmenu modulu : ${tabname}'
      })
    }
  },
  async delete (req, res , next ) {
    const id = req.query.id
    const dotaz = `delete from list_groups_users where idefix_group = ${id} ; delete from list_groups where idefix = ${id}`
    
    const client = await pool.connect()
    try {
    
    await client.query(dotaz , (err, response) =>   {
      if (err) {
        // res.json({info: 'error', data: '433' }); 
        res.status(505).send('Neuspesne smazani')
      }

    })
    await client.query('select * from list_groups order by id',(err,response) =>{
      if (response.rowCount == 0)   {
        res.send({info: 0})
     } else {
        res.json({info: response.rowCount , data: response.rows}); 
     }
     if (err) {
       res.status(505).send('Neuspesny dotaz na ulozena menu')
       console.log('Nejde nasypat zpatky vubec zadny radky')
     }
    })
    await client.release()
   } catch (err) {
      res.status(505).send('Neuspesne smazani')
   }
    


  },
  async init (req, res, next) {
    let neco = ''
    let user
    let nazev
    let popis
    let idefix
    let dotaz 

    console.log('Im hyr', req.body.form)
    
     
    const client = await pool.connect()
    if (req.body.typ == 'all'){
        
      
      await req.body.form.forEach(element => {
          dotaz = `
          with t as (
            delete from list_groups where id= ${element.id} returning nazev,popis,idefix,time_insert,time_update,user_insert,user_update 
            ) 
            insert into list_groups (nazev,popis,idefix,time_insert,time_update,user_insert,user_update)
            select * from t
          `
         client.query(`${dotaz}`,[],(err, response) =>{
           if (err) {
             console.log('Err: ', err)
             console.log('Err: ', err)
             console.log('Err: ', err)
             return next(err)
           }

         }) 
        
      })

      await client.release() 
      res.json({info:'OK'})
      
      
      return
    }  

    user   = req.body.user
    nazev  = req.body.form.Nazev
    popis  = req.body.form.Popis.toString().replace(/'/g,'xxxxx')
    dotaz = `insert into  ${tabname} (nazev,popis, user_insert ) values ( '${nazev}','${popis}', '${user}'  ) ` 

    try {
    
        client.query(` begin work`  ,[],(err, response ) => { })
         
         await client.query(` ${dotaz}`  ,[],(err, response ) => {
           if (err) {
             console.log(err, 'aaaa')
           }
         })
         await client.query(`update ${tabname} set idefix = id where idefix is null or idefix = 0 `  ,[],(err, response ) => {
          if (err) {
            console.log(err, 'aaaa')
          }
        })
        client.query(` commit `  ,[],(err, response ) => { })         
        await client.release() 
        res.json({info:'OK'})
    } catch (err) {
        // console.log(err)
        res.status(400).send({
          error: 'Chyba 002 pri pozadavku na databazi : ${tabname}'
        })
    }
  }
}

