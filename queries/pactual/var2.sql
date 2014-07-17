select *,texto1 from questoes,grupodequestoes,blocodequestoes where 
(variavel='COP') and 
questoes.idgrupo=grupodequestoes.idgrupo and 
grupodequestoes.idbloco=blocodequestoes.idbloco and 
blocodequestoes.idquestionario=9 and
questoes._removido=0 and grupodequestoes._removido=0 and blocodequestoes._removido=0