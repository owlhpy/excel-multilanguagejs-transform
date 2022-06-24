function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var xlsx = require("node-xlsx"); // var fs = require("fs") 


var defaultConfig = {
  outputFolderPath: './genFiles',
  //生成文件的输出目录
  xlsFilePath: './multiLang.xlsx',
  //读取的xls文件路径
  keyValueObj: {
    'zh_CN': {
      key: 1,
      value: 2
    },
    'en_US': {
      key: 1,
      value: 3
    },
    'zh_TW': {
      key: 1,
      value: 4
    },
    'locales': {
      key: 0,
      value: 1,
      exportFormat: 'const locales = {${data} \r }',
      valueFormat: 'intl.formatMessage({id:"${data}"})'
    }
  },
  //excel表格对应的列
  startFromIndex: 1,
  //从表格第几行开始读取数据
  tableIndex: 0,
  //选择的表格，从0开始算，默认0
  arrGenDataType: ['locales'] //储存格式是数组的key

};

function readXls(path, outputPath, fs) {
  try {
    if (fs.existsSync(outputPath)) {
      console.log('The path exists.');
    } else {
      try {
        fs.promises.mkdir(outputPath);
      } catch (err) {
        console.error(err.message);
      }
    }

    var tableData = xlsx.parse("".concat(path));
    return tableData;
  } catch (error) {
    console.log("excel读取异常,error=%s", error);
    return null;
  }
}

function genMultiLang(config, fs) {
  var currentConfig = _objectSpread2(_objectSpread2({}, defaultConfig), config);

  var tableData = readXls(currentConfig.xlsFilePath, currentConfig.outputFolderPath, fs);
  var keyValueObj = currentConfig.keyValueObj,
      arrGenDataType = currentConfig.arrGenDataType;

  if (tableData) {
    var index;

    (function () {
      var table0 = tableData["".concat(currentConfig.tableIndex)]; //选取第几个表格

      var data = table0.data.slice(currentConfig.startFromIndex);
      var files = new Map();
      Object.keys(keyValueObj).map(function (item) {
        if (arrGenDataType.includes(item)) {
          files.set("".concat(item), {
            key: keyValueObj[item],
            content: []
          });
        } else {
          files.set("".concat(item), {
            key: keyValueObj[item],
            content: {}
          });
        }
      });

      for (index in data) {
        files.forEach(function (value, key, map) {
          var temp = value.content;

          if (value.key.valueFormat) {
            data[index][value.key.key] && temp.push("\r ".concat(data[index][value.key.key], ":").concat(value.key.valueFormat.replace(/\$\{data\}/gi, data[index][value.key.value])));
          } else {
            temp[data[index][value.key.key]] = data[index][value.key.value];
          }

          files.set("".concat(key), _objectSpread2(_objectSpread2({}, value), {}, {
            content: temp
          }));
        });
      }

      files.forEach(function (value, key, map) {
        var _value$key, _value$key$exportForm;

        var temp = (_value$key = value.key) === null || _value$key === void 0 ? void 0 : (_value$key$exportForm = _value$key.exportFormat) === null || _value$key$exportForm === void 0 ? void 0 : _value$key$exportForm.split('${data}');
        var formater = (temp ? "".concat(temp[0]).concat(value.content).concat(temp[1]) : '') || "module.exports=".concat(JSON.stringify(value.content, null, "\t"));
        fs.writeFile("".concat(currentConfig.outputFolderPath, "/").concat(key, ".js"), formater, function (err, data) {
          if (err) throw err;
        });
      });
    })();
  }
}

export { defaultConfig, genMultiLang };
