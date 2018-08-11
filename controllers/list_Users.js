const config = require('../config/config')
const {pool, client } = require('../db/index')
const tabname = 'list_users'
const resObj = {}
// const {login, password} = req.body

module.exports = {
 async all (req, res) {
      var typ = req.query.typ
      var dotaz = `select * from ${tabname}  order  by id`
      if (typ.match(/[0-9]/i)){
        dotaz = `select * from ${tabname}  where idefix = '${typ}' order by  id limit 1`
      } 
//      var dotaz_groups = 'select idefix_group, idefix_user from list_groups_users order by idefix_user,idefix_group, id'
//      var dotaz_menu = 'select idefix_menu, idefix_user  from list_menu_users order by idefix_user,idefix_menu, id'
      console.log(dotaz)
      
    
  try {
       const client = await pool.connect()
       console.log('Users all')
       
        await client.query(`select jmeno||' '|| prijmeni as fullname, * from ${tabname} where 1=$1`  ,[1 ],(err, response) => {
         if (response.rowCount == 0)   {
           res.json({info: 0, data: '433' }); 
        } else {
           //res.json({info: 1, data: response.rows}); 
           resObj.info = 1
           neco =response.rows  
           console.log('Users 1: ',response.rowCount)
           resObj.data= response.rows 
           console.log(resObj.data)

           res.json({info:1, data: resObj.data , dataModules: resObj.dataModules, dataMenu: resObj.dataMenu  })
           
        }
          if (err) {
            console.log(err)
             return next(err)
           } ;
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
  },
  async updateGroups(req, res ,next) {
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
