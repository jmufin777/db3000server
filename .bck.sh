/usr/local/pgsql/bin/pg_dump -d db3000 -U postgres |gzip -c >db3000.gz
git add --all
git commit -m 'autodb3000'
git push