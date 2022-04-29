import React, { useEffect, useRef } from "react";

function SettingsBox(props) {
    const {
        context,
        buttonsContent,
        xOffset,
        yOffset,
        setShowSettings,
    } = props;
    const wrapperRef = useRef(null);
    useHideOnOutsideClick(wrapperRef, setShowSettings);

    const buttons = buttonsContent.map((button) => {
        const [ content, onClickFunc ] = button;

        return (
            <SettingsButton
                key={`${context} ${content}`}
                content={content}
                onClickFunc={onClickFunc} 
                setShowSettings={setShowSettings}
            />
        );
    });

    return (
        <div style={{left: xOffset - 160, top: yOffset}}
            ref={wrapperRef}
            className="flex flex-col absolute p-1 gap-1 z-10 drop-shadow-lg rounded-xl text-lg font-medium bg-gray-700 text-slate-50">
            {buttons}
        </div>
    );
}

function SettingsButton(props) {
    const {
        content,
        onClickFunc,
        setShowSettings,
    } = props;

    const onClickHideSettings = () => {
        onClickFunc();
        setShowSettings(false);
    }

    return (
        <div onClick={onClickHideSettings} 
            className="select-none py-0.5 pl-0.5 pr-5 rounded-md transition duration-200 ease-linear hover:bg-amber-700 hover:cursor-pointer">
            {content}
        </div>
    );
}

// from https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
function useHideOnOutsideClick(ref, setShowSettings) {
    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setShowSettings(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

export default SettingsBox;