orion-api
=========

# SERVIDOR DE PRODUÇÃO

ssh -i CHAVE_PRIVADA root@192.34.56.106

---

# VAR NAMES

{ name: 'TRABALHO', title: 'Condição de trabalho', data: [] }
{ name: 'ROD', title: 'Rodada do tracking', data: [] }
{ name: 'MUN', title: 'Município', data: [] }
{ name: 'ZONA', title: 'Zona residencial', data: [] }
{ name: 'UF', title: 'Estado', data: [] }
{ name: 'SEXO', title: 'Sexo', data: [] }
{ name: 'IDADE', title: 'Idade', data: [] }
{ name: 'IDADEF', title: 'Idade categorizada', data: [] }
{ name: 'ESC', title: 'Grau de escolaridade', data: [] }
{ name: 'SIT', title: 'Situação do trabalho', data: [] }
{ name: 'PEA', title: 'Situação do trabalhador', data: [] }
{ name: 'RENDAF', title: 'Renda domiciliar', data: [] }
{ name: 'EPP', title: 'Intenção de voto espontânea para presidente', data: [] }
{ name: 'COP1', title: 'Grau de conhecimento a respeito de Dilma', data: [] }
{ name: 'COP2', title: 'Grau de conhecimento a respeito de Aécio', data: [] }
{ name: 'COP3', title: 'Grau de conhecimento a respeito de Eduardo', data: [] }
{ name: 'PVP1', title: 'Possibilidade de votar em Dilma', data: [] }
{ name: 'PVP2', title: 'Possibilidade de votar em Aécio', data: [] }
{ name: 'PVP3', title: 'Possibilidade de votar em Eduardo', data: [] }
{ name: 'ETP1', title: 'Intenção de voto estimulada para presidente', data: [] }
{ name: 'DVP', title: 'Percentual de indecisos', data: [] }
{ name: 'CHP', title: 'Chance de vitória na eleição presidencial', data: [] }
{ name: 'ETP2', title: 'Intenção de voto para 2 turno (Cenário 1)', data: [] }
{ name: 'ETP3', title: 'Intenção de voto para 2 turno (Cenário 2)', data: [] }
{ name: 'ADP2', title: 'Avaliação do desempenho da presidenta Dilma', data: [] }
{ name: 'C3', title: 'Satisfação em relação ao Brasil', data: [] }
{ name: 'IPG', title: 'Grau de interesse por política', data: [] }
{ name: 'CONV', title: 'Engajamento em conversa/discussão política', data: [] }
{ name: 'NET1', title: 'Hábito de acessar a internet', data: [] }
{ name: 'REL1', title: 'Religião', data: [] }
{ name: 'REL2', title: 'Frequência com que vai à igreja/culto', data: [] }
{ name: 'COR', title: 'Cor/Raça', data: [] }

---

# COMO CRIAR UM DASHBOARD NO MONGODB

1. Abre o mongo bash no shell. Os próximos passos já é dentro da shell.

2. use orion

3.
db.dashboards.remove({})
db.dashboards.insert({ name: 'Tracking Vox Nacional', variables: [
  { name: 'EPPR2', title: 'Intenção de voto espontânea para presidente', data: [] },
  { name: 'ETP1R2', title: 'Intenção de voto estimulada para presidente', data: [] },
  { name: 'DVP', title: 'Grau de decisão', data: [] },
  { name: 'CHP', title: 'Quem vai ganhar?', data: [] },
  { name: 'ETP2', title: '2o turno Dilma vs Aécio', data: [] },
  { name: 'ETP3', title: '2o turno Dilma vs Eduardo', data: [] },
  { name: 'ADP2', title: 'Avaliação do desempenho da presidenta Dilma', data: [] },
  { name: 'C3', title: 'Satisfação em relação ao Brasil', data: [] }
]});

---

# COMO ATUALIZAR UM DASHBOARD NO MONGODB

1. Ache o id do dashboard.

db.dashboards.find({ name: 'Tracking Vox Nacional' });

2. De posse do ID, faça:

db.dashboards.update({_id: ObjectId('SUBSTITUA_PELO_ID')}, {$set: {variables: []}});
db.dashboards.update({_id: ObjectId('SUBSTITUA_PELO_ID')}, {$push: {variables: { name: 'EPPR2', title: 'Intenção de voto espontânea para presidente', data: [] }}})
db.dashboards.update({_id: ObjectId('SUBSTITUA_PELO_ID')}, {$push: {variables: { name: 'ETP1R2', title: 'Intenção de voto estimulada para presidente', data: [] }}})
db.dashboards.update({_id: ObjectId('SUBSTITUA_PELO_ID')}, {$push: {variables: { name: 'DVP', title: 'Grau de decisão', data: [] }}})
db.dashboards.update({_id: ObjectId('SUBSTITUA_PELO_ID')}, {$push: {variables: { name: 'CHP', title: 'Quem vai ganhar?', data: [] }}})
db.dashboards.update({_id: ObjectId('SUBSTITUA_PELO_ID')}, {$push: {variables: { name: 'ETP2', title: '2o turno Dilma vs Aécio', data: [] }}})
db.dashboards.update({_id: ObjectId('SUBSTITUA_PELO_ID')}, {$push: {variables: { name: 'ETP3', title: '2o turno Dilma vs Eduardo', data: [] }}})
db.dashboards.update({_id: ObjectId('SUBSTITUA_PELO_ID')}, {$push: {variables: { name: 'ADP2', title: 'Avaliação do desempenho da presidenta Dilma', data: [] }}})
db.dashboards.update({_id: ObjectId('SUBSTITUA_PELO_ID')}, {$push: {variables: { name: 'C3', title: 'Satisfação em relação ao Brasil', data: [] }}})

3. Pronto.
