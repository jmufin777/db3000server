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
        from list_modules_fix a where
         not exists
        (select * from list_modules  c where a.idefix = c.idefix ) 
        --and EXISTS   (select * from list_modules_groups b where a.idefix = b.idefix_module ) 
        ;
        

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


create or replace FUNCTION year(timestamp) RETURNS int as $$
    begin
        RETURN extract(year from $1);
    end;
$$LANGUAGE PLPGSQL IMMUTABLE;

create or replace FUNCTION year(timestamp with time zone) RETURNS int as $$
    begin
        RETURN extract(year from $1);
    end;
$$LANGUAGE PLPGSQL IMMUTABLE;
create or replace FUNCTION month(timestamp) RETURNS int as $$
    begin
        RETURN extract(month from $1);
    end;
$$LANGUAGE PLPGSQL IMMUTABLE;

create or replace FUNCTION month(timestamp with time zone) RETURNS int as $$
    begin
        RETURN extract(month from $1);
    end;
$$LANGUAGE PLPGSQL IMMUTABLE;
create or replace FUNCTION day(timestamp) RETURNS int as $$
    begin
        RETURN extract(day from $1);
    end;
$$LANGUAGE PLPGSQL IMMUTABLE;

create or replace FUNCTION day(timestamp with time zone) RETURNS int as $$
    begin
        RETURN extract(day from $1);
    end;
$$LANGUAGE PLPGSQL IMMUTABLE;

create or replace FUNCTION dow(timestamp) RETURNS int as $$
    begin
        RETURN extract(dow from $1);
    end;
$$LANGUAGE PLPGSQL IMMUTABLE;

create or replace FUNCTION dow(timestamp with time zone) RETURNS int as $$
    begin
        RETURN extract(dow from $1);
    end;
$$LANGUAGE PLPGSQL IMMUTABLE;



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


CREATE or replace FUNCTION minn(VARIADIC arr numeric[]) RETURNS numeric AS $$
    SELECT min($1[i]) FROM generate_subscripts($1, 1) g(i);
$$ LANGUAGE SQL;

CREATE or replace  FUNCTION maxx(VARIADIC arr numeric[]) RETURNS numeric AS $$
    SELECT max($1[i]) FROM generate_subscripts($1, 1) g(i);
$$ LANGUAGE SQL;

CREATE or replace  FUNCTION minn(VARIADIC arr float[]) RETURNS float AS $$
    SELECT min($1[i]) FROM generate_subscripts($1, 1) g(i);
$$ LANGUAGE SQL;

CREATE or replace  FUNCTION maxx(VARIADIC arr float[]) RETURNS float AS $$
    SELECT max($1[i]) FROM generate_subscripts($1, 1) g(i);
$$ LANGUAGE SQL;

CREATE or replace  FUNCTION maxx(VARIADIC arr timestamp[]) RETURNS timestamp AS $$
    SELECT max($1[i]) FROM generate_subscripts($1, 1) g(i);
$$ LANGUAGE SQL;

CREATE or replace  FUNCTION minn(VARIADIC arr timestamp[]) RETURNS timestamp AS $$
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
AS $function$to_ascii_encname$function$;

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
       exception when others then return $1  ;
    end;
  return cret;
end;  
$function$;



create or replace function idefix(_idefix bigint)  returns text as $$
    declare r record;
            r2 record;
            cRet text := '';

    declare cQ text := '';
    begin
    for r in 
         SELECT DISTINCT table_schema,table_name, column_name FROM information_schema.columns  WHERE  column_name = 'idefix'  and not table_name  ilike any (array['log%','tmp%','trand%','bck%']) 
           loop
                cQ := 'select * from ' || r.table_schema||'.'||r.table_name ||' where idefix = ' || _idefix  || ' limit 1';
                for r2 in execute cQ loop
                    cRet := r.table_schema||'.'||r.table_name ;
                    
                --    raise notice '%',cQ ;


                end loop;


                
                if (cRet >'') THEN
                    exit;
                end if;

end loop ;
 
RETURN cRet;
    end;
$$LANGUAGE PLPGSQL;


create or replace function idefix_nazev(_idefix bigint)  returns text as $$
    declare r record;
            r2 record;
            cRet text := '';

    declare cQ text := '';
    begin
    for r in 
         SELECT DISTINCT table_schema,table_name, column_name FROM information_schema.columns  WHERE  column_name = 'idefix' 
                  loop
              
              begin  
                    cQ := 'select nazev from ' || r.table_schema||'.'||r.table_name ||' where idefix = ' || _idefix  || ' limit 1';
                    for r2 in execute cQ loop
                        cRet := r2.nazev;
                    end loop;
                exception when others    then 
                      continue;
                end;
                if (cRet >'') THEN
                    exit;
                end if;
    end loop ;
RETURN cRet;
 end;
$$LANGUAGE PLPGSQL;

create or replace function idefix_nazev1(_idefix bigint)  returns text as $$
    declare r record;
            r2 record;
            cRet text := '';

    declare cQ text := '';
    begin
    for r in 
         SELECT DISTINCT table_schema,table_name, column_name FROM information_schema.columns  WHERE  column_name = 'idefix' 
                  loop
              
              begin  
                    cQ := 'select nazev1 as nazev from ' || r.table_schema||'.'||r.table_name ||' where idefix = ' || _idefix  || ' limit 1';
                    for r2 in execute cQ loop
                        cRet := r2.nazev;
                    end loop;
                exception when others    then 
                      continue;
                end;
                if (cRet >'') THEN
                    exit;
                end if;
    end loop ;
RETURN cRet;
 end;
$$LANGUAGE PLPGSQL;

create or replace function idefix_name(_idefix bigint)  returns text as $$
    declare r record;
            r2 record;
            cRet text := '';

    declare cQ text := '';
    begin
    for r in 
         SELECT DISTINCT table_schema,table_name, column_name FROM information_schema.columns  WHERE  column_name = 'idefix' 
                  loop
              
              begin  
                    cQ := 'select name as nazev from ' || r.table_schema||'.'||r.table_name ||' where idefix = ' || _idefix  || ' limit 1';
                    for r2 in execute cQ loop
                        cRet := r2.nazev;
                    end loop;
                exception when others    then 
                      continue;
                end;
                if (cRet >'') THEN
                    exit;
                end if;
    end loop ;
RETURN cRet;
 end;
$$LANGUAGE PLPGSQL;

create or replace function idefix_login(_idefix bigint)  returns text as $$
    declare r record;
            r2 record;
            cRet text := '';

    declare cQ text := '';
    begin
    for r in 
         SELECT DISTINCT table_schema,table_name, column_name FROM information_schema.columns  WHERE  column_name = 'idefix' 
                  loop
              
              begin  
                    cQ := 'select login as nazev from ' || r.table_schema||'.'||r.table_name ||' where idefix = ' || _idefix  || ' limit 1';
                    for r2 in execute cQ loop
                        cRet := r2.nazev;
                    end loop;
                exception when others    then 
                      continue;
                end;
                if (cRet >'') THEN
                    exit;
                end if;
    end loop ;
RETURN cRet;
 end;
$$LANGUAGE PLPGSQL;

create or replace FUNCTION idefix_txt(_idefix bigint )  returns text as $$
    declare cRet text := '' ;
    BEGIN
        cRet := idefix_nazev(_idefix) ;
        if cRet = '' then
            cRet := idefix_nazev1(_idefix) ;
        end if ;
        if cRet = '' then
            cRet := idefix_name(_idefix) ;
        end if ;
                if cRet = '' then
            cRet := idefix_login(_idefix) ;
        end if ;
        RETURN cRet;
    end ;
$$LANGUAGE PLPGSQL ;


create or replace function right(bigint, n int) returns text as $$
    begin
    return right($1::text,n);
    end;
$$LANGUAGE PLPGSQL IMMUTABLE;

create or replace function left(bigint, n int) returns text as $$
    begin
    return left($1::text,n);
    end;
$$LANGUAGE PLPGSQL IMMUTABLE;

create or replace function lpad(bigint, int, cim text default '0') returns text as $$
    declare neco text := coalesce($1::text,'');
    begin
        return lpad(neco,$2,cim) ;
    end;
$$LANGUAGE PLPGSQL IMMUTABLE ;

create or replace function rpad(bigint, int, cim text default '0') returns text as $$
    declare neco text := coalesce($1::text,'');
    begin
        return rpad(neco,$2,cim) ;
    end;
$$LANGUAGE PLPGSQL IMMUTABLE ;

create or replace function d_exp( ndays int default 10 ) returns date as $$
    begin
        return now()::date +  ndays;
    end;
$$LANGUAGE PLPGSQL;



create or replace function newzak(_idefixuser bigint default 0, _rok int default 0 )  returns bigint as $$
    declare _r int := 0;
    declare newzak bigint := 0;
    declare lastzak text:= '';
    declare rok text := 0;
begin
    if (_rok = 0) then
        rok := (extract(year from now()) - 2000)::text;
       ELSE
        rok := right(_rok,2)::text;
    end if;
    select max(right(cislozakazky::text,5)) into lastzak  from zak_t_list where left(cislozakazky,2)= rok;
    if (lastzak is null or lastzak = '0') then
--        raise notice ' %', lastzak;
        lastzak := lpad('1',5,'0');
        else
        lastzak := lpad((lastzak::bigint+1)::text,5,'0') ;
    end if ;
--    raise notice '%' , (rok || lpad(_idefixuser,3) || lastzak ) ;
    newzak := (rok || lpad(_idefixuser,3) || lastzak )::bigint;


    return newzak;
end;
--RR NNN ZZZZZ
$$LANGUAGE PLPGSQL ;

create or replace function newnab(_idefixuser bigint default 0,_rok int default 0 )  returns bigint as $$
    declare _r int := 0;
    declare newzak bigint := 0;
    declare lastzak text:= '';
    declare rok text := 0;
begin
      if (_rok = 0) then
        rok := (extract(year from now()) - 2000)::text;
       ELSE
        rok := right(_rok,2)::text;
    end if;
    select max(right(cislonabidky::text,5)) into lastzak  from nab_t_list where left(cislonabidky,2)= rok;
    if (lastzak is null or lastzak = '0') then
--        raise notice 'A  %', lastzak;
        lastzak := lpad('1',5,'0');
        else
        lastzak := lpad((lastzak::bigint+1)::text,5,'0') ;
--        raise notice 'B  %', lastzak;
    end if ;
--    raise notice ' C %' , (rok || lpad(_idefixuser,3) || lastzak ) ;
    newzak := (rok || lpad(_idefixuser,3) || lastzak )::bigint;


    return newzak;
end;
--RR NNN ZZZZZ
$$LANGUAGE PLPGSQL ;

--14125
drop function zak_insert ( bigint, bigint, date) ;
create or replace function zak_insert( user_insert_idefix bigint default 0, idefix_firma bigint default 0,dat_exp date default now()::date,
                                         OUT  datum_spl date, OUT idefix bigint, OUT cislo bigint, OUT platbaInfo text, OUT info text,
                                         OUT datumzadani date
                                         ) 
                            returns setof record   as $$
    declare idefix_ret  bigint := 0;
    declare splatnost date := now()::date; 
    declare r record;
    declare splDays int :=0;
    begin 
    if (idefix_firma = 0 or idefix_firma is null ) then
        idefix = 0;
        info := 'Firma musi byt zadana'; 
        cislo := 0;
        return next;
        else 
        for r in select * from list_dodavatel a where a.idefix = idefix_firma loop

            if (r.hotovost = 1) then 
                platbaInfo := 'Platba v hotovosti';
                datum_spl  := dat_exp ;
                splDays    :=  0 ;

              else
                platbaInfo := 'Faktura';
                datum_spl  := dat_exp + r.splatnost ;
                splDays    := r.splatnost ;

            end if ;
        end loop;
        for r in 
        insert into zak_t_list (cislozakazky, datumexpedice,datumsplatnosti, idefix_firma,user_insert_idefix, datumzadani)    
                     values
                      (newzak(user_insert_idefix, year(dat_exp)),dat_exp, datum_spl, idefix_firma,user_insert_idefix,now()) 
                     
                       returning * loop
                      raise notice 'RET %', r;
                     idefix := r.idefix;
                     cislo   := r.cislozakazky ;
                     info    := 'Splatnost = ' || splDays::text;
                     datumzadani := r.datumzadani ;


        end loop;             

        
        return next;

    end if ;
    return;
    end;
$$LANGUAGE PLPGSQL;

create or replace function nab_insert( user_insert_idefix bigint default 0, idefix_firma bigint default 0,dat_exp date default now()::date,
                                         OUT  datum_spl date, OUT idefix bigint, OUT cislo bigint, OUT platbaInfo text, OUT info text,
                                         OUT  datumzadani date
                                         
                                         ) 
                            returns setof record   as $$
    declare idefix_ret  bigint := 0;
    declare splatnost date := now()::date; 
    declare r record;
    declare splDays int :=0;
    begin 
    if (idefix_firma = 0 or idefix_firma is null ) then
        idefix = 0;
        info := 'Firma musi byt zadana ? Obecna nabidka'; 
        cislo := 0;
        for r in 
            insert into nab_t_list (cislonabidky, datumexpedice,datumsplatnosti, idefix_firma,user_insert_idefix, datumzadani)    
                     values (newnab(user_insert_idefix, year(dat_exp)),dat_exp, datum_spl, idefix_firma,user_insert_idefix,now())   returning * loop
                      raise notice 'RET 1 %', r;
                     idefix := r.idefix;
                     cislo   := r.cislonabidky ;
                     datumzadani := r.datumzadani ;
        


        end loop;             
        return next;
        else 
        for r in select * from list_dodavatel a where a.idefix = idefix_firma loop

            if (r.hotovost = 1) then 
                platbaInfo := 'Platba v hotovosti';
                datum_spl  := dat_exp ;
                splDays    :=  0 ;

              else
                platbaInfo := 'Faktura';
                datum_spl  := dat_exp + r.splatnost ;
                splDays    := r.splatnost ;

            end if ;
        end loop;
        for r in 
        insert into nab_t_list (cislonabidky, datumexpedice,datumsplatnosti, idefix_firma,user_insert_idefix,datumzadani)    
                     values (newnab(user_insert_idefix, year(dat_exp)),dat_exp, datum_spl, idefix_firma,user_insert_idefix,now())   returning * loop
                      raise notice 'RET 2 % b : %  c: % ', r , newnab(user_insert_idefix) , user_insert_idefix;
                     idefix := r.idefix;
                     cislo   := r.cislonabidky ;
                     info    := 'Splatnost = ' || splDays::text;
                     datumzadani := r.datumzadani ;


        end loop;             

        
        return next;

    end if ;
    return;
    end;
$$LANGUAGE PLPGSQL;

create or replace function splatnost(_idefix_zak bigint) returns date as $$
 declare r record ;
         r1 record ;
         dret date;
         datum_spl date;
         splDays int ;
         platbaInfo text;

 begin
    for r in select * from zak_t_list where idefix = _idefix_zak loop
        for r1 in select * from list_dodavatel a where a.idefix = r.idefix_firma loop

            if (r1.hotovost = 1) then 
                platbaInfo := 'Platba v hotovosti';
                datum_spl  := r.datumexpedice ;
                splDays    :=  0 ;

              else
                platbaInfo := 'Faktura';
                datum_spl  := r.datumexpedice + (r1.splatnost*86400)::text::interval ;
                splDays    := r1.splatnost ;

            end if ;
        end loop;

    end loop;
    return datum_spl ;
 
 end ;
$$LANGUAGE PLPGSQL;

create or replace function vl_init() returns text as $$
    declare i int :=0;
    declare i2 int :=0;
    declare r record ;
    begin
    truncate table list2_vl ;
   for i in 1..26 loop
        i2:=i2+1;
        raise notice '%', chr(i+64);
        perform setval('list2_vl_id_seq',i2);
        insert into list2_vl(id,nazev) values(i2,chr(i+64));
   end loop;
   for r in select * from list2_vl order by id loop 
    for i in 1..26 loop
        raise notice '%', chr(i+64);
        i2:=i2+1;
        perform setval('list2_vl_id_seq',i2);
        insert into list2_vl(id,nazev) values(i2,r.nazev||chr(i+64));
    end loop;
   end loop; 
    return 'OK';
    end;
$$LANGUAGE PLPGSQL ;

create or replace function vl_set( _idefix_zak bigint default 0,  _idefix_item bigint default 0) returns text as $$
    declare r record ;
    declare cRet text :='';
    declare _vl_last int := 0;
    declare _vl_cur int :=0;
    declare _vl_lastname text := '';
    declare _vl_curname text :='';
    begin
    delete from zak_t_vl_v a where not exists (select * from zak_t_items b where a.idefix_item=b.idefix) ; -- Navazat na soubory a smazat
    if _idefix_zak=0 then
        return 'nic';
    end if;
    select * into _vl_last from zak_vl_last where idefix_zak = _idefix_zak;
    if not found then
        for r in select * from list2_vl order by id limit 1 loop
             _vl_cur := r.id;
            _vl_curname := r.nazev;
            insert into zak_vl_last (idefix_zak,idefix_item,vl_id,vl_znacka,pocet)  values (_idefix_zak,_idefix_item,_vl_cur,_vl_curname,1);
            update zak_t_items set vl_znacka= _vl_curname, vl_id = _vl_cur where idefix=_idefix_item;
        end loop;
    end if;
    if found then


        for r in select * from list2_vl order by id limit 1 loop
             _vl_cur := r.id;
            _vl_curname := r.nazev;
            --insert into zak_vl_last (idefix_zak,id_vl,nazev,pocet)  values (_idefix_zak,_vl_cur,_vl_curname,1);
        end loop;
    end if;
       --zak_vl_last 
    return cRet;
    end;   
$$LANGUAGE PLPGSQL;
--select vl_set(13518947,13629472) ;
--13518947,13629472
--// SELECT concat('My ', 'dog ', 'likes ', 'chocolate') As result;

-- result