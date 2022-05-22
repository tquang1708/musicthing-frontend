import { React, useState } from 'react';
import { Helmet } from 'react-helmet-async';

function Login(props) {
    const { setServerUrl } = props;
    const [ textInput, setTextInput ] = useState(localStorage.getItem("prevServerUrl"));
    const [ passwordInput, setPasswordInput ] = useState("");
    const [ isHover, setIsHover ] = useState(false);

    const updateInput = (e) => setTextInput(e.target.value);
    const updatePasswordInput = (e) => setPasswordInput(e.target.value);
    const updateServerUrl = () => {
        setServerUrl(textInput);
        localStorage.setItem('serverUrl', textInput);
    };

    const onEnterEnableHover = () => setIsHover(true);
    const onLeaveDisableHover = () => setIsHover(false);

    return (
        <div 
            className="m-2 md:m-8 w-auto max-w-60 2xl:max-w-80">
            <Helmet>
                <meta charSet="utf-8" />
                <title>musicthing</title>
            </Helmet>
            <p 
                style={{color: "var(--highlight-color)"}}
                className="mb-2 font-sans text-xl 2xl:text-3xl font-bold">
                musicthing
            </p>
            <div className="grid grid-cols-3 grid-rows-3 gap-1 justify-start">
                <p
                    style={{color: "var(--highlight-color)"}}
                    className="pl-3 text-base 2xl:text-lg font-semibold">
                    Server&apos;s IPAddr:Port (no ending slash)
                </p>
                <input 
                    style={{color: "var(--menu-text-icon-color)"}} 
                    type="text"
                    value={textInput ? textInput : ""}
                    onChange={(e) => updateInput(e)}
                    className="col-span-2" />
                <p
                    style={{color: "var(--highlight-color)"}}
                    className="pl-3 text-base 2xl:text-lg font-semibold">
                    Password
                </p>
                <input 
                    style={{color: "var(--menu-text-icon-color)"}} 
                    type="password" 
                    value={passwordInput} 
                    onChange={(e) => updatePasswordInput(e)}
                    className="col-span-2" />
                <div 
                    onClick={updateServerUrl} onMouseEnter={onEnterEnableHover} onMouseLeave={onLeaveDisableHover}
                    style={{color: "var(--highlight-color)", backgroundColor: `${isHover ? "var(--select-dark-color)" : ""}`}}
                    className="pl-3 bg-gray-800 rounded-md text-base 2xl:text-lg font-semibold hover:cursor-pointer transition duration-300" >
                    Enter
                </div>
            </div>
        </div>
    );
}

export default Login;