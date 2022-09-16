import { FunctionComponent, useRef } from 'react';
import { AlipayCircleOutlined, WechatOutlined } from '@ant-design/icons';
import { Row, Button, Upload, Card, message, Modal } from 'antd';
import utils from '../utils';

interface UploadBtnProps {
    icon: JSX.Element;
    handleData: (data: any[]) => void;
}

const UploadButton: FunctionComponent<UploadBtnProps> = (
    props: UploadBtnProps
): JSX.Element => {
    const uploadProps = {
        name: 'file',
        accept: '.xls,.xlsx,.csv',
        showUploadList: false,
        beforeUpload: async (file: any) => {
            try {
                const rawData = await utils.xlsxToJson(file);
                const formatedData = utils.formatData(rawData);
                console.log('rawData:', rawData);
                console.log('formatedData:', formatedData);
                props.handleData(formatedData);
                return false;
            } catch (err) {
                console.error(err);
            }
        },
    };
    return (
        <Upload {...uploadProps}>
            <Card hoverable>{props.icon}</Card>
        </Upload>
    );
};

interface Props {
    onSubmit: (data: string) => void;
}

const Import: FunctionComponent<Props> = (props: Props): JSX.Element => {
    const aliData = useRef<any[]>([]);
    const wxData = useRef<any[]>([]);

    const onFileChange = (param: { data: any[]; type: string }) => {
        const { data, type } = param;
        if (type === 'alipay') {
            aliData.current = data;
        } else if (type === 'wechat') {
            wxData.current = data;
        }
    };

    const importCacheData = (data: Record<string, any> | null) => {
        console.log(data);
        if (!data) {
            return;
        }
        const dataString = JSON.stringify(data);
        localStorage.setItem('cacheData', dataString);
        props.onSubmit(dataString);
    };

    const uploadProps = {
        name: 'file',
        accept: '.json',
        showUploadList: false,
        beforeUpload: async (file: any) => {
            try {
                Modal.confirm({
                    title: '确认导入',
                    onOk: async () => {
                        const data = await utils.getJsonFromFile(file);
                        console.log('load json:', data);
                        importCacheData(data as Record<string, any>);
                    },
                });
                return false;
            } catch (err) {
                console.error(err);
            }
        },
    };

    return (
        <div id="import">
            <Row style={{ height: '40vh' }} align="middle" justify="center">
                <UploadButton
                    icon={
                        <AlipayCircleOutlined
                            style={{ color: 'blue', fontSize: 80 }}
                        />
                    }
                    handleData={(data: any[]) => {
                        onFileChange({ data, type: 'alipay' });
                    }}
                />
            </Row>
            <Row style={{ height: '40vh' }} align="middle" justify="center">
                <UploadButton
                    icon={
                        <WechatOutlined
                            style={{ color: 'green', fontSize: 80 }}
                        />
                    }
                    handleData={(data: any[]) => {
                        onFileChange({ data, type: 'wechat' });
                    }}
                />
            </Row>
            <Row style={{ height: '20vh' }} align="middle" justify="center">
                <Button
                    onClick={() => {
                        if (
                            !aliData?.current?.length &&
                            !wxData?.current?.length
                        ) {
                            message.warning('请上传流水文件');
                            return;
                        }
                        const unifiedData = utils.getUnifiedData(
                            wxData?.current,
                            aliData?.current
                        );
                        console.log('unifiedData:', unifiedData);
                        props.onSubmit(
                            JSON.stringify({ originData: unifiedData })
                        );
                    }}>
                    导入
                </Button>
            </Row>
            <Upload {...uploadProps}>
                <Button
                    style={{
                        position: 'fixed',
                        bottom: '1rem',
                        right: '1rem',
                        width: '5rem',
                        height: '5rem',
                    }}
                    shape="circle">
                    导入缓存
                </Button>
            </Upload>
        </div>
    );
};

export default Import;
