import React, { useState, useEffect } from 'react';

import MenuMiniPlayer from './MenuMiniPlayer';
import MenuContent from './MenuContent';

function SideMenu(props) {
    const {
        sidebarOverlay,
        setTabTitle,
        npAlbum,
        npTrack,
        setnpTrack,
        setnpAlbum,
        isPlaying,
        setIsPlaying,
        setNewTrack,
        trackProgress,
        setTrackProgress,
        audioRef,
        intervalRef,
        startInterval,
        serverUrl,
        setServerUrl,
        explicitQueue,
        setExplicitQueue,
        inExplicitQueue,
        setInExplicitQueue,
        implicitQueuePlaylist,
        implicitQueueDiscIndex,
        implicitQueueTrackIndex,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
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
                    serverUrl={serverUrl}
                    setTabTitle={setTabTitle}
                    npAlbum={npAlbum}
                    npTrack={npTrack}
                    setnpTrack={setnpTrack}
                    setnpAlbum={setnpAlbum}
                    showSidebar={showSidebar}
                    setShowSidebar={setShowSidebar}
                    explicitQueue={explicitQueue}
                    setExplicitQueue={setExplicitQueue}
                    inExplicitQueue={inExplicitQueue}
                    setInExplicitQueue={setInExplicitQueue}
                    implicitQueuePlaylist={implicitQueuePlaylist}
                    implicitQueueDiscIndex={implicitQueueDiscIndex}
                    implicitQueueTrackIndex={implicitQueueTrackIndex}
                    setImplicitQueueDiscIndex={setImplicitQueueDiscIndex}
                    setImplicitQueueTrackIndex={setImplicitQueueTrackIndex}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    setNewTrack={setNewTrack}
                    setDivHeight={setDivHeight}
                    showMenu={showMenu}
                    setDivWidth={setDivWidth}
                />
                <MenuContent 
                    showSidebar={showSidebar}
                    audioRef={audioRef}
                    intervalRef={intervalRef}
                    startInterval={startInterval}
                    trackProgress={trackProgress}
                    setTrackProgress={setTrackProgress}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    explicitQueue={explicitQueue}
                    setExplicitQueue={setExplicitQueue}
                    implicitQueuePlaylist={implicitQueuePlaylist}
                    implicitQueueDiscIndex={implicitQueueDiscIndex}
                    implicitQueueTrackIndex={implicitQueueTrackIndex}
                    setImplicitQueueDiscIndex={setImplicitQueueDiscIndex}
                    setImplicitQueueTrackIndex={setImplicitQueueTrackIndex}
                    serverUrl={serverUrl}
                    setServerUrl={setServerUrl}
                />
            </div>
            <MenuHideButton 
                showMenu={showMenu}
                showSidebar={showSidebar}
                setShowMenu={setShowMenu}
                setDivWidth={setDivWidth} />
        </div>
    );
}

function MenuHideButton(props) {
    const {
        showMenu,
        showSidebar,
        setShowMenu,
        setDivWidth,
    } = props;

    useEffect(() => {
        if (showMenu && showSidebar) {
            setDivWidth("w-auto");
        }
    }, [showMenu]);

    const onClickToggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
        <div 
            onClick={onClickToggleMenu}
            className={`flex flex-col justify-center px-1 bg-gray-800 h-14 2xl:h-20 font-mono text-2xl text-slate-50 hover:cursor-pointer hover:text-amber-300 hover:bg-gray-900 transition ease-in-out duration-500 ${showMenu ? "translate-x-0 opacity-100" : "-translate-x-56 2xl:-translate-x-80 opacity-90"}`}>
            {showMenu ? "◀︎" : "▶︎"}
        </div>
    );
}

export default SideMenu;