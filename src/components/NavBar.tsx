import React from 'react';
import { Button, Row, Col } from 'antd';
import { LeftOutlined, RightOutlined, SettingOutlined, UnorderedListOutlined } from '@ant-design/icons';

interface Props {
    currentIndex: number;
    totalCount: number;
    goPrev: () => void;
    goNext: () => void;
    loadConfig: () => void;
    exportData: () => void;
    toggleList: () => void;
    goBack: () => void;
}

const NavBar: React.FC<Props> = (props: Props): JSX.Element => {
    const { currentIndex, totalCount, goPrev, goNext, loadConfig, toggleList, exportData, goBack } = props;
    return (
        <div id='nav_bar'>
            <Row justify='space-between' align='middle'>
                <Button shape="circle" icon={<UnorderedListOutlined />} size="large" onClick={toggleList} />
                <Button shape="circle" icon={<LeftOutlined />} size="large" onClick={goPrev} />
                {!!(currentIndex >= 0 && totalCount >= currentIndex + 1) && <span style={{ fontSize: 20 }}>{`${currentIndex + 1} / ${totalCount}`}</span>}
                <Button shape="circle" icon={<RightOutlined />} size="large" onClick={goNext} />
                <Button shape="circle" icon={<SettingOutlined />} size="large" onClick={loadConfig} />
            </Row>
            <Row justify='center' align='middle' gutter={30} style={{ marginTop: 24 }}>
                <Col>
                    <Button type='primary' danger onClick={goBack}>返回</Button>
                </Col>
                <Col>
                    <Button type='primary' onClick={exportData}>导出</Button>
                </Col>
            </Row>
        </div>
    );
}

export default NavBar;