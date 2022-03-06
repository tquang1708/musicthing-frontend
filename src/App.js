import { React, useState, useEffect } from 'react';
import './App.css';

function App() {
    const [testState, setTestState] = useState('');

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/test')
            .then((response) => response.text())
            .then((text) => setTestState(text))
            .catch((error) => console.log(error));
    });

    return (
        <p>{ testState }</p>
    );
}

export default App;
