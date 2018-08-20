
create table list_prace (
id serial,
id_use int ,
prace	varchar(100),
stroj	varchar(50),
jednotka	varchar(50) ,  -- hodina ?
jednotka_num numeric(10,5),
cena_priprava_naklad	numeric(10,2),
cena_priprava_prodej	numeric(10,2),
cena_jednotka_naklad	numeric(10,2),
cena_jednotka_prodej    numeric(10,2),

time_insert TIMESTAMP default now(),
time_update TIMESTAMP default now(),  --//jen last update
user_insert TIMESTAMP default now(),
user_update TIMESTAMP default now()   --//jen last update

) ;

--
--název	použití stroj	šířka (mm)	délka mm	tloušťka mm	váha g/m2	návaznost na	cena nákup	cena prodej	koeficient nákladovosti ?	potisknutelnost - 1/0, 1/1, NE
--samolepka monomer	HP, EFI	1370, 1520	50	0,1		laminace	28	37	N1	
create table list_mat (
    id serial,
    nazev varchar(100),	
    stroj_pouziti varchar(100),
    sirka_mm NUMERIC(10,2),
    delka_mm NUMERIC(10,2),
    tloustka_mm NUMERIC(10,2),
    vaha_gm2 NUMERIC(10,2),
    navaznost_na_praci int,
    cena_nakup NUMERIC(10,2),
    cena_prodej numeric(10,2),
    koeficient_nakladovosti NUMERIC(10,5),
    potisknutelnost int default 0,
    time_insert TIMESTAMP default now(),
    time_update TIMESTAMP default now(),  --//jen last update
    user_insert TIMESTAMP default now(),
    user_update TIMESTAMP default now()   --//jen last update

);
-- 1/0, 1/1, NE
create table list2_potisknutelnost (
    id  serial,
    kod int,
    nazev varchar(20),
    time_insert TIMESTAMP default now(),
    time_update TIMESTAMP default now(),  --//jen last update
    user_insert TIMESTAMP default now(),
    user_update TIMESTAMP default now() 
);
insert into list2_potisknutelnost (nazev ) VALUES ('NE'),('1/1'),('1/0');
update list2_potisknutelnost set kod = id ;

alter table list2_barevnost ADD user_insert VARCHAR(50)
create table list2_barevnost (
    id  serial,
    kod int,
    nazev varchar(20),
    time_insert TIMESTAMP default now(),
    time_update TIMESTAMP default now(),  --//jen last update
    user_insert varchar(50),
    user_update varchar(50),
    user_insert_idefix int,
    user_update_idefix int
);
insert into list2_barevnost (nazev ) VALUES ('4/0'),('4/4'),('4/1'),('1/0'),('1/1'),('4+W'),('4+W+4');
update list2_barevnost set kod = id;





