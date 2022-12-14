import { FunctionComponent, useEffect, useState } from 'react';
import './styles/App.css';
import Import from './pages/Import';
import Edit from './pages/Edit';
import { MODE } from './constant';

const App: FunctionComponent = () => {
    const [mode, setMode] = useState<MODE>(MODE.IMPORT);
    const [originData, setOriginData] = useState<string>('');

    useEffect(() => {
        const cacheData = localStorage.getItem('cacheData') || '';
        if (cacheData) {
            setOriginData(cacheData);
            setMode(MODE.EDIT);
        }
    });

    return (
        <>
            {mode === MODE.IMPORT && (
                <Import
                    onSubmit={(data: string) => {
                        setOriginData(data);
                        setMode(MODE.EDIT);
                    }}
                />
            )}
            {mode === MODE.EDIT && (
                <Edit
                    setMode={(mode: MODE) => setMode(mode)}
                    data={originData}
                />
            )}
        </>
    );
};

export default App;
