 create table app_menu(id bigserial
    ,nazev text
    ,items jsonb,
    time_insert TIMESTAMP default now(),
    time_update TIMESTAMP default now(),  --//jen last update
    user_insert TIMESTAMP default now(),
    user_update TIMESTAMP default now() 
 ) without oids;
