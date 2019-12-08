#!/bin/bash 
 sudo /usr/bin/convert  "/var/www/db3000/server/uploads/20191023114204656.pdf[0]" -thumbnail 800x600 "/var/www/db3000/server/uploads/20191023114204656_800.jpg"
sudo /usr/bin/convert  "/var/www/db3000/server/uploads/20191023114204656_800.jpg" -thumbnail 300x200 "/var/www/db3000/server/uploads/20191023114204656_300.jpg"