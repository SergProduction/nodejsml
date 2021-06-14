#  Lerna

### Мотивация
Лерна нужна чтоб мы могли объединить два рабочих проэета с меньшими усилиями.
Она позволяет изолировать готовые проэкты, со свомим системами билдеров, конфигами, версиями пакетов  
Так же создавать рядом новый проэкт (кор)  
и подлючать кор в другие проэкты  
Так же она нам поможет по этапно унифицировать билдеры конфиги и пакеты в проэктах  
и выносить их в рут для всех проэктов  

### для старта
1. npm install --global lerna
2. lerna bootstrap --hoist
(чтобы установить все зависимости (включая символические ссылки).


### работа с lerna
- `lerna add packagename` добавить в каждый проэкт packagename в dependencies
- `lerna add packagename --dev` добавить в каждый проэкт packagename в devDependencies
- `lerna add packagename --scope=projectname` добавить packagename только в projectname
- `lerna add projectname1 --scope=projectname2` добавит projectname1 в projectname2
- `lerna bootstrap` создаст node_modules в каждом projectname
- `lerna bootstrap --hoist` поднимет все packagename из node_modules в рут для всех projectname
- `lerna run command` запустить command в каждом projectname
- `lerna run --scope projectname command`, запустить command только projectname
- `lerna clean`, удалит node_modules из всех packages

__примечание__: projectname - это имя модуля, которое указано в *package.json .name*  

для уcтановки всяких дев тулзов типо линта прикомита и т.п. используйте `npm i -D packagename`  

с командой `lerna bootstrap --hoist` могут быть проблемы когда в двух и более project будет одинаковый package, но с разными версиями, если вдруг такой появится, надо будет указаьб в `lerna.json [{"version":"independent"}]`

*источники*  
[в целом про лерну (старая версия лерны, некоторые команды не актуальны)](https://webdevblog.ru/monorepozitarii-na-primerah-s-ispolzovaniem-lerna-chast-1/)  
[команда add](https://github.com/lerna/lerna/blob/main/commands/add/README.md)  
[команда bootstrap](https://github.com/lerna/lerna/blob/main/commands/bootstrap/README.md)  
[команда run](https://github.com/lerna/lerna/blob/main/commands/run/README.md)