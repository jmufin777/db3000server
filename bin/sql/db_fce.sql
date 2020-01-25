CREATE OR REPLACE FUNCTION fce_modules_sync ()
    RETURNS text
    AS $$
BEGIN
    UPDATE
        list_modules
    SET
        idefix = id
    WHERE
        idefix = 0
        OR idefix IS NULL;
    UPDATE
        list_modules a
    SET
        idefix = b.idefix
    FROM (
        SELECT
            idefix,
            modul,
            nazev
        FROM
            list_modules_fix a
        WHERE
            idefix > 0
            AND NOT EXISTS (
                SELECT
                    *
                FROM
                    list_modules b
                WHERE
                    a.idefix = b.idefix)
                AND EXISTS (
                    SELECT
                        *
                    FROM
                        list_modules b
                    WHERE
                        a.modul = b.modul
                        AND a.nazev = b.nazev
                        AND a.modul > ''
                        AND a.nazev > '')) b
WHERE
    a.modul = b.modul;
    DELETE FROM list_modules_fix a
    WHERE modul > ''
        AND NOT EXISTS (
            SELECT
                *
            FROM ( SELECT DISTINCT ON (modul)
                    *
                FROM
                    list_modules_fix
                WHERE
                    modul > ''
                ORDER BY
                    modul,
                    idefix) b
            WHERE
                a.idefix = b.idefix)
        AND NOT EXISTS (
            SELECT
                *
            FROM
                list_modules_groups b
            WHERE
                a.idefix = b.idefix_module);
    DELETE FROM list_modules a
    WHERE modul > ''
        AND NOT EXISTS (
            SELECT
                *
            FROM ( SELECT DISTINCT ON (modul)
                    *
                FROM
                    list_modules
                WHERE
                    modul > ''
                ORDER BY
                    modul,
                    idefix) b
            WHERE
                a.idefix = b.idefix);
        INSERT INTO list_modules (nazev, modul, category, popis, items, time_insert, time_update, user_insert, user_update, idefix)
    SELECT
        nazev,
        modul,
        category,
        popis,
        items,
        time_insert,
        time_update,
        user_insert,
        user_update,
        idefix
    FROM
        list_modules_fix a
    WHERE
        NOT EXISTS (
            SELECT
                *
            FROM
                list_modules c
            WHERE
                a.idefix = c.idefix)
        --and EXISTS   (select * from list_modules_groups b where a.idefix = b.idefix_module )
;
    UPDATE
        list_modules_fix a
    SET
        nazev = b.nazev
    FROM
        list_modules b
    WHERE
        b.nazev > ''
        AND a.nazev != b.nazev
        AND a.idefix = b.idefix
        AND a.modul = b.modul;
    RETURN 'modules sync OK ';
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION fce_user_fullname (_idefix bigint)
    RETURNS varchar( 100 )
    AS $$
DECLARE
    txt_ret text := 'Neuveden';
BEGIN
    SELECT
        jmeno || ' ' || prijmeni AS fullname INTO txt_ret
    FROM
        list_users a
    WHERE
        a.idefix = _idefix;
    IF txt_ret IS NULL THEN
        txt_ret := 'Neuveden';
    END IF;
    RETURN txt_ret;
END;
$$
LANGUAGE PLPGSQL
IMMUTABLE;

CREATE OR REPLACE FUNCTION idefix2fullname (_idefix bigint)
    RETURNS varchar( 100
)
    AS $$
DECLARE
    txt_ret text := 'Neuveden';
BEGIN
    SELECT
        jmeno || ' ' || prijmeni AS fullname INTO txt_ret
    FROM
        list_users a
    WHERE
        a.idefix = _idefix;
    IF txt_ret IS NULL THEN
        txt_ret := 'Neuveden';
    END IF;
    RETURN txt_ret;
END;
$$
LANGUAGE PLPGSQL
IMMUTABLE;

CREATE OR REPLACE FUNCTION id2fullname (_idefix bigint)
    RETURNS varchar( 100
)
    AS $$
DECLARE
    txt_ret text := 'Neuveden';
BEGIN
    SELECT
        jmeno || ' ' || prijmeni AS fullname INTO txt_ret
    FROM
        list_users a
    WHERE
        a.id = _idefix;
    IF txt_ret IS NULL THEN
        txt_ret := 'Neuveden';
    END IF;
    RETURN txt_ret;
END;
$$
LANGUAGE PLPGSQL
IMMUTABLE;

CREATE OR REPLACE FUNCTION login2idefix (_login varchar)
    RETURNS bigint
    AS $$
DECLARE
    idx int := - 1;
BEGIN
    SELECT
        idefix INTO idx
    FROM
        list_users
    WHERE
        LOGIN = _login
    LIMIT 1;
    RETURN idx;
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION login2id (_login varchar)
    RETURNS bigint
    AS $$
DECLARE
    idx int := - 1;
BEGIN
    SELECT
        id INTO idx
    FROM
        list_users
    WHERE
        LOGIN = _login
    LIMIT 1;
    RETURN idx;
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION id2login (_id bigint)
    RETURNS varchar( 50
)
    AS $$
DECLARE
    _lg varchar(50);
BEGIN
    SELECT
        LOGIN INTO _lg
    FROM
        list_users
    WHERE
        id = _id
    LIMIT 1;
    RETURN _lg;
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION idefix2login (_id bigint)
    RETURNS varchar( 50
)
    AS $$
DECLARE
    _lg varchar(50);
BEGIN
    SELECT
        LOGIN INTO _lg
    FROM
        list_users
    WHERE
        idefix = _id
    LIMIT 1;
    RETURN _lg;
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION year (timestamp)
    RETURNS int
    AS $$
BEGIN
    RETURN extract(year FROM $1);
END;
$$
LANGUAGE PLPGSQL
IMMUTABLE;

CREATE OR REPLACE FUNCTION year (timestamp WITH time zone)
    RETURNS int
    AS $$
BEGIN
    RETURN extract(year FROM $1);
END;
$$
LANGUAGE PLPGSQL
IMMUTABLE;

CREATE OR REPLACE FUNCTION month (timestamp)
    RETURNS int
    AS $$
BEGIN
    RETURN extract(month FROM $1);
END;
$$
LANGUAGE PLPGSQL
IMMUTABLE;

CREATE OR REPLACE FUNCTION month (timestamp WITH time zone)
    RETURNS int
    AS $$
BEGIN
    RETURN extract(month FROM $1);
END;
$$
LANGUAGE PLPGSQL
IMMUTABLE;

CREATE OR REPLACE FUNCTION day (timestamp)
    RETURNS int
    AS $$
BEGIN
    RETURN extract(day FROM $1);
END;
$$
LANGUAGE PLPGSQL
IMMUTABLE;

CREATE OR REPLACE FUNCTION day (timestamp WITH time zone)
    RETURNS int
    AS $$
BEGIN
    RETURN extract(day FROM $1);
END;
$$
LANGUAGE PLPGSQL
IMMUTABLE;

CREATE OR REPLACE FUNCTION dow (timestamp)
    RETURNS int
    AS $$
BEGIN
    RETURN extract(dow FROM $1);
END;
$$
LANGUAGE PLPGSQL
IMMUTABLE;

CREATE OR REPLACE FUNCTION dow (timestamp WITH time zone)
    RETURNS int
    AS $$
BEGIN
    RETURN extract(dow FROM $1);
END;
$$
LANGUAGE PLPGSQL
IMMUTABLE;

CREATE OR REPLACE FUNCTION jsonb2array (items anyelement)
    RETURNS text[]
    AS $$
BEGIN
    RETURN (string_to_array(regexp_replace(items::text, '[\[\]"]', '', 'g'), ','));
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION jsonb2array (items anyelement, nitem int)
    RETURNS text[]
    AS $$
BEGIN
    RETURN (string_to_array(regexp_replace(items::text, '[\[\]"]', '', 'g'), ','))[nitem + 1];
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION _2array (items anyelement)
    RETURNS text[]
    AS $$
BEGIN
    RETURN (string_to_array(regexp_replace(items::text, '[\[\]"]', '', 'g'), ','));
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION _2array (items anyelement, nitem int)
    RETURNS text
    AS $$
BEGIN
    RETURN (string_to_array(regexp_replace(items::text, '[\[\]"]', '', 'g'), ','))[nitem + 1];
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION minn (VARIADIC arr numeric[])
    RETURNS numeric
    AS $$
    SELECT
        min($1[i])
    FROM
        generate_subscripts($1, 1) g (i);

$$
LANGUAGE SQL;

CREATE OR REPLACE FUNCTION maxx (VARIADIC arr numeric[])
    RETURNS numeric
    AS $$
    SELECT
        max($1[i])
    FROM
        generate_subscripts($1, 1) g (i);

$$
LANGUAGE SQL;

CREATE OR REPLACE FUNCTION minn (VARIADIC arr float[])
    RETURNS float
    AS $$
    SELECT
        min($1[i])
    FROM
        generate_subscripts($1, 1) g (i);

$$
LANGUAGE SQL;

CREATE OR REPLACE FUNCTION maxx (VARIADIC arr float[])
    RETURNS float
    AS $$
    SELECT
        max($1[i])
    FROM
        generate_subscripts($1, 1) g (i);

$$
LANGUAGE SQL;

CREATE OR REPLACE FUNCTION maxx (VARIADIC arr timestamp[])
    RETURNS timestamp
    AS $$
    SELECT
        max($1[i])
    FROM
        generate_subscripts($1, 1) g (i);

$$
LANGUAGE SQL;

CREATE OR REPLACE FUNCTION minn (VARIADIC arr timestamp[])
    RETURNS timestamp
    AS $$
    SELECT
        minn ($1[i])
    FROM
        generate_subscripts($1, 1) g (i);

$$
LANGUAGE SQL;

CREATE OR REPLACE FUNCTION concat2 (cSpace varchar(20) DEFAULT ' ', VARIADIC cPars text[] DEFAULT ARRAY[' '])
        RETURNS text
        AS $$
DECLARE
    cRet text := '';
    i int := 0;
    i1 int := 0;
BEGIN
    i := array_upper(cPars, 1);
    FOR i1 IN 1..i LOOP
        IF cRet > ' ' THEN
            cRet := cRet || cSpace;
        END IF;
        IF coalesce(cPars[i1], '') > ' ' THEN
            cRet := cRet || coalesce(cPars[i1], '');
        END IF;
        raise notice ' % , % , %  ,: % ', i1, cPars[i1], cRet, cPars;
    END LOOP;
    cRet := trim(cRet);
    cRet := REGEXP_REPLACE(cRet, '( ){2,}', ' ');
    --//    SELECT array_to_string($1,'');
    RETURN cRet;
END;
$$
LANGUAGE 'plpgsql';
/*
CREATE OR REPLACE FUNCTION public.to_ascii(bytea, name)
        RETURNS text
        LANGUAGE internal
        IMMUTABLE STRICT
        AS $function$
    to_ascii_encname$function $;
    */

CREATE OR REPLACE FUNCTION public.to_aascii (text)
    RETURNS text
    
     AS
$$
DECLARE
    cret text := '';
BEGIN
    BEGIN
        SELECT
            to_ascii(convert_to(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(REPLACE(replace(replace(replace(replace(replace($1, chr(8211), ''), chr(157), ''), chr(174), ''), chr(711), ''), chr(239), 'i'), chr(207), 'I'), chr(209), chr(327)), chr(213), chr(211)), chr(188), 'L'), chr(190), 'L'), chr(197), 'L'), chr(179), 'L'), chr(198), 'L'), chr(163), 'L'), chr(219), 'U'), chr(191), 'Z'), chr(204), ''), chr(217), chr(218)), chr(208), ''), chr(338), chr(352)), chr(202), chr(352)), chr(192), chr(344)), '', ''), 'latin2'), 'latin2') INTO cret;
    exception
        WHEN OTHERS THEN
            RETURN $1;
    END;
    RETURN cret;
END;

$$LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION idefix (_idefix bigint)
    RETURNS text
    AS $$
DECLARE
    r record;
    r2 record;
    cRet text := '';
    DECLARE cQ text := '';
BEGIN
    FOR r IN SELECT DISTINCT
        table_schema,
        table_name,
        column_name
    FROM
        information_schema.columns
    WHERE
        column_name = 'idefix'
        AND NOT table_name ILIKE ANY (ARRAY['log%', 'tmp%', 'trand%', 'bck%'])
        LOOP
            cQ := 'select * from ' || r.table_schema || '.' || r.table_name || ' where idefix = ' || _idefix || ' limit 1';
            FOR r2 IN EXECUTE cQ LOOP
                cRet := r.table_schema || '.' || r.table_name;
                --    raise notice '%',cQ ;
            END LOOP;
            IF (cRet > '') THEN
                exit;
            END IF;
        END LOOP;
    RETURN cRet;
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION idefix_nazev (_idefix bigint)
    RETURNS text
    AS $$
DECLARE
    r record;
    r2 record;
    cRet text := '';
    DECLARE cQ text := '';
BEGIN
    FOR r IN SELECT DISTINCT
        table_schema,
        table_name,
        column_name
    FROM
        information_schema.columns
    WHERE
        column_name = 'idefix' LOOP
            BEGIN
                cQ := 'select nazev from ' || r.table_schema || '.' || r.table_name || ' where idefix = ' || _idefix || ' limit 1';
            FOR r2 IN EXECUTE cQ LOOP
                cRet := r2.nazev;
            END LOOP;
            exception
                WHEN OTHERS THEN
                    CONTINUE;
            END;
            IF (cRet > '') THEN
                exit;
            END IF;
        END LOOP;
    RETURN cRet;
END;

$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION idefix_nazev1 (_idefix bigint)
    RETURNS text
    AS $$
DECLARE
    r record;
    r2 record;
    cRet text := '';
    DECLARE cQ text := '';
BEGIN
    FOR r IN SELECT DISTINCT
        table_schema,
        table_name,
        column_name
    FROM
        information_schema.columns
    WHERE
        column_name = 'idefix' LOOP
            BEGIN
                cQ := 'select nazev1 as nazev from ' || r.table_schema || '.' || r.table_name || ' where idefix = ' || _idefix || ' limit 1';
            FOR r2 IN EXECUTE cQ LOOP
                cRet := r2.nazev;
            END LOOP;
            exception
                WHEN OTHERS THEN
                    CONTINUE;
            END;
            IF (cRet > '') THEN
                exit;
            END IF;
        END LOOP;
    RETURN cRet;
END;

$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION idefix_name (_idefix bigint)
    RETURNS text
    AS $$
DECLARE
    r record;
    r2 record;
    cRet text := '';
    DECLARE cQ text := '';
BEGIN
    FOR r IN SELECT DISTINCT
        table_schema,
        table_name,
        column_name
    FROM
        information_schema.columns
    WHERE
        column_name = 'idefix' LOOP
            BEGIN
                cQ := 'select name as nazev from ' || r.table_schema || '.' || r.table_name || ' where idefix = ' || _idefix || ' limit 1';
            FOR r2 IN EXECUTE cQ LOOP
                cRet := r2.nazev;
            END LOOP;
            exception
                WHEN OTHERS THEN
                    CONTINUE;
            END;
            IF (cRet > '') THEN
                exit;
            END IF;
        END LOOP;
    RETURN cRet;
END;

$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION idefix_login (_idefix bigint)
    RETURNS text
    AS $$
DECLARE
    r record;
    r2 record;
    cRet text := '';
    DECLARE cQ text := '';
BEGIN
    FOR r IN SELECT DISTINCT
        table_schema,
        table_name,
        column_name
    FROM
        information_schema.columns
    WHERE
        column_name = 'idefix' LOOP
            BEGIN
                cQ := 'select login as nazev from ' || r.table_schema || '.' || r.table_name || ' where idefix = ' || _idefix || ' limit 1';
            FOR r2 IN EXECUTE cQ LOOP
                cRet := r2.nazev;
            END LOOP;
            exception
                WHEN OTHERS THEN
                    CONTINUE;
            END;
            IF (cRet > '') THEN
                exit;
            END IF;
        END LOOP;
    RETURN cRet;
END;

$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION idefix_txt (_idefix bigint)
    RETURNS text
    AS $$
DECLARE
    cRet text := '';
BEGIN
    cRet := idefix_nazev (_idefix);
    IF cRet = '' THEN
        cRet := idefix_nazev1 (_idefix);
    END IF;
    IF cRet = '' THEN
        cRet := idefix_name (_idefix);
    END IF;
    IF cRet = '' THEN
        cRet := idefix_login (_idefix);
    END IF;
    RETURN cRet;
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION
    RIGHT (bigint, n int)
        RETURNS text
        AS $$
BEGIN
    RETURN
    RIGHT ($1::text,
        n);
END;
$$
LANGUAGE PLPGSQL
IMMUTABLE;

CREATE OR REPLACE FUNCTION
    LEFT (bigint, n int)
        RETURNS text
        AS $$
BEGIN
    RETURN
    LEFT ($1::text,
        n);
END;
$$
LANGUAGE PLPGSQL
IMMUTABLE;

CREATE OR REPLACE FUNCTION lpad(bigint, int, cim text DEFAULT '0')
        RETURNS text
        AS $$
DECLARE
    neco text := coalesce($1::text, '');
BEGIN
    RETURN lpad(neco, $2, cim);
END;
$$
LANGUAGE PLPGSQL
IMMUTABLE;

CREATE OR REPLACE FUNCTION rpad(bigint, int, cim text DEFAULT '0')
        RETURNS text
        AS $$
DECLARE
    neco text := coalesce($1::text, '');
BEGIN
    RETURN rpad(neco, $2, cim);
END;
$$
LANGUAGE PLPGSQL
IMMUTABLE;

CREATE OR REPLACE FUNCTION d_exp (ndays int DEFAULT 10)
    RETURNS date
    AS $$
BEGIN
    RETURN now()::date + ndays;
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION newzak (_idefixuser bigint DEFAULT 0, _rok int DEFAULT 0)
    RETURNS bigint
    AS $$
DECLARE
    _r int := 0;
    DECLARE newzak bigint := 0;
    DECLARE lastzak text  :=  '';
    DECLARE rok text := 0;
BEGIN
    IF (_rok = 0) THEN
        rok := (extract(year FROM now()) - 2000)::text;
    ELSE
        rok :=
    RIGHT (_rok,
        2)::text;
    END IF;
    SELECT
        max(
        RIGHT (cislozakazky::text, 5)) INTO lastzak
    FROM
        zak_t_list
    WHERE
    LEFT (cislozakazky, 2) = rok;
    IF (lastzak IS NULL OR lastzak = '0') THEN
        --        raise notice ' %', lastzak;
        lastzak := lpad('1', 5, '0');
    ELSE
        lastzak := lpad((lastzak::bigint + 1)::text, 5, '0');
    END IF;
    --    raise notice '%' , (rok || lpad(_idefixuser,3) || lastzak ) ;
    newzak := (rok || lpad(_idefixuser, 3) || lastzak)::bigint;
    RETURN newzak;
END;
    --RR NNN ZZZZZ
$$LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION newnab (_idefixuser bigint DEFAULT 0, _rok int DEFAULT 0)
    RETURNS bigint
    AS $$
DECLARE
    _r int := 0;
    DECLARE newzak bigint := 0;
    DECLARE lastzak text  :=  '';
    DECLARE rok text := 0;
BEGIN
    IF (_rok = 0) THEN
        rok := (extract(year FROM now()) - 2000)::text;
    ELSE
        rok :=
    RIGHT (_rok,
        2)::text;
    END IF;
    SELECT
        max(
        RIGHT (cislonabidky::text, 5)) INTO lastzak
    FROM
        nab_t_list
    WHERE
    LEFT (cislonabidky, 2) = rok;
    IF (lastzak IS NULL OR lastzak = '0') THEN
        --        raise notice 'A  %', lastzak;
        lastzak := lpad('1', 5, '0');
    ELSE
        lastzak := lpad((lastzak::bigint + 1)::text, 5, '0');
        --        raise notice 'B  %', lastzak;
    END IF;
    --    raise notice ' C %' , (rok || lpad(_idefixuser,3) || lastzak ) ;
    newzak := (rok || lpad(_idefixuser, 3) || lastzak)::bigint;
    RETURN newzak;
END;
    --RR NNN ZZZZZ
$$
LANGUAGE PLPGSQL;

--14125
DROP FUNCTION zak_insert (bigint, bigint, date);

CREATE OR REPLACE FUNCTION zak_insert (user_insert_idefix bigint DEFAULT 0, idefix_firma bigint DEFAULT 0, dat_exp date DEFAULT now() ::date, OUT datum_spl date, OUT idefix bigint, OUT cislo bigint, OUT platbaInfo text, OUT info text, OUT datumzadani date)
        RETURNS SETOF record
        AS $$
DECLARE
    idefix_ret bigint := 0;
    DECLARE splatnost date := now()::date;
    DECLARE r record;
    DECLARE splDays int := 0;
BEGIN
    IF (idefix_firma = 0 OR idefix_firma IS NULL) THEN
        idefix = 0;
        info := 'Firma musi byt zadana';
        cislo := 0;
        RETURN NEXT;
    ELSE
        FOR r IN
        SELECT
            *
        FROM
            list_dodavatel a
        WHERE
            a.idefix = idefix_firma LOOP
                IF (r.hotovost = 1) THEN
                    platbaInfo := 'Platba v hotovosti';
                    datum_spl := dat_exp;
                    splDays := 0;
                ELSE
                    platbaInfo := 'Faktura';
                    datum_spl := dat_exp + r.splatnost;
                    splDays := r.splatnost;
                END IF;
            END LOOP;
        FOR r IN INSERT INTO zak_t_list (cislozakazky, datumexpedice, datumsplatnosti, idefix_firma, user_insert_idefix, datumzadani)
        VALUES (newzak (user_insert_idefix, year (dat_exp)), dat_exp, datum_spl, idefix_firma, user_insert_idefix, now())
    RETURNING
        * LOOP
            raise notice 'RET %', r;
        idefix := r.idefix;
        cislo := r.cislozakazky;
        info := 'Splatnost = ' || splDays::text;
        datumzadani := r.datumzadani;
    END LOOP;
        RETURN NEXT;
    END IF;
    RETURN;
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION nab_insert (user_insert_idefix bigint DEFAULT 0, idefix_firma bigint DEFAULT 0, dat_exp date DEFAULT now() ::date, OUT datum_spl date, OUT idefix bigint, OUT cislo bigint, OUT platbaInfo text, OUT info text, OUT datumzadani date)
        RETURNS SETOF record
        AS $$
DECLARE
    idefix_ret bigint := 0;
    DECLARE splatnost date := now()::date;
    DECLARE r record;
    DECLARE splDays int := 0;
BEGIN
    IF (idefix_firma = 0 OR idefix_firma IS NULL) THEN
        idefix = 0;
        info := 'Firma musi byt zadana ? Obecna nabidka';
        cislo := 0;
        FOR r IN INSERT INTO nab_t_list (cislonabidky, datumexpedice, datumsplatnosti, idefix_firma, user_insert_idefix, datumzadani)
        VALUES (newnab (user_insert_idefix, year (dat_exp)), dat_exp, datum_spl, idefix_firma, user_insert_idefix, now())
    RETURNING
        * LOOP
            raise notice 'RET 1 %', r;
        idefix := r.idefix;
        cislo := r.cislonabidky;
        datumzadani := r.datumzadani;
    END LOOP;
        RETURN NEXT;
    ELSE
        FOR r IN
        SELECT
            *
        FROM
            list_dodavatel a
        WHERE
            a.idefix = idefix_firma LOOP
                IF (r.hotovost = 1) THEN
                    platbaInfo := 'Platba v hotovosti';
                    datum_spl := dat_exp;
                    splDays := 0;
                ELSE
                    platbaInfo := 'Faktura';
                    datum_spl := dat_exp + r.splatnost;
                    splDays := r.splatnost;
                END IF;
            END LOOP;
        FOR r IN INSERT INTO nab_t_list (cislonabidky, datumexpedice, datumsplatnosti, idefix_firma, user_insert_idefix, datumzadani)
        VALUES (newnab (user_insert_idefix, year (dat_exp)), dat_exp, datum_spl, idefix_firma, user_insert_idefix, now())
    RETURNING
        * LOOP
            raise notice 'RET 2 % b : %  c: % ', r, newnab (user_insert_idefix), user_insert_idefix;
        idefix := r.idefix;
        cislo := r.cislonabidky;
        info := 'Splatnost = ' || splDays::text;
        datumzadani := r.datumzadani;
    END LOOP;
        RETURN NEXT;
    END IF;
    RETURN;
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION splatnost (_idefix_zak bigint)
    RETURNS date
    AS $$
DECLARE
    r record;
    r1 record;
    dret date;
    datum_spl date;
    splDays int;
    platbaInfo text;
BEGIN
    FOR r IN
    SELECT
        *
    FROM
        zak_t_list
    WHERE
        idefix = _idefix_zak LOOP
            FOR r1 IN
            SELECT
                *
            FROM
                list_dodavatel a
            WHERE
                a.idefix = r.idefix_firma LOOP
                    IF (r1.hotovost = 1) THEN
                        platbaInfo := 'Platba v hotovosti';
                        datum_spl := r.datumexpedice;
                        splDays := 0;
                    ELSE
                        platbaInfo := 'Faktura';
                        datum_spl := r.datumexpedice + (r1.splatnost * 86400)::text::interval;
                        splDays := r1.splatnost;
                    END IF;
                END LOOP;
        END LOOP;
    RETURN datum_spl;
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION vl_init ()
    RETURNS text
    AS $$
DECLARE
    i int := 0;
    DECLARE i2 int := 0;
    DECLARE r record;
BEGIN
    TRUNCATE TABLE list2_vl;
    FOR i IN 1..26 LOOP
        i2  :=  i2 + 1;
        raise notice '%', chr(i + 64);
        PERFORM
            setval('list2_vl_id_seq', i2);
            INSERT INTO list2_vl (id, nazev)
            VALUES (i2, chr(i + 64));
    END LOOP;
    FOR r IN
    SELECT
        *
    FROM
        list2_vl
    ORDER BY
        id LOOP
            FOR i IN 1..26 LOOP
                raise notice '%', chr(i + 64);
                i2  :=  i2 + 1;
                PERFORM
                    setval('list2_vl_id_seq', i2);
                    INSERT INTO list2_vl (id, nazev)
                    VALUES (i2, r.nazev || chr(i + 64));
            END LOOP;
        END LOOP;
    RETURN 'OK';
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION idefix_zak (bigint)
    RETURNS bigint
    AS $$
DECLARE
    ifx bigint DEFAULT 0;
BEGIN
    SELECT
        idefix INTO ifx
    FROM
        zak_t_list
    WHERE
        idefix = $1;
    IF found THEN
        RETURN ifx;
    END IF;
    SELECT
        idefix INTO ifx
    FROM
        zak_t_list
    WHERE
        cislozakazky = $1;
    IF NOT found THEN
        SELECT
            idefix INTO ifx
        FROM
            nab_t_list
        WHERE
            cislonabidky = $1;
        IF NOT found THEN
            SELECT
                idefix_zak INTO ifx
            FROM
                zak_t_items
            WHERE
                idefix = $1;
            raise notice '1 % %', ifx, $1;
            IF NOT found THEN
                SELECT
                    idefix_nab INTO ifx
                FROM
                    nab_t_items
                WHERE
                    idefix = $1;
            END IF;
        END IF;
    END IF;
    IF ifx IS NULL THEN
        ifx := 0;
    END IF;
    RETURN ifx;
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION set_open (_idefix int, _login text, _menu text, _cislo bigint, _obrazovka int DEFAULT 1, _item bigint DEFAULT 0, OUT _login1 text, OUT _cas1 text, OUT _user1 text, OUT _cislo1 text, OUT _zkratka1 text)
    RETURNS SETOF record
    AS $$
DECLARE
    r record;
BEGIN
    IF _cislo = 0 THEN
        RETURN;
    END IF;
    IF (_menu = 'zakazky') THEN
        PERFORM
            *
        FROM
            zak_log_open
        WHERE
            idefix_user = _idefix
            AND cislozakazky = _cislo;
        IF NOT found THEN
            INSERT INTO zak_log_open (idefix_zak, cislozakazky, idefix_user, LOGIN, cas, obrazovka)
            VALUES (idefix_zak (_cislo), _cislo, _idefix, _login, now(), _obrazovka);
        ELSE
            UPDATE
                zak_log_open
            SET
                cas = now(),
                obrazovka = _obrazovka
            WHERE
                idefix_user = _idefix
                AND cislozakazky = _cislo;
        END IF;
        FOR r IN
        SELECT
            *
        FROM
            zak_log_open
        WHERE
            now() - cas <= '10 seconds'
            AND cislozakazky = _cislo
        ORDER BY
            CASE WHEN LOGIN = _login THEN
                '1'
            ELSE
                '2'
            END || LOGIN LOOP
                _login1  :=  'a';
                _cas1 = extract(epoch FROM now() - r.cas);
                _cislo1  :=  r.cislozakazky;
                _login1  :=  _login;
                _user1 := r.idefix_user;
                _zkratka1 := zkratka (r.idefix_user);
                RETURN NEXT;
            END LOOP;
    END IF;
    IF (_menu = 'kalkulace') THEN
        PERFORM
            *
        FROM
            nab_log_open
        WHERE
            idefix_user = _idefix
            AND cislonabidky = _cislo;
        IF NOT found THEN
            INSERT INTO nab_log_open (idefix_nab, cislonabidky, idefix_user, LOGIN, cas, obrazovka)
            VALUES (idefix_zak (_cislo), _cislo, _idefix, _login, now(), _obrazovka);
        ELSE
            UPDATE
                nab_log_open
            SET
                cas = now(),
                obrazovka = _obrazovka
            WHERE
                idefix_user = _idefix
                AND cislonabidky = _cislo;
        END IF;
        FOR r IN
        SELECT
            *
        FROM
            nab_log_open
        WHERE
            now() - cas <= '10 seconds'
            AND cislonabidky = _cislo
        ORDER BY
            CASE WHEN LOGIN = _login THEN
                '1'
            ELSE
                '2'
            END || LOGIN LOOP
                _login1  :=  'a';
                _cas1 = extract(epoch FROM now() - r.cas);
                _cislo1  :=  r.cislonabidky;
                _login1  :=  _login;
                _user1 := r.idefix_user;
                _zkratka1 := zkratka (r.idefix_user);
                RETURN NEXT;
            END LOOP;
    END IF;
    RETURN;
END;
$$
LANGUAGE PLPGSQL;

--CREATE OR REPLACE FUNCTION create_temp_zak ()
--//await Q.post(self.idefix,`select drop_tmp(${self.idefix});`)
--/await Q.post (self.idefix, `drop table if exists ${self.cTable}`) await Q.post (self.idefix, `create table  ${self.cTable} without oids as select * from ${ceho}_t_items where idefix_zak=${ifx_aktivni}`) await Q.post (self.idefix, `create sequence ${self.cTable}_seq`) await Q.post (self.idefix, `alter table  ${self.cTable}  alter column id set default nextval('${self.cTable}_seq'::regclass ) `) await Q.post (self.idefix, `alter table  ${self.cTable}  alter column idefix set default  nextval('list2_seq'::regclass) `) 
CREATE OR REPLACE FUNCTION drop_tmp (_idefix int DEFAULT 0)
    RETURNS text
    AS $$
DECLARE
    r record;
BEGIN
    IF (_idefix > 0) THEN
        FOR r IN
        SELECT
            tablename
        FROM
            pg_tables
        WHERE
            tablename LIKE 'calc_my_' || _idefix || '_%' LOOP
                raise notice '%', r.tablename;
                EXECUTE 'drop table if exists ' || r.tablename;
            END LOOP;
        FOR r IN
        SELECT
            c.relname
        FROM
            pg_class c
        WHERE
            c.relkind = 'S'
            AND relname LIKE 'calc_my_' || _idefix || '_%' LOOP
                raise notice '%', r.relname;
                EXECUTE 'drop sequence  if exists ' || r.relname;
            END LOOP;
    END IF;
    IF (_idefix < 0) THEN
        FOR r IN
        SELECT
            tablename
        FROM
            pg_tables
        WHERE
            tablename LIKE 'calc_my_%'
        UNION
        SELECT
            tablename
        FROM
            pg_tables
        WHERE
            tablename LIKE 'tmp_%' LOOP
                raise notice '%', r.tablename;
                EXECUTE 'drop table if exists ' || r.tablename;
            END LOOP;
        FOR r IN
        SELECT
            c.relname
        FROM
            pg_class c
        WHERE
            c.relkind = 'S'
            AND relname ILIKE 'calc_my_%' LOOP
                raise notice '%', r.relname;
                EXECUTE 'drop sequence  if exists ' || r.relname;
            END LOOP;
    END IF;
    RETURN 'hotovo';
END;
$$
LANGUAGE PLPGSQL;

--   ${self.idefix}
-- ,'${self.user}'
-- ,'${self.setmenu}'
-- ,'${self.form.cislo}'
--select vl_set(13518947,13629472) ;
--13518947,13629472
--// SELECT concat('My ', 'dog ', 'likes ', 'chocolate') As result;
-- result
