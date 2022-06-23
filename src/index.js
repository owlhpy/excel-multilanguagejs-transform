
var xlsx = require("node-xlsx");
// var fs = require("fs") 


const defaultConfig = {
	outputFolderPath: './genFiles',//生成文件的输出目录
	xlsFilePath: './multiLang.xlsx',//读取的xls文件路径
	keyValueObj: { 'zh_CN': { key: 1, value: 2 }, 'en_US': { key: 1, value: 3 }, 'zh_TW': { key: 1, value: 4 }, 'locales': { key: 0, value: 1, exportFormat: 'const locales = {${data} \r }', valueFormat: 'intl.formatMessage({id:"${data}"})' } },//excel表格对应的列
	startFromIndex: 1,//从表格第几行开始读取数据
	tableIndex: 0,//选择的表格，从0开始算，默认0
	arrGenDataType: ['locales']//储存格式是数组的key
}


function readXls(path, outputPath, fs) {
	try {
		if (fs.existsSync(outputPath)) {
			console.log('The path exists.');
		} else {
			try {
				fs.promises.mkdir(outputPath)
			} catch (err) {
				console.error(err.message);
			}

		}

		const tableData = xlsx.parse(`${path}`);
		return tableData;
	} catch (error) {
		console.log("excel读取异常,error=%s", error);
		return null;
	}
}


function genMultiLang(config, fs) {
	const currentConfig = { ...defaultConfig, ...config };
	const tableData = readXls(currentConfig.xlsFilePath, currentConfig.outputFolderPath, fs);
	const { keyValueObj, arrGenDataType } = currentConfig;
	if (tableData) {
		const table0 = tableData[`${currentConfig.tableIndex}`];//选取第几个表格
		const data = table0.data.slice(currentConfig.startFromIndex);
		let files = new Map();
		Object.keys(keyValueObj).map(item => {
			if (arrGenDataType.includes(item)) {
				files.set(`${item}`, { key: keyValueObj[item], content: [] })
			} else {
				files.set(`${item}`, { key: keyValueObj[item], content: {} })
			}
		})

		for (var index in data) {
			files.forEach((value, key, map) => {
				let temp = value.content;
				if (value.key.valueFormat) {
					data[index][value.key.key] && temp.push(`\r ${data[index][value.key.key]}:${value.key.valueFormat.replace(/\$\{data\}/gi, data[index][value.key.value])}`)
				} else {
					temp[data[index][value.key.key]] = data[index][value.key.value];
				}
				files.set(`${key}`, { ...value, content: temp })
			})
		}

		files.forEach((value, key, map) => {
			let temp = value.key?.exportFormat?.split('${data}');
			let formater = (temp ? `${temp[0]}${value.content}${temp[1]}` : '') || `module.exports=${JSON.stringify(value.content, null, "\t")}`
			fs.writeFile(
				`${currentConfig.outputFolderPath}/${key}.js`,
				formater,
				(err, data) => {
					if (err) throw err;
				}
			);
		})
	}

}


export {
	defaultConfig,
	genMultiLang
}


