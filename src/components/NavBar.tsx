import React from 'react';
import { Button, Row } from 'antd';
import { LeftOutlined, RightOutlined, DeleteOutlined } from '@ant-design/icons';

interface Props {
    currentIndex: number;
    totalCount: number;
    goPrev: () => void;
    goNext: () => void;
    deleteData: () => void;
}

const NavBar: React.FC<Props> = (props: Props): JSX.Element => {
    const { currentIndex, totalCount, goPrev, goNext, deleteData } = props;
    return (
        <Row>
            <Button shape="circle" icon={<LeftOutlined />} size="large" onClick={goPrev} />
            {!!(currentIndex >= 0 && totalCount >= currentIndex + 1) && <div>{`${currentIndex + 1} / ${totalCount}`}</div>}
            <Button shape="circle" icon={<RightOutlined />} size="large" onClick={goNext} />
            <Button type="primary" shape="circle" icon={<DeleteOutlined />} size="large" danger onClick={deleteData} />
        </Row>
    );
}

export default NavBar;