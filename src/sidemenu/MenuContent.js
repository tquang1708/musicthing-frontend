import React, { useState } from 'react';
import Controller from './tabs/Controller.js';
import Queue from "./tabs/Queue";
import Setting from "./tabs/Setting";
import tabIcons from './tabs/tabIcons.js';

function MenuContent(props) {
    const {
        showSidebar,
        npTrack,
        npAlbum,
        audioRef,
        intervalRef,
        startInterval,
        onBigScreen,
        onBiggerScreen,
        trackProgress,
        setTrackProgress,
        isPlaying,
        setIsPlaying,
        explicitQueue,
        setExplicitQueue,
        inExplicitQueue,
        setInExplicitQueue,
        implicitQueuePlaylist,
        implicitQueueDiscIndex,
        implicitQueueTrackIndex,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
        serverUrl,
        setServerUrl,
        setNewTrack,
        setnpTrack,
        setnpAlbum,
        setTabTitle,
        setBottomMenuContentVisible,
        hideSidebarOnDisplayMedium,
        setHideSidebarOnDisplayMedium,
        hideSidebarOnDisplayLarge,
        setHideSidebarOnDisplayLarge,
        themeSelection,
        setThemeSelection,
        textColor,
        setTextColor,
        customTextColor,
        setCustomTextColor,
    } = props;
    const [ selectedTab, setSelectedTab ] = useState(0);
    const [ showSettingMessage, setShowSettingMessage ] = useState(false);

    return (
        <div className={`flex flex-row grow overflow-auto transition ease-in-out duration-500 ${showSidebar ? "translate-y-0" : "-translate-y-full"}`}>
            <MenuTabItems 
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                setShowSettingMessage={setShowSettingMessage}
            />
            <MenuTabContent 
                selectedTab={selectedTab}
                npTrack={npTrack}
                npAlbum={npAlbum}
                audioRef={audioRef}
                intervalRef={intervalRef}
                startInterval={startInterval}
                trackProgress={trackProgress}
                setTrackProgress={setTrackProgress}
                onBigScreen={onBigScreen}
                onBiggerScreen={onBiggerScreen}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                explicitQueue={explicitQueue}
                setExplicitQueue={setExplicitQueue}
                inExplicitQueue={inExplicitQueue}
                setInExplicitQueue={setInExplicitQueue}
                implicitQueuePlaylist={implicitQueuePlaylist}
                implicitQueueDiscIndex={implicitQueueDiscIndex}
                implicitQueueTrackIndex={implicitQueueTrackIndex}
                setImplicitQueueDiscIndex={setImplicitQueueDiscIndex}
                setImplicitQueueTrackIndex={setImplicitQueueTrackIndex}
                serverUrl={serverUrl}
                setServerUrl={setServerUrl}
                showSettingMessage={showSettingMessage}
                setShowSettingMessage={setShowSettingMessage}
                setNewTrack={setNewTrack}
                setnpTrack={setnpTrack}
                setnpAlbum={setnpAlbum}
                setTabTitle={setTabTitle}
                setBottomMenuContentVisible={setBottomMenuContentVisible}
                hideSidebarOnDisplayMedium={hideSidebarOnDisplayMedium}
                setHideSidebarOnDisplayMedium={setHideSidebarOnDisplayMedium}
                hideSidebarOnDisplayLarge={hideSidebarOnDisplayLarge}
                setHideSidebarOnDisplayLarge={setHideSidebarOnDisplayLarge}
                themeSelection={themeSelection}
                setThemeSelection={setThemeSelection}
                textColor={textColor}
                setTextColor={setTextColor}
                customTextColor={customTextColor}
                setCustomTextColor={setCustomTextColor}
            />
        </div>
    );
}

function MenuTabItems(props) {
    const {
        selectedTab,
        setSelectedTab,
        setShowSettingMessage,
    } = props;

    console.log(tabIcons);

    const images = tabIcons.map((tab, i) => {
        return (
            <MenuTabItem 
                key={`tab image ${tab[0]}`} 
                i={i}
                image={tab[1]}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                setShowSettingMessage={setShowSettingMessage}
            />
        )
    });

    return (
        <div className={`grow z-30 w-14 2xl:w-20 overflow-auto flex flex-col bg-gray-700`}>
            {images}
        </div>
    )
}

function MenuTabItem(props) {
    const {
        i,
        image,
        selectedTab,
        setSelectedTab,
        setShowSettingMessage,
    } = props;
    const [ isHover, setIsHover ] = useState(false);
    const onEnterEnableHover = () => setIsHover(true);
    const onLeaveDisableHover = () => setIsHover(false);

    const onClickSetTab = (i) => {
        setSelectedTab(i);
        if (i !== tabIcons.length - 1) {
            setShowSettingMessage(false);
        }
    };

    return (
        <div
            onClick={() => onClickSetTab(i)} onMouseEnter={onEnterEnableHover} onMouseLeave={onLeaveDisableHover}
            style={{backgroundColor: `${isHover ? "var(--select-dark-color)" : ""}`}}
            className={`p-2 2xl:p-3 w-14 h-14 2xl:w-20 2xl:h-20
                ${i === tabIcons.length - 1 && "mt-auto"} 
                ${i !== selectedTab ? "bg-gray-700" : "bg-gray-500"} 
                transition duration-350 ease-in-out hover:cursor-pointer`}>
            {image}
        </div>
    );
}

function MenuTabContent(props) {
    const {
        selectedTab,
        npTrack,
        npAlbum,
        audioRef,
        intervalRef,
        startInterval,
        trackProgress,
        setTrackProgress,
        onBigScreen,
        onBiggerScreen,
        isPlaying,
        setIsPlaying,
        explicitQueue,
        setExplicitQueue,
        inExplicitQueue,
        setInExplicitQueue,
        implicitQueuePlaylist,
        implicitQueueDiscIndex,
        implicitQueueTrackIndex,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
        serverUrl,
        setServerUrl,
        showSettingMessage,
        setShowSettingMessage,
        setNewTrack,
        setnpTrack,
        setnpAlbum,
        setTabTitle,
        setBottomMenuContentVisible,
        hideSidebarOnDisplayMedium,
        setHideSidebarOnDisplayMedium,
        hideSidebarOnDisplayLarge,
        setHideSidebarOnDisplayLarge,
    } = props;

    const tab_contents = [
        <Controller 
            key={"tab controller"}
            serverUrl={serverUrl}
            npTrack={npTrack}
            npAlbum={npAlbum}
            audioRef={audioRef}
            intervalRef={intervalRef}
            startInterval={startInterval}
            trackProgress={trackProgress}
            setTrackProgress={setTrackProgress}
            onBigScreen={onBigScreen}
            onBiggerScreen={onBiggerScreen}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            explicitQueue={explicitQueue}
            setExplicitQueue={setExplicitQueue}
            inExplicitQueue={inExplicitQueue}
            setInExplicitQueue={setInExplicitQueue}
            implicitQueuePlaylist={implicitQueuePlaylist}
            implicitQueueDiscIndex={implicitQueueDiscIndex}
            implicitQueueTrackIndex={implicitQueueTrackIndex}
            setImplicitQueueDiscIndex={setImplicitQueueDiscIndex}
            setImplicitQueueTrackIndex={setImplicitQueueTrackIndex}
            setNewTrack={setNewTrack}
            setTabTitle={setTabTitle}
            setnpTrack={setnpTrack}
            setnpAlbum={setnpAlbum}
            setBottomMenuContentVisible={setBottomMenuContentVisible}
        />,
        <Queue 
            key="tab queue" 
            serverUrl={serverUrl}
            onBigScreen={onBigScreen}
            explicitQueue={explicitQueue}
            setExplicitQueue={setExplicitQueue}
            inExplicitQueue={inExplicitQueue}
            setInExplicitQueue={setInExplicitQueue}
            implicitQueuePlaylist={implicitQueuePlaylist}
            implicitQueueDiscIndex={implicitQueueDiscIndex}
            implicitQueueTrackIndex={implicitQueueTrackIndex}
            setImplicitQueueDiscIndex={setImplicitQueueDiscIndex}
            setImplicitQueueTrackIndex={setImplicitQueueTrackIndex}
            setNewTrack={setNewTrack}
            setnpTrack={setnpTrack}
            setnpAlbum={setnpAlbum}
            setBottomMenuContentVisible={setBottomMenuContentVisible}
            setTabTitle={setTabTitle}
        />,
        <Setting 
            key="tab setting"
            serverUrl={serverUrl}
            setServerUrl={setServerUrl}
            showSettingMessage={showSettingMessage}
            setShowSettingMessage={setShowSettingMessage}
            hideSidebarOnDisplayMedium={hideSidebarOnDisplayMedium}
            setHideSidebarOnDisplayMedium={setHideSidebarOnDisplayMedium}
            hideSidebarOnDisplayLarge={hideSidebarOnDisplayLarge}
            setHideSidebarOnDisplayLarge={setHideSidebarOnDisplayLarge}
        />
    ];

    return (
        <div className={`bg-gray-500 grow z-30 overflow-auto w-42 2xl:w-60`}>
            {tab_contents[selectedTab]}
        </div>
    )
}

export default MenuContent;