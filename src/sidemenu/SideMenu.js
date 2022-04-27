import React, { useState, useEffect } from 'react';

import MenuMiniPlayer from './MenuMiniPlayer';
import MenuContent from './MenuContent';

function SideMenu(props) {
    const {
        sidebarOverlay,
        artSource,
        npArtist,
        npAlbum,
        npTitle,
        isPlaying,
        setIsPlaying,
    } = props;
    const [ showMenu, setShowMenu ] = useState(true);
    const [ showSidebar, setShowSidebar ] = useState(true);
    const [ divHeight, setDivHeight ] = useState("h-screen");
    const [ divWidth, setDivWidth ] = useState("w-auto");

    // handle transitions
    const onTransitionEndHideDiv = () => {
        if (!showSidebar) {
            setDivWidth("w-0");
            setDivHeight("h-14 2xl:h-20");
        }
        if (!showMenu) {
            setDivWidth("w-0");
        }
    };

    return (
        <div className={`${sidebarOverlay ? "fixed" : "sticky top-0 self-start"} flex flex-row z-50 ${divWidth}`}>
            <div 
                onTransitionEnd={onTransitionEndHideDiv} 
                className={`flex flex-col transition ease-in-out duration-500 ${divHeight} ${showMenu ? "translate-x-0" : "-translate-x-full"}`}>
                <MenuMiniPlayer
                    artSource={artSource}
                    npArtist={npArtist}
                    npAlbum={npAlbum}
                    npTitle={npTitle}
                    showSidebar={showSidebar}
                    setShowSidebar={setShowSidebar}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    setDivHeight={setDivHeight}
                />
                <MenuContent 
                    showSidebar={showSidebar}
                />
            </div>
            <MenuHideButton 
                showMenu={showMenu}
                setShowMenu={setShowMenu}
                setDivWidth={setDivWidth} />
        </div>
    );
}

function MenuHideButton(props) {
    const {
        showMenu,
        setShowMenu,
        setDivWidth,
    } = props;

    useEffect(() => {
        if (showMenu) {
            setDivWidth("w-auto");
        }
    }, [showMenu]);

    const onClickToggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
        <div 
            onClick={onClickToggleMenu}
            className={`flex flex-col justify-center px-1 bg-gray-800 h-14 2xl:h-20 font-mono text-2xl text-slate-50 hover:cursor-pointer hover:text-amber-300 hover:bg-gray-900 ease-in-out duration-500 ${showMenu ? "translate-x-0 opacity-100" : "-translate-x-56 2xl:-translate-x-80 opacity-90"}`}>
            {showMenu ? "◀︎" : "▶︎"}
        </div>
    );
}

export default SideMenu;