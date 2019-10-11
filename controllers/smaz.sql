select * from (
select 1 as kategorie, * from (
    select 1 as kategorie,* , idefix2fullname(idefix_obchodnik) as obchodnik , idefix2fullname(idefix_produkce) as produkce from 
(select a.*,b.nazev as firma,b.splatnost,b.hotovost,b.vlastnik,c.*, osoba( coalesce(o.idefix,0)) as osoba , coalesce(o.idefix,0) as idefix_osoba , 'F,N,KOSIK'::text as stav 
from zak_t_list a left join list_dodavatel b on a.idefix_firma= b.idefix left join list_firmaosoba o on a.idefix_firmaosoba = o.idefix left join ( select idefix_zak, sum(naklad) as nakladsum, sum(prodej) as prodejsum 
from zak_t_items group by idefix_zak ) c on a.idefix = c.idefix_zak) a where datumexpedice>=now()::date +'-365 days'::interval and right(cislozakazky,5)::bigint = right(8,5)::bigint) a 

union
 select * from (select 2 as kategorie, * from (select * from (select * , idefix2fullname(idefix_obchodnik) as obchodnik , idefix2fullname(idefix_produkce) as produkce from (select * from (select a.*,b.nazev as firma,b.splatnost,b.hotovost,b.vlastnik,c.*, osoba( coalesce(o.idefix,0)) as osoba , coalesce(o.idefix,0) as idefix_osoba , 'F,N,KOSIK'::text as stav from zak_t_list a left join list_dodavatel b on a.idefix_firma= b.idefix left join list_firmaosoba o on a.idefix_firmaosoba = o.idefix left join ( select idefix_zak, sum(naklad) as nakladsum, sum(prodej) as prodejsum from zak_t_items group by idefix_zak ) c on a.idefix = c.idefix_zak) a where left(cislozakazky,2) = right(2017,2)) a ) a order by cislozakazky desc ) a order by cislozakazky desc limit 5) a
  ) a order by kategorie , cislozakazky desc
