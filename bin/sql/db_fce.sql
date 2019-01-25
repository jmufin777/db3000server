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



create or replace FUNCTION fce_user_fullname(_idefix bigint) returns varchar(100) as $$
declare txt_ret text := 'Neuveden' ;
    begin
        select jmeno||' '|| prijmeni as fullname into txt_ret from list_users a where a.idefix = _idefix ;
        if txt_ret is null THEN 
            txt_ret := 'Neuveden' ;
        end if ;    
    return txt_ret;
    end ;
$$LANGUAGE PLPGSQL IMMUTABLE;

create or replace FUNCTION idefix2fullname(_idefix bigint) returns varchar(100) as $$
declare txt_ret text := 'Neuveden' ;
    begin
        select jmeno||' '|| prijmeni as fullname into txt_ret from list_users a where a.idefix = _idefix ;
        if txt_ret is null THEN 
            txt_ret := 'Neuveden' ;
        end if ;    
    return txt_ret;
    end ;
$$LANGUAGE PLPGSQL IMMUTABLE;

create or replace FUNCTION id2fullname(_idefix bigint) returns varchar(100) as $$
declare txt_ret text := 'Neuveden' ;
    begin
        select jmeno||' '|| prijmeni as fullname into txt_ret from list_users a where a.id = _idefix ;
        if txt_ret is null THEN 
            txt_ret := 'Neuveden' ;
        end if ;    
    return txt_ret;
    end ;
$$LANGUAGE PLPGSQL IMMUTABLE;

CREATE or replace FUNCTION login2idefix(_login varchar) returns bigint as $$
    declare idx int := -1;
    begin
        select idefix into idx from list_users where login = _login limit 1;
        return idx ;
    end;
$$LANGUAGE PLPGSQL;

CREATE or replace FUNCTION login2id(_login varchar) returns bigint as $$
    declare idx int := -1;
    begin
        select id into idx from list_users where login = _login limit 1;
        return idx ;
    end;
$$LANGUAGE PLPGSQL;

CREATE or replace FUNCTION id2login(_id bigint) returns varchar(50) as $$
    declare _lg varchar(50);
    begin
        select login into _lg from list_users where id = _id  limit 1;
        return _lg ;
    end;
$$LANGUAGE PLPGSQL;

CREATE or replace FUNCTION idefix2login(_id bigint) returns varchar(50) as $$
    declare _lg varchar(50);
    begin
        select login into _lg from list_users where idefix = _id  limit 1;
        return _lg ;
    end;
$$LANGUAGE PLPGSQL;




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

CREATE or replace FUNCTION concat2(cSpace varchar(20) default ' ',VARIADIC cPars text[] default ARRAY[' ']) RETURNS text AS $$
    declare cRet text := '' ;
            i  int := 0 ;
            i1 int := 0 ;
    begin
      i := array_upper(cPars, 1) ;
        for i1 in 1..i  loop
         if cRet > ' ' then 
            cRet := cRet || cSpace  ;
         end if ;
            if coalesce(cPars[i1],'' ) > ' ' then 
                cRet := cRet || coalesce(cPars[i1],'' );
            end if;
            raise notice ' % , % , %  ,: % ', i1 , cPars[i1], cRet, cPars  ;
        end loop;
        cRet := trim(cRet) ;
        cRet := REGEXP_REPLACE(cRet,'( ){2,}',' ');
    --//    SELECT array_to_string($1,'');
      return cRet;
    end;
$$LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION public.to_ascii(bytea, name)
 RETURNS text
 LANGUAGE internal
 IMMUTABLE STRICT
AS $function$to_ascii_encname$function$

CREATE OR REPLACE FUNCTION public.to_aascii(text)
 RETURNS text
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$   
declare cret text := '';
begin
    begin
  SELECT to_ascii(convert_to(
  replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
  replace(replace(replace(replace(REPLACE(replace(replace(replace(replace(replace($1,chr(8211),'')
  ,chr(157),'')
  ,chr(174),''),chr(711),'')
  ,chr(239),'i'),chr(207),'I'),chr(209),chr(327)),chr(213),chr(211)),chr(188),'L')
  ,chr(190),'L'),chr(197),'L'),chr(179),'L'),chr(198),'L'),chr(163),'L'),chr(219),'U'),chr(191),'Z'),chr(204),''),chr(217),chr(218) ),chr(208),''),chr(338),chr(352)),chr(202),chr(352))
  ,chr(192),chr(344)),'','')
  , 'latin2'),'latin2') into cret;
  --      exception when others then return cret  ;
    end;
  return cret;
end;  
$function$



SELECT concat('My ', 'dog ', 'likes ', 'chocolate') As result;

result