CREATE OR REPLACE FUNCTION vl_set (_idefix_zak bigint DEFAULT 0, _idefix_item bigint DEFAULT 0)
    RETURNS text
    AS $$
DECLARE
    r record;
    DECLARE r2 record;
    DECLARE cRet text := '';
    DECLARE _vl_last int := 0;
    DECLARE _vl_cur int := 0;
    DECLARE _vl_lastname text := '';
    DECLARE _vl_curname text := '';
BEGIN
    DELETE FROM zak_t_vl_v a
    WHERE NOT EXISTS (
            SELECT
                *
            FROM
                zak_t_items b
            WHERE
                a.idefix_item = b.idefix);
    -- Navazat na soubory a smazat
    IF _idefix_zak = 0 AND _idefix_item = 0 THEN
        -- opravy
        UPDATE
            zak_vl_last a
        SET
            vl_id = b.vlnew
        FROM (
            SELECT
                vlnew,
                a.idefix_zak
            FROM
                zak_vl_last a
                JOIN (
                    SELECT
                        max(vl_id) AS vlnew,
                        idefix_zak
                    FROM
                        zak_T_items
                    WHERE
                        vl_id > 0
                    GROUP BY
                        idefix_zak) b ON a.idefix_zak = b.idefix_zak
                WHERE
                    a.vl_id < b.vlnew) b
    WHERE
        a.idefix_zak = b.idefix_zak;
        UPDATE
            zak_t_items a
        SET
            vl_id = 0,
            vl_znacka = '',
            status = 0
        WHERE
            vl_id > 0
            AND NOT EXISTS (
                SELECT
                    *
                FROM
                    zak_t_vl_v b
                WHERE
                    a.idefix = b.idefix_item);
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
            --and a.idefix_zak= _idefix_zak
            AND (a.vl_id IS NULL
                OR a.vl_id <> b.vl_id);
    END IF;
    IF _idefix_zak = 0 THEN
        RETURN 'nic';
    END IF;
    IF _idefix_item = - 1 AND _idefix_zak > 0 THEN
        UPDATE
            zak_t_items
        SET
            vl_id = 0,
            vl_znacka = ''
        WHERE
            idefix_zak = _idefix_zak
            AND obsah IS NULL;
        UPDATE
            zak_vl_last
        SET
            pocet = (
                SELECT
                    count(*)
                FROM
                    zak_t_items
                WHERE
                    idefix_zak = _idefix_zak
                    AND vl_id > 0
                    AND status IN (1, 3, 4, 5, 6, 7, 8, 9)
                    AND obsah::text > ''),
            vl_id = (
                SELECT
                    vl_id
                FROM
                    zak_t_items
                WHERE
                    idefix_zak = _idefix_zak
                    AND vl_id > 0
                ORDER BY
                    vl_id DESC
                LIMIT 1),
        vl_znacka = (
            SELECT
                vl_znacka
            FROM
                zak_t_items
            WHERE
                idefix_zak = _idefix_zak
                AND vl_id > 0
            ORDER BY
                vl_id DESC
            LIMIT 1),
    idefix_item = (
        SELECT
            idefix
        FROM
            zak_t_items
        WHERE
            idefix_zak = _idefix_zak
            AND vl_id > 0
        ORDER BY
            vl_id DESC
        LIMIT 1)
WHERE
    idefix_zak = _idefix_zak;
        UPDATE
            zak_t_vl_v a
        SET
            poradi2 = 0
        WHERE
            status = 2
            AND poradi2 > 0
            AND idefix_zak = _idefix_zak;
        UPDATE
            zak_t_vl_v a
        SET
            poradi2 = b.rn
        FROM (
            SELECT
                idefix_zak,
                datumodeslani,
                vl_id,
                idefix_item,
                row_number() OVER (PARTITION BY idefix_zak ORDER BY datumodeslani) AS rn
            FROM
                zak_t_vl_v
            WHERE
                status = 1) b
    WHERE
        a.idefix_zak = b.idefix_zak
            AND a.idefix_item = b.idefix_item
            AND a.idefix_zak = _idefix_zak;
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
            AND a.idefix_zak = _idefix_zak
            AND (a.vl_id IS NULL
                OR a.vl_id <> b.vl_id);
        RETURN 'Odecteno';
    END IF;
    SELECT
        * INTO _vl_last
    FROM
        zak_vl_last
    WHERE
        idefix_zak = _idefix_zak;
    IF NOT found THEN
        raise notice '0';
        UPDATE
            zak_t_items
        SET
            vl_id = 0,
            vl_znacka = ''
        WHERE
            idefix_zak = _idefix_zak
            AND obsah IS NULL;
        FOR r IN
        SELECT
            *
        FROM
            list2_vl
        ORDER BY
            id
        LIMIT 1 LOOP
            raise notice '00';
            _vl_cur := r.id;
            _vl_curname := r.nazev;
            INSERT INTO zak_vl_last (idefix_zak, idefix_item, vl_id, vl_znacka, pocet)
            VALUES (_idefix_zak, _idefix_item, _vl_cur, _vl_curname, 1);
            UPDATE
                zak_t_items
            SET
                vl_znacka = _vl_curname,
                vl_id = _vl_cur
            WHERE
                idefix = _idefix_item;
        END LOOP;
    END IF;
    IF found THEN
        -- toje ze nejaky list uz existuje
        raise notice '1';
        UPDATE
            zak_t_items
        SET
            vl_id = 0,
            vl_znacka = ''
        WHERE
            idefix_zak = _idefix_zak
            AND obsah IS NULL;
        UPDATE
            zak_t_items a
        SET
            vl_id = b.vl_id,
            vl_znacka = b.vl_znacka
        FROM
            zak_t_vl_v b
        WHERE
            a.idefix = b.idefix_item
            AND (a.vl_id IS NULL
                OR a.vl_znacka IS NULL)
            AND a.idefix_zak = _idefix_zak
            AND a.idefix_zak = b.idefix_zak;
        FOR r2 IN
        SELECT
            *
        FROM
            zak_t_items
        WHERE
            idefix = _idefix_item LOOP
                raise notice '2';
                IF r2.vl_id IS NOT NULL AND r2.vl_id > 0 THEN
                    raise notice '3 %', r2.vl_id;
                    UPDATE
                        zak_vl_last
                    SET
                        pocet = (
                            SELECT
                                count(*)
                            FROM
                                zak_t_items
                            WHERE
                                idefix_zak = _idefix_zak
                                AND vl_id > 0
                                AND status IN (1, 3, 4, 5, 6, 7, 8, 9)
                                AND obsah::text > '')
                    WHERE
                        idefix_zak = _idefix_zak;
                    CONTINUE;
                ELSE
                    raise notice '4';
                    FOR r IN
                    SELECT
                        *
                    FROM (
                        SELECT
                            1 AS idq,
                            *
                        FROM
                            list2_vl
                        WHERE
                            id > (
                                SELECT
                                    vl_id
                                FROM
                                    zak_vl_last
                                WHERE
                                    idefix_zak = _idefix_zak
                                LIMIT 1)
                        ORDER BY
                            id
                        LIMIT 1) a
                UNION
                SELECT
                    *
                FROM (
                    SELECT
                        2 AS idq,
                        *
                    FROM
                        list2_vl
                    ORDER BY
                        id
                    LIMIT 1) b
            ORDER BY
                idq,
                id
            LIMIT 1 LOOP
                _vl_cur := r.id;
                _vl_curname := r.nazev;
                --//insert into zak_vl_last (idefix_zak,idefix_item,vl_id,vl_znacka,pocet)  values (_idefix_zak,_idefix_item,_vl_cur,_vl_curname,1);
                raise notice '5 %', _vl_cur;
                UPDATE
                    zak_t_items
                SET
                    vl_znacka = _vl_curname,
                    vl_id = _vl_cur
                WHERE
                    idefix = _idefix_item;
                UPDATE
                    zak_vl_last
                SET
                    vl_znacka = _vl_curname,
                    vl_id = _vl_cur,
                    pocet = (
                        SELECT
                            count(*)
                        FROM
                            zak_t_items
                        WHERE
                            idefix_zak = _idefix_zak
                            AND vl_id > 0
                            AND status IN (1, 3, 4, 5, 6, 7, 8, 9)
                            AND obsah::text > '')
                WHERE
                    idefix_zak = _idefix_zak;
            END LOOP;
                    --insert into zak_vl_last (idefix_zak,id_vl,nazev,pocet)  values (_idefix_zak,_vl_cur,_vl_curname,1);
                END IF;
            END LOOP;
    END IF;
    UPDATE
        zak_t_items
    SET
        vl_id = 0,
        vl_znacka = ''
    WHERE
        idefix_zak = _idefix_zak
        AND obsah IS NULL;
    UPDATE
        zak_t_vl_v a
    SET
        vl_id = b.vl_id,
        vl_znacka = b.vl_znacka,
        status = b.status
    FROM
        zak_t_items b
    WHERE
        a.idefix_item = b.idefix
        AND a.idefix_item = _idefix_item;
    UPDATE
        zak_t_vl_v a
    SET
        vl_id = b.vl_id,
        vl_znacka = b.vl_znacka,
        status = b.status
    FROM
        zak_t_items b
    WHERE
        a.idefix_item = b.idefix
        AND ((a.vl_id IS NULL
                OR a.vl_id = 0)
            AND b.vl_id > 0);
    --update zak_t_vl_v a  set poradi2=0 where status = 2 and poradi2>0;
    UPDATE
        zak_t_vl_v a
    SET
        poradi2 = 0
    WHERE
        status = 2
        AND poradi2 > 0
        AND idefix_zak = _idefix_zak;
    UPDATE
        zak_t_vl_v a
    SET
        poradi2 = b.rn
    FROM (
        SELECT
            idefix_zak,
            datumodeslani,
            vl_id,
            idefix_item,
            row_number() OVER (PARTITION BY idefix_zak ORDER BY datumodeslani) AS rn
        FROM
            zak_t_vl_v
        WHERE
            status = 1) b
WHERE
    a.idefix_zak = b.idefix_zak
    AND a.idefix_item = b.idefix_item
    AND a.idefix_zak = _idefix_zak;
    UPDATE
        zak_vl_last
    SET
        vl_znacka = _vl_curname,
        vl_id = _vl_cur,
        pocet = (
            SELECT
                count(*)
            FROM
                zak_t_items
            WHERE
                idefix_zak = _idefix_zak
                AND vl_id > 0
                AND status IN (1, 3, 4, 5, 6, 7, 8, 9)
                AND obsah::text > '')
    WHERE
        idefix_zak = _idefix_zak;
    --zak_vl_last
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
        AND a.idefix_zak = _idefix_zak
        AND (a.vl_id IS NULL
            OR a.vl_id <> b.vl_id);
    RETURN cRet;
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION idefix_vl (_idefix_item bigint DEFAULT 0)
    RETURNS bigint
    AS $$
DECLARE
    nRet bigint := 0;
BEGIN
    --return 0;
    SELECT
        idefix INTO nRet
    FROM
        zak_t_vl_v
    WHERE
        idefix_item = _idefix_item
    LIMIT 1;
    IF NOT found THEN
        nRet := 0;
    END IF;
    RETURN nRet;
END;
$$
LANGUAGE PLPGSQL
IMMUTABLE;

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
