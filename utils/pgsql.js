const { exec } = require('child_process');
const moment = require('moment');
const  ClientN = require('pg-native')

const clientN = new ClientN()
clientN.connectSync('postgresql://db3000:@localhost:5432/db3000')

module.exports = function() {

    this.getLogin = function getLogin(idefix){
        var dotaz = `select login from list_users where idefix=${idefix}`
        var rows = query(dotaz)
        return rows[0].login
      }

      this.idefixZak = function idefixZak(idefix){
        var dotaz = `select idefix_zak(${idefix}) as idefix_zak`
        var rows = query(dotaz)
        return rows[0].idefix_zak
      }
      this.idefixLast = function idefixLast(table){
        var dotaz = `select max(idefix) as idefix_last from ${table}`
        var rows = query(dotaz)
        return rows[0].idefix_last
      }
      
    this.query =   function query(dotaz, rows){
        rows = rows || [] 
        if( dotaz.match(/(^insert)|(^update)|(^delete)/i)) {
          dotaz = `${dotaz} returning * `
          //console.log(dotaz)
        }
        rows= clientN.querySync(dotaz)
        if (rows && rows.length>0){
        //  console.log('ROWS OK ',rows)
          return rows;
        } else {
          console.log('ROWS 0',rows)
        }
        return [];
      }

      //
      
}