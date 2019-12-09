 
create or replace function get_idefix(_idefix bigint default 0, _type varchar(100) default '',_idefix_user bigint default 0, OUT _idefix2 bigint, OUT _cislo bigint, OUT _cislo_short varchar(5), OUT _rok varchar(4)) returns setof record as $$
    declare r record;
            r2 record;
    begin
        if (_type ='zakazky'  ) then 
         for r in 
            select * from zak_t_items where idefix_src = _idefix limit 1
          loop
            _idefix2 := r.idefix_zak;
           for r2 in 
             select * from zak_t_list where idefix = _idefix2  limit 1
           loop
            _cislo   :=  r2.cislozakazky ;
            _cislo_short := cislo(_cislo);
           end loop  ;
           return next;
         end loop;
        end if;
       if (_type ='nabidky'  ) then 
         for r in 
            select * from nab_t_items where idefix_src = _idefix limit 1
          loop
            _idefix2 := r.idefix_nab;
           for r2 in 
             select * from nab_t_list where idefix = _idefix2  limit 1
           loop
            _cislo   :=  r2.cislonabidky ;
            _cislo_short := cislo(_cislo);
           end loop  ;
           return next;
         end loop;
        end if;
    return ;
    end;
$$LANGUAGE PLPGSQL;

create or replace function get_cislo(_idefix bigint ,_type varchar(100) default '', OUT _cislo bigint, OUT _cislo_short varchar(5) , OUT _rok varchar(4) ) returns setof record  as $$
declare r record ;
begin
    if (_type ='zakazky' or _type='') then
     for r in select rok(cislozakazky) as rok,cislo(cislozakazky) as cislo, cislozakazky from zak_t_list  where idefix = _idefix loop
            _cislo := r.cislozakazky;
            _cislo_short := r.cislo;
            _rok:=r.rok;
        return next;
     end loop;
    end if;
    if (_type ='kalkulace' ) then
     for r in select rok(cislonabidky) as rok,cislo(cislonabidky) as cislo, cislonabidky from nab_t_list  where idefix = _idefix loop
            _cislo := r.cislonabidky;
            _cislo_short := r.cislo;
            _rok:=r.rok;
        return next;
     end loop;
    end if;
   return ;
end;
$$LANGUAGE PLPGSQL;

create or replace function cislo( _cislo bigint default 0) returns varchar(5) as $$
begin
    return  right(_cislo::text,5) ;
end;
$$LANGUAGE PLPGSQL ;
create or replace function rok( _cislo bigint default 0) returns varchar(4) as $$
begin
    return  '20'||lpad(left(_cislo::text,2),2,'0') ;
end;
$$LANGUAGE PLPGSQL IMMUTABLE;


create or replace function cislo_int( _cislo bigint default 0) returns int as $$
begin
    return  right(_cislo::text,5)::int ;
end;
$$LANGUAGE PLPGSQL ;

create or replace function cislorok( _cislo bigint default 0) returns varchar(5) as $$
begin
    return  left(_cislo,2)||right(_cislo::text,5) ;
end;
$$LANGUAGE PLPGSQL ;

