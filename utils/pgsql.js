const { exec } = require("child_process");
const moment = require("moment");
const ClientN = require("pg-native");
require("./soubory")();

const clientN = new ClientN();
clientN.connectSync("postgresql://db3000:@localhost:5432/db3000");
//clientAs= new ClientN()
//clientAs.connectSync

module.exports = function() {
  this.getLogin = function getLogin(idefix) {
    var dotaz = `select login from list_users where idefix=${idefix}`;
    var rows = query(dotaz);
    return rows[0].login;
  };

  this.idefixZak = function idefixZak(idefix) {
    var dotaz = `select idefix_zak(${idefix}) as idefix_zak`;
    var rows = query(dotaz);
    return rows[0].idefix_zak;
  };
  this.idefixLast = function idefixLast(table) {
    var dotaz = `select max(idefix) as idefix_last from ${table}`;
    var rows = query(dotaz);
    return rows[0].idefix_last;
  };

  this.query = function query(dotaz, rows) {
    rows = rows || [];
    if (dotaz.match(/(^insert)|(^update)|(^delete)/i)) {
      dotaz = `${dotaz} returning * `;
      //console.log(dotaz)
    }
    rows = clientN.querySync(dotaz);
    if (rows && rows.length > 0) {
      //  console.log('ROWS OK ',rows)
      return rows;
    } else {
      console.log("ROWS 0", rows);
    }
    return [];
  };
  this.query2 = async function query2(idefix_user,aquery,res) { ///Da do krabic dotazu odpovedi, provede prednastavene konverze jsoo a datum, cas
      const rows = {}
      const opravy ={}
      isDatum  = false;
      isCas    = false;
      isParse  = false;
      //console.log(aquery)
      return new Promise(function(resolve) {
      for (const i in aquery) {
      //  console.log(i)
        if (aquery.hasOwnProperty(i)) {
          const Dotaz = aquery[i];
          try {
            rows[i] = query(Dotaz)
            //console.log(rows[i])
            if (rows[i].length>0){  //Seznam nazvu polozek - ten se pak porovna se seznamem polozek pro opravu datumu
              //console.log(i,':',rows[i])
              //datum3 - expedice_datum,datumexpedice
              // datum20(polozka.datumzadani);
              // datum3(polozka.datumzadani)}
              //f.datum3(polozka.time_update
              for (const nazev in rows[i][0]){
                if (nazev.match(/datumexpedice/g) || nazev.match(/expedice.*datum/g)) {
                  isDatum=true;
                   console.log('EXPedICE', nazev, rows[i][0][nazev], datum3(rows[i][0][nazev]))
                }
                if (nazev.match(/obsah/g) ) {
                  isParse=true;
                  console.log('Parse')
                }
                //console.log('nazev:',nazev)
              }
            }
            if (isParse || isDatum || isCas) {
              for (let index = 0; index < rows[i].length; index++) {
                const Polozka = rows[i][index];
                if (rows[i].hasOwnProperty('obsah')){
                  rows[i][index].obsah = JSON.parse(JSON.stringify(Polozka.obsah))
                }
                if (rows[i][index].hasOwnProperty('expedice_datum')){
                  rows[i][index].expedice_datum = datum3(Polozka.expedice_datum)
                  //console.log(rows[i][index].expedice_datum)
                }
                if (rows[i][index].hasOwnProperty('datum_expedice')){
                  rows[i][index].datum_expedice = datum3(Polozka.datum_expedice)
                  //console.log(rows[i][index].datum_expedice)
                }
                if (rows[i][index].hasOwnProperty('expedice_cas')){
                  rows[i][index].expedice_cas = cas3(Polozka.expedice_cas)
                  //console.log(rows[i][index].expedice_cas, 'd3',cas3(rows[i][index].expedice_cas))
                }
                
                //logS('PARSE ',index, Polozka.obsah)
              }

            }
            
            // if ( Dotaz.match(/--parse--/i)){
            //   logS('PARSE ',i, rows[i].length)
            //   for (let index = 0; index < rows[i].length; index++) {
            //     const Polozka = rows[i][index];

            //     rows[i][index].obsah = JSON.parse(JSON.stringify(Polozka.obsah))
            //     //logS('PARSE ',index, Polozka.obsah)
            //   }
            //   //console.log('PARSE!!!', aquery)
            // }
          } catch(e) {

            rows[i] = 'ERROR '+ Dotaz
            console.log(e)
          }
        }
      }
      resolve(rows)
    })
  };


  this.query2Raw = async function query2Raw(idefix_user,aquery,res) { //////Da do krabic dotazu odpovedi, ponecha data bez uprav
    const rows = {}
    const opravy ={}
    isDatum  = false;
    isCas    = false;
    isParse  = false;
    console.log(aquery)
    return new Promise(function(resolve) {
    for (const i in aquery) {
    //  console.log(i)
      if (aquery.hasOwnProperty(i)) {
        const Dotaz = aquery[i];
        try {
          rows[i] = query(Dotaz)
          console.log(rows[i])
        } catch(e) {

          rows[i] = 'ERROR '+ Dotaz
          console.log(e)
        }
      }
    }
    resolve(rows)
  })
};
  //
};
