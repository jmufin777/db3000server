alter table list_menu    add idefix int default 0;
alter table list_groups  add idefix int default 0;
alter table list_modules add idefix int default 0;
alter table list_users   add idefix int default 0;

 drop table list_menu;
 create table list_menu(id bigserial
    ,nazev varchar(64)
    ,popis text
    ,typ varchar(10)   default 'user'
    ,idefix int default 0
    ,items jsonb,
    time_insert TIMESTAMP default now(),
    time_update TIMESTAMP default now(),  --//jen last update
    user_insert varchar(50) default 'app',
    user_update varchar(50) default '' 
 ) without oids;
 create unique index on list_menu(nazev,popis);
 

 drop table list_groups;
 create table list_groups(id bigserial
 
    ,nazev varchar(64)
    ,popis text
    ,idefix int default 0,
    time_insert TIMESTAMP default now(),
    time_update TIMESTAMP default now(),  --//jen last update
    user_insert varchar(50) default 'app',
    user_update varchar(50) default '' 
 ) without oids;
 create unique index on list_groups(nazev);
 create index list_groups_idefix on list_groups(idefix);

 drop table list_modules_groups;
 create table list_modules_groups(id bigserial
    ,module_name varchar(64)
    ,group_name varchar(64)
    ,idefix_module int 
    ,idefix_group int ,
    time_insert TIMESTAMP default now(),
    time_update TIMESTAMP default now(),  --//jen last update
    user_insert varchar(50) default 'app',
    user_update varchar(50) default '' 
 ) without oids;
 create unique index on list_modules_groups(module_name,group_name);

 drop table list_menu_groups;
 create table list_menu_groups(id bigserial
    ,idefix_user int 
    ,idefix_group int 
    ,menu_name varchar(64)
    ,group_name varchar(64),
    time_insert TIMESTAMP default now(),
    time_update TIMESTAMP default now(),  --//jen last update
    user_insert varchar(50) default 'app',
    user_update varchar(50) default '' 
 ) without oids;
 create unique index on list_menu_groups(menu_name,group_name);

 drop table list_modules_users;
 create table list_modules_users(id bigserial
    ,idefix_module int 
    ,idefix_user  int 
    ,module_name varchar(64)
    ,user_name  varchar(64),
    time_insert TIMESTAMP default now(),
    time_update TIMESTAMP default now(),  --//jen last update
    user_insert varchar(50) default 'app',
    user_update varchar(50) default '' 
 ) without oids;
 create unique index on list_menu(nazev,popis);

 drop table list_menu_users;
 create table list_menu_users(id bigserial
    ,idefix_user int 
    ,idefix_menu int 
    ,menu_name varchar(64)
    ,user_name varchar(64),
    time_insert TIMESTAMP default now(),
    time_update TIMESTAMP default now(),  --//jen last update
    user_insert varchar(50) default 'app',
    user_update varchar(50) default '' 
 ) without oids;
 
 create unique index on list_menu_users(user_name, menu_name);



 /* zkusit
SELECT list_modules.id, d.key, d.value
FROM list_modules
JOIN jsonb_each_text(list_modules.items) d ON true
ORDER BY 1, 2;
*/
drop table list_modules ;
alter table  list_modules add modul varchar(64)
create table list_modules(
    id bigserial,
    nazev text,
    modul varchar(64),
    category text,   --vychozi kategorie priblizne  dle originalniho zadani//
    popis text,      -- // - upresneni - dokumnetace k modulu
    items jsonb,
    time_insert TIMESTAMP default now(),
    time_update TIMESTAMP default now(),  --//jen last update
    user_insert varchar(50) default 'app',
    user_update varchar(50) default '' 
) without oids ;
create unique index 

-- Pohled na moduly  a jejich vazby
-- zatim takle jednoduse bez vazeb na funkci databaze, casem se uvidi

select * from (
select distinct unnest(string_to_array(regexp_replace(items::text,'[\[\]"]','','g'),',')) as all,id,nazev from list_menu 
) a join 
(
select (string_to_array(regexp_replace(items::text,'[\[\]"]','','g'),','))[4] as modul from list_modules 
) b on a.all = b.modul where  b.modul > ' ' and id=288;
