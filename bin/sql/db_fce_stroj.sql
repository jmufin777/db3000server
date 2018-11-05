create or replace FUNCTION fce_list_stroj_copy(_idefix bigint, _user varchar(50) default 'mares') returns bigint as $$
   declare  idefix_new bigint := 0 ;
 
begin 
	drop table if exists tmp_stroj_insert ;
	
    drop table if exists tmp_list_strojmod              ;
    drop table if exists tmp_list_strojmodbarevnost     ;
    drop table if exists tmp_list_strojinkoust          ;
    drop table if exists tmp_list_strojinkoustbarevnost ;
    drop table if exists tmp_list_strojceny             ;
    
																		   
	create table tmp_stroj_insert                without oids as  select * from   list_stroj                  where idefix = _idefix limit 1;
    
    create table tmp_list_strojmod               without oids as  select * from   list_strojmod               where idefix_stroj = _idefix;
    create table tmp_list_strojmodbarevnost      without oids as  select * from   list_strojmodbarevnost      where idefix_stroj = _idefix;
    create table tmp_list_strojinkoust           without oids as  select * from   list_strojinkoust           where idefix_stroj = _idefix;
    create table tmp_list_strojinkoustbarevnost  without oids as  select * from   list_strojinkoustbarevnost  where idefix_stroj = _idefix;
    create table tmp_list_strojceny              without oids as  select * from   list_strojceny              where idefix_stroj = _idefix;
	
	update tmp_stroj_insert set id = nextval('list_stroj_id_seq'::regclass), idefix=nextval('list2_seq'::regclass) ,time_insert = now(), time_update= now(),user_insert_idefix = login2idefix(_user) ;
    update tmp_stroj_insert set kod = (select max(kod)+1 from list_stroj);
	select idefix into idefix_new from tmp_stroj_insert order by id desc limit 1;

    update tmp_list_strojmod                  set idefix_stroj = idefix_new,id = nextval('list_strojmod_id_seq'::regclass), idefix=nextval('list2_seq'::regclass) ,time_insert = now(), time_update= now(),user_insert_idefix = login2idefix(_user) ;
    update tmp_list_strojmodbarevnost         set idefix_stroj = idefix_new,id = nextval('list_strojmodbarevnost_id_seq'::regclass), idefix=nextval('list2_seq'::regclass) ,time_insert = now(), time_update= now(),user_insert_idefix = login2idefix(_user) ;
    update tmp_list_strojinkoust              set idefix_stroj = idefix_new,id = nextval('list_strojinkoust_id_seq'::regclass), idefix=nextval('list2_seq'::regclass) ,time_insert = now(), time_update= now(),user_insert_idefix = login2idefix(_user) ;
    update tmp_list_strojinkoustbarevnost     set idefix_stroj = idefix_new,id = nextval('list_strojinkoustbarevnost_id_seq'::regclass), idefix=nextval('list2_seq'::regclass) ,time_insert = now(), time_update= now(),user_insert_idefix = login2idefix(_user) ;	
	update tmp_list_strojceny                 set idefix_stroj = idefix_new,id = nextval('list_strojceny_id_seq'::regclass), idefix=nextval('list2_seq'::regclass) ,time_insert = now(), time_update= now(),user_insert_idefix = login2idefix(_user) ;	
    																	   
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

create or replace function fce_list2_mat_vlastnost_insert(ctxt text) returns bigint as $$
 declare nret bigint := 0 ;
 BEGIN
   insert into list2_matvlastnosti(nazev) select neco from (select ctxt as neco ) a where not exists(select * from list2_matvlastnosti b where a.neco = b.nazev ) ;
   select idefix into nret from list2_matvlastnosti where nazev = ctxt limit 1;
   update list2_matvlastnosti set kod = (select kod from list2_matvlastnosti where kod > 0 order by kod desc limit 1) +10 where kod is null ;
   return nret; 
 END;
$$LANGUAGE plpgsql;

create or replace function fce_list2_mat_vyrobce_insert(ctxt text) returns bigint as $$
 declare nret bigint := 0 ;
 BEGIN
    insert into list2_matvyrobce(nazev) select neco from (select ctxt as neco ) a where not exists(select * from list2_matvyrobce b where a.neco = b.nazev ) ;
    select idefix into nret from list2_matvyrobce where nazev = ctxt limit 1;
    update list2_matvyrobce set kod = (select kod from list2_matvyrobce where kod > 0 order by kod desc limit 1) +10 where kod is null ;
	    update list2_matvyrobce set vyrobce = nazev where vyrobce is null;
   return nret; 
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

create or replace function fce_list_mat_clean(ctxt text='') returns bigint as $$
 declare nret bigint := 0 ;
 BEGIN
 if ctxt = '' or ctxt ='barva' then
  raise notice '% ' ,ctxt ;
  delete from list_mat_barva a where not exists (
  select * from (
  select min(idefix) as idefix from list_mat_barva group by idefix_mat,idefix_barva 
  ) b where a.idefix = b.idefix);
 end if;  
 if ctxt = '' or ctxt ='potisknutelnost' then
 raise notice '% ' ,ctxt ;
  delete from list_mat_potisknutelnost a where not exists (
  select * from (
  select min(idefix) as idefix from list_mat_potisknutelnost group by idefix_mat,idefix_potisknutelnost 
  ) b where a.idefix = b.idefix);
 end if;  
 if ctxt = '' or ctxt ~'vlastnost' then 
 raise notice '% ' ,ctxt ;
  delete from list_mat_vlastnosti a where not exists (
  select * from (
  select min(idefix) as idefix from list_mat_vlastnosti group by idefix_mat,idefix_vlastnost
  ) b where a.idefix = b.idefix);
 end if; 
if ctxt = '' or ctxt ~'stroj' then 
raise notice '% ' ,ctxt ;
delete from list_mat_stroj a where not exists (
  select * from (
  select min(idefix) as idefix from list_mat_stroj group by idefix_mat,idefix_stroj
  ) b where a.idefix = b.idefix);
end if; 

if ctxt = '' or ctxt ~'strojskup' then 
raise notice '% ' ,ctxt ;
delete from list_mat_strojskup a where not exists (
  select * from (
  select min(idefix) as idefix from list_mat_strojskup group by idefix_mat,idefix_strojskup
  ) b where a.idefix = b.idefix);
 end if;

return nret; 
 END;
$$LANGUAGE plpgsql;  
 --select * from fce_list_mat_copy(655)													   
 --select * from list_mat_vlastnosti where idefix_mat = 1274
 