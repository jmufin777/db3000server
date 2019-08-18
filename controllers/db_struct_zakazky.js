 cislozakazky            biginteger                  not null default 0 --metodika honza  RR NNN ZZZ ZZ  - jedno cislo ?  priklad: 1900500001 ? - preklad 2019HonzaCislo  z datumu zadani 
 ,vl_rozsah               text                            -- zajisti prokliky ? ,  zobrazit jako tlacitka kvuli oddeleni? zobrazeni VL - formular bez editace, protoze VL prochazi rakdami kalkulace dle technologie, vzhledem ke slozitost dedukce VL 
 ,idefix_firma            bigint                      not null -- firma - musi byt zadano ( jak u nabidek ?)
 ,idefix_firmaosoba       bigint                      not null default 0 -- kontaktni osoba- predpoklad je ze nemusi byt povinna ?
 ,nazev                   character varying(255)      -- nazev zakazky
 ,cisloobjednavky         character varying(255)      -- X otazniky textove - zadat pokud bude k dispozici, v navrzenem formulari chybi , kamumistit ? obsahuje napr, text Pawlasova...
 ,datumzadani             timestamp without time zone  -- automat, system
 ,datumexpedice           timestamp without time zone  not null X - 10 dnu od zadani -- musi byt vyplneno pri zadani (budem kalkulavat)  
 ,datumsplatnosti         timestamp without time zone  not null -- automatickakalkulace pri zadani v zavislosti na parametrech firmy , moznost zmeny ? 
 ,vyrobapopis             text                        -- obsaheje texty jako Vizitky 90x50 mm,4/0,300g KM - 100 ks p. Tichá\rFakturovat na BAGOsport apod, pouziva se kam to dame vlastne?
 ,naklad                  integer                     --zahada, nejspis neni potreba, ve stare je vyplneno , na obrazovce jsem nenasel polozku
 ,poznamky                text                        -- Pouzva se texty napr.  50% zálohovka - Zálohová faktura č. 190800018 , kam s tim na obrazovce ? = TEXT NA FAKTUTU
 ,zamknuto                timestamp                   -- zmena - evidence casi zamku
 ,idefix_user_lock        bigint                      -- nove, kdo uzamkl - automat - system
 ,odemknuto               date                        -- odemknuti 
 ,idefix_user_unlock      bigint                      -- nove, kdo odemkl
 ,zamek                   boolean                     -- aktualn status - zajisti databaze pri zmene - pokud bude novejsi odemknuto nez zamknuto
 ,uct_rok                 integer                     -- XXXX rusime - je na pevno dano expedici ?
 ,login                   character varying(50)       -- obchodnik textem- neni nutne , pro kontrolu se muze hodit, nicemiu nevadi, ponecham
 ,vyrobapopis_print       text                        -- obsahuje texty jako v EUR bez DPH , pouziva se porad, potrebujeme, kam s tim ?
 ,cislofaktury            character varying(50)       -- Nahradi propojenou tabulkou ponechamme,pouziva se  lec - kam umistime na obrazovce ? 190102117 
 ,idefix_obchodnik        bigint                      default 0   -- rozbalovaci menu          -- pro toto a nize - co s tlacitky predej ?
 ,idefix_produkce         bigint                      default 0   -- stejne rozbalovaci menu   - produkce
 ,idefix_last             bigint                      default 0   -- stara kopie- vazbana zdrojovou zakazku - zachovam stejnou funkci
 ,idefix_nabidka          bigint                      default 0   -- Nabidka - pokud z ni zakazkavychazi
 ,dodak0                  text                        default ''::text -- pdf skladiste - zachovame funkci a ulozeni podobnejako doposud? kam s tim na obr`zovce ?
 ,objednavka0             text                        default ''::text -- pdf skladiste - zachovame funkci a ulozeni podobnejako doposud? kam s tim na obr`zovce ?
 ,pdf0                    text                        default ''::text -- pdf skladiste - zachovame funkci a ulozeni podobnejako doposud? kam s tim na obr`zovce ?
 ,informace               text                        --systemovy stavy - polozku ponecham , uvidim zdapouziji ci nikoliv


SOUCEt Z2

 + 

FIRMY pridelit v planovani obchodnika - jako ver stare od do, novou zakazku zaklada produkce, obchodnik je pridelen v db firem
 text na fakturu - asi poznamka - prokoumat
 FIRMY - default adresa
 caret-dwon, caret-down


 nahledy - dva druhy mensi - vetsi

 Databaze automaticky obsahuje informace  o manipulaxcich (zmeny, vklad, kdo a kdy) + kompletni system historie
 ve strukture neuvadim , je to automaticke pro vsechny databaze v nove db
