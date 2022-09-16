import React from 'react';
import { Modal, Upload, Button } from 'antd';
import utils from '../utils';

interface Props {
    show: boolean;
    importConfig?: (config: Record<string, any> | null) => void;
    exportConfig?: () => void;
    importCacheData?: (data: Record<string, any> | null) => void;
    exportCacheData?: () => void;
    onClose: () => void;
}

const Settings: React.FC<Props> = (props: Props): JSX.Element => {
    const {
        show,
        importConfig,
        exportConfig,
        importCacheData,
        exportCacheData,
        onClose,
    } = props;

    const getUploadProps = (
        callback?: (config: Record<string, any> | null) => void
    ) => {
        return {
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
                            callback?.(data as Record<string, any>);
                        },
                    });
                    return false;
                } catch (err) {
                    console.error(err);
                }
            },
        };
    };

    return (
        <div>
            <Modal
                visible={show}
                onOk={() => onClose?.()}
                onCancel={() => onClose?.()}>
                <Upload {...getUploadProps(importConfig)}>
                    <Button>导入配置</Button>
                </Upload>
                <Button onClick={exportConfig}>导出配置</Button>
                <Upload {...getUploadProps(importCacheData)}>
                    <Button>导入缓存数据</Button>
                </Upload>
                <Button onClick={exportCacheData}>导出缓存数据</Button>
            </Modal>
        </div>
    );
};

export default Settings;
