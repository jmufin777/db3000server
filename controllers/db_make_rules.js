//const {User} = require('../models')
const config = require('../config/config')
const {pool, client } = require('../db')
const _ = require('lodash')
var lErr= false
var  b1 = false;


async function init(){
    console.log(1)
    await sleep(10000)
    console.log(2)
 }
 function sleep(ms){
     return new Promise(resolve=>{
         setTimeout(resolve,ms)
     })
 }

 


 const atables = [

    {
        name: 'db_system',
         struct: `
         kod int,
         name text,
         struct text,
         index_name text[],reindex int default 0, initq text[]
        `,
        index_name: [],
        reindex: 0,
        initq: [`update db_system set kod = id ;`]
    },
    {
        name: 'list2_barevnost'
        ,struct:  `
        kod int,
        nazev varchar(20)`,
        index_name: [ 
          `kod  ~~~ (kod)`,
          `nazev ~~~ (nazev)`
        ],
        reindex: 1,
        initq: [`
            insert into list2_barevnost (nazev ) VALUES ('4/0'),('4/4'),('4/1'),('1/0'),('1/1'),('4+W'),('4+W+4');
            update list2_barevnost set kod = id ;`
        ]
    } ,
    {
        name: 'list2_matpotisknutelnost'
        ,struct:  `
            kod int,
            nazev varchar(20)`,
         index_name: [ 

                `kod  ~~~ (kod)`,
                `nazev ~~~ (nazev)`
          ],
        reindex: 1,
         initq: [
            `insert into list2_matpotisknutelnost (nazev ) VALUES ('NE'),('1/1'),('1/0');
             update list2_matpotisknutelnost set kod = id ;`,
        ]
    },
    {
        name: 'list2_matvlastnosti'
        ,struct:  `
         kod int,
         nazev varchar(50),
         popis varchar(200)
         `,
         index_name: [ 
                `kod  ~~~ (kod)`,
                `nazev ~~~ (nazev)`
          ],
        reindex: 1,
         initq: [
            `insert into list2_matvlastnosti (nazev ) VALUES ('NE');
             update list2_matvlastnosti set kod = id ;
             `,
             

        ]
    },
    { name: 'list_prace'
    ,struct: `
    kod int,
    prace                  character varying(100)      , 
    
    idefix_stroj           bigint       , 
    jednotka               character varying(50)       , 
    jednotka_num           numeric(10,5)               , 
    cena_priprava_naklad   numeric(10,2)               , 
    cena_priprava_prodej   numeric(10,2)               , 
    cena_jednotka_naklad   numeric(10,2)               , 
    cena_jednotka_prodej   numeric(10,2)               ,
    jednotka_vykonu        varchar(20),
    vykon_za_cas           float
    `
    ,reindex: 1,
         initq: [
            `insert into list_prace (nazev ) VALUES ('NE');
             update list_prace set kod = id ;
             `,
             

        ]
    },



    {   name: 'list_stroj'
    ,struct:  `
     kod int,
     idefix_strojskup int ,
     nazev varchar(120),
     nazev_text  varchar(120),
     sirka_mat_max_mm int default 0,
     delka_mat_max_mm int default 0,
     sirka_tisk_max_mm int default 0,
     delka_tisk_max_mm int default 0,

     sirka_lam_max_mm int default 0,
     delka_lam_max_mm int default 0,

     tech_okraj_strana_mm int default 0,
     tech_okraj_start_mm int default 0,
     tech_okraj_spacecopy_mm int default 0,
     tech_okraj_spacejobs_mm int default 0,
     tech_okraj_end_mm int default 0,

     bez_okraj int default 0,
     spadavka_mm int default 0,
     space_znacky_mm int default 0 ,
     
     priprava_cas_minuta float default 0,
     priprava_minuta_naklad float default 0,
     priprava_minuta_prodej float default 0,
     priprava_celkem_naklad float default 0,
     priprava_celkem_prodej float default 0,
     tisk boolean default false


     `,
     
     index_name: [ 
            `kod  ~~~ (kod)`,
            `nazev ~~~ (nazev)`
      ],
    reindex: 1,
     initq: [
        `insert into list_stroj (nazev ) VALUES ('NE');
         update list_stroj set kod = id ;`,
    ]
} ,

{   name: 'list_strojmod'
    ,struct:  `
     kod int,
     idefix_stroj bigint ,
     idefix_prace bigint ,
     prace varchar(120),
     nazev varchar(120) default '',
     nazev_text  varchar(120) default '',

     rychlost float,
     idefix_jednotka bigint,
     i1typ varchar(20),
     idefix_i1 bigint,
     i1spotreba float,
     i2typ varchar(20),
     idefix_i2 bigint,
     i2spotreba float,
     i3typ varchar(20),
     idefix_i3 bigint,
     i3spotreba float,
     i4typ varchar(20),
     idefix_i4 bigint,
     i4spotreba float,
     i5typ varchar(20),
     idefix_i5 bigint,
     i5spotreba float,
      
     mod_priorita boolean default false,

     rychlost_minuta_m2 float,
     rychlost_minuta_pocet float
     

     `,
     
     index_name: [ 
            `kod  ~~~ (kod)`,
            `nazev ~~~ (nazev)`
      ],
    reindex: 1,
     initq: [
        `insert into list_strojmod (nazev ) VALUES ('NE');
         update list_strojmod set kod = id ;`,
    ]
} ,
{   name: 'list_strojinkoust'
    ,struct:  `
     kod int,
     idefix_stroj bigint ,
     idefix_barevnost bigint ,
     nazev varchar(120),
     nazev_text  varchar(120),
     
     cena_naklad_m2 float,
     cena_prodej_m2 float

     `,
     
     index_name: [ 
            `kod  ~~~ (kod)`,
            `nazev ~~~ (nazev)`
      ],
    reindex: 1,
     initq: [
        `insert into list_strojinkoust (nazev ) VALUES ('NE');
         update list_strojinkoust set kod = id ;`,
    ]
} ,
//Vazby:

{
    name: 'list_strojinkoustbarevnost'
    ,struct: `

        idefix_stroj bigint,
        kod int,
        idefix_inkoust bigint,
        idefix_barevnost bigint
    `
},
{
    name: 'list_strojmodbarevnost'
    ,struct: `
        idefix_stroj bigint,
        idefix_strojmod bigint,
        idefix_barevnost bigint
    `
},
{
    name: 'list_strojceny'
    ,struct: `
        idefix_stroj bigint,
        idefix_strojmod bigint,
        idefix_inkoust bigint,

        kod int ,
        nazev varchar(100),
        pocet_start int ,
        pocet_stop int ,
        cena_naklad  float,
        cena_prodej  float,
        idefix_jednotka bigint   

    `
},
// Nasleduje detail - list mod stroj - neomezeny pocet
    
    {   name: 'list2_strojskup'
        ,struct:  `
         kod int,
         nazev varchar(20),
         typ_kalkulace varchar(20)`,
         index_name: [ 
                `kod  ~~~ (kod)`,
                `nazev ~~~ (nazev)`
          ],
        reindex: 1,
         initq: [
            `insert into list2_strojskup (nazev ) VALUES ('NE'),('Archove'),('Velkoploch');
             update list2_strojskup set kod = id ;`,
        ]
    } ,

    {   name: 'list2_prace'
        ,struct:  `
         kod int,
         nazev varchar(50),
         zkratka varchar(50),
         nazev_text varchar(100),
         stroj boolean default true,
         kalk_sloupec_v int default -1,
         kalk_sloupec_arch int default -1,
         kalk_sloupec_bt int default -1

         `,
         index_name: [ 
                `kod  ~~~ (kod)`,
                `nazev ~~~ (nazev)`
          ],
        reindex: 1,
         initq: [
            `insert into list2_jednotka (nazev ) VALUES ('NE'),('Tisk'),('Laminace');
             update list2_prace set kod = id ;`,
        ]
    } ,

    {   name: 'list2_format'
        ,struct:  `
         kod serial,
         nazev varchar(50),
         zkratka varchar(50),
         poznamka varchar(150),
         vyska numeric(10,2),
         sirka numeric(10,2)

         `,
         index_name: [ 
                `kod  ~~~ (kod)`,
                `nazev ~~~ (nazev)`
          ],
        reindex: 1,
         initq: [
            `insert into list2_format (nazev ) VALUES ('NE'),('Tisk'),('Laminace');
             `,
        ]
    } ,

   {   name: 'list2_jednotka'
    ,struct:  `
     kod int,
     nazev varchar(50),
     zkratka varchar(10)
     
     `,
     index_name: [ 
            `kod  ~~~ (kod)`,
            `nazev ~~~ (nazev)`
      ],
    reindex: 1,
     initq: [
        `insert into list2_jednotka (nazev.zkratka ) VALUES ('NE','NE'),('Ks/H','KSH'),('m2/h','M2H');
         update list2_jednotka set kod = id ;`,
    ]
} ,

    
    {   name: 'list2_strojlaminace'
        ,struct:  `
         kod int,
         nazev varchar(100)`,
         index_name: [ 
                `kod  ~~~ (kod)`,
                `nazev ~~~ (nazev)`
          ],
        reindex: 1,
         initq: [
            `insert into list2_strojlaminace (nazev ) VALUES ('NE'),('Jednostranná 1/0'),('Oboustranná 1/1');
             update list2_strojlaminace set kod = id ;`,
        ]
    },
        

    {   name: 'list2_strojtiskmod'
        ,struct:  `
         kod int,
         nazev varchar(100)`,
         index_name: [ 
                `kod  ~~~ (kod)`,
                `nazev ~~~ (nazev)`
          ],
        reindex: 1,
         initq: [
            `insert into list2_strojtiskmod (nazev ) VALUES ('NE'),('300x900/4/on/off'),('600x600/4/on/off')
            ,('600x600/4/on/off/ white'),('600x600/4/on/off - CMYK/WHITE/CMYK')
            ;
             update list2_strojtiskmod set kod = id ;`,
        ]
    },
    {   name: 'list2_matskup'
        ,struct:  `
         kod int,
         nazev varchar(20),
         zkratka varchar(5)`,
         index_name: [ 
                `kod  ~~~ (kod)`,
                `nazev ~~~ (nazev)`
          ],
        reindex: 1,
         initq: [
            `insert into list2_matskup (nazev ) VALUES ('NE'),('Deska'),('Arch'),('Role');
             update list2_matskup set kod = id ;`,
        ]
    },

 {   name: 'list2_matsubskup'
    ,struct:  `
     kod int,
     idefix_matskup int ,
     nazev varchar(200)`,
     index_name: [ 
            `kod  ~~~ (kod)`,
            `nazev ~~~ (nazev)`
      ],
    reindex: 1,
     initq: [
        `insert into list2_matsubskup (idefix_matskup,nazev ) VALUES (276,'Samolepicí fólie a laminace');
         update list2_matsubskup set kod = id ;`,
    ]
},

    {   name: 'list2_matdostupnost'
        ,struct:  `
         kod int,
         nazev varchar(50),
         zkratka varchar(5)`,
         index_name: [ 
                `kod  ~~~ (kod)`,
                `nazev ~~~ (nazev)`
                
          ],
        reindex: 1,
         initq: [
            `insert into list2_matdostupnost (nazev ) VALUES ('NE'),('Skladem'),('Na objednavku');
             update list2_matdostupnost set kod = id ;`,
        ]
    },
    {   name: 'list2_matbarva'
        ,struct:  `
         kod int,
         nazev varchar(50),
         zkratka varchar(5)`,
         index_name: [ 
                `kod  ~~~ (kod)`,
                `nazev ~~~ (nazev)`
                
          ],
        reindex: 1,
         initq: [
            //--hodnoty bílá, černá, transparentní,jiná
            `insert into list2_matbarva (nazev ) VALUES ('bílá'),('černá'),('transparentní'),('jiná');
             update list2_matbarva set kod = id ;`,
        ]
    },
    {   name: 'list2_matsirka'
        ,struct:  `
         kod int,
         sirka_mm int,
         vyska_mm int,
         idefix_mat int`   ,
         index_name: [ 
                `kod  ~~~ (kod)`,
                `sirka_mm ~~~ (sirka)`
          ],
        reindex: 1,
         initq: [
            `insert into list2_matsirka (sirka_mm ) VALUES ('0'),('1060'),('1370'),('1520');
             update list2_matsirka set kod = id ;`,
        ]
    },
    

    {   name: 'list_dodavatel'    //Docasne pridelim mat =  1 pro material, v bodoucnu dodelam vazby na dalsi typy ( doprava, interni, ostatni .... )
            //Sehnat zpusob z ARES
        ,struct:  `
         kod int,
         ico varchar(8) default '00000000',    
         dic varchar(20) default '',
         nazev varchar(100) default '',
         ulice varchar(100) default '',
         obec varchar(100) default '',
         psc  varchar(6) default '',
         
         ulice0 varchar(100) default '',
         obec0 varchar(100) default '',
         cp1 varchar(20) default '',
         cp2 varchar(20) default '',
         aktivni varchar(100) default '',

         nazev2 varchar(100) default '',
         ulice2 varchar(100) default '',
         obec2 varchar(100) default '',
         psc2  varchar(6) default '',
         tel varchar(100) default '',
         tel2 varchar(100) default '',
         mail varchar(100) default '',
         www varchar(100) default '',
         poznamka text default '',
         mat int default 1,
         splatnost int default 0,
         hotovost int default 1,
         datum_ares date 
         `,
         index_name: [ 
                `kod  ~~~ (kod)`,
                `nazev ~~~ (nazev)`
          ],
        reindex: 1,
         initq: [
            `insert into list_dodavatel (nazev ) VALUES ('NE'),('Antalis'),('FTP');
             update list_dodavatel set kod = id ;`,
        ]
    },
    

    {   name: 'list_firmaosoba'    //Docasne pridelim mat =  1 pro material, v bodoucnu dodelam vazby na dalsi typy ( doprava, interni, ostatni .... )
            //Sehnat zpusob z ARES
        ,struct:  `
         kod int,
         idefix_firma bigint,
         jmeno varchar(50) default '',
         prijmeni varchar(50) default '',
         titul varchar(20) default '',
         titulza varchar(20) default '',
         funkce varchar(50) default '',
         oddeleni varchar(50) default '',
         prioritni boolean default false,
         tel varchar(100) default '',
         tel2 varchar(100) default '',
         tel3 varchar(100) default '',
         mail varchar(100) default '',
         www varchar(100) default '',
         poznamka text default '',
         narozeniny date,
         mail_fakt varchar(100) default '',
         aktivni  boolean default true ,
         ulice varchar(100) default '',
         obec varchar(100) default '',
         psc  varchar(6) default ''
         
         `,
         index_name: [ 
                `kod  ~~~ (kod)`,
                `prijmeni ~~~ (nazev)`
          ],
        reindex: 1,
         initq: [
            `select 1 ;`
             
        ]
    },



    {   name: 'list_firmaprovozovna'    //Docasne pridelim mat =  1 pro material, v bodoucnu dodelam vazby na dalsi typy ( doprava, interni, ostatni .... )
            //Sehnat zpusob z ARES
        ,struct:  `
         kod int,
         idefix_firma bigint,
         nazev varchar(100) default '',
         nazev_txt varchar(100) default '',
         ulice varchar(100) default '',
         obec varchar(100) default '',
         psc  varchar(6) default '',

         jmeno varchar(50) default '',
         prijmeni varchar(50) default '',
         titul varchar(20) default '',
         titulza varchar(20) default '',
         funkce varchar(50) default '',
         oddeleni varchar(50) default '',
         prioritni boolean default false,
         aktivni boolean default true,
         tel varchar(15) default '',
         tel2 varchar(100) default '',
         tel3 varchar(100) default '',
         mail varchar(100) default '',
         www varchar(100) default '',
         poznamka text default '',
         otevreno_od time default '08:00',
         otevreno_do time default '17:00',
         po boolean default true,
         ut boolean default true,
         st boolean default true,
         ct boolean default true,
         pa boolean default true,
         so boolean default false,
         ne boolean default false,
         otevreno_w_od time default '08:00',
         otevreno_w_do time default '12:00'

         

         `,
         index_name: [ 
                `kod  ~~~ (kod)`,
                `nazev ~~~ (nazev)`
          ],
        reindex: 1,
         initq: [
            `select 1 ;`
        ]
    },
    {   name: 'list_firmanotice'    //Docasne pridelim mat =  1 pro material, v bodoucnu dodelam vazby na dalsi typy ( doprava, interni, ostatni .... )
            //Sehnat zpusob z ARES
        ,struct:  `
         kod int,
         idefix_firma bigint,
         txt text,
         txt2 text,
         pripominka boolean,

         idefix_osoba bigint,
         kdy TIMESTAMP,
         zobrazeno int default 0,
         
         datum TIMESTAMP
         
         `,
         index_name: [ 
                `kod  ~~~ (kod)`,
                `idefix_firma ~~~ (idefix_firma)`
          ],
        reindex: 1,
         initq: [
            `select 1 ;`
        ]
    },
    {   name: 'list_firmaosobanotice'    //Docasne pridelim mat =  1 pro material, v bodoucnu dodelam vazby na dalsi typy ( doprava, interni, ostatni .... )
            //Sehnat zpusob z ARES
        ,struct:  `
         kod int,
         idefix_firmaosoba bigint,
         txt text,
         datum TIMESTAMP
         
         `,
         index_name: [ 
                `kod  ~~~ (kod)`,
                `idefix_firmaosoba ~~~ (idefix_firmaosoba)`
          ],
        reindex: 1,
         initq: [
            `select 1 ;`
        ]
    },

    {   name: 'list_firmaprovozovnanotice'    //Docasne pridelim mat =  1 pro material, v bodoucnu dodelam vazby na dalsi typy ( doprava, interni, ostatni .... )
            //Sehnat zpusob z ARES
        ,struct:  `
         kod int,
         idefix_firmaprovozovna bigint,
         txt text,
         datum TIMESTAMP
         
         `,
         index_name: [ 
                `kod  ~~~ (kod)`,
                `idefix_firmaprovozovna ~~~ (idefix_firmaprovozovna)`
          ],
        reindex: 1,
         initq: [
            `select 1 ;`
        ]
    },

    {   name: 'list_firmaprace'    //Docasne pridelim mat =  1 pro material, v bodoucnu dodelam vazby na dalsi typy ( doprava, interni, ostatni .... )
    //Sehnat zpusob z ARES
        ,struct:  `
        kod int,
        idefix_firma bigint,
        idefix_prace bigint
        `,
 index_name: [ 
        `idefix_firma ~~~ (idefix_firma)`,
        `idefix_prace ~~~ (idefix_prace)`
  ],
reindex: 1,
 initq: [
    `select 1 ;`
]
},
    
    {   name: 'list2_matvyrobce'
        ,struct:  `
         kod int,
         vyrobce varchar(50),
         nazev varchar(50)`,
         index_name: [ 
                `kod  ~~~ (kod)`,
                `nazev ~~~ (nazev)`
          ],
        reindex: 1,
         initq: [
            `insert into list2_matvyrobce (nazev ) VALUES ('NE'),('Avery'),('Coala'),('3M'),('Asian');
             update list2_matvyrobce set kod = id ;`,
        ]
    },


    {   name: 'list_mat'
        ,struct:  `
         kod int default 0,
         idefix_matskup int default 0 ,  --deska arch role ....
         
         idefix_matsubskup int,   --kategorie - mozna ozno zrusit - nahrazeno nazvy ? 
         idefix_vyrobce int,   --presne oznbaceni
         
         nazev1 varchar(80),
         nazev2 varchar(80),
         nazev3 varchar(80),
         popis text,
         txt text,
         idefix_dodavatel int,
         dodavatel_priorita int default 0,
         nakup_result numeric(10,3) default 0  ,
         
         sila_mm numeric(10,2) default 0  ,
         vaha_gm2 numeric(10,2) default 0  ,
         
         cena_nakup_m2 numeric(10,2) default 0  ,
         
         koef_naklad numeric(10,2) default 0  ,   --//spolecna polozka
         koef_prodej numeric(10,2) default 0  ,   

         cena_nakup_kg numeric(10,2) default 0   ,   --!!!! cena za arch je různá podle gramáží papíru
         cena_nakup_arch numeric(10,2) default 0  ,  --výpočet z ceny za kg, formátu a gr. v db ponecham, prepoctu po ulozeni, nebo prepocitam aplikaci
         cena_naklad_arch numeric(10,2) default 0  ,    -- vypočteno nákupní cena x nákladový koeficient  - tedy postupne , podle zadanych hodnot

         cena_naklad_m2 numeric(10,2) default 0  ,    -- vypočteno nákupní cena x nákladový koeficient  - tedy postupne , podle zadanych hodnot
                           
         cena_prodej_m2 numeric(10,2)   default 0  , -- výpočet nákladová cena x prodejní koeficient     
         
         
         cena_prodej_arch numeric(10,2),  -- výpočet nákladová cena x prodejní koeficient     
         cena_nakup_bm numeric(10,2)  default 0  ,
         cena_prodej_bm numeric(10,2) default 0  ,
         cena_naklad_bm numeric(10,2) default 0  ,

         cena_nakup_baleni numeric(10,2)  default 0   ,
         cena_prodej_baleni numeric(10,2) default 0   ,
         cena_naklad_baleni numeric(10,2) default 0   ,
         objem_baleni numeric(10,2) default 0  ,
         cena_nakup_1l numeric(10,2) default 0  ,
         cena_prodej_1l numeric(10,2) default 0  ,
         cena_naklad_1l numeric(10,2)  default 0  ,
         txt text,
         kalkulace boolean default 
         
         `,
         /*
nákupní cena za m2 u rolových
nákladový koeficient
nákladová cena za m2 u rolových
prodejní koeficient
prodejní cena za m2 u rolových

ceny deskový materiál
nákupní cena za m2 u deskových
nákladový koeficient
nákladová cena za m2 u deskových
prodejní koeficient
prodejní cena za m2 u deskových

??? minimální velikost zbytku ???

ceny archový materiál - cena za arch
nákupní cena za kg
nákupní cena za arch
nákladový koeficient
nákladová cena za arch
prodejní koeficient
prodejní cena za arch

         */
         index_name: [ 
                `kod  ~~~ (kod)`,
                `nazev ~~~ (nazev)`
          ],
        reindex: 1,
         initq: [
            `insert into list_mat (nazev1 ) VALUES ('Vzor');
             update list_mat set kod = id ;`,
        ]
    },

    {   name: 'list_mat_vlastnosti'   // Vazba 1:n - obsahuje data vazana na list2_matvlastnosti
        ,struct:  `
         idefix_mat int,
         idefix_vlastnost int
         `,
         index_name: [ 
                `idefix_mat  ~~~ (idefix_mat)`
          ],
        reindex: 1,
         initq: [
            
        ]
    },

    {   name: 'list_mat_projcena'   // Vazba 1:n - obsahuje data vazana na list2_matvlastnosti
    ,struct:  `
     idefix_mat int,
     kod serial,
     datum date default now()::date,
     nabidka bigint default 0,
     zakazka bigint default 0,
     cena_m2 numeric(10,2),
     mnozstvi numeric(10,2),
     faktura varchar(20),
     popis varchar(100)

     `,
     index_name: [ 
            `idefix_mat  ~~~ (idefix_mat)`
      ],
    reindex: 1,
     initq: [
        
    ]
     },

    {   name: 'list_mat_barva'   // Vazba 1:n - obsahuje data vazana na list2_matvlastnosti
        ,struct:  `
         idefix_mat int,
         idefix_barva int
         `,
         index_name: [ 
                `idefix_mat  ~~~ (idefix_mat)`
          ],
        reindex: 1,
         initq: [
            
        ]
    },
    {   name: 'list_mat_potisknutelnost'   // Vazba 1:n - obsahuje data vazana na list2_matvlastnosti
        ,struct:  `
         idefix_mat int,
         idefix_potisknutelnost int
         `,
         index_name: [ 
                `idefix_mat  ~~~ (idefix_mat)`
          ],
        reindex: 1,
         initq: [
            
        ]
    },
    {   name: 'list_mat_rozmer'   // Vazba 1:n 
        ,struct:  `
         idefix_mat int,
         sirka_mm numeric(10,2) default 0,
         vyska_mm numeric(10,2) default 0,
         sirka_mm_zbytek numeric(10,2) default 0,
         vyska_mm_zbytek numeric(10,2) default 0,

         idefix_dostupnost int default 0,
         popis varchar(100)
         `,
         index_name: [ 
                `idefix_mat_rozmer  ~~~ (idefix_mat)`
                // create unique index list_mat_rozmer_mat_sir_vyska on list_mat_rozmer(idefix_mat,sirka_mm,vyska_mm)
          ],
        reindex: 1,
         initq: [
            
        ]
    }

    ,
    {   name: 'list_mat_strojskup'   // Vazba 1:n , skupiny - kategorie stroju
        ,struct:  `
         idefix_mat int,
         idefix_strojskup int default 0
         `,
         index_name: [ 
                `idefix_mat_strojskup  ~~~ (idefix_mat)`  // -- index na id materialu
          ],
        reindex: 1,
         initq: [
            
        ]
    }
    ,
    {   name: 'list_mat_stroj'   // Vazba 1:n , skupiny - stroje jednotlive, teoreticky y to nemelo bbyt potreba vubec
        ,struct:  `
         idefix_mat int,
         idefix_stroj int default 0
         `,
         index_name: [ 
                `idefix_mat_stroj  ~~~ (idefix_mat)`
          ],
        reindex: 1,
         initq: [
            
        ]
    }



]



if (false) {
atables.forEach(e0 => {
    var idx = JSON.stringify(e0.index_name)
    var inittxt = JSON.stringify(e0.initq)
    idx = idx.replace(/"/g,"'")
    //inittxt = inittxt.replace(/'/g,"\\'")
    inittxt = inittxt.replace(/"/g,"$$$")
    console.log(idx)
    //return
    
    
    var cq = 'insert into db_system (name, struct, index_name,initq, reindex) values '
    var cq2=` 
    ('${e0.name}','${e0.struct}'
    ,array${idx}
    ,array${inittxt}
    ,${e0.reindex}
    
     ) `
     cq2=cq2.replace(/array\[\]/g,'null')
     

    var q_all = `${cq} ${cq2}`
    console.log('\n\n',q_all,'\n\n')
    //q_all= 'update db_system set kod = id '
    //return
    pool.query(q_all,(err,res) => {
        if (err){
            console.log('err', q_all)
        }
    })
    console.log('\n\n',q_all,'\n\n')
    //console.log('A:',`'{${e0.index_name}}'`,'\n B: ',cq2)

}
    
);
return
}



var tabname=''
// const client = await pool.connect()
var dotazS0 = `create table ~~~ (id bigserial, idefix bigint default nextval('list2_seq'),
            ~S~S~   ,
            time_insert TIMESTAMP default now(),
            time_update TIMESTAMP default now(),  
            user_insert_idefix int,
            user_update_idefix int
)
`

var dotaz0=`CREATE or replace  RULE log_~~~ AS ON UPDATE TO ~~~
     where row(NEW.*) <> row(OLD.*)
        DO 
        INSERT INTO log_central 
        (idefix, 
        idefix_user,
        db_user,
        tabulka ,
        txt,
        typ,
        cas
        )
        VALUES (
                                    OLD.idefix,
                                    NEW.user_update_idefix,
                                    current_user,
                                    '~~~',
                                    row(OLD.*),
                                    'U',
                                    current_timestamp
                                )`


var dotazD=`CREATE or replace  RULE logdel_~~~ AS ON DELETE TO ~~~
     
        DO 
        INSERT INTO log_central 
        (idefix, 
        idefix_user,
        db_user,
        tabulka ,
        txt,
        typ,
        cas
        )
        VALUES (
                                    OLD.idefix,
                                    OLD.user_update_idefix,
                                    current_user,
                                    '~~~',
                                    row(OLD.*),
                                    'D',
                                    current_timestamp
         )`



//console.log(dotazD)                                
// dotaz0 = dotazD
//return;

//var dotaz=0                         
var dotazS=''

var status=0

//waitTill = new Date(new Date().getTime() + 1 * 1000)        
//while(waitTill > new Date()){}
/*
var neco = ''

//;(async function() {
    var addStruct=[]
    //var changeStruct=[]
    atables.forEach((el, idx) =>{
        addStruct=[]
        changeStruct=[]
        el.struct.split(',').forEach(el21=>{
            while (el21.match(/  /)) {
                el21 = el21.replace(/  /g,' ')

            }
            if (el21.match(/[a-z]/)){
                 el21= el21.replace(/\n/,' ')   
                addStruct.push([`alter table ${el.name} add ${el21}`])
                
            }


            
        })
        addStruct.forEach(el22 => {
            console.log(el22,"\n")
            pool.query(`${el22}`,(err  ,res)=>{
                if (err) {
                    console.log('Vynechavam ', el22)
                } else {
                    console.log('Vkladam  ', el22)
                }
            })
        })
        console.log(addStruct)      


    })
    //console.log(atables[0].struct)
    return
    */

   
   // return
   
    pool.query('select * from db_system',(err,res) => {
//        console.log(res.rows)
        console.log(atables)

   //res.rows.forEach((el, idx) =>{
    
   atables.forEach((el, idx) =>{
        for (let x in el){
            if (x == 'struct'){
                Struktura(el)
                while (!b1) ;
                b1 = false
                StrukturaChange(el)
                while (!b1) ;
                console.log(x)
                b1 = false
            }
            if (x == 'index_name'){
                Indexes(el)
                while (!b1) ;
                b1 = false
                console.log(x)
            }
            if (x == 'initq'){
                RulesD(el)
                while (!b1) ;
                b1 = false
                Rules(el)
                while (!b1) ;
                b1 = false
                console.log(x)
            }
            

        }
    }   )
    console.log('end')
})



    return;

//})()

//waitTill = new Date(new Date().getTime() + 1 * 1000)        
//while(waitTill > new Date()){}

function StrukturaChange(el) {
     var addStruct=[]
    //var changeStruct=[]
    
        addStruct=[]
     //   changeStruct=[]
     el.struct.split('\n').forEach(el21=>{

     //   el.struct.split(',').forEach(el21=>{
            while (el21.match(/  /)) {
                el21 = el21.replace(/  /g,' ')

            }
            if (el21.match(/[a-z]/)){
                 el21= el21.replace(/\n/,' ').replace(/,$/," ")   
                addStruct.push([`alter table ${el.name} add ${el21}`])
                
            }


            
        })
        addStruct.forEach(el22 => {
            console.log(el22,"\n")
            pool.query(`${el22}`,(err  ,res)=>{
                if (err) {
                    console.log('Vynechavam ', el22)
                } else {
                    console.log('Vkladam  ', el22)
                }
            })
        })
        console.log(addStruct)      
        b1 = true
    

}
 function Indexes(el) {
        var cq=''
        var index_name=''

    if (el.reindex == 1)   {
        try {
        pool.query(`select * from pg_indexes where schemaname='public' and tablename ilike '${el.name}'`, (err, res ) =>{
            if (err) {
                console.log('Chyba zjisteni indexu pro ', el.name )
            } else {
                if (res.rowCount > 0){
                    res.rows.forEach(idb=>{
                        try{
                       console.log("--------------\n",idb,"\n\n",
                       `drop index ${idb.schemaname}.${idb.indexname}`,
                       "\n--------------\n",

                       ) 
                       
                        pool.query(`drop index ${idb.schemaname}.${idb.indexname}`, (err,res) =>{
                            if (err){
                                console.log('Selhalo smazani ', `drop index ${idb.schemaname}.${idb.indexname}`)
                            } else {
                                console.log('OK  smazani ', `drop index ${idb.chemaname}.${idb.indexname}`)
                            }
                        })
                    } catch(e) {
                        console.log('pad 22')
                    }
                    })
                

                } else {
                    console.log('Indexy nejsou vytvoreny pro ', el.name )
                }
            }
        })
    } catch(e) {
        console.log('Pad 33')
    }
        
    }

    setTimeout(function(){

    // console.log(el.index_name)
    // return
    console.log(el.index_name,' /n',Array.isArray(el.index_name))
    if (!Array.isArray(el.index_name)){
        return
    }
        
    el.index_name.forEach(index_expr =>{
        
/*
        if (index_expr[1]==1){
           cq=`create unique index  ${el.name}_${index_expr[0]}` 
        } else {
            cq=`create index  ${el.name}_${index_expr[0]}` 
        }
*/
  
             cq=`create index  ${el.name}_${index_expr}` 
  
          cq = cq.replace(/~~~/g,` on ${el.name} `)

        try{
        pool.query(cq,(err,res)=>{
            if (err){
                console.log('ERROR !!! \n Index ',cq, 'jiz je nastaven',err.name, err.routine, res)
            }
        })
    } catch(e) {
        console.log('pad 44')
    }
        //console.log('Indexes: ',cq,  index_expr[0])  
    })
},500)    
b1 = true
}

async function OK(){
    console.log('OK EOF')
}
 
async function Drop(el, idx) {
    var lRet = 'NIC'
    pool.query(`select '${el.name}'`, (err, res) =>{
        if (err){
            lRet = 'X- NELZE'
            return lRet
            console.log('X- nezle smazat', el.name, idx)    
        } else {
            lRet = 'X- Smazano '
            return lRet
            console.log('smazano', el.name, idx)
        }
    })
  
}

async function Struktura(el) {
    console.log('Strukura' , el.name)
    var lRet= -1

    try {
    status= 0
    tabname = el.name    
    
    dotazS = dotazS0.replace(/~S~S~/g,el.struct)  //Vytvoreni struktury
    dotazS = dotazS.replace(/~~~/g,el.name)

    console.log(dotazS)
    


            pool.query(`${dotazS} `, (err, res )=> {
                if (err) {
                    console.log(err)
                    // return
                    
                    pool.query(`select * from ${el.name} limit 1`, (err2, res2)=>{
                        if (err2) {
                            console.log('ERR: ',`select * from ${el.name} limit 1` )
                            return 
                        }   
                        //
                       if (res2.rowCount > 0) {
                            console.log('netreba Init pro', el.name, res2.rowCount)
                        } 
                            else {
                                console.log('Je treba Init Pro', el.name)
                                InitQ(el.initq)
                            }
                    })
                    
                    lRet  = false 
                } else {
                    console.log('Je Treba Init',el.name, el.init)    
                    if (Array.isArray(el.initq)){
                        InitQ(el.initq)    
                    }
                    
                }
                //console.log(el.name, dotazS,idx)
            })
    } catch(e) {
        console.log('Err')
    }
    
    
        //console.log('Nastavuji 11')
        b1 = true;    
        


}

async function InitQ(aQ) {
    console.log('InitQ', aQ)
    if (!Array.isArray(aQ)){
        return
    }
    //return
    var qI1=''
    aQ.forEach(qI => {
        qI1 = qI.trim().replace(/\\n/g,'').trim()
        qI1 = qI1.trim().replace(/\\r/g,'').trim()
   //     console.log("Trim:", qI.trim().replace(/\\n/g,'XXXX'))

        
        pool.query(qI1,(err,res)=>{
            if (err){
                console.log('ERR ',qI1)

            } else {
                console.log(res)
            }
        })
     //   console.log(qI)
    })
}


async function Rules(el) {
    console.log('Rules')
    try{
    status= 0
    tabname = el.name    
    dotaz = dotaz0.replace(/~~~/g,el.name)   //Nastaveni rule
            pool.query(` ${dotaz} `, (err, res )=> {
                if (err) {
                    console.log('selhani Rule', el.name)
                    console.log(dotaz)
                } else {
                    console.log(' Rule Ok pro',el.name)    
                }
                //console.log(el.name, dotazS,idx)
            })
    } catch(e) {
        console.log('Err')
    }
    b1 = true
}

async function RulesD(el) {
    console.log('Rules D')
    try{
    status= 0
    tabname = el.name    
    dotaz = dotazD.replace(/~~~/g,el.name)   //Nastaveni rule
    
            pool.query(` ${dotaz} `, (err, res )=> {
                if (err) {
                    console.log('selhani Rule', el.name)
                    console.log(dotaz)
                } else {
                    console.log(' Rule Ok pro',el.name)    
                }
                //console.log(el.name, dotazS,idx)
            })
    } catch(e) {
        console.log('Err')
    }
    b1 = true

}



