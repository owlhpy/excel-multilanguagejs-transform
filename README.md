# excel-multilanguagejs-transform
Generate js in multi-language file format through excel

### Target
input an excel file like this:

<img width="938" alt="image" src="https://user-images.githubusercontent.com/22045431/175257838-4be28afc-38d4-4916-955f-c23805562740.png">

output a folder with js files:  

<img width="132" alt="image" src="https://user-images.githubusercontent.com/22045431/175258674-cbab5db4-6040-4170-8435-a2ce4040c4e8.png">

zh_CN.js:  
```
module.exports={
key:value
}
```
locales.js:  
```
const locales = {
key:intl.formatMessage({id:"value"}),
}
```

### Getting Start
First thing is to install, node version:v16.0.0+ is required
```console
npm install excel-multilanguagejs-transform -D
```
or  
```console
cnpm install excel-multilanguagejs-transform -D
```

### Usage
example:
```
import { genMutilLang,defaultConfig } from "excel-to-js";
console.log(defaultConfig)
const fs = require('node:fs');
const path = require('node:path')
genMutilLang({ outputFolderPath: path.resolve('./testplugins/genFiles'), xlsFilePath:path.resolve('./testplugins/mutilLang.xlsx')}, fs);

```
genMutilLang(setting,fs)
```
default setting:  

{
	outputFolderPath: './genFiles',//生成文件的输出目录
	xlsFilePath: './multiLang.xlsx',//读取的xls文件路径
	keyValueObj: { 
        'zh_CN': { key: 1, value: 2 }, //excel里面对应列的位置
        'en_US': { key: 1, value: 3 }, 
        'zh_TW': { key: 1, value: 4 }, 
        'locales': { key: 0, value: 1, exportFormat:'const locales = {${data} \r }', valueFormat: 'intl.formatMessage({id:"${data}"})'}
        },//excel表格对应的列
	startFromIndex: 1,//从表格第几行开始读取数据
	tableIndex: 0,//选择的表格，从0开始算，默认0
	arrGenDataType: ['locales']//储存格式是数组的key
}
```
according to keyValueObj to generate js files, default exportFormat is 'module.export={${data}}'.  
Use keyValueObj's key as file name.  
fs is required.


### License

#### [MIT](./LICENSE)


