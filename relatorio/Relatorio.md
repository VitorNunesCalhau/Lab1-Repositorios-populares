## Introdução

Este relatório tem como objetivo analisar características comuns entre sistemas populares no GitHub. Para isso, foram coletadas informações de repositórios amplamente conhecidos na plataforma, avaliando aspectos como idade, contribuições, releases, atualizações, linguagens utilizadas e gestão de issues.

A partir dessas informações, buscamos responder a seis perguntas de pesquisa (RQs) que investigam padrões recorrentes entre os sistemas mais bem avaliados e utilizados da comunidade de desenvolvimento de software.


## Metodologia

A análise foi realizada utilizando a API GraphQL do GitHub para coletar dados de repositórios populares. As métricas analisadas incluem:
- RQ1: Idade do repositório em dias
- RQ2: Total de pull requests aceitas
- RQ3: Total de releases do projeto
- RQ4: Tempo desde último commit
- RQ5: Principais linguagens dos repositórios
- RQ6: Razão entre o número de issues fehcadas pelo total de issues


## Hipóteses

### RQ 01: Sistemas populares são maduros/antigos?
Hipótese: Esperamos que sistemas populares sejam maduros.

### RQ 02: Sistemas populares recebem muita contribuição externa?
Hipótese: Acreditamos que sistemas populares recebem muitas contribuições.

### RQ 03: Sistemas populares lançam releases com frequência?
Hipótese: Suponhamos que frameworks e bibliotecas populares lancem releases frequentes.

### RQ 04: Sistemas populares são atualizados com frequência?
Hipótese: Achamos que sistemas populares são frequentemente atualizados para corrigir bugs e evoluir.

### RQ 05: Sistemas populares são escritos nas linguagens mais populares?
Hipótese: A tendência é que sim, especialmente com JavaScript e Python.

### RQ 06: Sistemas populares possuem um alto percentual de issues fechadas?
Hipótese: Supomos que sim, pois são bem gerenciados.

### RQ 07 Sistemas escritos em linguagens mais populares recebem mais contribuição externa, lançam mais releases e são atualizados com mais frequência?
Hipótese: Acreditamos que linguagens populares atraem mais desenvolvedores, resultando em mais contribuições, releases e atualizações frequentes.

## Resultados Obtidos
### RQ 01
Mediana da idade dos repositórios  - 8.25
![Mostra a mediana da idade dos repositórios populares](relatorio.RQ01)

### RQ 02
Mediana de pull requests - 613.5
![Mostra a mediana do total de pull requests aceitos dos repositórios populares](relatorio.RQ02)

### RQ 03
Mediana de releases - 32.5
![Mostra a mediana da total de releases dos repositórios populares](relatorio.RQ03)

### RQ 04
Mediana do tempo desde última alteração - 7
![Mostra a mediana do tempo da última atualização dos repositórios populares](relatorio.RQ04)

### RQ 05
Python - 171
TypeScript - 145
JavaScript - 145
None - 105
Go - 72
Java - 52
C++ - 51
C - 26
Shell - 23
Jupyter Notebook - 21
![Mostra a mediana das linguagens primárias dos repositórios populares](relatorio.RQ05)

### RQ 06
Mediana do ratio de issues: 0.86
![Mostra a mediana da razão entre número de issues fechadas pelo total de issues dos repositórios populares](relatorio.RQ06)

## Discussão
