select texto1 from questoes,grupodequestoes,blocodequestoes where 
(variavel='COP' OR substring(variavel,-1) like 'COP%' OR substring(variavel,-2) like 'COP%') and 
questoes.idgrupo=grupodequestoes.idgrupo and 
grupodequestoes.idbloco=blocodequestoes.idbloco and 
blocodequestoes.idquestionario=9