 create table app_menu(id bigserial
    ,nazev text
    ,items jsonb,
    time_insert TIMESTAMP default now(),
    time_update TIMESTAMP default now(),  --//jen last update
    user_insert TIMESTAMP default now(),
    user_update TIMESTAMP default now() 
 ) without oids;

 /* zkusit
SELECT q.id, d.key, d.value
FROM q
JOIN json_each_text(q.data) d ON true
ORDER BY 1, 2;
*/
drop table list_modules ;
create table list_modules(
    id bigserial,
    nazev text,
    category text,   --vychozi kategorie priblizne  dle originalniho zadani//
    popis text,      -- // - upresneni - dokumnetace k modulu
    items jsonb,
    time_insert TIMESTAMP default now(),
    time_update TIMESTAMP default now(),  --//jen last update
    user_insert varchar(50) default 'app',
    user_update varchar(50) default '' 
) without oids ;