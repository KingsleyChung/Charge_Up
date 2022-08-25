import React from 'react';
import { FlowItem } from '../typings';
import { Card, Form, Input, Select, Cascader } from 'antd';
import { FORM_ITEM_TYPE, DataFieldOption } from '../constant';

interface Props {
    data: FlowItem;
    saveData: (data: FlowItem) => void;
}

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
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
console.log(categoryOptions)

const DetailCard: React.FC<Props> = (props: Props): JSX.Element => {
    const [form] = Form.useForm<FlowItem>();

    const renderFormItem = (param: { name: string; label: string; type: FORM_ITEM_TYPE; rules?: any[] }): JSX.Element => {
        const { name, label, type, rules } = param;
        const itemProps: Record<string, any> = {
            label,
            rules,
        };
        if (type !== FORM_ITEM_TYPE.CASCADER) {
            itemProps.name = name;
        }

        return (
            <Form.Item {...itemProps}>
                {/* {type === FORM_ITEM_TYPE.INPUT && <Input />} */}
                {type === FORM_ITEM_TYPE.CASCADER && <Cascader options={categoryOptions} />}
            </Form.Item>
        )
    };

    return (
        <Card>
            <Form {...layout} form={form} name="control-hooks" initialValues={props.data} onFinish={props.saveData}>
                {renderFormItem({ name: 'firstCategory', label: '分类', type: FORM_ITEM_TYPE.CASCADER, rules: [{ required: true }] })}
                {renderFormItem({ name: 'amount', label: '金额', type: FORM_ITEM_TYPE.INPUT, rules: [{ required: true }] })}
            </Form>
        </Card>
    );
}

export default DetailCard;