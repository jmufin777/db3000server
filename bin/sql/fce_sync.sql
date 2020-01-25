CREATE OR REPLACE FUNCTION vl_sync (ctable varchar(64) DEFAULT 'nic')
        RETURNS text
        AS $$
DECLARE
    atab text[];
    ifx_zak bigint := 0;
    ifx_user bigint := 0;
    czak bigint := 0;
    cq text := '';
    cq2 text := '';
    r record;
    _poradi int := 0;
    _test text := '';
BEGIN
    raise notice ' Tabulka %', ctable;
    atab = string_to_array(ctable, '_');
    raise notice ' Tabulka %', atab[3];
    ifx_user := atab[3]::bigint;
    cq := 'select max(idefix_zak) as _ifx from ' || ctable;
    raise notice ' Tabulka %', cq;

    select tablename  into _test from pg_tables  where tablename ilike trim(ctable);
    if _test is null THEN
        RETURN 'Tabulka [' || ctable || '] neexistuje';
    end if;


    FOR r IN EXECUTE cq LOOP
        ifx_zak := r._ifx;
    END LOOP;
    raise notice ' Tabulka %', ifx_zak;
    IF ifx_zak IS NULL OR ifx_zak = 0 OR TRUE THEN
        raise notice ' Tabulka 1 %', ifx_zak;
        FOR r IN
        SELECT
            *
        FROM
            zak_log_open
        WHERE
            idefix_user = ifx_user
        ORDER BY
            cas DESC
        LIMIT 1 LOOP
            raise notice ' Tabulka 2 %', ifx_zak;
            ifx_zak := idefix_zak (r.cislozakazky);
            raise notice ' Tabulka 3 %', ifx_zak;
            IF (r.idefix_zak = 0 OR r.idefix_zak IS NULL) THEN
                UPDATE
                    zak_log_open
                SET
                    idefix_zak = ifx_zak
                WHERE
                    idefix = r.idefix;
            END IF;
        END LOOP;
    END IF;
    SELECT
        count(*) INTO _poradi
    FROM
        zak_t_items
    WHERE
        idefix_zak = ifx_zak;
    --poradi je nutne vyplnit
    cq := 'select *  from ' || ctable || ' where obsah::text >' || quote_literal('') || ' and idefix_src is null order by idefix';
    FOR r IN EXECUTE cq LOOP
        _poradi := _poradi + 1;
        cq2 := 'update ' || ctable || ' set idefix_src= ' || r.idefix || ', idefix_zak = ' || ifx_zak || ' where idefix = ' || r.idefix;
        EXECUTE cq2;
        raise notice ' cq2 , % ', cq2;
        INSERT INTO zak_t_items (idefix, nazev, obsah, kcks, ks, naklad, marze, prodej, marze_pomer, expedice_datum, expedice_cas, datum, poradi, idefix_tmp, idefix_zak, idefix_src, id_src, active, time_insert, time_update, user_insert_idefix, user_update_idefix, idefix_dod, idefix_prace, d_fak, vzor, old_kod, old_kodv, status, vl, vl_id, vl_znacka, poradi2)
        VALUES (r.idefix, r.nazev, r.obsah, r.kcks, r.ks, r.naklad, r.marze, r.prodej, r.marze_pomer, r.expedice_datum, r.expedice_cas, r.datum, _poradi, r.idefix_tmp, ifx_zak, r.idefix, r.id_src, r.active, now(), now(), ifx_user, ifx_user, r.idefix_dod, r.idefix_prace, r.d_fak, r.vzor, r.old_kod, r.old_kodv, r.status, r.vl, r.vl_id, r.vl_znacka, r.poradi2);
    END LOOP;

    /*
     id                 
     idefix             
     kod                
     nazev              
     obsah              
     kcks               
     ks                 
     naklad             
     marze              
     prodej             
     marze_pomer        
     expedice_datum     
     expedice_cas       
     datum              
     poradi             
     idefix_tmp         
     idefix_zak         
     idefix_src         
     id_src             
     active             
     time_insert        
     time_update        
     user_insert_idefix 
     user_update_idefix 
     idefix_dod         
     idefix_prace       
     d_fak              
     faktura            
     vzor               
     old_kod            
     old_kodv           
     status             
     vl                 
     vl_id              
     vl_znacka          
     poradi2            
--More--
     */
    --select calc_my_9_zak9685091619
    --select * from zak_log_open where idefix_user = 9 order by cas desc ;
    --select * from zak_log_open where idefix_user = 9 order by cas desc ;
    UPDATE
        zak_t_items a
    SET
        vl_id = b.vl_id,
        vl_znacka = b.vl_znacka,
        poradi2 = b.poradi2
    FROM
        zak_t_vl_v b
    WHERE
        a.idefix = b.idefix_item
        AND (a.vl_id IS NULL
            OR a.vl_id <> b.vl_id);
    cq2 := 'update ' || ctable || ' a set vl_id=b.vl_id,vl_znacka=b.vl_znacka,poradi2=b.poradi2  from zak_t_vl_v b where  a.idefix=b.idefix_item  
         
         and (a.vl_id is null or a.vl_id<>b.vl_id )
         ;';
    EXECUTE cq2;
    RETURN ifx_zak::text;
END;
$$
LANGUAGE PLPGSQL;

SELECT
    vl_sync ('calc_my_9_zak2306538750');

