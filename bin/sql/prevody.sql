-- old
create table c_prac_3000 without oids as select * from c_prac  where kodprace in (select kodprace from vyroba_prace where kodzakazky in (select kodzakazkoveholistu from zak_list where year(datumexpedice) = 2018) ) ;
 pg_dump -d pp2 -U postgres -t c_prac_3000 |gzip -c   > c_prac_3000.gz
-- new
kodprace     | 22
nazevprace   | lišty/háčky 
login        | 
d_insert     | 
cena         | 0.00
vazba_studio | 
t_round      | 
poradi       | 1000

id                 | 3
idefix             | 9359
kod                | 1
nazev              | Ne
zkratka            | NE
nazev_text         | 
time_insert        | 2018-11-15 21:45:45.964129
time_update        | 2018-11-15 21:45:45.964129
user_insert_idefix | 9
user_update_idefix | 9
stroj              | t


create SEQUENCE tmp_seq_prace start 500
insert into list2_prace (kod,nazev,stroj,zkratka,nazev_text)
select nextval('tmp_seq_prace'), nazevprace, false,'','' from c_prac_3000 

;

