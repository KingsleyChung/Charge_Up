import React, { useEffect } from 'react';
import { FlowItem } from '../typings';
import {
    Card,
    Form,
    Input,
    Select,
    Cascader,
    DatePicker,
    Button,
    Row,
    Col,
    Divider,
    Typography,
    Tooltip,
} from 'antd';
import { FORM_ITEM_TYPE, DataFieldOption } from '../constant';
import TextArea from 'antd/lib/input/TextArea';

const { Option } = Select;
const { Paragraph } = Typography;

interface Props {
    data: FlowItem & { category?: string[] | undefined };
    config: Record<string, any> | null;
    saveData: (data: FlowItem) => void;
    deleteData: () => void;
}

const itemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
};

const DetailCard: React.FC<Props> = (props: Props): JSX.Element => {
    const fieldOption = props.config?.DataFieldOption || DataFieldOption;
    const [form] = Form.useForm<FlowItem>();

    useEffect(() => {
        const data = props.data;
        if (!data.category?.length && typeof data.firstCategory === 'string') {
            data.category = data.firstCategory.split('/');
        }
        // else {
        //     data.category = [];
        // }
        // if (!data.wallet) {
        //     data.wallet = '';
        // }
        // if (!data.member) {
        //     data.member = '';
        // }
        // if (!data.project) {
        //     data.project = '';
        // }
        if (!data.note) {
            data.note = '';
        }
        console.log('currentData:', props.data);
        form.setFieldsValue(props.data);
    }, [props]);

    const categoryOptions = (() => {
        const options: any[] = [];
        fieldOption.firstCategory.forEach((firstCategory: string) => {
            const option: Record<string, any> = {
                label: firstCategory,
                value: firstCategory,
            };
            if (
                fieldOption.secondCategory[
                    firstCategory as keyof typeof fieldOption.secondCategory
                ]
            ) {
                option.children = fieldOption.secondCategory[
                    firstCategory as keyof typeof fieldOption.secondCategory
                ].map((secondCategory: string) => {
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

    const renderFormItem = (param: {
        name: string;
        label: string;
        type: FORM_ITEM_TYPE;
        rules?: any[];
        options?: any[];
    }): JSX.Element => {
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
            formItem = <Input prefix="￥" suffix="RMB" />;
        } else if (type === FORM_ITEM_TYPE.CASCADER) {
            formItem = <Cascader options={categoryOptions} />;
        } else if (type === FORM_ITEM_TYPE.SELECT) {
            formItem = (
                <Select>
                    {(options || []).map((option, index) => (
                        <Option key={index} value={option}>
                            {option}
                        </Option>
                    ))}
                </Select>
            );
        } else if (type === FORM_ITEM_TYPE.DATETIME) {
            formItem = <DatePicker showTime />;
        } else if (type === FORM_ITEM_TYPE.TEXTAREA) {
            formItem = <TextArea />;
        }

        return <Form.Item {...itemProps}>{formItem}</Form.Item>;
    };

    const onFinish = (
        values: Partial<FlowItem> & { category?: string[] | undefined }
    ) => {
        if (values.category?.length) {
            values.firstCategory = values.category[0];
            values.secondCategory = values.category[1];
        }
        props.saveData(values as FlowItem);
    };

    return (
        <Card id="detail_card" style={{ margin: '1.6rem' }}>
            <Form
                {...itemLayout}
                size="small"
                form={form}
                name="control-hooks"
                initialValues={props.data}
                onFinish={onFinish}>
                <Row gutter={12}>
                    <Col span={12}>
                        {renderFormItem({
                            name: 'amount',
                            label: '金额',
                            type: FORM_ITEM_TYPE.INPUT_AMOUNT,
                            rules: [{ required: true }],
                        })}
                    </Col>
                    <Col span={12}>
                        {renderFormItem({
                            name: 'inOrOut',
                            label: '收/支',
                            type: FORM_ITEM_TYPE.SELECT,
                            rules: [{ required: true }],
                            options: fieldOption.inOrOut,
                        })}
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={12}>
                        {renderFormItem({
                            name: 'category',
                            label: '分类',
                            type: FORM_ITEM_TYPE.CASCADER,
                            rules: [{ required: true }],
                        })}
                    </Col>
                    <Col span={12}>
                        {renderFormItem({
                            name: 'wallet',
                            label: '钱包',
                            type: FORM_ITEM_TYPE.SELECT,
                            rules: [{ required: true }],
                            options: fieldOption.wallet,
                        })}
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={12}>
                        {renderFormItem({
                            name: 'member',
                            label: '成员',
                            type: FORM_ITEM_TYPE.SELECT,
                            options: fieldOption.member,
                        })}
                    </Col>
                    <Col span={12}>
                        {renderFormItem({
                            name: 'project',
                            label: '项目',
                            type: FORM_ITEM_TYPE.SELECT,
                            options: fieldOption.project,
                        })}
                    </Col>
                </Row>
                {renderFormItem({
                    name: 'time',
                    label: '时间',
                    type: FORM_ITEM_TYPE.DATETIME,
                    rules: [{ required: true }],
                })}
                {renderFormItem({
                    name: 'note',
                    label: '备注',
                    type: FORM_ITEM_TYPE.TEXTAREA,
                })}
                <Divider />
                <Typography>
                    <Tooltip title={props.data.receiver}>
                        <Paragraph ellipsis={true}>
                            收款人：{props.data.receiver}
                        </Paragraph>
                    </Tooltip>
                    <Tooltip title={props.data.goods}>
                        <Paragraph ellipsis={true}>
                            商品：{props.data.goods}
                        </Paragraph>
                    </Tooltip>
                </Typography>
                <Row
                    justify="center"
                    gutter={24}
                    style={{ marginTop: '1.6rem' }}>
                    <Col>
                        <Button
                            type="primary"
                            danger
                            onClick={props.deleteData}>
                            删除
                        </Button>
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
};

export default DetailCard;
