#!/bin/bash 
 sudo /usr/bin/convert  "/var/www/db3000/server/uploads/12856421.pdf[0]" -thumbnail 800x600 "/var/www/db3000/server/uploads/12856421_800.jpg"
sudo /usr/bin/convert  "/var/www/db3000/server/uploads/12856421_800.jpg" -thumbnail 300x200 "/var/www/db3000/server/uploads/12856421_300.jpg"
mkdir -p /home/db3000/db/thumbs/128