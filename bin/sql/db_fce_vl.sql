create or replace function vl_set( _idefix_zak bigint default 0,  _idefix_item bigint default 0) returns text as $$
    declare r record ;
    declare r2 record ;
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
    raise notice '0';
        for r in select * from list2_vl order by id limit 1 loop
        raise notice '00';
             _vl_cur := r.id;
            _vl_curname := r.nazev;
            insert into zak_vl_last (idefix_zak,idefix_item,vl_id,vl_znacka,pocet)  values (_idefix_zak,_idefix_item,_vl_cur,_vl_curname,1);
            update zak_t_items set vl_znacka= _vl_curname, vl_id = _vl_cur where idefix=_idefix_item;
        end loop;
    end if;
    if found then  -- toje ze nejaky list uz existuje
        raise notice '1';
        for r2 in select * from zak_t_items where idefix = _idefix_item loop
           raise notice '2'; 
            if r2.vl_id is not null and r2.vl_id>0 then
                raise notice '3 %',r2.vl_id;
                update zak_vl_last  set pocet=(select count(*) from zak_t_items where idefix_zak=_idefix_zak and vl_id>0  and status in (1,3,4,5,6,7,8,9)) WHERE idefix_zak = _idefix_zak;
                continue;
                else 
            raise notice '4';
            for r in select * from list2_vl where id>(select vl_id from zak_vl_last where idefix_zak=_idefix_zak limit 1) order by id limit 1 loop
                _vl_cur := r.id;
                _vl_curname := r.nazev;
                --//insert into zak_vl_last (idefix_zak,idefix_item,vl_id,vl_znacka,pocet)  values (_idefix_zak,_idefix_item,_vl_cur,_vl_curname,1);
                raise notice '5 %', _vl_cur;
                update zak_t_items set vl_znacka= _vl_curname, vl_id = _vl_cur where idefix=_idefix_item;
                update zak_vl_last  set vl_znacka = _vl_curname, vl_id=_vl_cur, pocet=(select count(*) from zak_t_items where idefix_zak=_idefix_zak and vl_id>0 and status in (1,3,4,5,6,7,8,9)) WHERE idefix_zak = _idefix_zak;
            end loop;
            --insert into zak_vl_last (idefix_zak,id_vl,nazev,pocet)  values (_idefix_zak,_vl_cur,_vl_curname,1);
            end if;
        end loop;
    end if;q
       --zak_vl_last 
    return cRet;
    end;   
$$LANGUAGE PLPGSQL;
--update  zak_t_items set vl_id=null,vl_znacka=null where idefix_zak=13634216 ;
--delete 
select vl_set(13634216,13634217);
select vl_set(13634216,13634219);

select idefix,vl_id,vl_znacka  from zak_t_items where idefix_zak=13634216 ;
select * from zak_vl_last;
select * from list2_vl where id > (select id from zak_vl_last where idefix_zak=13634216 limit 1) order by id limit 1 ;
