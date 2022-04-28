import React, { useState } from "react";

function Setting(props) {
    const {
        serverUrl,
        setServerUrl,
        showSettingMessage,
        setShowSettingMessage,
    } = props;
    const [ reloadRunning, setReloadRunning ] = useState(false);

    const lastfm = () => {
        console.log("LAST");
    }

    const reload = () => {
        fetch(`${serverUrl}/api/reload`)
            .then((response) => {
                if (!response.ok) {
                    setReloadRunning(true); 
                }
            });
        setShowSettingMessage(true);
    }
    
    const hard_reload = () => {
        fetch(`${serverUrl}/api/hard_reload`)
            .then((response) => {
                if (!response.ok) {
                    setReloadRunning(true);
                }
            });
        setShowSettingMessage(true);
    }
    
    const disconnect = () => {
        localStorage.setItem('prevServerUrl', serverUrl);

        localStorage.removeItem('serverUrl');
        setServerUrl(null);
        location.reload();
    }

    return (
        <div className="flex flex-col gap-2 m-2 text-base 2xl:text-lg font-semibold text-slate-50">
            <SettingButton content="Connect to Last.fm" onClickFunc={lastfm} />
            <div></div>
            <div>Administrative</div>
            <SettingButton content="Reload Metadata DB" dangerous={true} onClickFunc={reload} />
            <SettingButton content="Hard-Reload Metadata DB" dangerous={true} onClickFunc={hard_reload} />
            <SettingButton content="Disconnect from DB" dangerous={true} onClickFunc={disconnect} />
            {showSettingMessage && 
                (reloadRunning ? 
                    <div>
                        A reload task is already running.
                    </div>
                    :
                    <div>
                        Metadata DB reloading started, and can take around 1 minute for every 1000 tracks. Reload periodically to see the up-to-date library.
                    </div>
                )
            }
        </div>
    );
}

function SettingButton(props) {
    const {
        content,
        dangerous,
        onClickFunc,
    } = props;

    return (
        <div 
            onClick={onClickFunc}
            className={`pl-3 bg-gray-800 rounded-md transition duration-300 hover:cursor-pointer ${dangerous ? "hover:bg-red-500" : "hover:bg-amber-500"}`}>
            {content}
        </div>
    );
}

export default Setting;