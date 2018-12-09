drop table list_users;
create table list_users (
    id bigserial,
    idefix bigint,
    login varchar(50),
    level int default 1,
    heslo VARCHAR(50),
    heslo2 VARCHAR(150),
    titul varchar(20),
    jmeno varchar(50),
    prijmeni varchar(50),
    titulza varchar(20),
    email varchar(100),
    telefon varchar(20),
    telefon2 varchar(20),
    ulice VARCHAR(50),
    obec VARCHAR(50),
    psc VARCHAR(50),
    zobraz int default 1,
    plati int default 1,
    plati_od date default '20000101',
    plati_do date default '21003112',

    time_insert TIMESTAMP default now(),
    time_update TIMESTAMP default now(),  --//jen last update
    user_insert varchar(50) default 'app',
    user_update varchar(50) default '' 

) ;

alter table list_users add plati_od date default '20000101' ;
alter table list_users add plati_do date default '21001231' ;
alter table list_users alter idefix set default nextval('list2_seq'::regclass) ;
alter table list_users add zkratka varchar(10) ;

create UNIQUE INDEX list_users_login on list_users (login);
create UNIQUE INDEX list_users_id on list_users (id);
create  INDEX list_users_idefix on list_users (idefix);
 create index list_users_zkratka on list_users(zkratka) ;


/*
insert into list_users( idefix,login, heslo, jmeno,prijmeni,email,plati, zobraz ,level )
select kodzamestnance, login, heslo,jmeno,prijmeni,email,plati, zobraz,level from list_users_bck where plati > 0 order by kodzamestnance ;
*/

 drop table list_menu_users;
 create table list_menu_users(id bigserial
    ,idefix_user bigint 
    ,idefix_menu bigint 
    ,menu_name varchar(64)
    ,user_name varchar(64),
    time_insert TIMESTAMP default now(),
    time_update TIMESTAMP default now(),  --//jen last update
    user_insert varchar(50) default 'app',
    user_update varchar(50) default '' 
 ) without oids;
 create unique index list_menu_users_idefix_user_idefix_menu on list_menu_users(idefix_user, idefix_menu );

 drop table list_groups_users;
 create table list_groups_users(id bigserial
    ,idefix_user int 
    ,idefix_group int 
    ,group_name varchar(64)
    ,user_name varchar(64),
    time_insert TIMESTAMP default now(),
    time_update TIMESTAMP default now(),  --//jen last update
    user_insert varchar(50) default 'app',
    user_update varchar(50) default '' 
 ) without oids;
 
 create unique index on list_groups_users(idefix_user, idefix_group );

 create or replace FUNCTION zkratka(_idefix int ) returns text as $$
   select zkratka from list_users where idefix = _idefix;
 $$LANGUAGE SQL ;
 
 create or replace FUNCTION zkratka(_login varchar ) returns text as $$
   select zkratka from list_users where login = _login;
 $$LANGUAGE SQL ;

create table list_users_sessions (id bigserial, idefix bigint, t_login timestamp default now(),t_logout timestamp,t_last timestamp default now()) 
without oids;

-- pozor nema indexy !!!!
