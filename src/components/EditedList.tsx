import React, { useState } from 'react';
import { FlowItem } from '../typings';
import {
    Drawer,
    Tabs,
    Card,
    Row,
    Button,
    Col,
    Typography,
    Tooltip,
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    RollbackOutlined,
} from '@ant-design/icons';
import { EDITED_LIST_TYPE } from '../constant';

const { TabPane } = Tabs;
const { Paragraph } = Typography;

interface Props {
    editedData: FlowItem[];
    deletedData: FlowItem[];
    show: boolean;
    moveToOriginData: (type: 'edited' | 'deleted', index: number) => void;
    onClose: () => void;
}

const deletedRenderField = [
    { label: '金额: ', field: 'amount' },
    {},
    { label: '收款人: ', field: 'receiver' },
    {},
    { label: '商品: ', field: 'goods' },
];

const editedRenderField = [
    { label: '金额: ', field: 'amount' },
    { label: '收/支: ', field: 'inOrOut' },
    { label: '分类: ', field: 'category' },
    { label: '钱包: ', field: 'wallet' },
    { label: '成员: ', field: 'member' },
    { label: '项目: ', field: 'project' },
    { label: '备注: ', field: 'note' },
    {},
    { label: '收款人: ', field: 'receiver' },
    {},
    { label: '商品: ', field: 'goods' },
    {},
];

const EditedList: React.FC<Props> = (props: Props): JSX.Element => {
    const { editedData, deletedData, show, moveToOriginData, onClose } = props;
    const [showType, setShowType] = useState<'edited' | 'deleted'>('edited');

    const renderFields = (
        data: FlowItem,
        type: EDITED_LIST_TYPE
    ): JSX.Element[] => {
        const renderFields =
            type === EDITED_LIST_TYPE.EDITED
                ? editedRenderField
                : deletedRenderField;
        const rows: JSX.Element[] = [];
        for (let i = 0; i < renderFields.length; i += 2) {
            const leftLabel = renderFields[i]?.label || '';
            const rightLabel = renderFields[i + 1]?.label || '';
            let leftData = renderFields[i]?.field
                ? data[renderFields[i].field as keyof FlowItem]
                : null;
            let rightData = renderFields[i + 1]?.field
                ? data[renderFields[i + 1].field as keyof FlowItem]
                : null;
            if (Array.isArray(leftData)) {
                leftData = leftData.join('/');
            }
            if (Array.isArray(rightData)) {
                rightData = rightData.join('/');
            }
            const row = (
                <Row gutter={12} key={`editedItem_${i}`}>
                    <Col span={rightData ? 12 : 24}>
                        <Paragraph ellipsis={true} style={{ marginBottom: 0 }}>
                            {leftLabel}
                            <Tooltip title={leftData as string}>
                                {leftData as string}
                            </Tooltip>
                        </Paragraph>
                    </Col>
                    {rightData && (
                        <Col span={12}>
                            <Paragraph
                                ellipsis={true}
                                style={{ marginBottom: 0 }}>
                                {rightLabel}
                                <Tooltip title={rightData as string}>
                                    {rightData as string}
                                </Tooltip>
                            </Paragraph>
                        </Col>
                    )}
                </Row>
            );
            rows.push(row);
        }
        return rows;
    };

    const renderList = (
        data: FlowItem[],
        type: EDITED_LIST_TYPE
    ): JSX.Element[] => {
        const list = data.map((item, index) => {
            return (
                <Card key={index}>
                    <Row justify="space-between" align="middle">
                        <Col span={21}>{renderFields(item, type)}</Col>
                        <Col
                            span={3}
                            style={{ display: 'flex', justifyContent: 'end' }}>
                            <Button
                                shape="circle"
                                icon={<RollbackOutlined />}
                                onClick={() =>
                                    moveToOriginData(showType, index)
                                }></Button>
                        </Col>
                    </Row>
                </Card>
            );
        });
        return list;
    };

    const renderEmpty = (): JSX.Element => {
        return <div>空列表</div>;
    };

    return (
        <Drawer
            placement="bottom"
            closable={false}
            onClose={onClose}
            visible={show}
            height={600}>
            <Tabs
                className="my_tab"
                activeKey={showType}
                onChange={(activeKey) =>
                    setShowType(activeKey as 'edited' | 'deleted')
                }
                style={{ height: '100%' }}>
                <TabPane
                    tab={
                        <span>
                            <EditOutlined />
                            已编辑
                        </span>
                    }
                    key="edited"
                    style={{ height: '100%', overflow: 'auto' }}>
                    {editedData?.length
                        ? renderList(editedData, EDITED_LIST_TYPE.EDITED)
                        : renderEmpty()}
                </TabPane>
                <TabPane
                    tab={
                        <span>
                            <DeleteOutlined />
                            已删除
                        </span>
                    }
                    key="deleted"
                    style={{ height: '100%', overflow: 'auto' }}>
                    {deletedData?.length
                        ? renderList(deletedData, EDITED_LIST_TYPE.DELETED)
                        : renderEmpty()}
                </TabPane>
            </Tabs>
        </Drawer>
    );
};

export default EditedList;
