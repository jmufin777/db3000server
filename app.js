const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const config = require("./config/config");
const _ = require("lodash");

const routes = require("./routes/list");
const request = require("request");
const fs = require("fs");
const os = require("os");
const { exec } = require("child_process");
const asc = require("express-async-handler");

const { pool, client } = require("./db");

const bodyParser = require("body-parser");
//const im = require("imagemagick")

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

var type = upload.single("file");
var oddelovac = "\n" + "-".repeat(100) + "\n";

//console.log('1')
const app = express();

//Limity
app.use(express.json({ limit: "9500mb" }));
app.use(bodyParser.json({ limit: "9150mb" }));
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    limit: "9150mb",
    extended: true
  })
);
//Limity
//console.log("startuji")
//return

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, OPTIONS, DELETE");
  next();
});

// var slozky_zakazky= '/home/db3000/db/zakazky/'
// var slozky_thumbs=`/home/db3000/db/thumbs`
// var slozky_vyroba=`/home/db3000/db/vyroba/`
// var slozky_mezipamet=`/home/db3000/db/vyroba/mezipamet`
// var slozky_stroje=`/home/db3000/db/vyroba/stroje`
// var slozky_zakazky_pdf=`/home/db3000/db/slozky_zakazky_pdf`
// var slozky_osobni=`/home/db3000/slozky/`

require("./utils/vl_vse.js")();
require("./utils/slozky")();
require("./utils/soubory")();
console.log("ERRFILE", errfile);
require("./utils/pgsql")();
require("./utils/ostatni")();
slozky();
//vl_droppriloha('calc_my_9_zak959878983',0)
//console.log(isZak('calc_my_9_zak959878983'))
//console.log(isNab('calc_my_9_zak959878983'))
//console.log(getIdefix('calc_my_9_zak959878983'))

//return
//return

k1();
slozky_thumbs = "huhuuhu";
k1();
slozky_thumbs = "huhuuhu2";
k2();
console.log(slozky_thumbs);

Prikaz(`mkdir -p ./log`);
fs.writeFileSync("./log/log.txt", "Start\n");
fs.writeFileSync("./log/log0.txt", "Start\n");
fs.writeFileSync("./log/logS.txt", "Start\n");
fs.writeFileSync("./log/logS0.txt", "Start\n");
fs.writeFileSync("./log/logE.txt", "Start\n");
fs.writeFileSync("./log/logE0.txt", "Start\n");

//console.log(neco)

vl_set(1).then(eco11 => {
  console.log(eco11, pokusnaVec);
});

slozky();

app.get("/upload0", async (req, res, next) => {
  console.log("zde ", req.query.file, " idfx", req.query.user);
  console.log("HLODAM", req.query);

  var soubor = cesta + req.query.file;
  var idefix = req.query.user;
  var login = getLogin(idefix);
  var cesta = `${slozky_osobni}${login}`;
  console.log(soubor, idefix, login, req.query);

  ext_file_list = recFindByExt2(cesta, req.query.file, req.query.fileinfo);
  var fInfo0 = JSON.parse(req.query.fileinfo);

  if (ext_file_list.length > 0) {
    soubory = await konverze(ext_file_list[0], req.query.user);

    info = await pdfInfo(ext_file_list[0]);
    rozbor = await pdfRozbor(info);

    full_nazev = ext_file_list[0];
    // console.log("INFO", info)
    idefix_obr = soubory[soubory.length - 1]; //IDEFIX - posledni polozkaz array
    //query(`update prilohy_prijem set pdfinfo='${info}' where idefix= ${idefix_obr}`)

    var slozka_cil = slozky_zakazky + fInfo0.rok + "/" + fInfo0.cislo;
    await Prikaz(`mkdir -p ${slozka_cil}`);
    await Prikaz(`mv  "${full_nazev}" "${slozka_cil}/"`);
    var nazev = path.basename(full_nazev);
    var dotaz = `update prilohy_prijem set pdfinfo='${info}',cesta_zak='${slozka_cil}',basename='${nazev}',stav=1,
    sirka_mm=${rozbor.sirka},vyska_mm=${rozbor.vyska},format='${rozbor.format}'
    where idefix = ${idefix_obr}`;
    console.log(dotaz);

    rows = query(`${dotaz}`);
    sirka = 0;
    vyska = 0;
    format = "Vlastni";
    if (rows.length > 0) {
      sirka = rows[0].sirka_mm;
      vyska = rows[0].vyska_mm;
      format = rows[0].format;
    }
    //res.json({'a':'2',files: ext_file_list,obrazek:idefix_obr})
    res.json({
      a: "122",
      files: ext_file_list,
      obrazek: idefix_obr,
      sirka: sirka,
      vyska: vyska,
      format: format
    });

    //res.json({'a':'122','files': ext_file_list,'obrazek' :idefix_obr})
    //console.log("TES K", soubory)
    //rows=query(`select * from prilohy_prijem where nazev='${soubory[0]}' order by idefix desc`)
    //console.log("rowS ",rows, " soubory", soubory)
    //   if (rows.length>0){
    //       idefix_obr=rows[0].idefix
    //   }else {
    // //    query("i")
    //   }
    console.log("Soubory :::: ", soubory);

    //mam
  } else {
    res.json({ a: "0" });
  }
  console.log("EXT:", ext_file_list);

  return;
});

app.post("/log", upload.single("file"), async (req, res) => {
  log(req);
  res.end();
});

app.post("/query2", async (req, res) => {
  //cesta do slozky stroje
  console.log("QUERY2 SMAZAT  ", req.body);
  logS("VL-SET 1", req.body);
  var user = req.body.params.user;
  var querys = req.body.params.query;

  console.log("SERVER - ", req.body.params);
  logS("SERVER :" + user, idefix_zak, idefix_item, table);
  await query2(user, querys);
  res.end();
});

app.post("/vlset", async (req, res) => {
  //cesta do slozky stroje
  console.log("VLSET POST  ", req.body);
  logS("VL-SET 1", req.body);
  var user = req.body.params.user;
  var idefix_zak = req.body.params.query.idefix_zak;
  var idefix_item = req.body.params.query.idefix_item;
  var table = req.body.params.query.tmpTable;
  console.log("SERVER - ", req.body.params);
  logS("SERVER :" + user, idefix_zak, idefix_item, table);
  await vl_set(idefix_zak, idefix_item, table, user);
  res.end();
});

//vl_list(14078622)
//get_zak_last(9)
app.post("/vllist", async (req, res) => {
  //cesta do mezipameti
  var user = req.body.params.user;
  var idefix_zak = req.body.params.query.idefix_zak;
  neco = await vl_list(idefix_zak);
  res.json({ vllist: neco });
});
//create_tmp_zak("tmpja", 14078602);

app.post("/create_tmp_zak", async (req, res) => {
  //cesta do slozky stroje
  console.log("VLCOPY  POST  ", req.body);
  //logS('VL-SET 1',req.body)
  //var user=req.body.params.user
  var table = req.body.params.table;
  var idefix_zak = req.body.params.idefix_zak;
  //var q = req.body.params.query

  console.log("SERVER - ", req.body.params);

  await create_tmp_zak(table, idefix_zak);
  res.end();
});

app.post("/getzaklast", async (req, res) => {
  //cesta do mezipameti
  var user = req.body.params.user;
  //var idefix_zak = req.body.params.query.idefix_zak
  neco = [];
  neco = await get_zak_last(user);
  logE("Zde", neco);
  res.json({ data: neco });
});

//get_zak_last

app.post("/vlunset", async (req, res) => {
  //cesta do mezipameti
  var user = req.body.params.user;
  var idefix_zak = req.body.params.query.idefix_zak;
  var idefix_item = req.body.params.query.idefix_item;
  var table = req.body.params.query.tmpTable;

  console.log("SERVER - ", req.body.params, "ZAK ");
  logS("SERVER :" + user, idefix_zak, idefix_item, table);
  await vl_unset(idefix_zak, idefix_item, table, user);
  res.end();
});
app.get("/log", function(req, res) {
  res.sendFile(__dirname + "/log/log.txt");
});
app.post("/sync", async (req, res) => {
  //cesta do mezipameti
  logS(req.body);
  vl_sync(req.body.params.query);
  console.log("SYNC 1: -- ", req.body);
  //await vl_sync(req.body)
  res.end();
});
app.post("/vl_copy", async (req, res) => {
  //cesta do slozky stroje
  console.log("VLCOPY  POST  ", req.body);
  //logS('VL-SET 1',req.body)
  var user = req.body.params.user;
  var table = req.body.params.table;
  var idefix_item = req.body.params.idefix_item;
  var q = req.body.params.query;

  //console.log('SERVER - ', req.body.params)

  await vl_copy(user, table, idefix_item, q);
  res.end();
});
// console.log('AAAAAA 1:')
// query2(9, {
//   'a':'select idefix,nazev from zak_t_list limit 1',
//   'b':'select idefix,nazev from zak_t_list limit 2',
//   'c':'select idefix,nazev from zak_t_list limit 2',
//   'd':'update zak_t_list set idefix=idnnefix' 
// })
// .then((res)=>{
//   console.log('AAAAAA 2:', res)
// })

app.post("/query22", async (req, res) => {  //Vrati ve stejnycch nazevech json jako pozadavzky na SQL odpovidajici data.data
  var user = req.body.params.user;
  var query = req.body.params.query;
  let neco = await query2(user, query); //Json s pojmenovanymi SQL dotazy
  res.json({data: neco})
});

app.get("/log", function(req, res) {
  res.sendFile(__dirname + "/log/log.txt");
});

app.post("/upload", upload.single("file"), async (req, res) => {
  var tmp_path = req.file.path;
  var idefix = req.body.idefix;
  var nazev = req.file.originalname;
  var local_dir = "uploads/";
  var full_nazev = __dirname + "/" + local_dir + nazev;

  var login = getLogin(idefix);
  var cesta_osobni = `${slozky_osobni}${login}`;
  //  console.log(tmp_path)
  var src = fs.createReadStream(tmp_path); //co se nahralo
  var dest = fs.createWriteStream(local_dir + nazev);
  src.pipe(dest);
  fs.unlink(tmp_path, err => {
    console.log(err);
  });
  fs.appendFileSync("/home/jarda/db3000/server/qUpdate.sql", "0", {
    mode: 0o777
  });
  soubory = await konverze(full_nazev, req.body.idefix);
  //fs.writeFileSync("/home/jarda/db3000/server/qUpdate.sql", "1"  , { mode: 0o777 });
  fs.appendFileSync("/home/jarda/db3000/server/qUpdate.sql", "1", {
    mode: 0o777
  });
  info = await pdfInfo(full_nazev);
  fs.appendFileSync("/home/jarda/db3000/server/qUpdate.sql", "3", {
    mode: 0o777
  });

  rozbor = await pdfRozbor(info);
  fs.appendFileSync("/home/jarda/db3000/server/qUpdate.sql", "4", {
    mode: 0o777
  });
  idefix_obr = soubory[soubory.length - 1];
  idefix_obr = soubory[soubory.length - 1];

  console.log("ROZBOR :", rozbor);
  fs.appendFileSync("/home/jarda/db3000/server/qUpdate.sql", "5", {
    mode: 0o777
  });
  fs.appendFileSync("/home/jarda/db3000/server/qUpdate.sql", req.body.rok, {
    mode: 0o777
  });

  var slozka_cil = "";
  //if (req.body.rok=='undefined'){
  if (typeof req.body.rok == "undefined") {
    slozka_cil = cesta_osobni;
  } else {
    slozka_cil = slozky_zakazky + req.body.rok + "/" + req.body.cislo;
  }
  //  slozka_cil = cesta_osobni

  await Prikaz(`mkdir -p ${slozka_cil}`);
  await Prikaz(`mv  "${full_nazev}" "${slozka_cil}/"`);
  var nazev = path.basename(full_nazev);
  var queryUpdate = `update prilohy_prijem set pdfinfo='${info}',cesta_zak='${slozka_cil}',basename='${nazev}',stav=1
  ,sirka_mm=${rozbor.sirka},vyska_mm=${rozbor.vyska},format='${rozbor.format}'
   where idefix = ${idefix_obr}`;
  rows = query(`${queryUpdate}`);

  try {
    fs.appendFileSync("/home/jarda/db3000/server/qUpdate.sql", queryUpdate, {
      mode: 0o777
    });
  } catch (e) {
    console.log("Soubor v ...", oddelovac, e, oddelovac);
  }
  //return;

  sirka = 0;
  vyska = 0;
  format = "Vlastni";
  console.log(oddelovac, queryUpdate, oddelovac);
  if (rows.length > 0) {
    sirka = rows[0].sirka_mm;
    vyska = rows[0].vyska_mm;
    format = rows[0].format;
  }
  //res.json({'a':'2',files: ext_file_list,obrazek:idefix_obr})
  res.json({
    a: "222",
    files: ext_file_list,
    obrazek: idefix_obr,
    sirka: sirka,
    vyska: vyska,
    format: format
  });
  console.log("IDEFIX ", idefix);
  //rows=query(`select * from prilohy_prijem where idefix_user=${idefix} order by idefix desc limit 1`)

  //res.json({'value':111});
  return;
});

app.use(express.static("uploads"));
let srcImage = "";
// srcImage='/home/jarda/db3000/server/uploads/CZ3308000000001178325173_2000002337878584.pdf'

app.get("/obrazek/:page", function(req, res) {
  let page = req.params.page;
  console.log("obrazek", page);
  desPath = "uploads/";
  //idefix=12856365  //page
  idefix = page; //page
  rows = query(`select * from prilohy_prijem where idefix=${idefix}`);

  if (rows.length > 0) {
    console.log(rows[0]);
    obrazek = rows[0].thumb_2;
    res.sendFile(obrazek);
  } else {
    res.json({ Obrazek: "neni k dispozici" });
  }

  //res.sendFile( __dirname+ '/'+desPath +'/'+obrazek);
  return;
});
app.get("/obrazek_small/:page", function(req, res) {
  let page = req.params.page;
  console.log("obrazek", page);
  desPath = "uploads/";
  //idefix=12856365  //page
  idefix = page; //page
  rows = query(`select * from prilohy_prijem where idefix=${idefix}`);

  console.log(rows[0]);
  obrazek = rows[0].thumb_1;
  res.sendFile(obrazek);
  //res.sendFile( __dirname+ '/'+desPath +'/'+obrazek);
  return;
});
app.get("/obrazek_orig/:page", function(req, res) {
  let page = req.params.page;
  console.log("obrazek", page);
  desPath = "uploads/";
  //idefix=12856365  //page
  idefix = page; //page
  rows = query(`select * from prilohy_prijem where idefix=${idefix}`);

  console.log(rows[0]);
  obrazek = rows[0].nazev;
  obrazek_zak = rows[0].cesta_zak + "/" + rows[0].basename;
  obrazek_mezi = rows[0].cesta_mezi + "/" + rows[0].basename;
  obrazek_stroj = rows[0].cesta_stroj + "/" + rows[0].basename;
  obrazek_send = errfile;
  try {
    if (fs.existsSync(obrazek)) {
      obrazek_send = obrazek;
    }
    if (fs.existsSync(obrazek_zak)) {
      obrazek_send = obrazek_zak;
    }
    if (fs.existsSync(obrazek_mezi)) {
      obrazek_send = obrazek_mezi;
      //file exists
    }
    if (fs.existsSync(obrazek_stroj)) {
      obrazek_send = obrazek_stroj;
    }
  } catch (err) {
    console.error(err);
  }
  res.sendFile(obrazek_send);
  //res.sendFile( __dirname+ '/'+desPath +'/'+obrazek);
  return;
});

app.get("/obrazek_del/:page/:user", function(req, res) {
  let page = req.params.page;
  res.json({ nic: "nic", par: req.params });
  return;
  console.log("obrazek", page);
  desPath = "uploads/";
  //idefix=12856365  //page
  idefix = page; //page

  rows = query(`DELETE  from prilohy_prijem where idefix=${idefix}`);

  console.log(rows[0]);
  obrazek = rows[0].nazev;
  res.sendFile(obrazek);
  //res.sendFile( __dirname+ '/'+desPath +'/'+obrazek);
  return;
});

app.get("/obrazek_del", function(req, res) {
  //let page = req.params.page
  let page = req.query.page;
  console.log("obrazek", req.query);
  idefix = page;

  //return
  console.log("obrazek", page);
  desPath = "uploads/";
  //idefix=12856365  //page
  idefix = page; //page

  rows = query(`DELETE  from prilohy_prijem where idefix=${idefix} `);
  var prikaz = "";
  var nazev = "";
  console.log("ROWS rows", rows[0]);
  if (rows.length > 0) {
    if (rows[0].stav == 0) {
      nazev = rows[0].nazev;
      prikaz = `rm "${nazev}"`;
      Prikaz(prikaz);
    }

    if (rows[0].stav == 1) {
      nazev = rows[0].cesta_zak + "/" + rows[0].basename;
      prikaz = `rm "${nazev}"`;
      Prikaz(prikaz);
    }
    if (rows[0].stav == 2) {
      nazev = rows[0].cesta_mezi + "/" + rows[0].basename;
      prikaz = `rm "${nazev}"`;
      Prikaz(prikaz);
    }
    if (rows[0].stav == 3) {
      nazev = rows[0].cesta_stroj + "/" + rows[0].basename;
      prikaz = `rm "${nazev}"`;
      Prikaz(prikaz);
    }
  }

  res.json({ nic: "nic", par: req.params });

  console.log(rows[0]);
  obrazek = rows[0].nazev;
  //  res.sendFile( obrazek);
  //res.sendFile( __dirname+ '/'+desPath +'/'+obrazek);
  return;
});

app.get(/(.*\.pdf)$/i, function(req, res) {
  var pdfPath = req.params[0];
  var pageNumber = req.params[1];
  console.log("pdf");

  var PDFImage = require("pdf-image").PDFImage;
  var pdfImage = new PDFImage(pdfPath);

  pdfImage.convertPage(pageNumber).then(
    function(imagePath) {
      res.sendFile(imagePath);
    },
    function(err) {
      res.send(err, 500);
    }
  );
});

app.get(/(.*\.pdf)\/([0-9]+).png$/i, function(req, res) {
  var pdfPath = req.params[0];
  var pageNumber = req.params[1];

  var PDFImage = require("pdf-image").PDFImage;
  var pdfImage = new PDFImage(pdfPath);

  pdfImage.convertPage(pageNumber).then(
    function(imagePath) {
      res.sendFile(imagePath);
    },
    function(err) {
      res.send(err, 500);
    }
  );
});

const pdf = require("pdf-parse");

app.get("/obrazekmeta2", function(req, res) {
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
    res.json({ metadata: data });
  });
});
app.get("/obrazekmeta", function(req, res) {
  try {
    im.readMetadata(srcImage, function(err, metadata) {
      if (err) {
        console.log("spadlo - neni soubor??", err);
      }
      res.json({ metadata: metadata });
    });
  } catch (e) {
    console.log("spadlo - neni soubor??");
  }
});

app.get("/obrazek", function(req, res) {
  res.sendFile("/home/jarda/db3000/server/uploads/jarda.jpg");
});

//app.use(express.limit('4M'));
//app.use(express.urlencoded({limit: '9500mb'}));

// #app.use(morgan('combined'));
app.use(cors());

app.use("/", routes);

//console.log('Staruju')

app.post("/upload11", type, function(req, res) {
  /** When using the "single"
      data come in "req.file" regardless of the attribute "name". **/
  console.log(JSON.stringify(req.file));
  //console.log(req.body.file.length);
  //      return

  var tmp_path = req.file.path;
  //  return

  /** The original name of the uploaded file
      stored in the variable "originalname". **/
  var target_path = "uploads/" + req.file.originalname;

  /** A better way to copy the uploaded file. **/
  var src = fs.createReadStream(tmp_path);
  var dest = fs.createWriteStream(target_path);
  //return
  src.pipe(dest);

  src.on("end", function() {
    //  res.render('complete');
    //console.log('baziaros')
  });
  return;
  src.on("error", function(err) {
    res.render("error");
  });
});

app.listen(config.port);
console.log(`Nasloucham na portu ${config.port}`);

module.exports = app;
