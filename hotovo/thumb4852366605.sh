#!/bin/bash 
 sudo /usr/bin/convert  "/home/db3000/slozky/mares/059 X2JGC4J5_47599.pdf[0]" -thumbnail 800x600 "/var/www/db3000/server/uploads/059 X2JGC4J5_47599_800.jpg"
sudo /usr/bin/convert  "/var/www/db3000/server/uploads/059 X2JGC4J5_47599_800.jpg" -thumbnail 300x200 "/var/www/db3000/server/uploads/059 X2JGC4J5_47599_300.jpg"
mkdir -p /home/db3000/db/thumbs/059