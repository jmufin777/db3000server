#!/bin/bash 
 sudo /usr/bin/convert  "/home/db3000/slozky/mares/čuříci.pdf[0]" -thumbnail 800x600 "/var/www/db3000/server/uploads/čuříci_800.jpg"
sudo /usr/bin/convert  "/var/www/db3000/server/uploads/čuříci_800.jpg" -thumbnail 300x200 "/var/www/db3000/server/uploads/čuříci_300.jpg"
mkdir -p /home/db3000/db/thumbs/ču