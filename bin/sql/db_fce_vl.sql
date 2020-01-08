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
    if _idefix_item=-1 and _idefix_zak>0 then
        update zak_vl_last  set  pocet=(select count(*) from zak_t_items where idefix_zak=_idefix_zak and vl_id>0 and status in (1,3,4,5,6,7,8,9))
        ,vl_id= (select vl_id from zak_t_items where idefix_zak = _idefix_zak and vl_id>0 order by vl_id desc limit 1 )
        ,vl_znacka= (select vl_znacka from zak_t_items where idefix_zak = _idefix_zak and vl_id>0 order by vl_id desc limit 1 )
        ,idefix_item= (select idefix from zak_t_items where idefix_zak = _idefix_zak and vl_id>0 order by vl_id desc limit 1 )
         WHERE idefix_zak = _idefix_zak;

        update zak_t_vl_v a  set poradi2=0 where status = 2 and poradi2>0 and idefix_zak=_idefix_zak;
        update zak_t_vl_v a  set poradi2= b.rn from (
        select idefix_zak, datumodeslani,vl_id,idefix_item, row_number() over(partition by idefix_zak order by datumodeslani) as rn from zak_t_vl_v where status = 1 
        ) b where a.idefix_zak=b.idefix_zak and a.idefix_item = b.idefix_item 
        and a.idefix_zak =_idefix_zak;

        return 'Odecteno';
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
    end if;
    update zak_t_vl_v a set vl_id=b.vl_id, vl_znacka=b.vl_znacka,status=b.status from zak_t_items b  where a.idefix_item=b.idefix and a.idefix_item=_idefix_item;
    update zak_t_vl_v a set vl_id=b.vl_id, vl_znacka=b.vl_znacka,status=b.status from zak_t_items b  where a.idefix_item=b.idefix and ( 
        (a.vl_id is null or a.vl_id=0) and b.vl_id >0
        ) ;
        --update zak_t_vl_v a  set poradi2=0 where status = 2 and poradi2>0;
        update zak_t_vl_v a  set poradi2=0 where status = 2 and poradi2>0 and idefix_zak=_idefix_zak;
        update zak_t_vl_v a  set poradi2= b.rn from (
        select idefix_zak, datumodeslani,vl_id,idefix_item, row_number() over(partition by idefix_zak order by datumodeslani) as rn from zak_t_vl_v where status = 1 
        ) b where a.idefix_zak=b.idefix_zak and a.idefix_item = b.idefix_item 
        and a.idefix_zak =_idefix_zak;
       --zak_vl_last 
    return cRet;
    end;   
$$LANGUAGE PLPGSQL;
--update  zak_t_items set vl_id=null,vl_znacka=null where idefix_zak=13634216 ;
--delete 

--select vl_set(13634216,13634217);
--select vl_set(13634216,13634219);

--select idefix,vl_id,vl_znacka  from zak_t_items where idefix_zak=13634216 ;
--select * from zak_vl_last;
--select * from list2_vl where id > (select id from zak_vl_last where idefix_zak=13634216 limit 1) order by id limit 1 ;
/*
                                           Tabulka "public.zak_form_xl_poradi"
      Sloupec      |              Typ               |                            Modifikátory                            
-------------------+--------------------------------+--------------------------------------------------------------------
 id                | bigint                         | not null implicitně nextval('zak_form_xl_poradi_id_seq'::regclass)
 id_leva           | integer                        | 
 poradi            | integer                        | implicitně 0
 vyber_od          | date                           | 
 vyber_do          | date                           | 
 stroj             | text                           | 
 tisk_plan         | timestamp(0) without time zone | 
 tisk_real         | timestamp(0) without time zone | 
 m2_tiskar         | numeric(10,2)                  | 
 tisk_poc          | timestamp(0) without time zone | 
 tisk_endd         | date                           | implicitně (now() + '1 day'::interval)
 tisk_endh         | time(0) without time zone      | implicitně '17:00:00'::time without time zone
 tisk_pocd         | date                           | implicitně (now() + '1 day'::interval)
 tisk_poch         | time(0) without time zone      | implicitně '09:00:00'::time without time zone
 knih_cas_den      | timestamp(0) without time zone | 
 dat_expedice      | timestamp(0) without time zone | 
 knih_cas_den_real | timestamp(0) without time zone | 
 prostoj           | text                           | 
 id_prostoj        | integer                        | 
 login_tisk        | text                           | 
 login_vyroba      | text                           | 
 login_kniha       | text                           | 
 login_expedice    | text                           | 
 posun             | integer                        | implicitně 0
 hod_b             | numeric(10,2)                  | implicitně 0
 m2_tiskar_orig    | numeric(15,2)                  | 
 m2_dat_zmeny      | timestamp without time zone    | 
 m2_login_zmeny    | text                           | 
 exp_baliky        | integer                        | implicitně 0
Indexy:
    "zak_form_xl_poradi_id_leva_idx" UNIQUE, btree (id_leva)
    "zak_form_xl_poradi_dat_expedice_idx" btree (dat_expedice)
    "zak_form_xl_poradi_stroj_idx" btree (stroj)
    "zak_form_xl_poradi_tisk_pocd_tisk_poch_stroj_idx" btree (tisk_pocd, tisk_poch, stroj)
    "zak_form_xl_poradi_tisk_real_idx" btree (tisk_real)

*/