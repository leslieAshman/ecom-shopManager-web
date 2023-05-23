/** @jsxImportSource @emotion/react */
import React from 'react';
import Routing from '../Routing';
import { AppProvider } from '../context/ContextProvider';

const App = () => {
  return (
    <AppProvider>
      <div className="w-screen h-screen" data-testid="app-container">
        <Routing />
      </div>
    </AppProvider>
  );
};

export default App;
