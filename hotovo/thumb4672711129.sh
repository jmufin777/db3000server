#!/bin/bash 
 sudo /usr/bin/convert  "/var/www/db3000/server/slozky/kovar/DOOSAN - NAHLEDY - SPRAVNE/EN_DX250WMH-5_Brochure_D4600510_04-2019_72DPi.pdf[0]" -thumbnail 800x600 "/var/www/db3000/server/uploads/EN_DX250WMH-5_Brochure_D4600510_04-2019_72DPi_800.jpg"
sudo /usr/bin/convert  "/var/www/db3000/server/uploads/EN_DX250WMH-5_Brochure_D4600510_04-2019_72DPi_800.jpg" -thumbnail 300x200 "/var/www/db3000/server/uploads/EN_DX250WMH-5_Brochure_D4600510_04-2019_72DPi_300.jpg"