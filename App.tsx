import React from 'react';
import { LogbookProvider } from './src/store/logbookStore';
import { PlannerProvider } from './src/store/plannerStore';
import { SavedProvider } from './src/store/savedStore';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <LogbookProvider>
      <PlannerProvider>
        <SavedProvider>
          <AppNavigator />
        </SavedProvider>
      </PlannerProvider>
    </LogbookProvider>
  );
};

export default App;