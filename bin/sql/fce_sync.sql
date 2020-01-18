create or replace function vl_sync(ctable varchar(64) default 'nic') returns text as $$
    declare 
    atab text[];
    ifx_zak bigint := 0;
    ifx_user bigint := 0;
    czak  bigint :=0;
    cq text :='';
    cq2 text :='';
    r record;
    _poradi int :=0;
begin
   raise notice ' Tabulka %', ctable;
   atab= string_to_array(ctable,'_') ;
   raise notice ' Tabulka %', atab[3];
   ifx_user := atab[3]::bigint;
   cq := 'select max(idefix_zak) as _ifx from ' || ctable ;
   raise notice ' Tabulka %', cq;
   for r in  execute cq loop
    ifx_zak := r._ifx;
   end loop;
      raise notice ' Tabulka %', ifx_zak;
   if ifx_zak is null or ifx_zak = 0 or true then   
    raise notice ' Tabulka 1 %', ifx_zak;
    for r in select * from zak_log_open where idefix_user = ifx_user order by cas desc limit 1 loop
           raise notice ' Tabulka 2 %', ifx_zak;
           ifx_zak := idefix_zak(r.cislozakazky);
          raise notice ' Tabulka 3 %', ifx_zak; 
        if (r.idefix_zak = 0 or r.idefix_zak is null ) then

            update zak_log_open set idefix_zak = ifx_zak where idefix=r.idefix;
        end if;
    end loop ;
   end if;

   select count(*) into _poradi from zak_t_items where idefix_zak= ifx_zak;  --poradi je nutne vyplnit

   cq:= 'select *  from ' || ctable || ' where obsah::text >' || quote_literal('') || ' and idefix_src is null order by idefix';
   for r in execute cq loop
         _poradi := _poradi +1;   
         cq2 := 'update ' || ctable || ' set idefix_src= '  || r.idefix || ', idefix_zak = ' ||ifx_zak ||' where idefix = ' || r.idefix ;
         execute cq2 ;

         raise notice ' cq2 , % ', cq2 ;
         
        insert into zak_t_items(
  idefix            
 ,nazev              
 ,obsah              
 ,kcks               
 ,ks                 
 ,naklad             
 ,marze              
 ,prodej             
 ,marze_pomer        
 ,expedice_datum     
 ,expedice_cas       
 ,datum              
 ,poradi             
 ,idefix_tmp         
 ,idefix_zak         
 ,idefix_src         
 ,id_src             
 ,active             
 ,time_insert        
 ,time_update        
 ,user_insert_idefix 
 ,user_update_idefix 
 ,idefix_dod         
 ,idefix_prace       
 ,d_fak              
 ,vzor               
 ,old_kod            
 ,old_kodv           
 ,status             
 ,vl                 
 ,vl_id              
 ,vl_znacka          
 ,poradi2            

        )
        values (
  r.idefix            
 ,r.nazev              
 ,r.obsah              
 ,r.kcks               
 ,r.ks                 
 ,r.naklad             
 ,r.marze              
 ,r.prodej             
 ,r.marze_pomer        
 ,r.expedice_datum     
 ,r.expedice_cas       
 ,r.datum              
 , _poradi             
 ,r.idefix_tmp         
 , ifx_zak
 ,r.idefix
 ,r.id_src             
 ,r.active             
 ,now()
 ,now()
 ,ifx_user
 ,ifx_user
 ,r.idefix_dod         
 ,r.idefix_prace       
 ,r.d_fak              
 ,r.vzor               
 ,r.old_kod            
 ,r.old_kodv           
 ,r.status             
 ,r.vl                 
 ,r.vl_id              
 ,r.vl_znacka          
 ,r.poradi2           
);
        
    
   end loop;

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
update zak_t_items a set vl_id=b.vl_id,vl_znacka=b.vl_znacka,poradi2=b.poradi2  from zak_t_vl_v b where  a.idefix=b.idefix_item  
        
        and (a.vl_id is null or a.vl_id<>b.vl_id )
        ;
cq2 := 'update ' || ctable || ' a set vl_id=b.vl_id,vl_znacka=b.vl_znacka,poradi2=b.poradi2  from zak_t_vl_v b where  a.idefix=b.idefix_item  
        
        and (a.vl_id is null or a.vl_id<>b.vl_id )
        ;'        ;

execute cq2;
return ifx_zak::text;
end;
$$LANGUAGE PLPGSQL;


select vl_sync('calc_my_9_zak2306538750');