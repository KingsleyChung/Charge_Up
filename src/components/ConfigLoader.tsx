import React, { useRef, useState } from 'react';
import { Modal, Upload, Button } from 'antd';
import utils from '../utils';


interface Props {
    show: boolean;
    onConfirm: (config: Record<string, any> | null) => void;
    onClose: () => void;
}

const ConfigLoader: React.FC<Props> = (props: Props): JSX.Element => {
    const { show, onConfirm, onClose } = props;
    const config = useRef<Record<string, any> | null>(null);
    const uploadProps = {
        name: 'file',
        accept: '.json',
        showUploadList: false,
        beforeUpload: async (file: any) => {
            try {
                const data = await utils.getJsonFromFile(file);
                console.log('load config:', data);
                config.current = data as Record<string, any>;
                return false;
            } catch (err) {
                console.error(err);
            }
        },
    }
    return (
        <div>
            <Modal
                visible={show}
                onOk={() => onConfirm?.(config.current)}
                onCancel={() => {
                    config.current = null; onClose?.()
                }}
            >
                <Upload {...uploadProps}>
                    <Button>加载配置</Button>
                </Upload>
            </Modal>
        </div>
    );
}

export default ConfigLoader;