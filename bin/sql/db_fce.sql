create or replace function fce_modules_sync() returns text as $$
begin
    update list_modules set idefix= id where idefix = 0 or idefix is null;
    update list_modules a set idefix = b.idefix from (
    select idefix,modul,nazev from list_modules_fix a where idefix > 0 and not exists (select * from list_modules b where a.idefix = b.idefix )
    and exists(select * from list_modules b where a.modul = b.modul and a.nazev = b.nazev and a.modul > '' and a.nazev > '')
    ) b where a.modul = b.modul;

    delete from list_modules_fix a where modul >'' and not exists(
    select * from (select distinct on ( modul) * from list_modules_fix where modul >'' order by modul,idefix) b where a.idefix = b.idefix
    )
    and not exists (
        select * from list_modules_groups b where a.idefix = b.idefix_module
    )    
    ;

    delete  from list_modules a where modul >'' and not exists(
    select * from (select distinct on ( modul) * from list_modules where modul >'' order by modul,idefix) b where a.idefix = b.idefix
    ) ;

    insert into list_modules(
    nazev,modul,category,popis,items,time_insert,time_update,user_insert, user_update, idefix 
        )
        select 
        nazev,modul,category,popis,items,time_insert,time_update,user_insert, user_update, idefix 
        from list_modules_fix a where EXISTS 
        (select * from list_modules_groups b where a.idefix = b.idefix_module )
        and not exists
        (select * from list_modules  c where a.idefix = c.idefix );

    update list_modules_fix a set nazev = b.nazev from list_modules b where b.nazev > '' and a.nazev != b.nazev and a.idefix =b.idefix and a.modul = b.modul ;
    return 'modules sync OK ';
end ;
$$LANGUAGE PLPGSQL ;    








create or replace function jsonb2array(items anyelement) returns text[] as $$
begin
 return (string_to_array(regexp_replace(items::text,'[\[\]"]','','g'),','));
end ;
$$LANGUAGE PLPGSQL;

create or replace function jsonb2array(items anyelement, nitem int) returns text[] as $$
begin
 return (string_to_array(regexp_replace(items::text,'[\[\]"]','','g'),','))[nitem+1];
end ;
$$LANGUAGE PLPGSQL;

create or replace function _2array(items anyelement) returns text[] as $$
begin
 return (string_to_array(regexp_replace(items::text,'[\[\]"]','','g'),','));
end ;
$$LANGUAGE PLPGSQL;

create or replace function _2array(items anyelement, nitem int) returns text as $$
begin
 return (string_to_array(regexp_replace(items::text,'[\[\]"]','','g'),','))[nitem+1];
end ;
$$LANGUAGE PLPGSQL;


CREATE FUNCTION minn(VARIADIC arr numeric[]) RETURNS numeric AS $$
    SELECT min($1[i]) FROM generate_subscripts($1, 1) g(i);
$$ LANGUAGE SQL;

CREATE FUNCTION maxx(VARIADIC arr numeric[]) RETURNS numeric AS $$
    SELECT max($1[i]) FROM generate_subscripts($1, 1) g(i);
$$ LANGUAGE SQL;

CREATE FUNCTION minn(VARIADIC arr float[]) RETURNS float AS $$
    SELECT min($1[i]) FROM generate_subscripts($1, 1) g(i);
$$ LANGUAGE SQL;

CREATE FUNCTION maxx(VARIADIC arr float[]) RETURNS float AS $$
    SELECT max($1[i]) FROM generate_subscripts($1, 1) g(i);
$$ LANGUAGE SQL;

CREATE FUNCTION maxx(VARIADIC arr timestamp[]) RETURNS timestamp AS $$
    SELECT max($1[i]) FROM generate_subscripts($1, 1) g(i);
$$ LANGUAGE SQL;

CREATE FUNCTION minn(VARIADIC arr timestamp[]) RETURNS timestamp AS $$
    SELECT minn($1[i]) FROM generate_subscripts($1, 1) g(i);
$$ LANGUAGE SQL;