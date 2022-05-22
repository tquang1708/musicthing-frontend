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
    const selectColorLocal = localStorage.getItem("selectColor") ? localStorage.getItem("selectColor") : "#f59e0b";
    const selectDarkColorLocal = localStorage.getItem("selectDarkColor") ? localStorage.getItem("selectDarkColor") : "#b45309";
    const dangerColorLocal = localStorage.getItem("dangerColor") ? localStorage.getItem("dangerColor") : "#ef4444";

    const customMenuTextIconColorLocal = localStorage.getItem("customMenuTextIconColor") ? localStorage.getItem("customMenuTextIconColor") : "#000";
    const customHighlightColorLocal = localStorage.getItem("customHighlightColor") ? localStorage.getItem("customHighlightColor") : "#f8fafc";
    const customSelectColorLocal = localStorage.getItem("customSelectColor") ? localStorage.getItem("customSelectColor") : "#f59e0b";
    const customSelectDarkColorLocal = localStorage.getItem("customSelectDarkColor") ? localStorage.getItem("customSelectDarkColor") : "#b45309";
    const customDangerColorLocal = localStorage.getItem("customDangerColor") ? localStorage.getItem("customDangerColor") : "#ef4444";

    const [ theme, setTheme ] = useState({
        menuTextIconColor: menuTextIconColorLocal,
        highlightColor: highlightColorLocal,
        selectColor: selectColorLocal,
        selectDarkColor: selectDarkColorLocal,
        dangerColor: dangerColorLocal,
    });
    const [ customTheme, setCustomTheme ] = useState({
        customMenuTextIconColor: customMenuTextIconColorLocal,
        customHighlightColor: customHighlightColorLocal,
        customSelectColor: customSelectColorLocal,
        customSelectDarkColor: customSelectDarkColorLocal,
        customDangerColorLocal: customDangerColorLocal,
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
                selectColor: customTheme["customSelectColor"],
                selectDarkColor: customTheme["customSelectDarkColor"],
                dangerColor: customTheme["customDangerColorLocal"],
            });

            localStorage.setItem('menuTextIconColor', customTheme["customMenuTextIconColor"]);
            localStorage.setItem('highlightColor', customTheme["customHighlightColor"]);
            localStorage.setItem('selectColor', customTheme["customSelectColor"]);
            localStorage.setItem('selectDarkColor', customTheme["customSelectDarkColor"]);
            localStorage.setItem('dangerColor', customTheme["customDangerColorLocal"]);

            document.documentElement.style.setProperty('--menu-text-icon-color', customTheme["customMenuTextIconColor"]);
            document.documentElement.style.setProperty('--highlight-color', customTheme["customHighlightColor"]);
            document.documentElement.style.setProperty('--select-color', customTheme["customSelectColor"]);
            document.documentElement.style.setProperty('--select-dark-color', customTheme["customSelectDarkColor"]);
            document.documentElement.style.setProperty('--danger-color', customTheme["customDangerColorLocal"]);
        } else {
            setDisableCustomTheme(true);

            if (newTheme === "default") {
                setTheme({
                    menuTextIconColor: '#000',
                    highlightColor: '#f8fafc',
                    selectColor: '#f59e0b',
                    selectDarkColor: '#b45309',
                    dangerColor: '#ef4444',
                });
                
                localStorage.setItem('menuTextIconColor', '#000');
                localStorage.setItem('highlightColor', '#f8fafc');
                localStorage.setItem('selectColor', '#f59e0b');
                localStorage.setItem('selectDarkColor', '#b45309');
                localStorage.setItem('dangerColor', '#ef4444');

                document.documentElement.style.setProperty('--menu-text-icon-color', '#000');
                document.documentElement.style.setProperty('--highlight-color', '#f8fafc');
                document.documentElement.style.setProperty('--select-color', '#f59e0b');
                document.documentElement.style.setProperty('--select-dark-color', '#b45309');
                document.documentElement.style.setProperty('--danger-color', '#ef4444');
            }
        }

        localStorage.setItem('themeSelection', newTheme);
        setThemeSelection(newTheme);
    };

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
                <ThemingOption 
                    theme={theme}
                    setTheme={setTheme}
                    customTheme={customTheme}
                    setCustomTheme={setCustomTheme}
                    themeSelection={themeSelection}
                    disableCustomTheme={disableCustomTheme}
                    labelTitle="Menu Text & Icon"
                    themeKey="menuTextIconColor"
                    customThemeKey="customMenuTextIconColor"
                    cssVar="--menu-text-icon-color"
                />
                <ThemingOption 
                    theme={theme}
                    setTheme={setTheme}
                    customTheme={customTheme}
                    setCustomTheme={setCustomTheme}
                    themeSelection={themeSelection}
                    disableCustomTheme={disableCustomTheme}
                    labelTitle="Highlight"
                    themeKey="highlightColor"
                    customThemeKey="customHighlightColor"
                    cssVar="--highlight-color"
                />
                <ThemingOption 
                    theme={theme}
                    setTheme={setTheme}
                    customTheme={customTheme}
                    setCustomTheme={setCustomTheme}
                    themeSelection={themeSelection}
                    disableCustomTheme={disableCustomTheme}
                    labelTitle="Select"
                    themeKey="selectColor"
                    customThemeKey="customSelectColor"
                    cssVar="--select-color"
                />
                <ThemingOption 
                    theme={theme}
                    setTheme={setTheme}
                    customTheme={customTheme}
                    setCustomTheme={setCustomTheme}
                    themeSelection={themeSelection}
                    disableCustomTheme={disableCustomTheme}
                    labelTitle="Select Dark"
                    themeKey="selectDarkColor"
                    customThemeKey="customSelectDarkColor"
                    cssVar="--select-dark-color"
                />
                <ThemingOption 
                    theme={theme}
                    setTheme={setTheme}
                    customTheme={customTheme}
                    setCustomTheme={setCustomTheme}
                    themeSelection={themeSelection}
                    disableCustomTheme={disableCustomTheme}
                    labelTitle="Danger"
                    themeKey="dangerColor"
                    customThemeKey="customDangerColor"
                    cssVar="--danger-color"
                />
            </div>
        </div>
    );
}

function ThemingOption(props) {
    const {
        theme,
        setTheme,
        customTheme,
        setCustomTheme,
        themeSelection,
        disableCustomTheme,
        labelTitle,
        themeKey,
        customThemeKey,
        cssVar,
    } = props;

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
        <label>
            <input 
                disabled={disableCustomTheme} 
                type="color" 
                value={theme[themeKey]} 
                onChange={(e) => onChangeSetColor(e, themeKey, customThemeKey, cssVar)} />
            &nbsp;{labelTitle}
        </label>  
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
    const [ isHover, setIsHover ] = useState(false);

    const onEnterEnableHover = () => setIsHover(true);
    const onLeaveDisableHover = () => setIsHover(false);

    return (
        <div 
            onClick={onClickFunc} onMouseEnter={onEnterEnableHover} onMouseLeave={onLeaveDisableHover}
            style={{backgroundColor: `${isHover ? `${dangerous ? "var(--danger-color)" : "var(--select-dark-color)"}` : ""}`}}
            className={`pl-3 bg-gray-800 rounded-md select-none transition duration-300 hover:cursor-pointer`}>
            {content}
        </div>
    );
}

export default Setting;
