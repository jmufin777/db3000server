const config = require('../config/config')
const {pool, client } = require('../db/index')
const tabname = 'list_users'
const resObj = {}
var lErr= false
// const {login, password} = req.body
module.exports = {
 async all (req, res, next) {
      var typ = req.query.typ
      var dotaz = `select jmeno||' '|| prijmeni as fullname, * from ${tabname}   order  by id limit 500`
      if (typ.match(/[0-9]/i)){
        dotaz = `select * from ${tabname}  where idefix = '${typ}' order by  id limit 1`
      } 
      var dotaz_groups = 'select idefix_group, idefix_user from list_groups_users order by idefix_user,idefix_group, id'
      var dotaz_menu = 'select idefix_menu, idefix_user  from list_menu_users order by idefix_user,idefix_menu, id'
      console.log(dotaz)
      const client = await pool.connect()
          
  try {
 
       console.log('Users all')
 
        await client.query(`${dotaz}`  ,(err, response) => {
          if (err) {
            lErr=true
            console.log(err)
            //  res.status(599).send({
            //    error: 'chyba users'
            //  })

            return next(err)
          }
         if (response.rowCount == 0)   {
           res.json({info: 0, data: '433' }); 
        } else {
           resObj.info = 1
           neco =response.rows  
           resObj.data= response.rows 
        }
    
       })


       if (lErr) return
       await client.query(`${dotaz_menu}`  ,(err, response) => {
        if (lErr) return
        if (err) {
          lErr = true
          console.log(err)
           return next(err)
         } 
        resObj.info = 2
        neco =response.rows  
        resObj.dataMenu= response.rows 
        console.log('Menu :3 : ',response.rowCount)
       
      })
      if (lErr) return
       await client.query(`${dotaz_groups}`  ,(err, response) => {
        if (lErr) return
        if (err) {
          lErr=true
           console.log(err)
            return next(err)
          } 
        resObj.info = 3
        neco =response.rows  
        resObj.dataGroups= response.rows 
        res.json({info:1, data: resObj.data , dataGroups: resObj.dataGroups, dataMenu: resObj.dataMenu  })
        console.log('Menu :3 : Users komplet ',response.rowCount)
      })
       await client.release() 
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
    const tmpTable = 'tmp_u_' +Math.round(Math.random()*10000000000)
    console.log(tmpTable)
    
    const qdel = `delete from list_menu_users where idefix_user = ${req.body.form.idefix} `
    
    const qtest = `select '${req.body.user}' as user_insert,${req.body.form.idefix} as idefix_user,unnest(array[${req.body.form.items}])  as idefix_menu`
    const q1 = `create table ${tmpTable} without oids as ${qtest}`
    const qinsert= `insert into list_menu_users (user_insert,idefix_user,idefix_menu) select * from ${tmpTable}`
    

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
  async updateGroups(req, res ,next) {
    console.log('jsem tu 1', req.body.form.items)
    

    
    console.log(Math.round(Math.random()*10000000000))
    const tmpTable = 'tmp_gu_' +Math.round(Math.random()*10000000000)
    console.log(tmpTable)

    
    
    const qdel = `delete from list_groups_users where idefix_user = ${req.body.form.idefix} `
    
    const qtest = `select '${req.body.user}' as user_insert,${req.body.form.idefix} as idefix_user,unnest(array[${req.body.form.items}])  as idefix_group`
    const q1 = `create table ${tmpTable} without oids as ${qtest}`
    const qinsert= `insert into list_groups_users (user_insert,idefix_user,idefix_group) select * from ${tmpTable}`
    const qstart='begin work'
    const qend='commit'
    

    const client = await pool.connect()

    console.log (qtest)
    await client.query(qstart)
    await client.query(q1, [], (err, result)=> {
      if (err) {
        console.log(err)
        return next.err
      }
    })
    
    try {
    
    console.log(qdel)
    await client.query(qdel,  (err, result)=> {
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
  },
  async delete (req, res , next ) {
    const id = req.query.id
    // const dotaz = `delete from list_users where idefix = ${id}`
    // const client = await pool.connect()
  },
  async init (req, res, next) {
  }    


}
