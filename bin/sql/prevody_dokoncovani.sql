-- old
create table c_dok_3000 without oids as select * from cis_typ_pol ;
ALTER table c_dok_3000 add stroj text;
UPDATE c_dok_3000 set stroj='Ostatni' 
UPDATE c_dok_3000 set stroj='Balení' where nazev_pol ~* 'bal' ;
UPDATE c_dok_3000 set stroj='Kašírování' where to_aascii(nazev_pol) ~* 'kas'  and stroj='Ostatni';
UPDATE c_dok_3000 set stroj='Řezání' where to_aascii(nazev_pol) ~* 'rez'  and stroj='Ostatni';
UPDATE c_dok_3000 set stroj='Lepení' where to_aascii(nazev_pol) ~* 'lep'  and stroj='Ostatni';
UPDATE c_dok_3000 set stroj='Bigování' where to_aascii(nazev_pol) ~* 'big'  and stroj='Ostatni';
UPDATE c_dok_3000 set stroj='Lepení/aranže' where to_aascii(nazev_pol) ~* 'lep'  and stroj='Lepení';





 pg_dump -d pp2 -U postgres -t  c_dok_3000  |gzip -c   >  c_dok_3000 .gz
-- new


alter table c_dok_3000 add strojskup bigint default 532;

alter table c_dok_3000 add idefix_stroj bigint default 0;
alter table c_dok_3000 add nazev_text text default 'člověk' ;



UPDATE c_dok_3000 a set idefix_stroj = b.idefix from list_stroj b where a.stroj = b.nazev ;

insert into list_stroj (nazev,nazev_text,idefix_strojskup )
select DISTINCT stroj, nazev_text, strojskup from c_dok_3000 where idefix_stroj = 0 ;

UPDATE c_dok_3000 a set idefix_stroj = b.idefix from list_stroj b where a.stroj = b.nazev ;



select DISTINCT stroj, nazev_text, strojskup from c_dok_3000 a where 
not exists(select * from list2_prace b where a.stroj=b.nazev)
;

insert into list_prace(nazev,kod) values ('Ostatni',999) ;

update list_stroj set nazev = 'Lepení/aranže' where nazev ~* 'lep'


alter table c_dok_3000 add idefix_prace bigint default 0;
update c_dok_3000 a set idefix_prace = b.idefix from list2_prace b where a.stroj = b.nazev;

insert into list_strojmod (nazev,idefix_stroj,idefix_prace,kod)
    select distinct nazev_pol,idefix_stroj,idefix_prace
    , row_number() over(partition by stroj order by id_typ)
    from c_dok_3000 a
    where  not exists 
    (select * from list_strojmod b where a.nazev_pol=b.nazev)







