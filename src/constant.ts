export const DataKeyMap: Record<string, string[]> = {
    time: ['交易时间'],
    type: ['交易类型', '交易分类'],
    receiver: ['交易对方'],
    goods: ['商品', '商品说明'],
    inOrOut: ['收/支'],
    amount: ['金额(元)', '金额'],
    payWay: ['支付方式', '收/付款方式'],
    status: ['当前状态', '交易状态'],
    businessNo: ['交易单号', '交易订单号'],
    shopNo: ['商户单号', '商家订单号'],
    receiverAccount: ['对方账号'],
    note: ['备注'],
};

export const DataFieldOption = {
    inOrOut: ['支出', '收入', '其他'],
    firstCategory: ['饮食', '购物', '交通'],
    secondCategory: {
        饮食: ['三餐', '饮料', '食品', '水果', '零食', '餐券'],
        购物: [
            '服装',
            '数码产品',
            '礼品',
            '家具',
            '游戏',
            '护肤品',
            '杂物',
            '鞋帽包',
            '配件',
            '日用品',
            '数码配件',
            '饰品',
            '化妆品',
            '运动用品',
            '其他物品',
            '家电',
            '居家用品',
        ],
        交通: [
            '公共交通',
            '共享单车',
            '加油',
            '停车费',
            '打车',
            '机票',
            '快递',
            '高铁',
            '公交卡',
            '桥路费',
            '租车',
        ],
    },
    wallet: ['现金', '小金库', '信用卡'],
    member: ['本人', '父母', '兄弟姐妹', '祖父母'],
    project: ['日常'],
};

export const exportFields = [
    { label: '交易类型', key: 'inOrOut' },
    { label: '分类', key: 'firstCategory' },
    { label: '子分类', key: 'secondCategory' },
    { label: '账户1', key: 'wallet' },
    { label: '金额', key: 'amount' },
    { label: '日期', key: 'time' },
    { label: '成员', key: 'member' },
    { label: '项目', key: 'project' },
    { label: '备注', key: 'note' },
    // { label: '', key: 'type' },
    // { label: '', key: 'receiver' },
    // { label: '', key: 'goods' },
    // { label: '', key: 'payWay' },
    // { label: '', key: 'status' },
    // { label: '', key: 'businessNo' },
    // { label: '', key: 'shopNo' },
    // { label: '', key: 'receiverAccount' },
];

export enum FORM_ITEM_TYPE {
    INPUT,
    CASCADER,
    SELECT,
    DATETIME,
    INPUT_AMOUNT,
    TEXTAREA,
}

export const enum MODE {
    IMPORT,
    EDIT,
    EXPORT,
}

export const enum EDITED_LIST_TYPE {
    EDITED,
    DELETED,
}
