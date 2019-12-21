#!/bin/bash 
 sudo /usr/bin/convert  "/var/www/db3000/server/uploads/Objednávka _ OKAY.cz.pdf[0]" -thumbnail 800x600 "/home/db3000/db/thumbs/OBJ/1912150434/Objednávka _ OKAY.cz_800.jpg"
sudo /usr/bin/convert  "/home/db3000/db/thumbs/OBJ/1912150434/Objednávka _ OKAY.cz_800.jpg" -thumbnail 300x200 "/home/db3000/db/thumbs/OBJ/1912150434/Objednávka _ OKAY.cz_300.jpg"