SELECT SEXO, count(SEXO) FROM pactualtrackingnacional
WHERE REM = 0
AND criado BETWEEN '2014-07-13' AND '2014-07-17' GROUP BY SEXO