#!/bin/bash
cpath=${PWD}
cd /var/www/db3000/server/
/etc/init.d/postgresql restart
sleep .1
`ps -faxu |grep npm | awk '{ print "kill "$2 }'`
`ps -faxu |grep "S DEV" | awk '{ print "kill "$2 }'`
`ps -faxu |grep "node" | awk '{ print "kill "$2 }'`
sleep .1
 screen -dmS DEV npm run dev
cd "${cpath}"
sleep .1


##/var/www/db3000/server/bin/restart_server.sh
