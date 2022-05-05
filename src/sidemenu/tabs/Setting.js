import React, { useState } from "react";
// import logo from '../../logo.svg';

function Setting(props) {
    const {
        serverUrl,
        setServerUrl,
        showSettingMessage,
        setShowSettingMessage,
        textColor,
        setTextColor,
        hideSidebarOnDisplayMedium,
        setHideSidebarOnDisplayMedium,
        hideSidebarOnDisplayLarge,
        setHideSidebarOnDisplayLarge,
    } = props;

    return (
        <div className="flex flex-col gap-2 m-2 text-base 2xl:text-lg font-semibold text-slate-50">
            {/* <SettingButton content="Connect to Last.fm (TBD)" onClickFunc={lastfm} />
            <div></div> */}
            <Behavior 
                hideSidebarOnDisplayMedium={hideSidebarOnDisplayMedium}
                setHideSidebarOnDisplayMedium={setHideSidebarOnDisplayMedium}
                hideSidebarOnDisplayLarge={hideSidebarOnDisplayLarge}
                setHideSidebarOnDisplayLarge={setHideSidebarOnDisplayLarge}
            />
            <Theming 
                textColor={textColor}
                setTextColor={setTextColor}
            />
            <Administrative 
                serverUrl={serverUrl}
                setServerUrl={setServerUrl}
                showSettingMessage={showSettingMessage}
                setShowSettingMessage={setShowSettingMessage}
            />
            {/* <img
                src={logo}
                alt="musicthing logo" >
            </img> */}
        </div>
    );
}

function Behavior(props) {
    const {
        hideSidebarOnDisplayMedium,
        setHideSidebarOnDisplayMedium,
        hideSidebarOnDisplayLarge,
        setHideSidebarOnDisplayLarge,
    } = props;

    const onChangeFlipSidebarDisplayMedium = () => {
        localStorage.setItem('hideSidebarOnDisplayMedium', !hideSidebarOnDisplayMedium);
        setHideSidebarOnDisplayMedium(!hideSidebarOnDisplayMedium);
    };
    const onChangeFlipSidebarDisplayLarge = () => {
        localStorage.setItem('hideSidebarOnDisplayLarge', !hideSidebarOnDisplayLarge);
        setHideSidebarOnDisplayLarge(!hideSidebarOnDisplayLarge);
    };

    return (
        <div className="flex flex-col grow text-black">
            <div className="h-8 md:hidden"></div>
            <div className="mb-1">Behavior</div>
            <div className="ml-2">Hide Side Menu on Displaying Album</div>
            <label className="mb-1 ml-2 font-normal text-base">
                <input 
                    type="checkbox" 
                    checked={hideSidebarOnDisplayMedium}
                    onChange={onChangeFlipSidebarDisplayMedium} />
                &nbsp;On Medium Display
            </label>
            <label className="ml-2 font-normal text-base">
                <input 
                    type="checkbox" 
                    checked={hideSidebarOnDisplayLarge}
                    onChange={onChangeFlipSidebarDisplayLarge} />
                &nbsp;On Large Display
            </label>
            <p className="font-normal text-sm italic">
                Medium Display: Viewport width &gt;=768px and &lt;1536px
            </p>
            <p className="font-normal text-sm italic">
                Large Display: Viewport width &gt;=1536px
            </p>
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

function Administrative(props) {
    const {
        serverUrl,
        setServerUrl,
        showSettingMessage,
        setShowSettingMessage,
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

    const buttons = [
        <SettingButton key="admin button reload" content="Reload Metadata DB" dangerous={true} onClickFunc={reload} />,
        <SettingButton key="admin button hard reload" content="Hard-Reload Metadata DB" dangerous={true} onClickFunc={hard_reload} />,
        <SettingButton key="admin button disconnect" content="Disconnect from DB" dangerous={true} onClickFunc={disconnect} />,
    ];

    return (
        <div className="flex flex-col grow gap-2">
            <div className="text-black">Administrative</div>
                {buttons}
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
        onClickFunc,
        dangerous,
    } = props;

    return (
        <div 
            onClick={onClickFunc}
            className={`pl-3 bg-gray-800 rounded-md select-none transition duration-300 hover:cursor-pointer ${dangerous ? "hover:bg-red-500" : "hover:bg-amber-700"}`}>
            {content}
        </div>
    );
}

export default Setting;