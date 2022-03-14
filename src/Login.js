import { React, useState } from 'react';

function Login(props) {
    const { setServerUrl } = props;
    const [ textInput, setTextInput ] = useState("http://0.0.0.0:8000");

    const updateInput = (e) => setTextInput(e.target.value);
    const updateServerUrl = () => {
        setServerUrl(textInput);
        localStorage.setItem('serverUrl', textInput);
    };

    return (
        <div>
            <h3>Input server&lsquo;s IPAddr:Port</h3>
            <br/>
            <input type="text" value={textInput} onChange={(e) => updateInput(e)} />
            <button onClick={() => updateServerUrl()}>Enter</button>
        </div>
    );
}

export default Login;