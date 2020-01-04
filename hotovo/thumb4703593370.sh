#!/bin/bash 
 sudo /usr/bin/convert  "/var/www/db3000/server/uploads/barg.pdf[0]" -thumbnail 800x600 "/home/db3000/db/thumbs/BAR/2001030606/barg_800.jpg"
sudo /usr/bin/convert  "/home/db3000/db/thumbs/BAR/2001030606/barg_800.jpg" -thumbnail 300x200 "/home/db3000/db/thumbs/BAR/2001030606/barg_300.jpg"