import React, { useState } from "react";
// import logo from '../../logo.svg';

function Setting(props) {
    const {
        serverUrl,
        setServerUrl,
        showSettingMessage,
        setShowSettingMessage,
        hideSidebarOnDisplayMedium,
        setHideSidebarOnDisplayMedium,
        hideSidebarOnDisplayLarge,
        setHideSidebarOnDisplayLarge,
    } = props;

    return (
        <div style={{color: "var(--highlight-color)"}} 
            className="flex flex-col gap-2 m-2 text-base 2xl:text-lg font-semibold">
            {/* <SettingButton content="Connect to Last.fm (TBD)" onClickFunc={lastfm} />
            <div></div> */}
            <Behavior 
                hideSidebarOnDisplayMedium={hideSidebarOnDisplayMedium}
                setHideSidebarOnDisplayMedium={setHideSidebarOnDisplayMedium}
                hideSidebarOnDisplayLarge={hideSidebarOnDisplayLarge}
                setHideSidebarOnDisplayLarge={setHideSidebarOnDisplayLarge}
            />
            <Theming />
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
        <div
            style={{color: "var(--menu-text-icon-color)"}}
            className="flex flex-col grow">
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

function Theming() {
    const themeSelectionLocal = localStorage.getItem("themeSelection") ? localStorage.getItem("themeSelection") : "default";
    const [ themeSelection, setThemeSelection ] = useState(themeSelectionLocal);

    const menuTextIconColorLocal = localStorage.getItem("menuTextIconColor") ? localStorage.getItem("menuTextIconColor") : "#000";
    const highlightColorLocal = localStorage.getItem("highlightColor") ? localStorage.getItem("highlightColor") : "#f8fafc";

    const customMenuTextIconColorLocal = localStorage.getItem("customMenuTextIconColor") ? localStorage.getItem("customMenuTextIconColor") : "#000";
    const customHighlightColorLocal = localStorage.getItem("customHighlightColor") ? localStorage.getItem("customHighlightColor") : "#f8fafc";

    const [ theme, setTheme ] = useState({
        menuTextIconColor: menuTextIconColorLocal,
        highlightColor: highlightColorLocal,
    });
    const [ customTheme, setCustomTheme ] = useState({
        customMenuTextIconColor: customMenuTextIconColorLocal,
        customHighlightColor: customHighlightColorLocal,
    });
    const [ disableCustomTheme, setDisableCustomTheme ] = useState(themeSelection !== "custom");

    const onChangeSetTheme = (e) => {
        const newTheme = e.target.value;

        // if custom enable custom theming
        if (newTheme === "custom") {
            setDisableCustomTheme(false);
            setTheme({
                menuTextIconColor: customTheme["customMenuTextIconColor"],
                highlightColor: customTheme["customHighlightColor"],
            });

            localStorage.setItem('menuTextIconColor', customTheme["customMenuTextIconColor"]);
            localStorage.setItem('highlightColor', customTheme["customHighlightColor"]);

            document.documentElement.style.setProperty('--menu-text-icon-color', customTheme["customMenuTextIconColor"]);
            document.documentElement.style.setProperty('--highlight-color', customTheme["customHighlightColor"]);
        } else {
            setDisableCustomTheme(true);

            if (newTheme === "default") {
                setTheme({
                    menuTextIconColor: '#000',
                    highlightColor: '#f8fafc',
                });
                
                localStorage.setItem('menuTextIconColor', '#000');
                localStorage.setItem('highlightColor', '#f8fafc');

                document.documentElement.style.setProperty('--menu-text-icon-color', '#000');
                document.documentElement.style.setProperty('--highlight-color', '#f8fafc');
            }
        }

        localStorage.setItem('themeSelection', newTheme);
        setThemeSelection(newTheme);
    };

    const onChangeSetColor = (e, themeKey, customThemeKey, cssVar) => {
        const newColor = e.target.value;
        const newTheme = {
            ...theme,
            [themeKey]: newColor,
        };
        setTheme(newTheme);
        localStorage.setItem(themeKey, newColor);

        if (themeSelection === "custom") {
            const newCustomTheme = {
                ...customTheme,
                [customThemeKey]: newColor,
            };
            setCustomTheme(newCustomTheme);
            localStorage.setItem(customThemeKey, newColor);
        }

        document.documentElement.style.setProperty(cssVar, newColor);
    }

    return (
        <div
            style={{color: "var(--menu-text-icon-color)"}} 
            className="flex flex-col grow gap-1">
            <div>Theming</div>
            <select className="grow" value={themeSelection} onChange={onChangeSetTheme}>
                <option value="default">Default</option>
                <option value="custom">Custom</option>
            </select>
            <div
                style={{color: `${disableCustomTheme ? "var(--menu-text-icon-color)" : "var(--highlight-color)"}`}} 
                className="flex flex-col gap-0.5">
                <label>
                    <input 
                        disabled={disableCustomTheme} 
                        type="color" 
                        value={theme["menuTextIconColor"]} 
                        onChange={(e) => onChangeSetColor(e, "menuTextIconColor", "customMenuTextIconColor", "--menu-text-icon-color")} />
                    &nbsp;Menu Text & Icon
                </label>
                <label>
                    <input 
                        disabled={disableCustomTheme} 
                        type="color" 
                        value={theme["highlightColor"]} 
                        onChange={(e) => onChangeSetColor(e, "highlightColor", "customHighlightColor", "--highlight-color")} />
                    &nbsp;Highlight
                </label>
            </div>
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
            <div style={{color: "var(--menu-text-icon-color)"}}>Administrative</div>
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
