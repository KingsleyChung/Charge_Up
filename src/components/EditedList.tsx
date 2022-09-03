import React, { useState } from 'react';
import { FlowItem } from '../typings';
import { Drawer, Tabs, Card, Row, Button, Col, Typography, Tooltip  } from 'antd';
import { EditOutlined, DeleteOutlined, RollbackOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Paragraph } = Typography;

interface Props {
    editedData: FlowItem[];
    deletedData: FlowItem[];
    show: boolean;
    moveToOriginData: (type: 'edited' | 'deleted', index: number) => void;
    onClose: () => void;
}

const EditedList: React.FC<Props> = (props: Props): JSX.Element => {
    const { editedData, deletedData, show, moveToOriginData, onClose } = props;
    const [showType, setShowType] = useState<'edited' | 'deleted'>('edited')

    const renderList = (data: FlowItem[]): JSX.Element[] => {
        const list = data.map((item, index) => {
            return (
                <Card key={index}>
                    <Row justify='space-between' align='middle'>                 
                        <Col span={21}>
                            <Row gutter={12}>
                                <Col span={10}>
                                    金额：￥{item.amount}
                                </Col>
                                <Col span={14}>
                                    <Paragraph ellipsis={true} style={{ marginBottom: 0 }}>
                                        收款人：
                                        <Tooltip title={item.receiver}>
                                            {item.receiver}
                                        </Tooltip>
                                    </Paragraph>
                                </Col>
                            </Row>
                            <Row>
                                <Paragraph ellipsis={true} style={{ marginBottom: 0 }}>
                                    商品：
                                    <Tooltip title={item.goods}>
                                        {item.goods}
                                    </Tooltip>
                                </Paragraph>
                            </Row>
                        </Col>
                        <Col span={3} style={{ display: 'flex', justifyContent: 'end' }}>
                            <Button shape='circle' icon={<RollbackOutlined />} onClick={() => moveToOriginData(showType, index)}></Button>
                        </Col>
                    </Row>   
                </Card>
            );
        });
        return list;
    }
    
    const renderEmpty = (): JSX.Element => {
        return <div>空列表</div>
    }

    return (
        <Drawer
            placement='bottom'
            closable={false}
            onClose={onClose}
            visible={show}
            height={600}
        >
            <Tabs className='my_tab' activeKey={showType} onChange={activeKey => setShowType(activeKey as 'edited' | 'deleted')} style={{ height: '100%' }}>
                <TabPane
                    tab={
                        <span>
                            <EditOutlined />
                            已编辑
                        </span>
                    }
                    key='edited'
                    style={{ height: '100%', overflow: 'auto' }}
                >
                    {editedData?.length ? renderList(editedData) : renderEmpty()}
                </TabPane>
                <TabPane
                    tab={
                        <span>
                            <DeleteOutlined />
                            已删除
                        </span>
                    }
                    key='deleted'
                    style={{ height: '100%', overflow: 'auto' }}
                >
                    {deletedData?.length ? renderList(deletedData) : renderEmpty()}
                </TabPane>
            </Tabs>
        </Drawer>
    );
}

export default EditedList;