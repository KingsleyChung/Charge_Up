import * as XLSX from 'xlsx';
import moment from 'moment';
import { DataKeyMap } from '../constant';

const xlsxToJson = (file: any) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('文件为空'))
    }
    const reader = new FileReader()
    reader.onload = (evt: any) => {
      try {
        let data = evt.target.result
        let workbook = XLSX.read(data, { type: 'binary', raw: true })
        let res = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
        if (!res.length) {
          return reject(new Error('文件内容为空'))
        }
        resolve(res)
      } catch (err) {
        reject(err)
      }
    }
    reader.readAsBinaryString(file)
  })
}

const formatData = (originData: any) => {
  const result = []

  let isAlipay = false
  let isWechat = false
  for (let key in originData[0]) {
    if (key.indexOf('支付宝') > -1) {
      isAlipay = true
      break
    }
    if (key.indexOf('微信') > -1) {
      isWechat = true
      break
    }
  }
  if (!isAlipay && !isWechat) {
    throw new Error('不支持除微信和支付宝以外的流水')
  }

  let headerLine = 0
  let endLine = -1
  if (isWechat) {
    headerLine = 13
  }
  const header: any[] = []
  Object.keys(originData[headerLine]).forEach(key => {
    header.push(originData[headerLine][key].trim())
  })

  for (let i = headerLine + 1; i < originData.length && endLine === -1; i++) {
    const row = originData[i]
    const rowData: any = {}
    Object.keys(row).forEach((key: string, index: number) => {
      const value = row[key]
      if (index === 0 && typeof value === 'string' && value.indexOf('-----') > -1) {
        endLine = i
        return
      }
      rowData[header[index]] = typeof value === 'string' ? value.trim() : value
    })
    rowData.appType = isAlipay ? 'alipay' : 'wechat'
    result.push(rowData)
  }
  return result
}

const getUnifiedData = (data1: any[], data2: any[]) => {
  let convertMap: Record<string, string> = {}
  Object.keys(DataKeyMap).forEach((key: string) => {
    (DataKeyMap[key] || []).forEach((label: string) => {
      convertMap[label] = key
    })
  })

  // 统一数据结构
  let unifiedData: any[] = []
  const _converData = (data: any[]) => {
    let newData: Record<string, any> = {}
    for (let key in data) {
      const finalKey = convertMap[key]
      let value = data[key]
      if (finalKey) {
        if (finalKey === 'time') {
          value = moment(value).format('YYYY-MM-DD HH:mm')
        }
        if (finalKey === 'amount') {
          if (value?.startsWith('¥')) {
            value = value.slice(1, value.length);
          }
          value = +value;
        }
        newData[finalKey] = value
      } else {
        newData[key] = value
      }
    }
    return newData
  }
  data1.forEach(data => {
    unifiedData.push(_converData(data))
  })
  data2.forEach(data => {
    unifiedData.push(_converData(data))
  })

  // 时间升序排列
  unifiedData = unifiedData.sort((a, b) => {
    return moment(a.time).diff(moment(b.time), 'seconds')
  })
  return unifiedData
}

export default {
  xlsxToJson,
  formatData,
  getUnifiedData,
}
