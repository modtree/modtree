select '=========================' AS '';
select '=========================' AS 'DATABASES';
show databases;
use mt_test;
select '=========================' AS '';
select '=========================' AS 'TABLES';
show tables;

select '=========================' AS '';
select '=========================' AS 'Condensed Modules';

select moduleCode from moduleCondensed;

