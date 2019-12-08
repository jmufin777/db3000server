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
//const im = require("imagemagick")

  const multer  = require('multer')
  var  upload = multer({ dest: 'uploads/' })
  var type = upload.single('file');




//console.log('1')
const app=express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, OPTIONS, DELETE");
  next();
});


const  path = require('path')
const  ClientN = require('pg-native')

const clientN = new ClientN()
clientN.connectSync('postgresql://db3000:@localhost:5432/db3000')
  
//clientN.connectSync()
function getLogin(idefix){
  var dotaz = `select login from list_users where idefix=${idefix}`
  var rows = query(dotaz)
  return rows[0].login
}

function query(dotaz, rows){
  rows = rows || [] 
  if( dotaz.match(/(^insert)|(^update)/i)) {
    dotaz = `${dotaz} returning * `
    console.log(dotaz)
  }
  rows= clientN.querySync(dotaz)
  if (rows && rows.length>0){
    console.log('ROWS OK ',rows)
    return rows;
  } else {
    console.log('ROWS 0',rows)
  }
  return [];
}


app.get('/upload0',  async (req, res, next ) => {
  console.log('zde ', req.query.file, ' idfx', req.query.user);
  // var cesta = './uploads/'
  var cesta = './slozky/'
  var soubor=cesta+req.query.file
  var idefix = req.query.user
  
  var login = getLogin(idefix)
  console.log(soubor,idefix, login)
  
  //ext_file_list = recFindByExt23(cesta,req.query.file)
  ext_file_list = recFindByExt2(cesta,req.query.file)
  if (ext_file_list.length>0){
    soubory= await konverze(__dirname+'/'+ ext_file_list[0],req.query.user)
    idefix_obr=soubory[soubory.length-1]
    console.log("TES K", soubory)
    //rows=query(`select * from prilohy_prijem where nazev='${soubory[0]}' order by idefix desc`)
    //console.log("rowS ",rows, " soubory", soubory)
  //   if (rows.length>0){
  //       idefix_obr=rows[0].idefix
  //   }else {
  // //    query("i")
  //   }
    console.log("Soubory", soubory)
    res.json({'a':'1',files: ext_file_list,obrazek:idefix_obr})
    //mam 
  } else {
    res.json({'a':'0'})
  }
  console.log('EXT:', ext_file_list)
  
  return
})
 
async function konverze(soubor, idefix, res){
  /*
  return new Promise((res, reject)=>{
    return resolve
  })
    */
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
  
  outfile800=`${__dirname}/uploads/${jpg800}`
  outfile300=`${__dirname}/uploads/${jpg300}`
  errfile=`${__dirname}/obrazky/error.jpg`

  prikaz800=`#!/bin/bash \n sudo /usr/bin/convert  "${srcImage}" -thumbnail 800x600 "${outfile800}"`
  prikaz300=`sudo /usr/bin/convert  "${outfile800}" -thumbnail 300x200 "${outfile300}"`
  //prikaz2=" screen -dmS sss  /home/jarda/db3000/server/thumb4.sh"
  prikaz2="/home/jarda/db3000/server/thumb4"+out+".sh"
  console.log('Konverze ', soubor, ' idefix', idefix, prikaz2 )
  //prikaz2="/home/jarda/db3000/server/thumb4"+".sh"
  //screen -dmS sss  
  try {
     fs.writeFileSync(prikaz2, prikaz800+'\n'+prikaz300, { mode: 0o777 });
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
        console.log('presunuto ',prikaz2)
      })
    console.log('res', res)  
    //return res
  })
  
  //console.log(res)
    
});    
  
  return 

  
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
  console.log(res)
  return res;


}
  app.post('/upload', upload.single('file'), async (req, res) => {
    
    var tmp_path = req.file.path;
    var idefix = req.body.idefix
     
  var nazev = req.file.originalname
  var local_dir = 'uploads/'
  var full_nazev  = __dirname +'/'+local_dir+ nazev
  //  console.log(tmp_path)
  var src  = fs.createReadStream(tmp_path);  //co se nahralo
  var dest = fs.createWriteStream(local_dir+nazev); 
  src.pipe(dest);  
   fs.unlink(tmp_path, err=>{
     console.log(err)
   })
  await konverze(full_nazev,req.body.idefix)
  console.log('IDEFIX ', idefix)
  rows=query(`select * from prilohy_prijem where idefix_user=${idefix} order by idefix desc limit 1`)
  console.log("BBBB" , rows) 
  res.json({'value':111});
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

    console.log(rows[0])
    obrazek=rows[0].thumb_2
    res.sendFile( obrazek); 
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
  res.sendFile( obrazek); 
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

app.use(express.json({limit: '9500mb'}));
app.use(express.urlencoded({limit: '9500mb'}));

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

function recFindByExt2(base,ext,files,result)  //Pouzivam , nemazat
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

function sleep(ms){
  return new Promise(resolve=>{
      setTimeout(resolve,ms)
  })
}
