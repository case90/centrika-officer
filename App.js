import React from 'react';
import { Provider as AuthProvider } from './src/context/AuthContext'
import RootScreen from './src/screens/RootScreen';

export default function App() {
  return (
    <AuthProvider>
      <RootScreen /> 
    </AuthProvider>
  );
}
