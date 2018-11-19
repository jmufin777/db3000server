CREATE OR REPLACE FUNCTION fce_list_stroj_copy(_idefix bigint, _user character varying DEFAULT 'mares'::character varying) RETURNS bigint AS $$
    declare  idefix_new bigint := 0 ;
    declare nkontrola int := 0;
	
	declare r record ;
 
begin 
	drop table if exists tmp_stroj_insert ;
	
    drop table if exists tmp_list_strojmod              ;
    drop table if exists tmp_list_strojmodbarevnost     ;
    drop table if exists tmp_list_strojinkoust          ;
    drop table if exists tmp_list_strojinkoustbarevnost ;
    drop table if exists tmp_list_strojceny             ;
	drop table if exists tmp_list_strojmod_vazba        ;
    
																		   
	create table tmp_stroj_insert                without oids as  select * from   list_stroj                  where idefix = _idefix limit 1;
    --select count(*) into nkontrola from list_stroj where concat2(nazev,nazev_text,idefix_strojskup::varchar) in ( select  concat2(nazev,nazev_text,idefix_strojskup::varchar) from tmp_stroj_insert );
	for r in 
	select count(*) as pocet,max(idefix) as maxidefix from list_stroj where concat2(nazev,nazev_text,idefix_strojskup::varchar) in ( select  concat2(nazev,nazev_text,idefix_strojskup::varchar) from tmp_stroj_insert ) loop
		if r.pocet > 1 then	
			idefix_new  := r.maxidefix;
		end if;
	end loop
	;
    if (idefix_new >0) THEN
     RETURN  idefix_new ;
    END IF;
    
    create table tmp_list_strojmod               without oids as  select * from   list_strojmod               where idefix_stroj = _idefix;
	
	create table tmp_list_strojmod_vazba         without oids as  select idefix,idefix as idefix_mod_new from   list_strojmod               where idefix_stroj = _idefix;
    
	create table tmp_list_strojmodbarevnost      without oids as  select * from   list_strojmodbarevnost      where idefix_stroj = _idefix;
    create table tmp_list_strojinkoust           without oids as  select * from   list_strojinkoust           where idefix_stroj = _idefix;
    create table tmp_list_strojinkoustbarevnost  without oids as  select * from   list_strojinkoustbarevnost  where idefix_stroj = _idefix;
    create table tmp_list_strojceny              without oids as  select * from   list_strojceny              where idefix_stroj = _idefix;
	
	update tmp_stroj_insert set id = nextval('list_stroj_id_seq'::regclass), idefix=nextval('list2_seq'::regclass) ,time_insert = now(), time_update= now(),user_insert_idefix = login2idefix(_user) ;
    update tmp_stroj_insert set kod = (select max(kod)+1 from list_stroj);
	
	select idefix into idefix_new from tmp_stroj_insert order by id desc limit 1;

    update tmp_list_strojmod_vazba            set  idefix_mod_new =nextval('list2_seq'::regclass);
	update tmp_list_strojmod           a      set idefix_stroj = idefix_new,id = nextval('list_strojmod_id_seq'::regclass), idefix=b.idefix_mod_new ,time_insert = now(), time_update= now(),user_insert_idefix = login2idefix(_user) 
	from tmp_list_strojmod_vazba b where a.idefix=b.idefix ;
--		update tmp_list_strojmod           a      set idefix_stroj = 9183,id = nextval('list_strojmod_id_seq'::regclass), idefix=b.idefix_mod_new ,time_insert = now(), time_update= now()
--from tmp_list_strojmod_vazba b where a.idefix=b.idefix 

--	select * from tmp_list_strojmod_vazba
--select * from tmp_list_strojmod
	
    update tmp_list_strojmodbarevnost         set idefix_stroj = idefix_new,id = nextval('list_strojmodbarevnost_id_seq'::regclass), idefix=nextval('list2_seq'::regclass) ,time_insert = now(), time_update= now(),user_insert_idefix = login2idefix(_user) ;
    update tmp_list_strojinkoust              set idefix_stroj = idefix_new,id = nextval('list_strojinkoust_id_seq'::regclass), idefix=nextval('list2_seq'::regclass) ,time_insert = now(), time_update= now(),user_insert_idefix = login2idefix(_user) ;
    update tmp_list_strojinkoustbarevnost     set idefix_stroj = idefix_new,id = nextval('list_strojinkoustbarevnost_id_seq'::regclass), idefix=nextval('list2_seq'::regclass) ,time_insert = now(), time_update= now(),user_insert_idefix = login2idefix(_user) ;	
	update tmp_list_strojceny                 set idefix_stroj = idefix_new,id = nextval('list_strojceny_id_seq'::regclass), idefix=nextval('list2_seq'::regclass) ,time_insert = now(), time_update= now(),user_insert_idefix = login2idefix(_user) ;	
--	select * from  tmp_list_strojceny
	update tmp_list_strojceny a set idefix_strojmod= b.idefix_mod_new from tmp_list_strojmod_vazba  b where a.idefix_strojmod = b.idefix ;
--    RETURN 0;
    																	   
    insert into list_stroj select * from tmp_stroj_insert ;
            
    insert into  list_strojmod               select * from tmp_list_strojmod              ;
    insert into  list_strojmodbarevnost      select * from tmp_list_strojmodbarevnost     ;
    insert into  list_strojinkoust           select * from tmp_list_strojinkoust          ;
    insert into  list_strojinkoustbarevnost  select * from tmp_list_strojinkoustbarevnost ;
    insert into  list_strojceny              select * from tmp_list_strojceny             ;

    return idefix_new;
end;
$$LANGUAGE plpgsql;

create or replace function fce_list_stroj_del(_idefix bigint) returns text as $$
    declare cret text := '';
    BEGIN
        delete from list_stroj                 where idefix = _idefix;
        delete from list_strojmod              where idefix_stroj = _idefix;
        delete from list_strojmodbarevnost     where idefix_stroj = _idefix;
        delete from list_strojinkoust          where idefix_stroj = _idefix;
        delete from list_strojinkoustbarevnost where idefix_stroj = _idefix;
        delete from list_strojceny             where idefix_stroj = _idefix;
    
    return 'ahoj stroji';
    END;

$$LANGUAGE plpgsql;



create or replace function fce_list_dodavatel_insert(ctxt text) returns bigint as $$
 declare nret bigint := 0 ;
 BEGIN
    insert into list_dodavatel(nazev) select neco from (select ctxt as neco ) a where not exists(select * from list_dodavatel b where a.neco = b.nazev ) ;
    select idefix into nret from list_dodavatel where nazev = ctxt limit 1;
    update list_dodavatel set kod = (select kod from list_dodavatel where kod > 0 order by kod desc limit 1) +10 where kod is null ;
	update list_dodavatel set ico = '00000000' where ico is null ;
   return nret; 
 END;
$$LANGUAGE plpgsql;

