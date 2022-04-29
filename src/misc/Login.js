import { React, useState } from 'react';
import { Helmet } from 'react-helmet-async';

function Login(props) {
    const { setServerUrl } = props;
    const [ textInput, setTextInput ] = useState(localStorage.getItem("prevServerUrl"));
    const [ passwordInput, setPasswordInput ] = useState("");

    const updateInput = (e) => setTextInput(e.target.value);
    const updatePasswordInput = (e) => setPasswordInput(e.target.value);
    const updateServerUrl = () => {
        setServerUrl(textInput);
        localStorage.setItem('serverUrl', textInput);
    };

    return (
        <div className="m-8 w-60 2xl:w-80">
            <Helmet>
                <meta charSet="utf-8" />
                <title>musicthing</title>
            </Helmet>
            <p className="mb-2 font-sans text-xl 2xl:text-3xl font-bold text-slate-50">
                musicthing
            </p>
            <div className="grid grid-cols-3 grid-rows-3 gap-1 justify-start">
                <p
                    className="pl-3 text-base 2xl:text-lg font-semibold text-slate-50">
                    Server&apos;s IPAddr:Port
                </p>
                <input 
                    type="text"
                    value={textInput}
                    onChange={(e) => updateInput(e)}
                    className="col-span-2" />
                <p
                    className="pl-3 text-base 2xl:text-lg font-semibold text-slate-50">
                    Password
                </p>
                <input 
                    type="password" 
                    value={passwordInput} 
                    onChange={(e) => updatePasswordInput(e)}
                    className="col-span-2" />
                <div 
                    onClick={updateServerUrl}
                    className="pl-3 bg-gray-800 rounded-md text-base 2xl:text-lg font-semibold text-slate-50 hover:cursor-pointer transition duration-300 hover:bg-amber-700" >
                    Enter
                </div>
            </div>
        </div>
    );
}

export default Login;