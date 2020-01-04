const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const config = require('./config/config')
const _ = require('lodash')


const routes = require('./routes/list')
const request = require('request')
const fs = require('fs')
const os = require("os");
const { exec } = require('child_process');
const asc = require('express-async-handler')

const {pool, client } = require('./db')

const bodyParser = require('body-parser')
//const im = require("imagemagick")

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const moment = require('moment');

var type = upload.single('file');
var oddelovac="\n"+("-".repeat(100))+"\n"
errfile=`${__dirname}/obrazky/error.jpg`
console.log(errfile);

//console.log('1')
const app=express();

//Limity 
app.use(express.json({limit: '9500mb'}));
app.use(bodyParser.json({limit: '9150mb'}));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
limit: '9150mb',
extended: true
})); 
//Limity 
//console.log("startuji")
//return

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, OPTIONS, DELETE");
  next();
});

var slozky_zakazky= '/home/db3000/db/zakazky/'
var slozky_thumbs=`/home/db3000/db/thumbs`
var slozky_vyroba=`/home/db3000/db/vyroba/`
var slozky_mezipamet=`/home/db3000/db/vyroba/mezipamet`
var slozky_stroje=`/home/db3000/db/vyroba/stroje`
var slozky_zakazky_pdf=`/home/db3000/db/slozky_zakazky_pdf`
var slozky_osobni=`/home/db3000/slozky/`


slozky()
Prikaz(`mkdir -p ./log`)
fs.writeFileSync("./log/log.txt", 'Start\n')
fs.writeFileSync("./log/log0.txt", 'Start\n')
/*
test="/home/db3000/slozky/mares/STRENGTH AND DENSITY VOL 1.pdf";
test2="/home/db3000/slozky/mares/cert_3719056_pozar.pdf";
test3="/home/db3000/slozky/mares/01_VESTY 27x27_PARKING.pdf";

 pdfInfo(test)
 .then(xx =>{
   pdfRozbor(xx)
 })
pdfInfo(test3)
.then(xx =>{
  pdfRozbor(xx)
})
*/
//await pdfRozbor


const  path = require('path')
const  ClientN = require('pg-native')

const clientN = new ClientN()
clientN.connectSync('postgresql://db3000:@localhost:5432/db3000')
  
//clientN.connectSync()

  //console.log('jedu11 ')
  
  slozky()


app.get('/upload0',  async (req, res, next ) => {
  console.log('zde ', req.query.file, ' idfx', req.query.user);
  // var cesta = './uploads/'
  console.log('HLODAM', req.query)
   //res.json({'BB':1});
   ///return
  
  var soubor=cesta+req.query.file
  var idefix = req.query.user
  var login = getLogin(idefix)
  var cesta = `${slozky_osobni}${login}`
  ///home/db3000/slozky/mares/
  console.log(soubor,idefix, login, req.query)
//  await sleep(5000);
  
  //ext_file_list = recFindByExt23(cesta,req.query.file)
  //ext_file_list = recFindByExt2(cesta,req.query.file)
  
  
  ext_file_list = recFindByExt2(cesta,req.query.file,req.query.fileinfo)
  var fInfo0 = JSON.parse(req.query.fileinfo)
  //ext_file_list = await myFind(cesta, req.query.file, req.query.fileinfo)
  //console.log("Nalezl :", ext_file_list)
  //res.json({"value":'xxx', 'seznam': ext_file_list});
  //return

  
  if (ext_file_list.length>0){

    //soubory= await konverze(__dirname+'/'+ ext_file_list[0],req.query.user)
    soubory= await konverze(ext_file_list[0],req.query.user)

    //info = await pdfInfo(__dirname+'/'+ ext_file_list[0])
    info = await pdfInfo( ext_file_list[0])
    rozbor=await pdfRozbor(info)

    full_nazev=ext_file_list[0]
    // console.log("INFO", info)
    idefix_obr=soubory[soubory.length-1]  //IDEFIX - posledni polozkaz array
    //query(`update prilohy_prijem set pdfinfo='${info}' where idefix= ${idefix_obr}`)
    
    var slozka_cil=slozky_zakazky+fInfo0.rok+'/'  +fInfo0.cislo  
    await Prikaz(`mkdir -p ${slozka_cil}`)
    await Prikaz(`mv  "${full_nazev}" "${slozka_cil}/"`)
    var nazev=path.basename(full_nazev)
    var dotaz=`update prilohy_prijem set pdfinfo='${info}',cesta_zak='${slozka_cil}',basename='${nazev}',stav=1,
    sirka_mm=${rozbor.sirka},vyska_mm=${rozbor.vyska},format='${rozbor.format}'
    where idefix = ${idefix_obr}`
    console.log(dotaz)

    rows=query(`${dotaz}`)
    sirka=0
    vyska=0
    format='Vlastni'
   if (rows.length>0){
     sirka=rows[0].sirka_mm
     vyska=rows[0].vyska_mm
     format=rows[0].format
   }
   //res.json({'a':'2',files: ext_file_list,obrazek:idefix_obr})
    res.json({'a':'122','files': ext_file_list,'obrazek' :idefix_obr,'sirka':sirka,'vyska':vyska,'format':format })

    //res.json({'a':'122','files': ext_file_list,'obrazek' :idefix_obr})
    //console.log("TES K", soubory)
    //rows=query(`select * from prilohy_prijem where nazev='${soubory[0]}' order by idefix desc`)
    //console.log("rowS ",rows, " soubory", soubory)
  //   if (rows.length>0){
  //       idefix_obr=rows[0].idefix
  //   }else {
  // //    query("i")
  //   }
    console.log("Soubory :::: ", soubory)
    
    //mam 
  } else {
    res.json({'a':'0'})
  }
  console.log('EXT:', ext_file_list)
  
  return
})
 
app.post('/log', upload.single('file'), async (req, res) => {  
    console.log("LOGGGG",req.body)
    await Prikaz(`mkdir -p ./log`)
    dd = new Date()  
    //fs.writeFileSync("./log/log.txt", `
    fs.appendFileSync("./log/log0.txt", `
    ${dd.getHours()}:${dd.getMinutes()}:${dd.getSeconds()};${req.body.txt1.trim()};${req.body.txt2.trim()};${req.body.txt3.trim()};${req.body.txt4.trim()};`, { mode: 0o777 });

    req.body.txt1=req.body.txt1.replace(/\n|\r/g,'')
    req.body.txt1=req.body.txt1.replace(/ +(?= )/g,'');
    fs.appendFileSync("./log/log.txt", `
    ${dd.getHours()}:${dd.getMinutes()}:${dd.getSeconds()};${req.body.txt1.trim()};${req.body.txt2.trim()};${req.body.txt3.trim()};${req.body.txt4.trim()};`, { mode: 0o777 });
    res.end();
})
app.get('/log', function(req, res) {
  res.sendFile( __dirname+ '/log/log.txt'); 
}
)  

app.post('/upload', upload.single('file'), async (req, res) => {
    
    var tmp_path = req.file.path;
    var idefix = req.body.idefix
    var nazev = req.file.originalname
    var local_dir = 'uploads/'
    var full_nazev  = __dirname +'/'+local_dir+ nazev
    
    var login = getLogin(idefix)
    var cesta_osobni = `${slozky_osobni}${login}`
    //  console.log(tmp_path)
    var src  = fs.createReadStream(tmp_path);  //co se nahralo
    var dest = fs.createWriteStream(local_dir+nazev); 
    src.pipe(dest);  
    fs.unlink(tmp_path, err=>{
      console.log(err)
    })
  fs.appendFileSync("/home/jarda/db3000/server/qUpdate.sql", "0"  , { mode: 0o777 });  
  soubory = await konverze(full_nazev,req.body.idefix)
  //fs.writeFileSync("/home/jarda/db3000/server/qUpdate.sql", "1"  , { mode: 0o777 });
  fs.appendFileSync("/home/jarda/db3000/server/qUpdate.sql", "1"  , { mode: 0o777 });
  info    = await pdfInfo(full_nazev)
  fs.appendFileSync("/home/jarda/db3000/server/qUpdate.sql", "3"  , { mode: 0o777 });

  rozbor=   await pdfRozbor(info)
  fs.appendFileSync("/home/jarda/db3000/server/qUpdate.sql", "4"  , { mode: 0o777 });
  idefix_obr=soubory[soubory.length-1]
  idefix_obr=soubory[soubory.length-1]
  
  console.log("ROZBOR :", rozbor )
  fs.appendFileSync("/home/jarda/db3000/server/qUpdate.sql", "5"  , { mode: 0o777 });
  fs.appendFileSync("/home/jarda/db3000/server/qUpdate.sql", req.body.rok  , { mode: 0o777 });
  
    
  var slozka_cil=''
  //if (req.body.rok=='undefined'){
   if (typeof req.body.rok == 'undefined') {
    slozka_cil = cesta_osobni  
  } else {
    slozka_cil = slozky_zakazky+req.body.rok+'/' +req.body.cislo  
  }
//  slozka_cil = cesta_osobni  
  

  await Prikaz(`mkdir -p ${slozka_cil}`)
  await Prikaz(`mv  "${full_nazev}" "${slozka_cil}/"`)
  var nazev=path.basename(full_nazev)
  var queryUpdate=`update prilohy_prijem set pdfinfo='${info}',cesta_zak='${slozka_cil}',basename='${nazev}',stav=1
  ,sirka_mm=${rozbor.sirka},vyska_mm=${rozbor.vyska},format='${rozbor.format}'
   where idefix = ${idefix_obr}`
  rows=query(`${queryUpdate}`)

  try{
    fs.appendFileSync("/home/jarda/db3000/server/qUpdate.sql", queryUpdate  , { mode: 0o777 });
  } catch(e){
    console.log("Soubor v ...",oddelovac,e,oddelovac)
  }
   //return;

   sirka=0
   vyska=0
   format='Vlastni'
   console.log(oddelovac,queryUpdate,oddelovac)
  if (rows.length>0){
    sirka=rows[0].sirka_mm
    vyska=rows[0].vyska_mm
    format=rows[0].format
  }
  //res.json({'a':'2',files: ext_file_list,obrazek:idefix_obr})
  res.json({'a':'222','files': ext_file_list,'obrazek' :idefix_obr,'sirka':sirka,'vyska':vyska,'format':format })
  console.log('IDEFIX ', idefix)
  //rows=query(`select * from prilohy_prijem where idefix_user=${idefix} order by idefix desc limit 1`)

  //res.json({'value':111});
  return

})

app.use(express.static('uploads'));
  let  srcImage=''
  // srcImage='/home/jarda/db3000/server/uploads/CZ3308000000001178325173_2000002337878584.pdf'

  app.get('/obrazek/:page', function(req, res) {

    let page = req.params.page
    console.log('obrazek', page)
    desPath = 'uploads/'
    //idefix=12856365  //page
    idefix=page  //page
    rows=query(`select * from prilohy_prijem where idefix=${idefix}`)

    if (rows.length>0){
      console.log(rows[0])
      obrazek=rows[0].thumb_2
      res.sendFile( obrazek); 
    }   else {
      res.json({Obrazek: 'neni k dispozici'})
    }

      
    //res.sendFile( __dirname+ '/'+desPath +'/'+obrazek); 
    return

});
app.get('/obrazek_small/:page', function(req, res) {

  let page = req.params.page
  console.log('obrazek', page)
  desPath = 'uploads/'
  //idefix=12856365  //page
  idefix=page  //page
  rows=query(`select * from prilohy_prijem where idefix=${idefix}`)

  console.log(rows[0])
  obrazek=rows[0].thumb_1
  res.sendFile( obrazek); 
  //res.sendFile( __dirname+ '/'+desPath +'/'+obrazek); 
  return

});
app.get('/obrazek_orig/:page', function(req, res) {

  let page = req.params.page
  console.log('obrazek', page)
  desPath = 'uploads/'
  //idefix=12856365  //page
  idefix=page  //page
  rows=query(`select * from prilohy_prijem where idefix=${idefix}`)

  console.log(rows[0])
  obrazek=rows[0].nazev
  obrazek_zak=rows[0].cesta_zak+'/'+rows[0].basename
  obrazek_mezi=rows[0].cesta_mezi+'/'+rows[0].basename
  obrazek_stroj=rows[0].cesta_stroj+'/'+rows[0].basename
  obrazek_send=errfile
  try {
    if (fs.existsSync(obrazek)) {
        obrazek_send=obrazek;
    }
    if (fs.existsSync(obrazek_zak)) {
      obrazek_send=obrazek_zak;
     }
    if (fs.existsSync(obrazek_mezi)) {
      obrazek_send=obrazek_mezi;
    //file exists
    }
    if (fs.existsSync(obrazek_stroj)) {
      obrazek_send=obrazek_stroj;
    }
  } catch(err) {
    console.error(err)
  }
  res.sendFile( obrazek_send); 
  //res.sendFile( __dirname+ '/'+desPath +'/'+obrazek); 
  return

});

app.get('/obrazek_del/:page/:user', function(req, res) {

  let page = req.params.page
  res.json({'nic':'nic', par: req.params})
  return
  console.log('obrazek', page)
  desPath = 'uploads/'
  //idefix=12856365  //page
  idefix=page  //page

  rows=query(`DELETE  from prilohy_prijem where idefix=${idefix}`)


  console.log(rows[0])
  obrazek=rows[0].nazev
  res.sendFile( obrazek); 
  //res.sendFile( __dirname+ '/'+desPath +'/'+obrazek); 
  return

});

app.get('/obrazek_del', function(req, res) {

  //let page = req.params.page
  let page = req.query.page
  console.log('obrazek', req.query)
  idefix=page
  
  //return
  console.log('obrazek', page)
  desPath = 'uploads/'
  //idefix=12856365  //page
  idefix=page  //page

  rows=query(`DELETE  from prilohy_prijem where idefix=${idefix} `)
  var prikaz ="";
  var nazev = "";
  console.log("ROWS rows", rows[0]);
  if (rows.length>0){
    if (rows[0].stav==0){
      nazev = rows[0].nazev
      prikaz=`rm "${nazev}"`
      Prikaz(prikaz)
    }

    if (rows[0].stav==1){
      nazev = rows[0].cesta_zak+'/'+rows[0].basename
      prikaz=`rm "${nazev}"`
      Prikaz(prikaz)
    }
    if (rows[0].stav==2){
      nazev = rows[0].cesta_mezi+'/'+rows[0].basename
      prikaz=`rm "${nazev}"`
      Prikaz(prikaz)
    }
    if (rows[0].stav==3){
      nazev = rows[0].cesta_stroj+'/'+rows[0].basename
      prikaz=`rm "${nazev}"`
      Prikaz(prikaz)
    }
  }
  
  res.json({'nic':'nic', par: req.params})


  console.log(rows[0])
  obrazek=rows[0].nazev
//  res.sendFile( obrazek); 
  //res.sendFile( __dirname+ '/'+desPath +'/'+obrazek); 
  return

});


app.get(/(.*\.pdf)$/i, function (req, res) {
  var pdfPath = req.params[0];
  var pageNumber = req.params[1];
  console.log('pdf')

  var PDFImage = require("pdf-image").PDFImage;
  var pdfImage = new PDFImage(pdfPath);

  pdfImage.convertPage(pageNumber).then(function (imagePath) {

    res.sendFile(imagePath);
  }, function (err) {
    res.send(err, 500);
  });
});

app.get(/(.*\.pdf)\/([0-9]+).png$/i, function (req, res) {
  var pdfPath = req.params[0];
  var pageNumber = req.params[1];

  var PDFImage = require("pdf-image").PDFImage;
  var pdfImage = new PDFImage(pdfPath);

  pdfImage.convertPage(pageNumber).then(function (imagePath) {

    res.sendFile(imagePath);
  }, function (err) {
    res.send(err, 500);
  });
});



const pdf = require('pdf-parse');

app.get('/obrazekmeta2', function(req, res) {
//let dataBuffer = fs.readFileSync('/home/jarda/db3000/server/uploads/neco23.pdf');

 
pdf(srcImage).then(function(data) {
     // number of pages
     console.log(data.numpages);
    // number of rendered pages
    console.log(data.numrender);
    // PDF info
    console.log(data.info);
    // PDF metadata
    console.log(data.metadata); 
    // PDF.js version
    // check https://mozilla.github.io/pdf.js/getting_started/
    console.log(data.version);
    // PDF text
    console.log(data.text); 
    console.log(data); 
    res.json({"metadata": data});

}) 
})
app.get('/obrazekmeta', function(req, res) {
  try{
    im.readMetadata(srcImage, function(err, metadata){
      if (err) {
        console.log('spadlo - neni soubor??', err)
      }
      res.json({"metadata": metadata});
  });

  } catch(e) {
    console.log('spadlo - neni soubor??')

  }
  
});

 app.get('/obrazek', function(req, res){
   res.sendFile('/home/jarda/db3000/server/uploads/jarda.jpg');
 }); 



//app.use(express.limit('4M'));
//app.use(express.urlencoded({limit: '9500mb'}));

// #app.use(morgan('combined'));
app.use(cors());



app.use('/',routes);

console.log('Staruju')

 app.post('/upload11', type, function (req,res) {


  /** When using the "single"
      data come in "req.file" regardless of the attribute "name". **/
      console.log(JSON.stringify(req.file));
      //console.log(req.body.file.length);
//      return

  
  var tmp_path = req.file.path;
//  return

  /** The original name of the uploaded file
      stored in the variable "originalname". **/
  var target_path = 'uploads/' + req.file.originalname;

  /** A better way to copy the uploaded file. **/
  var src = fs.createReadStream(tmp_path);
  var dest = fs.createWriteStream(target_path);
  //return
  src.pipe(dest);
  
  src.on('end', function() { 
  //  res.render('complete'); 
  //console.log('baziaros')
  });
  return;
  src.on('error', function(err) { res.render('error'); });

});


app.listen(config.port )
console.log(`Nasloucham na portu ${config.port}`)

module.exports = app;


function recFindByExtOrig(base,ext,files,result)  //hleda podle pripony - muze se hodit
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


function recFindByExt2(base,ext,fileinfo,files,result)  //Pouzivam , nemazat
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

function recFindByExt2Bck(base,ext,files,result)  //Pouzivam , nemazat
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

async function myFind(cesta,nazev, detail){
  var prikaz = `find ${cesta} -name "${nazev}" -exec ls -l  --time-style=+"%Y%m%d %H:%M:%S" {} \\;`
  var aRes=[cesta]
  console.log(prikaz ,detail )
  return new Promise(function(resolve) {

    exec(prikaz, (error1, stdout1, stderr1) => {
    konec=true
    if (error1){
      console.log("ERR", error1)
      
    } else {
      console.log('My Find OK ',stdout1.split(" "))

      aRes.push(stdout1)

      resolve(aRes)
      //row=query(`insert into prilohy_prijem (nazev,script_sh,thumb_1,thumb_2,idefix_user) select '${soubor}','${prikaz2}','${outfile300}','${outfile800}',${idefix}`)
    }
      //res.push(row[0].idefix) 

      })
  })

  //cesta, req.query.file, req.query.fileinfo

}
//
async function Prikaz(prikaz){
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

async function pdfInfo(pdf){
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


function  pdfRozbor(txt) {
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


function sleep(ms){
  return new Promise(resolve=>{
      setTimeout(resolve,ms)
  })
}


async function slozky(){
  //exec('mkdir /home/db3000/slozky -p', (error1, stdout1, stderr1) => {
  //}
  //)  
  exec(`mkdir ${slozky_thumbs} -p`, (error1, stdout1, stderr1) => {
  }
  )  
  exec(`mkdir ${slozky_zakazky} -p`, (error1, stdout1, stderr1) => {
  }
  )  
  exec(`mkdir ${slozky_vyroba} -p`, (error1, stdout1, stderr1) => {
  }
  )  
  exec(`mkdir ${slozky_mezipamet} -p`, (error1, stdout1, stderr1) => {
  }
  )  
  exec(`mkdir ${slozky_stroje} -p`, (error1, stdout1, stderr1) => {
  }
  )  
  exec(`mkdir ${slozky_zakazky_pdf} -p`, (error1, stdout1, stderr1) => {
  }
  )  
}

function getLogin(idefix){
  var dotaz = `select login from list_users where idefix=${idefix}`
  var rows = query(dotaz)
  return rows[0].login
}

function query(dotaz, rows){
  rows = rows || [] 
  if( dotaz.match(/(^insert)|(^update)|(^delete)/i)) {
    dotaz = `${dotaz} returning * `
    console.log(dotaz)
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

function getFilesizeInBytes(filename) {
  const stats = fs.statSync(filename);
  const fileSizeInBytes = stats.size;
  var mtime = stats.mtime;
  //console.log("MODIFY ", mtime);
  return fileSizeInBytes;
}

function getFileInfo(filename) {
  const stats = fs.statSync(filename);
  const fileSizeInBytes = stats.size;
  var mtime = stats.mtime;

  //console.log("MODIFY ", mtime);
  return {size: fileSizeInBytes, zmena: mtime} ;
}

function datum5(value) {
  var neco = ''
  try {
    neco= moment(String(value)).format('YYMMDDhhmm') //hhmm
  } catch (e) {
    console.log("Chybka xxxx" , e)
  }
  return neco
}

function getNahledyFolder(soubor) {
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
function cleanNazev(nazev){
  return nazev.toUpperCase().replace(/[^a-zA-Z0-9]+/g, "");
}

async function konverze(soubor, idefix, res){
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