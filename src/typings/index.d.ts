import { Moment } from 'moment';

declare type FlowItem = {
    appType: 'wechat' | 'alipay';
    time: Moment;
    type: string;
    receiver: string;
    goods: string;
    inOrOut: string;
    amount: number;
    payWay: string;
    status: string;
    businessNo: string;
    shopNo: string;
    receiverAccount: string;
    note: string;
    firstCategory?: string;
    secondCategory?: string;
    wallet?: string;
    member?: string;
    project?: string;
}