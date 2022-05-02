import React, { useState } from "react";

function Setting(props) {
    const {
        serverUrl,
        setServerUrl,
        showSettingMessage,
        setShowSettingMessage,
        textColor,
        setTextColor,
    } = props;
    const [ reloadRunning, setReloadRunning ] = useState(false);

    // const lastfm = () => {
    //     console.log("TBD!!!");
    // }

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
        <div className="flex flex-col gap-2 m-2 select-none text-base 2xl:text-lg font-semibold text-slate-50">
            {/* <SettingButton content="Connect to Last.fm (TBD)" onClickFunc={lastfm} />
            <div></div> */}
            <Theming 
                textColor={textColor}
                setTextColor={setTextColor}
            />
            <div className="text-black">Administrative</div>
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

function Theming(props) {
    const {
        textColor,
        setTextColor,
    } = props;

    const onChangeSetTextColor = (e) => setTextColor(e.target.value);

    return (
        <div className="flex flex-col grow gap-1">
            <div className="text-black">Theming</div>
            <select className="text-black grow">
                <option value="default">Default</option>
                <option value="custom">Custom</option>
            </select>
            <input type="color" name="text" value={textColor} onChange={onChangeSetTextColor}></input>
            <label htmlFor="text">Text</label>
        </div>
    );
}

function SettingButton(props) {
    const {
        content,
        onClickFunc,
        dangerous,
    } = props;

    return (
        <div 
            onClick={onClickFunc}
            className={`pl-3 bg-gray-800 rounded-md transition duration-300 hover:cursor-pointer ${dangerous ? "hover:bg-red-500" : "hover:bg-amber-700"}`}>
            {content}
        </div>
    );
}

export default Setting;