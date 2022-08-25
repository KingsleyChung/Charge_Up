import { FunctionComponent, useState } from 'react';
import './styles/App.css';
import Import from './pages/Import';
import Edit from './pages/Edit';

const enum MODE {
  IMPORT,
  EDIT,
  EXPORT,
}

const App: FunctionComponent = () => {
  const [mode, setMode] = useState<MODE>(MODE.IMPORT);
  const [originData, setOriginData] = useState<any[]>([]);

  return (
    <>
      {mode === MODE.IMPORT &&
        <Import onSubmit={data => {
          setOriginData(data);
          setMode(MODE.EDIT)
        }}/>
      }
      {mode === MODE.EDIT &&
        <Edit data={originData} />
      }
    </>
  )
}

export default App;
