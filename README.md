orion-api
=========

ssh -i do_basic root@192.34.56.106

# Var names

ELEITOR - Excluir do dashboard. Não é necessário visualizar.
TRABALHO - Condição de trabalho
ROD - Rodada do tracking
MUN - Município
BAIRRO - Excluir do dashboard. Não é necessário visualizar.
ZONA - Zona residencial
UF - Estado
SEXO - Sexo
IDADE - Idade
IDADEF - Idade categorizada
ESC - Grau de escolaridade
SIT - Situação do trabalho
PEA - Situação do trabalhador
RENDAF - Renda domiciliar
EPP - Intenção de voto espontânea para presidente
COP1 - Grau de conhecimento a respeito de Dilma
COP2 - Grau de conhecimento a respeito de Aécio
COP3 - Grau de conhecimento a respeito de Eduardo
PVP1 - Possibilidade de votar em Dilma
PVP2 - Possibilidade de votar em Aécio
PVP3 - Possibilidade de votar em Eduardo
ETP1 - Intenção de voto estimulada para presidente
DVP - Percentual de indecisos
CHP - Chance de vitória na eleição presidencial
ETP2 - Intenção de voto para 2 turno (Cenário 1)
ETP3 - Intenção de voto para 2 turno (Cenário 2)
ADP2 - Avaliação do desempenho da presidenta Dilma
C3 - Satisfação em relação ao Brasil
IPG - Grau de interesse por política
CONV - Engajamento em conversa/discussão política
NET1 - Hábito de acessar a internet
REL1 - Religião
REL2 - Frequência com que vai à igreja/culto
COR - Cor/Raça



case 'TRABALHO':
    title = 'Condição de trabalho';
    labels = [];
    break;
case 'ROD':
    title = 'Rodada do tracking';
    labels = [];
    break;
case 'MUN':
    title = 'Município';
    labels = [];
    break;
case 'ZONA':
    title = 'Zona residencial';
    labels = [];
    break;
case 'UF':
    title = 'Estado';
    labels = [];
    break;
case 'SEXO':
    title = 'Sexo';
    labels = [ { name: 1, label: 'Masculino' }, { name: 2, label: 'Feminino' } ];
    break;
case 'IDADE':
    title = 'Idade';
    labels = [];
    break;
case 'IDADEF':
    title = 'Idade categorizada';
    labels = [];
    break;
case 'ESC':
    title = 'Grau de escolaridade';
    labels = [ { name: 1, label: 'Até 4a série ou 5o ano do Ensino Fundamental' },
  { name: 2, label: 'De 5a até 8a série ou do 6o até o 9o ano do Ensino Fundamental' },
  { name: 3, label: 'Ensino Médio completo ou incompleto' },
  { name: 4, label: 'Superior completo ou incompleto' } ];
  break;
case 'SIT':
    title = 'Situação do trabalho';
    labels = [];
    break;
case 'PEA':
    title = 'Situação do trabalhador';
    labels = [];
    break;
case 'RENDAF':
    title = 'Renda domiciliar';
    labels = [];
    break;
case 'EPP':
    title = 'Intenção de voto espontânea para presidente';
    labels = [];
    break;
case 'COP1':
    title = 'Grau de conhecimento a respeito de Dilma';
    labels = [
        { name: 1, label: 'Conhece bem/tem muitas informações sobre ele(a)' },
        { name: 2, label: 'Conhece, mas não muito/tem algumas informações sobre ele(a)' },
        { name: 3, label: 'Conhece só de nome/só de ouvir falar' },
        { name: 4, label: 'Não conhece/É a primeira vez que ouve falar o nome' },
        { name: 9, label: 'NR' }
      ];
      break;
case 'COP2':
    title = 'Grau de conhecimento a respeito de Aécio';
    labels = [
        { name: 1, label: 'Conhece bem/tem muitas informações sobre ele(a)' },
        { name: 2, label: 'Conhece, mas não muito/tem algumas informações sobre ele(a)' },
        { name: 3, label: 'Conhece só de nome/só de ouvir falar' },
        { name: 4, label: 'Não conhece/É a primeira vez que ouve falar o nome' },
        { name: 9, label: 'NR' }
      ];
      break;
case 'COP3':
    title = 'Grau de conhecimento a respeito de Eduardo';
    labels = [
        { name: 1, label: 'Conhece bem/tem muitas informações sobre ele(a)' },
        { name: 2, label: 'Conhece, mas não muito/tem algumas informações sobre ele(a)' },
        { name: 3, label: 'Conhece só de nome/só de ouvir falar' },
        { name: 4, label: 'Não conhece/É a primeira vez que ouve falar o nome' },
        { name: 9, label: 'NR' }
      ];
      break;
case 'PVP1':
    title = 'Possibilidade de votar em Dilma';
    labels = [];
    break;
case 'PVP2':
    title = 'Possibilidade de votar em Aécio';
    labels = [];
    break;
case 'PVP3':
    title = 'Possibilidade de votar em Eduardo';
    labels = [];
    break;
case 'ETP1':
    title = 'Intenção de voto estimulada para presidente';
    labels = [ { name: 1, label: 'Aécio Neves (PSDB)' },
  { name: 2, label: 'Dilma Roussef (PT)' },
  { name: 3, label: 'Eduardo Campos (PSB)' },
  { name: 4, label: 'Eduardo Jorge (PV)' },
  { name: 5, label: 'Eymael (PSDC)' },
  { name: 6, label: 'Levy Fidelix (PRTB)' },
  { name: 7, label: 'Luciana Genro (PSOL)' },
  { name: 8, label: 'Mauro Iasi (PCB)' },
  { name: 9, label: 'Pastor Everaldo (PSC)' },
  { name: 10, label: 'Rui Costa Pimenta (PCO)' },
  { name: 11, label: 'Zé Maria (PSTU)' },
  { name: 77, label: 'Ninguém/Branco/Nulo' },
  { name: 88, label: 'NS' },
  { name: 99, label: 'NR' } ];
  break;
case 'DVP':
    title = 'Percentual de indecisos';
    labels = [ { name: -1, label: '-1' },
  { name: 1, label: 'Sim' },
  { name: 2, label: 'Não' } ];
  break;
case 'CHP':
    title = 'Chance de vitória na eleição presidencial';
    labels = [];
    break;
case 'ETP2':
    title = 'Intenção de voto para 2 turno (Cenário 1)';
    labels = [ { name: 1, label: 'Aécio Neves (PSDB)' },
  { name: 2, label: 'Dilma Roussef (PT)' },
  { name: 7, label: 'Ninguém/Branco/Nulo' },
  { name: 8, label: 'NS' },
  { name: 9, label: 'NR' } ];
  break;
case 'ETP3':
    title = 'Intenção de voto para 2 turno (Cenário 2)';
    labels = [ { name: 1, label: 'Dilma Roussef (PT)' },
  { name: 2, label: 'Eduardo Campos (PSB)' },
  { name: 7, label: 'Ninguém/Branco/Nulo' },
  { name: 8, label: 'NS' },
  { name: 9, label: 'NR' } ];
  break;
case 'ADP2':
    title = 'Avaliação do desempenho da presidenta Dilma';
    labels = [];
    break;
case 'C3':
    title = 'Satisfação em relação ao Brasil';
    labels = [];
    break;
case 'IPG':
    title = 'Grau de interesse por política';
    labels = [];
    break;
case 'CONV':
    title = 'Engajamento em conversa/discussão política';
    labels = [];
    break;
case 'NET1':
    title = 'Hábito de acessar a internet';
    labels = [];
    break;
case 'REL1':
    title = 'Religião';
    labels = [];
    break;
case 'REL2':
    title = 'Frequência com que vai à igreja/culto';
    labels = [];
    break;
case 'COR':
    title = 'Cor/Raça';
    labels = [];



    ----------

db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$set: {variables: []}});

db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'TRABALHO', title: 'Condição de trabalho', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'ROD', title: 'Rodada do tracking', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'MUN', title: 'Município', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'ZONA', title: 'Zona residencial', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'UF', title: 'Estado', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'SEXO', title: 'Sexo', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'IDADE', title: 'Idade', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'IDADEF', title: 'Idade categorizada', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'ESC', title: 'Grau de escolaridade', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'SIT', title: 'Situação do trabalho', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'PEA', title: 'Situação do trabalhador', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'RENDAF', title: 'Renda domiciliar', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'EPP', title: 'Intenção de voto espontânea para presidente', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'COP1', title: 'Grau de conhecimento a respeito de Dilma', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'COP2', title: 'Grau de conhecimento a respeito de Aécio', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'COP3', title: 'Grau de conhecimento a respeito de Eduardo', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'PVP1', title: 'Possibilidade de votar em Dilma', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'PVP2', title: 'Possibilidade de votar em Aécio', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'PVP3', title: 'Possibilidade de votar em Eduardo', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'ETP1', title: 'Intenção de voto estimulada para presidente', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'DVP', title: 'Percentual de indecisos', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'CHP', title: 'Chance de vitória na eleição presidencial', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'ETP2', title: 'Intenção de voto para 2 turno (Cenário 1)', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'ETP3', title: 'Intenção de voto para 2 turno (Cenário 2)', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'ADP2', title: 'Avaliação do desempenho da presidenta Dilma', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'C3', title: 'Satisfação em relação ao Brasil', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'IPG', title: 'Grau de interesse por política', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'CONV', title: 'Engajamento em conversa/discussão política', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'NET1', title: 'Hábito de acessar a internet', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'REL1', title: 'Religião', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'REL2', title: 'Frequência com que vai à igreja/culto', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'COR', title: 'Cor/Raça', data: [] }}})


----


ATUAL

db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$set: {variables: []}});
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'EPP', title: 'Intenção de voto espontânea para presidente', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'ETP1', title: 'Intenção de voto estimulada para presidente', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'DVP', title: 'Grau de decisão', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'CHP', title: 'Quem vai ganhar?', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'ETP2', title: '2o turno Dilma vs Aécio', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'ETP3', title: '2o turno Dilma vs Eduardo', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'ADP2', title: 'Avaliação do desempenho da presidenta Dilma', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'C3', title: 'Satisfação em relação ao Brasil', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'COP1', title: 'Grau de conhecimento a respeito de Dilma', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'COP2', title: 'Grau de conhecimento a respeito de Aécio', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'COP3', title: 'Grau de conhecimento a respeito de Eduardo', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'PVP1', title: 'Possibilidade de votar em Dilma', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'PVP2', title: 'Possibilidade de votar em Aécio', data: [] }}})
db.dashboards.update({_id: ObjectId('53c8109e95b8466b0d70acca')}, {$push: {variables: { name: 'PVP3', title: 'Possibilidade de votar em Eduardo', data: [] }}})
