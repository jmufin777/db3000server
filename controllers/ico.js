const _ = require('lodash')
const request = require('request')

var lErr= false
module.exports = {
    async all (req, response) {
      var firma=''
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

  


}
