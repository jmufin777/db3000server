#!/bin/bash 
 sudo /usr/bin/convert  "/var/www/db3000/server/uploads/cara.pdf[0]" -thumbnail 800x600 "/var/www/db3000/server/uploads/cara_800.jpg"
sudo /usr/bin/convert  "/var/www/db3000/server/uploads/cara_800.jpg" -thumbnail 300x200 "/var/www/db3000/server/uploads/cara_300.jpg"