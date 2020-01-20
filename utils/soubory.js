const { exec } = require('child_process');
const fs = require('fs')
const os = require("os");
require('./slozky')()
require('./ostatni')()
module.exports = function() {
    this.__dirname=__dirname.replace(/\/utils/,'')
    this.errfile=`${this.__dirname}/obrazky/error.jpg`
    
    console.log('AAAA', slozky_thumbs, this.__dirname)
    this.path = require('path')
    /*
    this.slozky_zakazky= '/home/db3000/db/zakazky/'
    this.slozky_thumbs=`/home/db3000/db/thumbs`
    this.slozky_vyroba=`/home/db3000/db/vyroba/`
    this.slozky_mezipamet=`/home/db3000/db/vyroba/mezipamet`
    this.slozky_stroje=`/home/db3000/db/vyroba/stroje`
    this.slozky_zakazky_pdf=`/home/db3000/db/slozky_zakazky_pdf`
    this.slozky_osobni=`/home/db3000/slozky/`
    */
    this.log= async function(req){
        //console.log("LOGGGG",req.body)
        //await Prikaz(`mkdir -p ./log`)
        dd = new Date()  
        //fs.writeFileSync("./log/log.txt", `
        fs.appendFileSync("./log/log0.txt", `
        ${dd.getHours()}:${dd.getMinutes()}:${dd.getSeconds()};${req.body.txt1.trim()};${req.body.txt2.trim()};${req.body.txt3.trim()};${req.body.txt4.trim()};`, { mode: 0o777 });

        req.body.txt1=req.body.txt1.replace(/\n|\r/g,'')
        req.body.txt1=req.body.txt1.replace(/ +(?= )/g,'');
        fs.appendFileSync("./log/log.txt", `
        ${dd.getHours()}:${dd.getMinutes()}:${dd.getSeconds()};${req.body.txt1.trim()};${req.body.txt2.trim()};${req.body.txt3.trim()};${req.body.txt4.trim()};`, { mode: 0o777 });
   }
   this.logS= async function(txt1='',txt2='',txt3='',txt4=''){
    //console.log("LOGGGG",req.body)
    txt1=JSON.stringify(txt1)
    txt2=JSON.stringify(txt2)
    txt3=JSON.stringify(txt3)
    txt4=JSON.stringify(txt4)
    dd = new Date()  
    //fs.writeFileSync("./log/log.txt", `
    fs.appendFileSync("./log/logS0.txt", `
    ${dd.getHours()}:${dd.getMinutes()}:${dd.getSeconds()};${txt1.trim()};${txt2.trim()};${txt3.trim()};${txt4.trim()};`, { mode: 0o777 });

    txt1=txt1.replace(/\n|\r/g,'')
    txt1=txt1.replace(/ +(?= )/g,'');
    fs.appendFileSync("./log/logS.txt", `
    ${dd.getHours()}:${dd.getMinutes()}:${dd.getSeconds()};${txt1.trim()};${txt2.trim()};${txt3.trim()};${txt4.trim()};`, { mode: 0o777 });
}
this.logE= async function(txt1='',txt2='',txt3='',txt4=''){
  //console.log("LOGGGG",req.body)
  txt1=JSON.stringify(txt1)
  txt2=JSON.stringify(txt2)
  txt3=JSON.stringify(txt3)
  txt4=JSON.stringify(txt4)
  dd = new Date()  
  //fs.writeFileSync("./log/log.txt", `
  fs.appendFileSync("./log/logE0.txt", `
  ${dd.getHours()}:${dd.getMinutes()}:${dd.getSeconds()};${txt1.trim()};
    ${txt2.trim()};
    ${txt3.trim()};
    ${txt4.trim()};`, { mode: 0o777 });

  txt1=txt1.replace(/\n|\r/g,'')
  txt1=txt1.replace(/ +(?= )/g,'');
  fs.appendFileSync("./log/logS.txt", `
  ${dd.getHours()}:${dd.getMinutes()}:${dd.getSeconds()};${txt1.trim()};${txt2.trim()};${txt3.trim()};${txt4.trim()};`, { mode: 0o777 });
}
    this.k2=function(){
        console.log('k1',slozky_thumbs)
        slozky_thumbs='z k2 zase'

      }

      this.konverze=async function konverze(soubor, idefix, res){
        /*
        return new Promise((res, reject)=>{
          return resolve
        })
          */
         var nahled = await getNahledyFolder(soubor)
       return new Promise(function(resolve) {
        //setTimeout(function(){
          //resolve(['comedy', 'drama', 'action'])
        //}, 2000);
      
      
        var ext      = path.extname(soubor)
        var basename0 = path.basename(soubor,ext)
        
        var dir      = path.dirname(soubor)
        //var 
        var jpg300 =  basename0+'_300'+'.jpg'
        var jpg800 =  basename0+'_800'+'.jpg'
        
        var srcImage = soubor
        var konec = false
        res = res || []
        res.push(soubor)
        res.push(jpg300)
        res.push(jpg800)
        res.push(basename0+ext)
      
        if (soubor.match(/\.pdf/i)){
          srcImage+='[0]'
        }
        
        out=Math.round(Math.random()*987456115)
        var fInfo= getFileInfo(soubor)
        
        
        //outfile800=`${__dirname}/uploads/${jpg800}`
        //outfile300=`${__dirname}/uploads/${jpg300}`
        
        errfile=`${__dirname}/obrazky/error.jpg`
        outfile800=`${nahled}/${jpg800}`
        outfile300=`${nahled}/${jpg300}`
        
        
        //var dat= datum5(fInfo.zmena) 
        //console.log("SUBOR" , soubor,dat, '   ', fInfo) 
        //thumbFolder=thumbFolder()
        //prikazMakeThumbFolder="mkdir -p /home/db3000/db/thumbs/"+basename0.substr(0,3)
      
        prikaz800=`#!/bin/bash \n sudo /usr/bin/convert  "${srcImage}" -thumbnail 800x600 "${outfile800}"`
        prikaz300=`sudo /usr/bin/convert  "${outfile800}" -thumbnail 300x200 "${outfile300}"`
        if (fs.existsSync(`"${outfile800}"`)) {
          prikaz800=`#!/bin/bash \n echo existuje "${outfile800}"`
        }  
        if (fs.existsSync(`"${outfile300}"`)) {
          prikaz300=`echo existuje "${outfile300}"`
        }  
        
        //prikaz2=" screen -dmS sss  /home/jarda/db3000/server/thumb4.sh"
        prikaz2="/home/jarda/db3000/server/thumb4"+out+".sh"
        console.log('Konverze ', soubor, ' idefix', idefix, prikaz2 )
        //prikaz2="/home/jarda/db3000/server/thumb4"+".sh"
        //screen -dmS sss  
        try {
           fs.writeFileSync(prikaz2, prikaz800+'\n'+prikaz300
             , { mode: 0o777 });
        } catch(err) {
        }
        //var result = require('child_process').execSync(prikaz2).toString();
        //var result = execSync(prikaz2).toString();
        exec(prikaz2, (error1, stdout1, stderr1) => {
          konec=true
          if (error1){
            row=query(`insert into prilohy_prijem (nazev,script_sh,thumb_1,thumb_2,idefix_user) select '${soubor}','${prikaz2}','${errfile}','${errfile}',${idefix}`)
          } else {
            row=query(`insert into prilohy_prijem (nazev,script_sh,thumb_1,thumb_2,idefix_user) select '${soubor}','${prikaz2}','${outfile300}','${outfile800}',${idefix}`)
          }
            res.push(row[0].idefix) 
            resolve(res)
            exec(`mv ${prikaz2} ./hotovo`, (error2, stdout2, stderr2)=>{
            //  console.log('presunuto ',prikaz2)
            })
          //console.log('res', res)  
          //return res
        })
        
        //console.log(res)
          
      });    
        
        return 
      
        /*
        fs.writeFile(prikaz2, prikaz800+'\n'+prikaz300,err=>{
          if (err){
            console.log('Err',err)
            return
          }
          exec(`sudo chmod 777 ${prikaz2}`, (error, stdout, stderr) => {
              if (error) {
                console.error(`0A exec error: ${error}`, ___line);
              //  return;
              }
                console.log(`1 stdout 777 : ${stdout}`);
                console.error(`2 stderr : ${stderr}`);
      
          exec(prikaz2, (error1, stdout1, stderr1) => {
              if (error1) {
                //console.error(`0B exec error: ${error1}`);
                console.log('Chyba, kopiruji chybu')
      
                return res;
              }
              console.log(`3 stdout: ${stdout1}`);
              // console.log(`4 stderr: ${stderr1}`);
              if (stderr1){
                
                //res.json({"err": stderr1})
                return res
              }
              //res.json({"Nahrano": 'nahrabo'})
              //res.sendFile(outfile)
              return res
          
            });
      
          })
        })
        */
        console.log(res)
        return res;
      
      
      }
      this.getFilesizeInBytes = function getFilesizeInBytes(filename) {
        const stats = fs.statSync(filename);
        const fileSizeInBytes = stats.size;
        var mtime = stats.mtime;
        //console.log("MODIFY ", mtime);
        return fileSizeInBytes;
      }
      
      this.getFileInfo = function getFileInfo(filename) {
        const stats = fs.statSync(filename);
        const fileSizeInBytes = stats.size;
        var mtime = stats.mtime;
      
        //console.log("MODIFY ", mtime);
        return {size: fileSizeInBytes, zmena: mtime} ;
      }
      
      
      
      this.getNahledyFolder =function getNahledyFolder(soubor) {
        return new Promise(function(resolve) {
      
          
        var dbSlozka="/home/db3000/db/thumbs/"
        var info=getFileInfo(soubor);
        var cas=datum5(info.zmena)
        var nazev=path.basename(soubor)
        var nazevSlozkyZkratka=cleanNazev(nazev).substr(0,3)
        var celaSlozka = dbSlozka + nazevSlozkyZkratka+'/'+cas
        exec(`mkdir -p "${celaSlozka}"`, (error1, stdout1, stderr1) => {
          resolve(celaSlozka)
        }  
        
        )
      
        //console.log("\n\n\n\GetNahledy ", soubor," // NAZEFFF ", nazev , " clean " , nazevSlozkyZkratka,"\n\n\n" ,celaSlozka )
      }
        )
      
      }
      this. cleanNazev = function cleanNazev(nazev){
        return nazev.toUpperCase().replace(/[^a-zA-Z0-9]+/g, "");
      }

      this.Prikaz=async function Prikaz(prikaz){
        var prevod=0.352778
        //var prikaz=`pdfinfo -box "${pdf}"`
        console.log("PRIKAZ ", prikaz)
        //return
        return new Promise(function(resolve) {
      
          exec(prikaz, (error1, stdout1, stderr1) => {
          konec=true
          if (error1){
            console.log('ERRO Prikaz : ', error1)
            resolve(false)
            //row=query(`insert into prilohy_prijem (nazev,script_sh,thumb_1,thumb_2,idefix_user) select '${soubor}','${prikaz2}','${errfile}','${errfile}',${idefix}`)
          } else {
            //row=query(`insert into prilohy_prijem (nazev,script_sh,thumb_1,thumb_2,idefix_user) select '${soubor}','${prikaz2}','${outfile300}','${outfile800}',${idefix}`)
          }
            //res.push(row[0].idefix) 
            //console.log('Info OK ',stdout1)
            //resolve(stdout1)
            resolve(true)
       
            })
      
          //return res
        })
       }

    this.recFindByExtOrig = function recFindByExtOrig(base,ext,files,result)  //hleda podle pripony - muze se hodit
{
    files = files || fs.readdirSync(base) 
    result = result || [] 

    files.forEach( 
        function (file) {
            var newbase = path.join(base,file)
            if ( fs.statSync(newbase).isDirectory() )
            {
                result = recFindByExt(newbase,ext,fs.readdirSync(newbase),result)
            }
            else
            {
                if ( file.substr(-1*(ext.length+1)) == '.' + ext )
                {
                    result.push(newbase)
                } 
            }
        }
    )
    return result
}

this.recFindByExt2=function recFindByExt2(base,ext,fileinfo,files,result)  //Pouzivam , nemazat
{
    files = files || fs.readdirSync(base) 
    result = result || [] 
    var fInfo0 = JSON.parse(fileinfo)
    //console.log("Hlodadlo",base, ext, fileinfo,fInfo0.size)
    //return


    files.forEach( 
        function (file) {
            var newbase = path.join(base,file)
            

            if ( fs.statSync(newbase).isDirectory() )
            {
                result = recFindByExt2(newbase,ext,fileinfo,fs.readdirSync(newbase),result)
            }
            else
            {
                //if ( file.substr(-1*(ext.length+1)) == '.' + ext )
                console.log('file' ,file , 'ext', ext)
                if ( file.trim() ==  ext.trim() )
                { 
                    var fInfo=getFileInfo(newbase) 
                    if (fInfo0.size==fInfo.size
                        // && fInfo0.zmena==fInfo.zmena
                      ){
                      console.log('file' ,file , 'ext', ext,'info : ' ,fileinfo ,newbase, " ",getFilesizeInBytes(newbase), " size2 ", fInfo.size ,"  size 1", fInfo0.zmena  )
                      result.push(newbase)
                    }
                    
                } 
            }
        }
    )
    return result
}

this.recFindByExt2Bck = function recFindByExt2Bck(base,ext,files,result)  //Pouzivam , nemazat
{
    files = files || fs.readdirSync(base) 
    result = result || [] 
    //console.log(ext)

    files.forEach( 
        function (file) {
            var newbase = path.join(base,file)
            if ( fs.statSync(newbase).isDirectory() )
            {
                result = recFindByExt2(newbase,ext,fs.readdirSync(newbase),result)
            }
            else
            {
                //if ( file.substr(-1*(ext.length+1)) == '.' + ext )
                //console.log('file' ,file , 'ext', ext)
                if ( file.trim() ==  ext.trim() )
                {  
                  
                    //console.log('file' ,file , 'ext', ext)
                    
                    result.push(newbase)
                } 
            }
        }
    )
    return result
}


this.pdfInfo = async function pdfInfo(pdf){
  var prevod=0.352778
  var prikaz=`pdfinfo -box "${pdf}"`
  console.log("PDF INFO ", prikaz)
  //return
  return new Promise(function(resolve) {

    exec(prikaz, (error1, stdout1, stderr1) => {
    konec=true
    if (error1){
      //row=query(`insert into prilohy_prijem (nazev,script_sh,thumb_1,thumb_2,idefix_user) select '${soubor}','${prikaz2}','${errfile}','${errfile}',${idefix}`)
    } else {
      //row=query(`insert into prilohy_prijem (nazev,script_sh,thumb_1,thumb_2,idefix_user) select '${soubor}','${prikaz2}','${outfile300}','${outfile800}',${idefix}`)
    }
      //res.push(row[0].idefix) 
      //console.log('Info OK ',stdout1)

      resolve(stdout1)
 
      })

    //return res
  })
 }


this.pdfRozbor=function  pdfRozbor(txt) {
   var res=''
   var tmp=[]
   var koef=0.352778
   var ret={
     sirka:0,
     vyska:0,
     format:'Vlastni'
   }
   console.log(txt)
   fs.appendFileSync("/home/jarda/db3000/server/qUpdate.sql", "\n 1 rozbor\n"  , { mode: 0o777 });
   fs.appendFileSync("/home/jarda/db3000/server/qUpdate.sql", `\n 2 rozbor ${txt}\n`  , { mode: 0o777 });
   return new Promise(function(resolve){
     if ((txt+'').trim()==''){
       resolve(ret);
       fs.appendFileSync("/home/jarda/db3000/server/qUpdate.sql", `\n 3 rozbor Empty ${txt}\n`  , { mode: 0o777 });
       return;
     }
     res=txt.split("\n")
     res.forEach((el,idx)=>{
       if (el.match(/Trimbox/i)){
         
         tmp = el.replace(/  +/g, ' ').split(' ');
         sirka=(tmp[3]*1 - tmp[1]*1)*koef
         vyska=(tmp[4]*1 - tmp[2]*1)*koef
         sirka=Math.round(sirka)
         vyska=Math.round(vyska)
         ret.sirka=sirka
         ret.vyska=vyska
         var q = `select * from list2_format  where (sirka = ${sirka} and vyska = ${vyska}) or (vyska = ${sirka} and sirka = ${vyska})`
         var av=query(q)
         if (av.length>0){
            ret.format=av[0].nazev
         }
         //console.log('RES :', ret) 
         fs.appendFileSync("/home/jarda/db3000/server/qUpdate.sql", `\n 4 rozbor pohoda ${txt}\n`  , { mode: 0o777 });
         resolve(ret) 
         console.log(  sirka,vyska,av,q )
       }
       
     })
     //console.log(res)

   })
 }

      
      
}