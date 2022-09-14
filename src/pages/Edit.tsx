import React from 'react';
import { FlowItem } from '../typings';
import { exportFields, MODE } from '../constant';
import DetailCard from '../components/DetailCard';
import EditedList from '../components/EditedList';
import NavBar from '../components/NavBar';
import utils from '../utils';
import moment, { Moment } from 'moment';
import ConfigLoader from '../components/ConfigLoader';

interface Props {
    data: string;
    setMode: (mode: MODE) => void;
}

interface State {
    currentIndex: number;
    originData: FlowItem[];
    deletedData: FlowItem[];
    editedData: FlowItem[];
    showList: boolean;
    showConfigLoader: boolean;
    config: Record<string, any>;
}

export default class Edit extends React.Component<Props, State> {
    private cacheTimer: any;

    constructor(props: Props) {
        super(props);
        const data = props.data ? JSON.parse(props.data) : {};
        const config = JSON.parse(localStorage.getItem('config') || '{}');
        this.state = {
            currentIndex: 0,
            originData: this.convertDate(data.originData, 'moment'),
            deletedData: this.convertDate(data.deletedData, 'moment'),
            editedData: this.convertDate(data.editedData, 'moment'),
            showList: false,
            showConfigLoader: false,
            config,
        }
    }

    componentDidMount() {
        this.initCacheTimer();
    }

    componentWillUnmount() {
        this.clearCacheTimer();
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.data !== this.props.data) {
            const newData = JSON.parse(this.props.data);
            this.setState({
                originData: this.convertDate(newData.originData, 'moment'),
                editedData: this.convertDate(newData.editedData, 'moment'),
                deletedData: this.convertDate(newData.deletedData, 'moment'),
            });
        }
    }

    convertDate = (data: FlowItem[], type: 'moment' | 'string', debug?: boolean) => {
        if (!data) {
            return [];
        }
        if (type === 'moment') {
            return data.map(item => {
                const newItem = { ...item };
                newItem.time = moment(newItem.time);
                return newItem;
            })
        } else if (type === 'string') {
            return data.map(item => {
                const newItem = { ...item };
                newItem.time = moment(newItem.time).format('YYYY-MM-DD hh:mm:ss');
                return newItem;
            })
        }
        return [];
    }

    initCacheTimer = () => {
        this.cacheTimer && clearInterval(this.cacheTimer);
        this.cacheTimer = setInterval(() => {
            const { originData, editedData, deletedData } = this.state;
            const cacheData = {
                originData: this.convertDate(originData, 'string'),
                editedData: this.convertDate(editedData, 'string'),
                deletedData: this.convertDate(deletedData, 'string'),
            };
            localStorage.setItem('cacheData', JSON.stringify(cacheData));
        }, 20000);
    }

    clearCacheTimer = () => {
        this.cacheTimer && clearInterval(this.cacheTimer);
        this.cacheTimer = null;
    }

    goNext = () => {
        const { originData, currentIndex } = this.state;
        if (currentIndex + 1 < originData.length) {
            this.setState({ currentIndex: currentIndex + 1 });
        }
    }

    goPrev = () => {
        const { currentIndex } = this.state;
        if (currentIndex - 1 >= 0) {
            this.setState({ currentIndex: currentIndex - 1 });
        }
    }

    deleteData = () => {
        const { currentIndex, originData, deletedData } = this.state;
        const data = originData[currentIndex];
        deletedData.push(data);
        originData.splice(currentIndex, 1);
        this.setState({ originData, deletedData });
    }

    saveData = (data: FlowItem) => {
        const { currentIndex, originData, editedData } = this.state;
        editedData.push(data);
        originData.splice(currentIndex, 1);
        this.setState({ originData, editedData });
    }

    moveToOriginData = (type: 'edited' | 'deleted', index: number) => {
        const { currentIndex, originData, editedData, deletedData } = this.state;
        let sourceData;
        if (type === 'edited') {
            sourceData = editedData;
        } else if (type === 'deleted') {
            sourceData = deletedData;
        }
        if (!sourceData?.[index]) {
            return;
        }
        originData.splice(currentIndex, 0, sourceData?.[index]);
        sourceData.splice(index, 1);
        if (type === 'edited') {
            this.setState({ originData, editedData: sourceData });
        } else if (type === 'deleted') {
            this.setState({ originData, deletedData: sourceData });
        }
    }

    exportData = () => {
        const { editedData } = this.state;
        const keys: string[] = [];
        const labels: string[] = [];
        exportFields.forEach(field => {
            keys.push(field.key);
            labels.push(field.label);
        })
        const finalData = editedData.map(data => {
            data.time = (data.time as Moment).format('YYYY-MM-DD hh:mm:ss');
            return data;
        })
        utils.jsonToXlsx(finalData, keys, labels, 'myMoney');
    }

    toggleList = () => {
        const { showList } = this.state;
        this.setState({ showList: !showList })
    }

    saveConfig = (config: Record<string, any> | null) => {
        if (!config) {
            return;
        }
        localStorage.setItem('config', JSON.stringify(config));
        this.setState({ config });
        this.toggleConfigLoader();
    }

    toggleConfigLoader = () => {
        const { showConfigLoader } = this.state;
        this.setState({ showConfigLoader: !showConfigLoader });
    }

    goBack = () => {
        localStorage.removeItem('cacheData')
        this.props.setMode(MODE.IMPORT);
    }

    render(): JSX.Element {
        const { originData, editedData, deletedData, currentIndex, showList, showConfigLoader, config } = this.state;
        if (!originData) {
            return <></>
        }
        return (
            <div id="edit">
                <DetailCard data={originData?.[currentIndex]} config={config} saveData={this.saveData} deleteData={this.deleteData} />
                <NavBar
                    currentIndex={currentIndex}
                    totalCount={originData.length}
                    goPrev={this.goPrev}
                    goNext={this.goNext}
                    loadConfig={this.toggleConfigLoader}
                    exportData={this.exportData}
                    toggleList={this.toggleList}
                    goBack={this.goBack}
                />
                <EditedList editedData={editedData} deletedData={deletedData} show={showList} moveToOriginData={this.moveToOriginData} onClose={() => this.toggleList()} />
                <ConfigLoader show={showConfigLoader} onConfirm={this.saveConfig} onClose={this.toggleConfigLoader} />
            </div>
        )
    }
}
