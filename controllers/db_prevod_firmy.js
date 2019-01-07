//const {User} = require('../models')
const config = require('../config/config')
const {pool, client } = require('../db')
const {pool2, client2 } = require('../db/db3')
const _ = require('lodash')
const Ico = require('./ico.js')
const  moment = require( 'moment')




var lErr= false
var  b1 = false;
var status=0

var limit = ' limit 5 '
const aKlienti = {
    a: []
}

aOprav=[`create unique index vazba_firma_id_old_idefix on vazba_firma(id_old,idefix)`,
        `update klienti set email  =  telefonnicislo  where length(replace(telefonnicislo,' ','')) > 15 `,
        `update klienti set email  =  mobil where length(replace(mobil,' ','')) > 15 and mobil like '%@%' `,
        `update klienti set mobil  =  '' where mobil = email and email like '%@%' `
]

async function init(){
    console.log(1)
    await sleep(100)
    console.log(2)
 }

 function sleep(ms){
     return new Promise(resolve=>{
         setTimeout(resolve,ms)
     })
 }

  console.log('Start')
   xIco()  //Je udela ico z aresu pro vsechny firmy 

  
//    vazba()
    return
//    while (!b1);

    //klienti()
    //klienti2()  //bez ica -zatimnevi
    klienti_dod()  // Z dodavatelu s icem


    //while (!b1);
    //kontakty();
    //kontakty_dod();
  //  provozovny();
//while (!b1);



async function  xIco()  {
    const req = {
            query: {
                id: '000000'
            },
            objFirma: {}
        }
    var neco = ''    
        //'25097563'
//    const res = {json:{}}

   //var q=`select * from list_dodavatel where idefix=13373  limit 2000`
   var q=`select * from list_dodavatel where ico > '00000000'  limit 10 -- and (datum_ares::date < now()::date - 60 or datum_ares is null or obec='' or obec is null) `
   //var q=`select * from list_dodavatel where ico > '' `
    pool.query(q,(errx,resx)=>{
        if (errx) {console.log('Chyba Firmy');return;}
        resx.rows.forEach(el => {
             req.query.id = el.ico
             neco = Ico.allFce(req,el)
            setTimeout(function () {
                console.log("Neco:", neco)    
            },1000)
            
            //console.log(req.query.id)
        })
    })
    b1=true  

    
}

async function provozovny() {
    b1=false    

/*
id          | 59681
kodklienta  | 2364
nazev       | kancelář SK,
adresa      | Svatoplukovu 28, Bratislava, 821 08,
telefon     | 
kontakt     | Katarína Čechovičová,  
mail        | 
poznamka    | 
deleted     | 0
accountrego | 5
datum       | 2018-11-23 13:47:25.448794
tisk        | 0
c_zak       | 0
pocet       | 1
uct_rok     | 2018
uct_rok1    | 2018
c_zak1      | 0
pocet1      | 0
uct_rok2    | 2018
c_zak2      | 0
pocet2      | 0

/// NEW
 idefix             | bigint                      | default nextval('list2_seq'::regclass)
 kod                | integer                     | 
 idefix_firma       | bigint                      | 
 nazev              | character varying(100)      | 
 ulice              | character varying(100)      | 
 obec               | character varying(100)      | 
 psc                | character varying(6)        | 
 jmeno              | character varying(50)       | default ''::character varying
 prijmeni           | character varying(50)       | default ''::character varying
 titul              | character varying(20)       | default ''::character varying
 titulza            | character varying(20)       | default ''::character varying
 funkce             | character varying(50)       | default ''::character varying
 oddeleni           | character varying(50)       | default ''::character varying
 prioritni          | boolean                     | default false
 tel                | character varying(15)       | default ''::character varying
 tel2               | character varying(100)      | default ''::character varying
 tel3               | character varying(100)      | default ''::character varying
 mail               | character varying(100)      | default ''::character varying
 www                | character varying(100)      | default ''::character varying
 poznamka           | text                        | default ''::text


*/

var idefixK=0
var qUpdate = ''
var qVk=''

//where idefix <= 12637
    try{

    //dotaz = `select * from vazba_firma  where idefix=14250  order by idefix   `  //Nastaveni rule
    dotaz = `select * from vazba_firma   order by idefix   `  //Nastaveni rule
             pool.query(` ${dotaz} `, (err, res )=> {
                if (err) {
                    console.log("Provozovny Chyba ",err)
                    } else {
                        if (res.rowCount == 0) { console.log('Vazby pro firmu nejsou k dispozici ')}
                        res.rows.forEach( vazba =>{
                            $q1K=`select * from klient_prodejny where kodklienta = ${vazba.id_old} and (nazev >'' or adresa>'' or mail >'' or telefon >'' )`
                            //$q1K=`select * from klient_prodejny where kodklienta = 1136 and (nazev >'' or adresa>'' or mail >'' or telefon >'' or poznamka >'')`
                            pool2.query($q1K,(err1,res1)=>{
                                if (err1) {console.log('chyba zjisteni kontaktu ')}
                                if (res1.rowCount == 0) { console.log('Kontakt neni k dispozici') ;return; } 

                                //console.log(res1.rows)
                                res1.rows.forEach( oldK  => {
                                    //console.log(oldK)
                                    qVk= `select * from vazba_firmaprovozovna where id_old = ${oldK.id}`
                                    console.log(qVk) 
                                    //return
                                    pool.query(qVk, (err3,res3)=>{
                                        if (err3) {console.log('Chyba pri datazu na vazba_firmaprovozovna', err3 ) ;return }
                                        if (res3.rowCount == 0) { 
                                            qiK = `insert into list_firmaprovozovna (idefix_firma ) values (${vazba.idefix}) returning * `
                                            console.log('Vklad a zjisteni idefixu', qiK )
                                            pool.query(qiK, (errK0, resK0 ) =>{
                                                if (errK0) {console.log(`Provozovna pro ${vazba.idefix} nelze vlozit`) ; return }
                                                    idefixK = resK0.rows[0].idefix
                                                    qiV=`insert into vazba_firmaprovozovna (idefix,idefix_firma,id_old) values (${idefixK},${vazba.idefix},${oldK.id})`
                                                    pool.query(qiV, (err4,res4) => {
                                                        if (err4) {
                                                            console.log('Vazbu se neepodari lo vlozit')
                                                        }
                                                    })

                                                console.log(qiV)
                                            })
                                        }

                                       console.log('Pokracuji updatem provozovny ') 
                                       qA=`select * from vazba_firmaprovozovna where id_old = ${oldK.id} `
                                       console.log(qA) 

                                       pool.query(qA, (errA,resA)=>{
                                           if (errA) {console.log('errA',errA);return}
                                           if (resA.rowCount==0) {
                                               console.log(`nejsou data provozoven pro ${oldK}`)
                                               return
                                            }
                                           if (!resA.rows[0].idefix) {console.log('Chybi idefix');return}
                                          //return


                                           console.log("ROWS A : ",resA.rows[0].idefix, oldK)

                                           
                                           qUpdate=`update list_firmaprovozovna set `
                                           //qUpdate+=` jmeno     =   ''`
                                           qUpdate+=`  nazev       = '${oldK.nazev                }'`
                                           qUpdate+=`, ulice       = '${oldK.adresa                 }'`
                                           qUpdate+=`, tel         = '${oldK.telefon                }'`
                                           qUpdate+=`, prijmeni    = '${oldK.kontakt}'`
                                           qUpdate+=`, poznamka    = '${oldK.poznamka     }'`
                                           
                                           
                                           qUpdate+=`, mail        = '${oldK.mail                 }'`
                                           
                                           
                                           qUpdate+=`, obec        = ''`
                                           
                                           // qUpdate+=` '${oldK.linka                 }'`
                                           
                                           // qUpdate+=` '${oldK.cislofaxu             }'`
                                           // qUpdate+=` '${oldK.login                 }'`
                                           // qUpdate+=` '${oldK.d_insert              }'`
                                           
                                           // qUpdate+=` '${oldK.plati                 }'`

                                           qUpdate+=` where idefix = ${resA.rows[0].idefix}`

                                           pool.query(qUpdate)

                                           console.log(resA.rows ,"\n" ,qUpdate)

                                       })
                                       console.log(qA)


                                    })


                                })

                            })
                        })


                        
    
                }
                })
    } catch(e) {
        console.log('Err',e)
    }

    b1 = true

}
async function kontakty() {
    b1=false    
/*
kodznacky              | 49
kodklienta             | 76
znackaklienta          |  
jmenokontaktniosoby    | Ivo
prijmenikontaktniosoby | Stehlík
firmanebooddeleni      |  
funkce                 |  
telefonnicislo         | +420 731 174 137
linka                  |  
email                  | ivo@agencyxxx.cz
cislofaxu              |  
login                  | martin
d_insert               | 2007-08-13 14:20:50.340704
f_mail                 | 
dat_nar                | 
plati                  | 1

/// NEW
id                 | 36
idefix             | 10259
kod                | 3
idefix_firma       | 10124
jmeno              | px 4
prijmeni           | px5
titul              | 
titulza            | 
funkce             | 
oddeleni           | 
prioritni          | f
tel                | 
tel2               | 
tel3               | 
mail               | 
www                | 
poznamka           | 
time_insert        | 2018-12-09 16:47:35.328351
time_update        | 2018-12-09 16:47:35.328351
user_insert_idefix | 9
user_update_idefix | 9
narozeniny         | 1900-12-30
mail_fakt          | 
psc                | 
obec               | 
ulice              | 
aktivni            | t

*/

var idefixK=0
var qUpdate = ''
var qVk=''

//where idefix <= 12637
    try{

    dotaz = `select * from vazba_firma  where id_old=1621 or 1=1 order by idefix   `  //Nastaveni rule
             pool.query(` ${dotaz} `, (err, res )=> {
                if (err) {
                    console.log("Klienti Chyba ",err)
                    } else {
                        if (res.rowCount == 0) { console.log('Vazby pro firmu nejsou k dispozici ')}
                        res.rows.forEach( vazba =>{
                            $q1K=`select * from kontakty where kodklienta = ${vazba.id_old}`
                            pool2.query($q1K,(err1,res1)=>{
                                if (err1) {console.log('chyba zjisteni kontaktu ')}
                                if (res1.rowCount == 0) { console.log('Kontakt neni k dispozici') ;return; } 

                                //console.log(res1.rows)
                                res1.rows.forEach( oldK  => {
                                    //console.log(oldK)
                                    qVk= `select * from vazba_firmaosoba where id_old = ${oldK.kodznacky}`
                                    console.log(qVk) 
                                    //return
                                    pool.query(qVk, (err3,res3)=>{
                                        if (err3) {console.log('Chyba pri datazu na vazba_firmaosoba', err3 ) ;return }
                                        if (res3.rowCount == 0) { 
                                            qiK = `insert into list_firmaosoba (idefix_firma ) values (${vazba.idefix}) returning * `
                                            console.log('Vklad a zjisteni idefixu', qiK )
                                            pool.query(qiK, (errK0, resK0 ) =>{
                                                if (errK0) {console.log(`Kontakt pro ${vazba.idefix} nelze vlozit`) ; return }
                                                    idefixK = resK0.rows[0].idefix
                                                    qiV=`insert into vazba_firmaosoba (idefix,idefix_firma,id_old) values (${idefixK},${vazba.idefix},${oldK.kodznacky})`
                                                    pool.query(qiV, (err4,res4) => {
                                                        if (err4) {
                                                            console.log('Vazbu se neepodari lo vlozit')
                                                        }
                                                    })

                                                console.log(qiV)
                                            })
                                        }

                                       console.log('Pokracuji updatem kontaktu ') 
                                       qA=`select * from vazba_firmaosoba where id_old = ${oldK.kodznacky}`
                                       console.log(qA) 

                                       pool.query(qA, (errA,resA)=>{
                                           if (errA) {console.log('errA')}
                                           if (resA.rowCount==0) {
                                               console.log(`nejsou data pro ${oldK}`)
                                               return
                                            }
                                           if (!resA.rows[0].idefix) {console.log('Chybi idefix');return}
                                          //return


                                           //console.log("ROWS A : ",resA.rows[0].idefix)
                                           if (oldK.dat_nar){
                                            oldK.dat_nar =  moment(oldK.dat_nar).format('YYYY-MM-DD')
                                           } else {
                                            oldK.dat_nar='1901-01-01'
                                           }
                                           



                                           //return
                                           qUpdate=`update list_firmaosoba set `
                                           qUpdate+=` jmeno     =   '${oldK.jmenokontaktniosoby}'`
                                           
                                           qUpdate+=`, prijmeni    = '${oldK.prijmenikontaktniosoby}'`
                                           qUpdate+=`, oddeleni    = substr('${oldK.firmanebooddeleni     }',1,50)`
                                           qUpdate+=`, funkce      = '${oldK.funkce                }'`
                                           qUpdate+=`, tel         = '${oldK.telefonnicislo        }'`
                                           qUpdate+=`, mail        = replace('${oldK.email                 }','undefined','')`
                                           qUpdate+=`, mail_fakt   = replace('${oldK.f_mail                }','undefined','')`
                                           qUpdate+=`, ulice       = replace('${oldK.ulice                 }','undefined','')`
                                           qUpdate+=`, obec        = replace('${oldK.obec                  }','undefined','')`
                                           qUpdate+=`, narozeniny  = '${oldK.dat_nar               }'::date`
                                           
                                           // qUpdate+=` '${oldK.plati                 }'`

                                           qUpdate+=` where idefix = ${resA.rows[0].idefix}`

                                           pool.query(qUpdate,(err,res)=>{
                                               if (err) {
                                                   console.log("ERR",qUpdate, err)
                                                   return
                                                }
                                           })

                                           //console.log(resA.rows ,"\n" ,qUpdate)


                                       })
                                       console.log(qA)


                                    })


                                })

                            })
                        })


                        
    
                }
                })
    } catch(e) {
        console.log('Err',e)
    }

    b1 = true
    
    

}




async function klienti() {


    b1=false    
    try{
    dotaz = `select * from klienti where ico ~'[0-9]' ${limit}`  //Nastaveni rule
             pool2.query(` ${dotaz} `, (err, res )=> {
                if (err) {
                    console.log("Klienti Chyba",err)
                    } else {
                    res.rows.forEach(el => {
                        // console.log(el.ico)
                         pool.query(`select * from list_dodavatel where ico = '${el.ico}' order by id desc limit 1`, (err1,res1) => {
                            if (res1.rowCount > 0 ){
                                //console.log(res1.rows, el)
                                qu=`update list_dodavatel set neco k updajte`
                                var neco = `insert into vazba_firma (id_old,idefix)  values (${el.kodklienta},${res1.rows[0].idefix})`
                                //console.log(neco)
                                pool.query(neco,(errb,resb)=>{
                                    if (errb) {
                                        console.log('Vazba je platna pro', el.nazevfirmy )
                                        return
                                    }
                                })
                                //pool.query(`` )  
                            } else {
                                //console.log( res1.rows[0] )
                                qi=`insert into list_dodavatel (
                                nazev,ulice,obec,psc,tel,tel2,mail,splatnost,hotovost,poznamka, time_insert,ico ) values (
                                '${el.nazevfirmy}',
                                '${el.adresa}',
                                '${el.mesto}',
                                substr(replace('${el.psc}',' ',''),1,6),
                                '${el.mobil}',
                                replace('${el.telefonnicislo}',' ',''),
                                '${el.email}',
                                '${el.splatnost}',
                                '${el.hotovost}',
                                '${el.poznamky}',
                                now(),
                                '${el.ico}' 
                                ) returning *`
                                console.log(qi)
                         //       return
                                pool.query(`${qi}`, (err2, res2) =>{
                                    if (err2) {
                                        console.log('err2: ', err2, el.psc )
                                    }
                                    console.log('Vklad: ',res2.rows[0].nazevfirmy)
                                    var neco = `insert into vazba_firma (id_old,idefix)  values (${el.kodklienta},${res2.rows[0].idefix})`
                                        console.log(neco)
                                        pool.query(neco,(errb,resb)=>{
                                        if (errb) {
                                            console.log('Vazba 2 je platna pro', el.nazevfirmy )
                                        return
                                    }
                                })

                                } )  
                            }
                            
                        })
                        
                    });
                    
                    return aKlienti

                }
                })
    } catch(e) {
        console.log('Err',e)
    }

    b1 = true
    
    

}


async function klienti2() {


    b1=false    
    try{
    dotaz = `select * from klienti where not ico ~'[0-9]' ${limit}`  //Nastaveni rule
             pool2.query(` ${dotaz} `, (err, res )=> {
                if (err) {
                    console.log("Klienti Chyba",err)
                    } else {
                    res.rows.forEach(el => {
                        // console.log(el.ico)
                         pool.query(`select * from list_dodavatel where ico = '${el.ico}' order by id desc limit 1`, (err1,res1) => {
                            if (res1.rowCount > 0 ){
                                //console.log(res1.rows, el)
                                qu=`update list_dodavatel set neco k updajte`
                                var neco = `insert into vazba_firma (id_old,idefix)  values (${el.kodklienta},${res1.rows[0].idefix})`
                                //console.log(neco)
                                pool.query(neco,(errb,resb)=>{
                                    if (errb) {
                                        console.log('Vazba je platna pro', el.nazevfirmy )
                                        return
                                    }
                                })
                                //pool.query(`` )  
                            } else {
                                //console.log( res1.rows[0] )
                                qi=`insert into list_dodavatel (
                                nazev,ulice,obec,psc,tel,tel2,mail,splatnost,hotovost,poznamka, time_insert,ico ) values (
                                '${el.nazevfirmy}',
                                '${el.adresa}',
                                '${el.mesto}',
                                substr(replace('${el.psc}',' ',''),1,6),
                                '${el.mobil}',
                                replace('${el.telefonnicislo}',' ',''),
                                '${el.email}',
                                '${el.splatnost}',
                                '${el.hotovost}',
                                '${el.poznamky}',
                                now(),
                                '${el.ico}' 
                                ) returning *`
                                console.log(qi)
                         //       return
                                pool.query(`${qi}`, (err2, res2) =>{
                                    if (err2) {
                                        console.log('err2: ', err2, el.psc )
                                    }
                                    console.log('Vklad: ',res2.rows[0].nazevfirmy)
                                    var neco = `insert into vazba_firma (id_old,idefix)  values (${el.kodklienta},${res2.rows[0].idefix})`
                                        console.log(neco)
                                        pool.query(neco,(errb,resb)=>{
                                        if (errb) {
                                            console.log('Vazba 2 je platna pro', el.nazevfirmy )
                                        return
                                    }
                                })

                                } )  
                            }
                            
                        })
                        
                    });
                    
                    return aKlienti

                }
                })
    } catch(e) {
        console.log('Err',e)
    }

    b1 = true
    
    

}


async function klienti_dod() {


    b1=false    
    try{
    //dotaz = `select * from klienti where not ico ~'[0-9]' ${limit}`  //Nastaveni rule
    dotaz = `select * from c_dod where upper(ico) not in (select upper(ico) from klienti where ico > '' )and ico > ' '`  ;
             pool2.query(` ${dotaz} `, (err, res )=> {
                if (err) {
                    console.log("Klienti Chyba",err)
                    } else {
                    res.rows.forEach(el => {
                        // console.log(el.ico)
                         pool.query(`select * from list_dodavatel where ico = '${el.ico}' order by id desc limit 1`, (err1,res1) => {
                            if (res1.rowCount > 0 ){
                                //console.log(res1.rows, el)
                                el.koddodavatele += 100000000
                                qu=`update list_dodavatel set neco k updajte`
                                var neco = `insert into vazba_firma (id_old,idefix)  values (${el.koddodavatele},${res1.rows[0].idefix})`
                                //console.log(neco)
                                pool.query(neco,(errb,resb)=>{
                                    if (errb) {
                                        console.log('Vazba je platna pro', el.nazevfirmy )
                                        return
                                    }
                                })
                                //pool.query(`` )  
                            } else {
                                 el.poznamky = el.funkce+   ' : '+ el.kontakt + ' : '+el.poznamky
                                //console.log( res1.rows[0] )
                                qi=`insert into list_dodavatel (
                                nazev,ulice,obec,psc,tel,tel2,mail,splatnost,hotovost,poznamka, time_insert,ico ) values (
                                '${el.nazevdodavatele}',
                                '${el.adresa}',
                                '${el.mesto}',
                                substr(replace('${el.psc}',' ',''),1,6),
                                '${el.mobil}',
                                replace('${el.telefonnicislo}',' ',''),
                                '${el.email}',
                                '14',
                                '1',
                                '${el.poznamky}',
                                now(),
                                '${el.ico}' 
                                ) returning *`
                                console.log(qi)
                         //       return
                                pool.query(`${qi}`, (err2, res2) =>{
                                    if (err2) {
                                        console.log('err2: ', err2, el.psc )
                                    }
                                    console.log('Vklad: ',res2.rows[0].nazevfirmy)
                                    var neco = `insert into vazba_firma (id_old,idefix)  values (${el.koddodavatele},${res2.rows[0].idefix})`
                                        console.log(neco)
                                        pool.query(neco,(errb,resb)=>{
                                        if (errb) {
                                            console.log('Vazba 2 je platna pro', el.nazevdodavatele )
                                        return
                                    }
                                })

                                } )  
                            }
                            
                        })
                        
                    });
                    
                    return aKlienti

                }
                })
    } catch(e) {
        console.log('Err',e)
    }

    b1 = true
    
    

}



async function vazba() {
    b1=false    
    // (klient_prodejny)
    var aVazba=[`create table vazba_firma (id_old bigint, idefix bigint ) without oids `,
    `create table vazba_firmaosoba (id_old bigint, idefix bigint,idefix_firma  bigint ) without oids `,
    `create table vazba_firmaprovozovna (id_old bigint, idefix bigint,idefix_firma bigint ) without oids `,
    `create unique index vazba_firma_id_old_idefix on vazba_firma(id_old,idefix)`,
    `create unique index vazba_firmaosoba_id_old_idefix on vazba_firmaosoba(id_old,idefix)`,
    `create unique index vazba_firmaosoba_id_old_idefix on vazba_firmaprovozovna(id_old,idefix)`
    




    ]

    try{

        aVazba.forEach(dotaz => {
            pool.query(` ${dotaz} `, (err, res,next )=> {
                if (err) {
                    console.log(`Vazba ${dotaz} jiz existuje`)
                    return next
                    } else {
                     console.log(`Vazbu ${dotaz} jsem vytvoril`)
                      return 
                }
                })
            })        
    } catch(e) {
        console.log(`Err :  ${dotaz}`)
    }

    b1 = true
    
    

}




