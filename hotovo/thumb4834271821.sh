#!/bin/bash 
 sudo /usr/bin/convert  "/var/www/db3000/server/uploads/Monstera 340x260 print .pdf[0]" -thumbnail 800x600 "/var/www/db3000/server/uploads/Monstera 340x260 print _800.jpg"
sudo /usr/bin/convert  "/var/www/db3000/server/uploads/Monstera 340x260 print _800.jpg" -thumbnail 300x200 "/var/www/db3000/server/uploads/Monstera 340x260 print _300.jpg"