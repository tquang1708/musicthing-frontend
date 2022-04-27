import React, { useState } from "react";

export default function Setting(props) {
    const {
        serverUrl,
        setServerUrl,
        showSettingMessage,
        setShowSettingMessage,
    } = props;
    const [ reloadRunning, setReloadRunning ] = useState(false);

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
            <div 
                onClick={reload}
                className="pl-3 bg-gray-800 rounded-md transition duration-300 hover:cursor-pointer hover:bg-amber-700" >
                Reload Metadata DB
            </div>
            <div 
                onClick={hard_reload}
                className="pl-3 bg-gray-800 rounded-md transition duration-300 hover:cursor-pointer hover:bg-amber-700" >
                Hard-Reload Metadata DB
            </div>
            <div 
                onClick={disconnect}
                className="pl-3 bg-gray-800 rounded-md transition duration-300 hover:cursor-pointer hover:bg-amber-700" >
                Disconnect from DB
            </div>
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