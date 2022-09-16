import * as XLSX from 'xlsx';
import moment from 'moment';
import { DataKeyMap } from '../constant';

const xlsxToJson = (file: any) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            return reject(new Error('文件为空'));
        }
        const reader = new FileReader();
        reader.onload = (evt: any) => {
            try {
                let data = evt.target.result;
                let workbook = XLSX.read(data, { type: 'binary', raw: true });
                let res = XLSX.utils.sheet_to_json(
                    workbook.Sheets[workbook.SheetNames[0]]
                );
                if (!res.length) {
                    return reject(new Error('文件内容为空'));
                }
                resolve(res);
            } catch (err) {
                reject(err);
            }
        };
        reader.readAsBinaryString(file);
    });
};

// require needKeys.length = xlsxKeys.length
// data为[{},{}],needKeys是需要哪些英文字段，xlsxKeys是列头名称（中文）,filename为文件名
const jsonToXlsx = (
    data: any,
    needKeys: string[],
    xlsxKeys: string[],
    filename: string
) => {
    if (!data.length) {
        return false;
    }
    if (needKeys.length !== xlsxKeys.length) {
        xlsxKeys = needKeys;
    }
    data = data.map((v: any) => {
        let res: any = {};
        for (let i = 0; i < needKeys.length; i++) {
            res[xlsxKeys[i]] = v[needKeys[i]];
        }
        return res;
    });
    var XLSX = require('xlsx');
    const wopts = { bookType: 'xls', bookSST: false, type: 'binary' };
    const wb: any = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} };
    wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(data);
    saveAs(
        new Blob([s2ab(XLSX.write(wb, wopts)) as BlobPart], {
            type: 'application/octet-stream',
        }),
        filename + '.' + (wopts.bookType === 'biff2' ? 'xls' : wopts.bookType)
    );
    return true;
};

// 以下三个函数保存json问excel文件
const saveAs = (obj: any, fileName: string) => {
    let tmpa = document.createElement('a');
    tmpa.download = fileName || '下载';
    tmpa.href = URL.createObjectURL(obj);
    tmpa.click();
    setTimeout(function () {
        URL.revokeObjectURL(obj);
    }, 100);
};

const s2ab = (s: any) => {
    if (typeof ArrayBuffer !== 'undefined') {
        let buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) {
            view[i] = s.charCodeAt(i) & 0xff;
        }
        return buf;
    } else {
        let buf = new Array(s.length);
        for (let i = 0; i !== s.length; ++i) {
            buf[i] = s.charCodeAt(i) & 0xff;
        }
        return buf;
    }
};

const formatData = (originData: any) => {
    const result = [];

    let isAlipay = false;
    let isWechat = false;
    for (let key in originData[0]) {
        if (key.indexOf('支付宝') > -1) {
            isAlipay = true;
            break;
        }
        if (key.indexOf('微信') > -1) {
            isWechat = true;
            break;
        }
    }
    if (!isAlipay && !isWechat) {
        throw new Error('不支持除微信和支付宝以外的流水');
    }

    let headerLine = 0;
    let endLine = -1;
    if (isWechat) {
        headerLine = 13;
    }
    const header: any[] = [];
    Object.keys(originData[headerLine]).forEach((key) => {
        header.push(originData[headerLine][key].trim());
    });

    for (let i = headerLine + 1; i < originData.length && endLine === -1; i++) {
        const row = originData[i];
        const rowData: any = {};
        Object.keys(row).forEach((key: string, index: number) => {
            const value = row[key];
            if (
                index === 0 &&
                typeof value === 'string' &&
                value.indexOf('-----') > -1
            ) {
                endLine = i;
                return;
            }
            rowData[header[index]] =
                typeof value === 'string' ? value.trim() : value;
        });
        rowData.appType = isAlipay ? 'alipay' : 'wechat';
        result.push(rowData);
    }
    return result;
};

const getUnifiedData = (data1: any[], data2: any[]) => {
    let convertMap: Record<string, string> = {};
    Object.keys(DataKeyMap).forEach((key: string) => {
        (DataKeyMap[key] || []).forEach((label: string) => {
            convertMap[label] = key;
        });
    });

    // 统一数据结构
    let unifiedData: any[] = [];
    const _converData = (data: any[]) => {
        let newData: Record<string, any> = {};
        for (let key in data) {
            const finalKey = convertMap[key];
            let value = data[key];
            if (finalKey) {
                if (finalKey === 'time') {
                    value = moment(value);
                }
                if (finalKey === 'amount') {
                    if (typeof value === 'string' && value?.startsWith('¥')) {
                        value = value.slice(1, value.length);
                    }
                    value = +value;
                }
                newData[finalKey] = value;
            } else {
                newData[key] = value;
            }
        }
        return newData;
    };
    data1.forEach((data) => {
        unifiedData.push(_converData(data));
    });
    data2.forEach((data) => {
        unifiedData.push(_converData(data));
    });

    // 时间升序排列
    unifiedData = unifiedData.sort((a, b) => {
        return moment(a.time).diff(moment(b.time), 'seconds');
    });
    return unifiedData;
};

const getJsonFromFile = (file: any) => {
    return new Promise((resolve) => {
        const fileReader = new FileReader();
        fileReader.readAsText(file, 'UTF-8');
        fileReader.onload = (e) => {
            resolve(JSON.parse(e?.target?.result as string));
        };
    });
};

const objectToJsonFile = (data: any, fileName: string) => {
    if (!data) {
        alert('保存的数据为空');
        return;
    }
    if (!fileName) {
        alert('无fileName');
        return;
    }
    fileName += '.json';
    if (typeof data === 'object') {
        data = JSON.stringify(data, undefined, 4);
    }
    var blob = new Blob([data], { type: 'text/json' }),
        e = document.createEvent('MouseEvents'),
        a = document.createElement('a');
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
    e.initMouseEvent(
        'click',
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
    );
    a.dispatchEvent(e);
};

const utils = {
    xlsxToJson,
    jsonToXlsx,
    formatData,
    getUnifiedData,
    getJsonFromFile,
    objectToJsonFile,
};

export default utils;
