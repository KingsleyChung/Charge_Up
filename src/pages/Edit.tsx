import React from 'react';
import { FlowItem } from '../typings';
import DetailCard from '../components/DetailCard';
import NavBar from '../components/NavBar';

const enum LIST_TYPE {
    NORMAL,
    DELETED,
}

interface Props {
    data: any[];
}

interface State {
    currentList: LIST_TYPE;
    currentIndex: number;
    originData: FlowItem[];
    deletedData: FlowItem[];
    editedData: FlowItem[];
}

export default class Edit extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            currentList: LIST_TYPE.NORMAL,
            currentIndex: 0,
            originData: props.data,
            deletedData: [],
            editedData: [],
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
            this.setState({ originData: this.props.data });
        }
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
        console.log('--- Delete', data);
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

    render(): JSX.Element {
        const { originData, currentIndex } = this.state;
        return (
            <div id="edit">
                <DetailCard data={originData?.[currentIndex]} saveData={this.saveData} />
                <NavBar currentIndex={currentIndex} totalCount={originData.length} goPrev={this.goPrev} goNext={this.goNext} deleteData={this.deleteData} />
            </div>
        )
    }
}
