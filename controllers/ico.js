const _ = require('lodash')
const Promise = require('promise')
const request = require('request')
const {pool, client } = require('../db')


var lErr= false
var  b = false
module.exports = {
    async all (req, response) {
      var firma=''
      console.log(req.query)
      
      //return
      //return
      const objFirma ={

          datumvypisu : '' ,
          ico         : '' ,
          dic         : '' ,
          nazev       : '' ,
          ulicecela   : '' ,
          obeccela    : '' ,
          obec        : '' ,
          ulice       : '' ,
          psc         : '' ,
          obec        : '' ,
          cp1         : '' ,
          cp2         : '' ,
          aktivni     : '' ,
      }
      const url= `https://wwwinfo.mfcr.cz/cgi-bin/ares/darv_bas.cgi?ico=${req.query.id}`
      request(`${url}`, { json: false }, (err, res, body) => {
     if (err) { return console.log(err); }
      firma = body

       var datumvypisu = firma.match(/(?=D:ADB).*\s*([^^]*)<\/D\:ADB>/)
       var ico         = firma.match(/(?=D\:ICO zdroj="([^^]*)").*\s*([^^]*)<\/D\:ICO>/)
       var dic         = firma.match(/(?=D:DIC zdroj="([^^]*)").*\s*([^^]*)<\/D\:DIC>/)
       var nazev       = firma.match(/(?=D:OF zdroj="([^^]*)").*\s*([^^]*)<\/D\:OF>/)
       var ulicecela   = firma.match(/(?=D:UC).*\s*([^^]*)<\/D\:UC>/)
       var obeccela    = firma.match(/(?=D:PB).*\s*([^^]*)<\/D\:PB>/)
       var obec        = firma.match(/(?=D:NMC).*\s*([^^]*)<\/D\:NMC>/)

       var ulice       = firma.match(/(?=D:NU).*\s*([^^]*)<\/D\:NU>/)
       var psc         = firma.match(/(?=D:PSC).*\s*([^^]*)<\/D\:PSC>/)
       var obec        = firma.match(/(?=D:NMC).*\s*([^^]*)<\/D\:NMC>/)
       var cp1         = firma.match(/(?=D:CD).*\s*([^^]*)<\/D\:CD>/)
       var cp2         = firma.match(/(?=D:CO).*\s*([^^]*)<\/D\:CO>/)
       var aktivni     = firma.match(/(?=D:SSU).*\s*([^^]*)<\/D\:SSU>/)


       //Kdyz to nevyjde
       if (!obec){
         obec        = firma.match(/(?=D:N>).*\s*([^^]*)<\/D\:N>/)

       //  dic = ['a','b<a']
       }
       console.log(dic)


      // https://wwwinfo.mfcr.cz/cgi-bin/ares/darv_bas.cgi?ico=60216654

      try {
       objFirma.datumvypisu = (datumvypisu) ? datumvypisu    [0].split(/[<>]/)[1]:''
       objFirma.ico         = (ico        ) ? ico            [0].split(/[<>]/)[1]:''
       objFirma.dic         = (dic        ) ? dic            [0].split(/[<>]/)[1]:''
       objFirma.nazev       = (nazev      ) ? nazev          [0].split(/[<>]/)[1]:''
       objFirma.ulicecela   = (ulicecela  ) ? ulicecela      [0].split(/[<>]/)[1]:''
       objFirma.obeccela    = (obeccela   ) ? obeccela       [0].split(/[<>]/)[1]:''
       objFirma.obec        = (obec       ) ? obec           [0].split(/[<>]/)[1]:''
       objFirma.ulice       = (ulice      ) ? ulice          [0].split(/[<>]/)[1]:''
       objFirma.psc         = (psc        ) ? psc            [0].split(/[<>]/)[1]:''
       objFirma.obec        = (obec       ) ? obec           [0].split(/[<>]/)[1]:''
       objFirma.cp1         = (cp1        ) ? cp1            [0].split(/[<>]/)[1]:''
       objFirma.cp2         = (cp2        ) ? cp2            [0].split(/[<>]/)[1]:''
       objFirma.aktivni     = (aktivni    ) ? aktivni        [0].split(/[<>]/)[1]:'Neuvedeno'
       if (objFirma.ulicecela.match(/^[0-9]/) && ! objFirma.ulicecela.match(/[a-z]/i) ){
        objFirma.ulicecela=objFirma.obec  + ' ' + objFirma.ulicecela 
       }
       
       console.log(objFirma)
       
        response.json(objFirma)
      } catch(e)  {
         console.log(e)
         response.json({err: `Nejsou k dispozici data pro subjekt ${req.query.id}`}) 
      }
       // console.log(body.explanation);
      });
      if (req.query.id=='nic') {
          
      }
      console.log(req.query.id )

      //res.json({'ok': body })

  },

  async allFce (req, f2)   {
    var firma=''
    //console.log(req.query)
    var b = true
    var q = ''
    var pol = ''


    //return
    //return
    
    const objFirma ={
        datumvypisu : '' ,
        ico         : '' ,
        dic         : '' ,
        nazev       : '' ,
        ulicecela   : '' ,
        obeccela    : '' ,
        obec        : '' ,
        ulice       : '' ,
        psc         : '' ,
        obec        : '' ,
        cp1         : '' ,
        cp2         : '' ,
        aktivni     : '' ,
    }

    const url= `https://wwwinfo.mfcr.cz/cgi-bin/ares/darv_bas.cgi?ico=${req.query.id}`
  let xyz =   await request(`${url}`, { json: false }, (err, res, body) => {
   if (err) { return console.log(err); }
    firma = body

     var datumvypisu = firma.match(/(?=D:ADB).*\s*([^^]*)<\/D\:ADB>/)
     var ico         = firma.match(/(?=D\:ICO zdroj="([^^]*)").*\s*([^^]*)<\/D\:ICO>/)
     var dic         = firma.match(/(?=D:DIC zdroj="([^^]*)").*\s*([^^]*)<\/D\:DIC>/)
     var nazev       = firma.match(/(?=D:OF zdroj="([^^]*)").*\s*([^^]*)<\/D\:OF>/)
     var ulicecela   = firma.match(/(?=D:UC).*\s*([^^]*)<\/D\:UC>/)
     var obeccela    = firma.match(/(?=D:PB).*\s*([^^]*)<\/D\:PB>/)
     var obec        = firma.match(/(?=D:NMC).*\s*([^^]*)<\/D\:NMC>/)

     var ulice       = firma.match(/(?=D:NU).*\s*([^^]*)<\/D\:NU>/)
     var psc         = firma.match(/(?=D:PSC).*\s*([^^]*)<\/D\:PSC>/)
     var obec        = firma.match(/(?=D:NMC).*\s*([^^]*)<\/D\:NMC>/)
     var cp1         = firma.match(/(?=D:CD).*\s*([^^]*)<\/D\:CD>/)
     var cp2         = firma.match(/(?=D:CO).*\s*([^^]*)<\/D\:CO>/)
     var aktivni     = firma.match(/(?=D:SSU).*\s*([^^]*)<\/D\:SSU>/)


     //Kdyz to nevyjde
     if (!obec){
       obec        = firma.match(/(?=D:N>).*\s*([^^]*)<\/D\:N>/)
     //  dic = ['a','b<a']
     }
     //console.log(dic)

    // https://wwwinfo.mfcr.cz/cgi-bin/ares/darv_bas.cgi?ico=60216654

    try {
     objFirma.datumvypisu = (datumvypisu) ? datumvypisu    [0].split(/[<>]/)[1]:''
     objFirma.ico         = (ico        ) ? ico            [0].split(/[<>]/)[1]:''
     objFirma.dic         = (dic        ) ? dic            [0].split(/[<>]/)[1]:''
     objFirma.nazev       = (nazev      ) ? nazev          [0].split(/[<>]/)[1]:''
     objFirma.ulicecela   = (ulicecela  ) ? ulicecela      [0].split(/[<>]/)[1]:''
     objFirma.obeccela    = (obeccela   ) ? obeccela       [0].split(/[<>]/)[1]:''
     objFirma.obec        = (obec       ) ? obec           [0].split(/[<>]/)[1]:''
     objFirma.ulice       = (ulice      ) ? ulice          [0].split(/[<>]/)[1]:''
     objFirma.psc         = (psc        ) ? psc            [0].split(/[<>]/)[1]:''
     objFirma.obec        = (obec       ) ? obec           [0].split(/[<>]/)[1]:''
     objFirma.cp1         = (cp1        ) ? cp1            [0].split(/[<>]/)[1]:''
     objFirma.cp2         = (cp2        ) ? cp2            [0].split(/[<>]/)[1]:''
     objFirma.aktivni     = (aktivni    ) ? aktivni        [0].split(/[<>]/)[1]:'Neuvedeno'
     if (objFirma.ulicecela.match(/^[0-9]/) && ! objFirma.ulicecela.match(/[a-z]/i) ){
      objFirma.ulicecela=objFirma.obec  + ' ' + objFirma.ulicecela 
     }

     b = true
     
     /// return objFirma
     // return Promise.resolve(objFirma);

     if (f2.ico) {
       if (f2.dic != objFirma.dic && objFirma.dic > ' ') {
        q=`update list_dodavatel set dic = '${objFirma.dic}' where idefix = ${f2.idefix}`
        console.log( f2.nazev, objFirma.dic, f2.idefix, q)
        pool.query(q)
       }
       if (f2.nazev != objFirma.nazev && objFirma.nazev > ' ') {
        q=`update list_dodavatel set nazev = '${objFirma.nazev}' where idefix = ${f2.idefix}`
        console.log( f2.nazev, objFirma.dic, f2.idefix, q)
        pool.query(q)
       }

       if (f2.ulice != objFirma.ulicecela && objFirma.ulicecela > ' ') {
        b=false
        q=`update list_dodavatel set ulice2 = ulice where idefix = ${f2.idefix} and (ulice2='' or ulice2 is null )`  
        pool.query(q)
        b= true
        while(!b);

        q=`update list_dodavatel set ulice = '${objFirma.ulicecela}' where idefix = ${f2.idefix}`
        console.log( f2.ulice, objFirma.ulicecela, f2.idefix, q)
        pool.query(q)
       }

       if ((f2.obec != objFirma.obec && objFirma.obec > ' ' ) && (f2.psc != objFirma.psc && objFirma.psc > ' ')) {
        b=false
        q=`update list_dodavatel set obec2 = obec, psc2= psc where idefix = ${f2.idefix} and (obec2='' or obec2 is null )`  
        pool.query(q)
        b= true
        while(!b);

        q=`update list_dodavatel set obec = '${objFirma.obec}', psc= '${objFirma.psc}'  where idefix = ${f2.idefix}`
        console.log( q)
        pool.query(q)
       }
       q=`update list_dodavatel set datum_ares = now()  where idefix = ${f2.idefix}`
        console.log( q)
        pool.query(q)


     }
     

     
     //req.objFirma.push(objFirma)
     
    // res.json(objFirma);
     

     
     
     
     
  //    response.json(objFirma)
    } catch(e)  {
       console.log(e)
       //response.json({err: `Nejsou k dispozici data pro subjekt ${req.query.id}`}) 
    }
     // console.log(body.explanation);
    })
    
    
},

  


}
