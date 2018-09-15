
create table list_prace (
id serial,
idefix  int default nextval('list2_seq'),
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
    idefix  int default nextval('list2_seq'),
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
    user_insert_idefix int,
    user_update_idefix int

);
-- 1/0, 1/1, NE
drop table list2_potisknutelnost;
create table list2_potisknutelnost (
    id  serial,
    kod int,
    nazev varchar(20),
    idefix  int default nextval('list2_seq'),
    time_insert TIMESTAMP default now(),
    time_update TIMESTAMP default now(),  --//jen last update
    user_insert_idefix int,
    user_update_idefix int
);

insert into list2_potisknutelnost (nazev ) VALUES ('NE'),('1/1'),('1/0');
update list2_potisknutelnost set kod = id ;

CREATE or replace  RULE log_list2_potisknutelnost AS ON UPDATE TO list2_potisknutelnost
     where row(NEW.*) <> row(OLD.*)
        DO 
        INSERT INTO log_central 
        (idefix, 
        idefix_user,
        db_user,
        tabulka ,
        txt,
        typ,
        cas
        )
        VALUES (
                                    OLD.idefix,
                                    NEW.user_update_idefix,
                                    current_user,
                                    'list2_potisknutelnost',
                                    row(OLD.*),
                                    'U',
                                    current_timestamp
                                );

CREATE or replace  RULE log_list2_barevnost AS ON DELETE TO list2_barevnost
        DO 
        INSERT INTO log_central 
        (idefix, 
        idefix_user,
        db_user,
        tabulka ,
        txt,
        typ,
        cas
        )
        VALUES (    OLD.idefix,
                    OLD.user_update_idefix,
                    current_user,
                    'list2_barevnost',
                    row(OLD.*),
                    'D',
                    current_timestamp
        );






create table list2_barevnost (
    id  serial,
    kod int,
    nazev varchar(20),
    idefix  int default nextval('list2_seq'),
    time_insert TIMESTAMP default now(),
    time_update TIMESTAMP default now(),  --//jen last update
    user_insert_idefix int,
    user_update_idefix int
);

insert into list2_barevnost (nazev ) VALUES ('4/0'),('4/4'),('4/1'),('1/0'),('1/1'),('4+W'),('4+W+4');
update list2_barevnost set kod = id;

create SEQUENCE list2_seq ;

create table log_central 
    (id bigserial, 
    idefix bigint, 
    idefix_user bigint default 0, 
    db_user varchar(64),
    tabulka name, 
    txt text,
    typ varchar(1), 
    cas TIMESTAMP default now()

    )
without oids ;


CREATE or replace  RULE log_list2_barevnost AS ON UPDATE TO list2_barevnost
     where row(NEW.*) <> row(OLD.*)
        DO 
        INSERT INTO log_central 
        (idefix, 
        idefix_user,
        db_user,
        tabulka ,
        txt,
        typ,
        cas
        )
        VALUES (
                                    OLD.idefix,
                                    NEW.user_update_idefix,
                                    current_user,
                                    'list2_barevnost',
                                    row(OLD.*),
                                    'U',
                                    current_timestamp
                                );

CREATE or replace  RULE log_list2_barevnost AS ON DELETE TO list2_barevnost
        DO 
        INSERT INTO log_central 
        (idefix, 
        idefix_user,
        db_user,
        tabulka ,
        txt,
        typ,
        cas
        )
        VALUES (    OLD.idefix,
                    OLD.user_update_idefix,
                    current_user,
                    'list2_barevnost',
                    row(OLD.*),
                    'D',
                    current_timestamp
        );




select 'drop table ' || tablename  from pg_tables where schemaname='public' and tablename like 'tmp_%';

