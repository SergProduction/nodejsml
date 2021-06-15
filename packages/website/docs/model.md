---
sidebar_label: "Model"
sidebar_position: 2
---



# Model

У модели есть свое внутренее впредставление данных, (modelData)
оно нужно чтоб хранить данные в таком виде, чтоб можно было производительно  
делать вычисления с этими данными,  
так же необходимо реализовать два метода `encode, decode`  
это сериализатор и десериализатор данных модели в примитивы js  
они нужны чтоб сохранять вычисленную (натренированную) модель данных в бд,  
напрямую с бд работать не надо.  

У модели есть реализованные методы `saveModel, loadModel`  
унаследовавшись от класса Model, ваш класс будет иметь эти методы  
`saveModel("название-модели")` - будет вызывать ваш метод encode,  
чтоб получить модель данных как примитив js,
и сохранит в файл ./data/models/"название-модели".json.
В след раз можно будет вопрользоватся методом
`loadModel("название-модели")` - который выгрузить данные из бд,  
и вызовет ваш decode(IOModelData) 