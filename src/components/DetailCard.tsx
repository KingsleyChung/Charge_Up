import React, { useEffect } from 'react';
import { FlowItem } from '../typings';
import { Card, Form, Input, Select, Cascader, DatePicker, Button, Row, Col, Divider, Typography } from 'antd';
import { FORM_ITEM_TYPE, DataFieldOption } from '../constant';
import TextArea from 'antd/lib/input/TextArea';

const { Option } = Select;

interface Props {
    data: FlowItem & { category?: string[] | undefined };
    saveData: (data: FlowItem) => void;
    deleteData: () => void;
}

const itemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
};

const categoryOptions = (() => {
    const options: any[] = [];
    DataFieldOption.firstCategory.forEach(firstCategory => {
        const option: Record<string, any> = {
            label: firstCategory,
            value: firstCategory,
        }
        if (DataFieldOption.secondCategory[firstCategory as keyof typeof DataFieldOption.secondCategory]) {
            option.children = DataFieldOption.secondCategory[firstCategory as keyof typeof DataFieldOption.secondCategory].map(secondCategory => {
                return {
                    label: secondCategory,
                    value: secondCategory,
                };
            });
        }
        options.push(option);
    });
    return options;
})();

const DetailCard: React.FC<Props> = (props: Props): JSX.Element => {
    const [form] = Form.useForm<FlowItem>();
    useEffect(() => {
        const data = props.data;
        if (typeof data.firstCategory === 'string') {
            data.category = data.firstCategory.split('/');
        } else {
            data.category = [];
        }
        if (!data.wallet) {
            data.wallet = '';
        }
        if (!data.member) {
            data.member = '';
        }
        if (!data.project) {
            data.project = '';
        }
        if (!data.note) {
            data.note = '';
        }
        form.setFieldsValue(props.data);
    }, [props])

    const renderFormItem = (param: { name: string; label: string; type: FORM_ITEM_TYPE; rules?: any[]; options?: any[] }): JSX.Element => {
        const { name, label, type, rules, options } = param;
        const itemProps: Record<string, any> = {
            label,
            rules,
            name,
        };
        let formItem: JSX.Element = <></>;
        if (type === FORM_ITEM_TYPE.INPUT) {
            formItem = <Input />;
        } else if (type === FORM_ITEM_TYPE.INPUT_AMOUNT) {
            formItem = <Input prefix='￥' suffix='RMB' />;
        } else if (type === FORM_ITEM_TYPE.CASCADER) {
            formItem = <Cascader options={categoryOptions} />;
        } else if (type === FORM_ITEM_TYPE.SELECT) {
            formItem = (
                <Select>
                    {(options || []).map((option, index) => <Option key={index} value={option}>{option}</Option>)}
                </Select>
            );
        } else if (type === FORM_ITEM_TYPE.DATETIME) {
            formItem = <DatePicker showTime />
        } else if (type === FORM_ITEM_TYPE.TEXTAREA) {
            formItem = <TextArea />
        }

        return (
            <Form.Item {...itemProps}>
                {formItem}
            </Form.Item>
        )
    };

    const onFinish = (values: Partial<FlowItem> & { category?: string[] | undefined }) => {
        if (values.category?.length) {
            values.firstCategory = values.category[0];
            values.secondCategory = values.category[1];
            delete values.category;
        }
        props.saveData(values as FlowItem);
    };

    return (
        <Card style={{ margin: '1.6rem' }}>
            <Form {...itemLayout} size='small' form={form} name="control-hooks" initialValues={props.data} onFinish={onFinish}>
                <Row gutter={12}>
                    <Col span={12}>
                        {renderFormItem({ name: 'amount', label: '金额', type: FORM_ITEM_TYPE.INPUT_AMOUNT, rules: [{ required: true }] })}
                    </Col>
                    <Col span={12}>
                        {renderFormItem({ name: 'category', label: '分类', type: FORM_ITEM_TYPE.CASCADER, rules: [{ required: true }] })}
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={12}>
                        {renderFormItem({ name: 'inOrOut', label: '收/支', type: FORM_ITEM_TYPE.SELECT, rules: [{ required: true }], options: DataFieldOption.inOrOut })}
                    </Col>
                    <Col span={12}>
                        {renderFormItem({ name: 'wallet', label: '钱包', type: FORM_ITEM_TYPE.SELECT, rules: [{ required: true }], options: DataFieldOption.wallet })}
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={12}>
                        {renderFormItem({ name: 'member', label: '成员', type: FORM_ITEM_TYPE.SELECT, options: DataFieldOption.member })}
                    </Col>
                    <Col span={12}>
                        {renderFormItem({ name: 'project', label: '项目', type: FORM_ITEM_TYPE.SELECT, options: DataFieldOption.project })}
                    </Col>
                </Row>
                {renderFormItem({ name: 'time', label: '时间', type: FORM_ITEM_TYPE.DATETIME, rules: [{ required: true }]})}
                {renderFormItem({ name: 'note', label: '备注', type: FORM_ITEM_TYPE.TEXTAREA })}
                <Divider />
                <Typography>
                    额外信息
                </Typography>
                <Row justify='center' gutter={24} style={{ marginTop: '1.6rem' }}>
                    <Col>
                        <Button type="primary" danger onClick={props.deleteData}>删除</Button>
                    </Col>
                    <Col>
                        <Button type="primary" htmlType="submit">
                            保存
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
}

export default DetailCard;