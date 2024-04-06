import React from 'react';
import ReactDOM from 'react-dom/client';
import AutoComplete from './app/Autocomplete';
import GoogleMaps from './app/test';

const App = () => {
    return (
        <GoogleMaps />
    )
};

const container = document.getElementById('app');
const root = ReactDOM.createRoot(container as HTMLElement);
root.render(<App />);