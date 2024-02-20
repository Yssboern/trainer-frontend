import React from 'react';
import TrainerList from './components/TrainerList';

const App: React.FC = () => {
  return (
      <div className="App">
        <header className="App-header">
          <TrainerList />
        </header>
      </div>
  );
};

export default App;
