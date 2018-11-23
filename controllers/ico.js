//const {User} = require('../models')
//const jwt = require('jsonwebtoken')
//const config = require('../config/config')
//const {pool, client } = require('../db')
const _ = require('lodash')
const request = require('request')
const xml2js = require('xml2js');

var lErr= false



module.exports = {

    async all (req, response) {
      var firma=''
      const objFirma ={}
      var neco = Array()
      request(`https://wwwinfo.mfcr.cz/cgi-bin/ares/darv_bas.cgi?ico=${req.query.id}`, { json: false }, (err, res, body) => {
     if (err) { return console.log(err); }
      firma = body
     
      //$cela="<$txt>([^^]*)<\/$txt>";
      //neco = firma.match(/|<D:ICO zdroj="OR">([27074358])<\/D:ICO>|U/)

       //console.log(neco.length)
       
      //  var rico = /(?=D\:ICO zdroj="OR").*\s*([^^]*)<\/D\:ICO>/
      //  var rdic = /(?=D:DIC zdroj="DPH").*\s*([^^]*)<\/D\:DIC>/
      //  var rnazev = /(?=D:OF zdroj="OR").*\s*([^^]*)<\/D\:OF>/
       
       //D:OF zdroj="OR">Asseco Central Europe, a.s.</D:OF>
      try {
       objFirma.datumvypisu = firma.match(/(?=D:ADB).*\s*([^^]*)<\/D\:ADB>/)[0].split(/[<>]/)[1]
       objFirma.ico         = firma.match(/(?=D\:ICO zdroj="OR").*\s*([^^]*)<\/D\:ICO>/)[0].split(/[<>]/)[1]
       objFirma.dic         = firma.match(/(?=D:DIC zdroj="DPH").*\s*([^^]*)<\/D\:DIC>/)[0].split(/[<>]/)[1]
       objFirma.nazev       = firma.match(/(?=D:OF zdroj="OR").*\s*([^^]*)<\/D\:OF>/)[0].split(/[<>]/)[1]
       objFirma.ulicecela   = firma.match(/(?=D:UC).*\s*([^^]*)<\/D\:UC>/)[0].split(/[<>]/)[1]
       objFirma.obeccela    = firma.match(/(?=D:PB).*\s*([^^]*)<\/D\:PB>/)[0].split(/[<>]/)[1]
       objFirma.obec        = firma.match(/(?=D:NMC).*\s*([^^]*)<\/D\:NMC>/)[0].split(/[<>]/)[1]
       objFirma.ulice       = firma.match(/(?=D:NU).*\s*([^^]*)<\/D\:NU>/)[0].split(/[<>]/)[1]
       objFirma.psc         = firma.match(/(?=D:PSC).*\s*([^^]*)<\/D\:PSC>/)[0].split(/[<>]/)[1]
       objFirma.obec        = firma.match(/(?=D:NMC).*\s*([^^]*)<\/D\:NMC>/)[0].split(/[<>]/)[1]
       objFirma.cp1         = firma.match(/(?=D:CD).*\s*([^^]*)<\/D\:CD>/)[0].split(/[<>]/)[1]
       objFirma.cp2         = firma.match(/(?=D:CO).*\s*([^^]*)<\/D\:CO>/)[0].split(/[<>]/)[1]
       objFirma.aktivni     = firma.match(/(?=D:SSU).*\s*([^^]*)<\/D\:SSU>/)[0].split(/[<>]/)[1]
       
       console.log(objFirma)
       
        response.json(objFirma)
      } catch(e)  {
         response.json({err: `Nejsou data pro subjekt ${req.query.id}`}) 
      }
  // console.log(body.explanation);
      });
      if (req.query.id=='nic') {
          
      }
      console.log(req.query.id )

      //res.json({'ok': body })

  },

  


}
