import React, { useState } from 'react';
import tab_images from './tabs/tabimages/tabImages.js'
import Controller from './tabs/Controller.js';
import Queue from "./tabs/Queue";
import Setting from "./tabs/Setting";

function MenuContent(props) {
    const {
        showSidebar,
        audioRef,
        intervalRef,
        startInterval,
        trackProgress,
        setTrackProgress,
        isPlaying,
        setIsPlaying,
        explicitQueue,
        setExplicitQueue,
        implicitQueuePlaylist,
        implicitQueueDiscIndex,
        implicitQueueTrackIndex,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
        serverUrl,
        setServerUrl,
    } = props;
    const [ selectedTab, setSelectedTab ] = useState(0);
    const [ showSettingMessage, setShowSettingMessage ] = useState(false);

    return (
        <div className={`flex flex-row grow overflow-auto .display-hidden transition ease-in-out duration-500 ${showSidebar ? "translate-y-0" : "-translate-y-full"}`}>
            <MenuTabItems 
                setSelectedTab={setSelectedTab}
                setShowSettingMessage={setShowSettingMessage}
            />
            <MenuTabContent 
                selectedTab={selectedTab}
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
                showSettingMessage={showSettingMessage}
                setShowSettingMessage={setShowSettingMessage}
            />
        </div>
    );
}

function MenuTabItems(props) {
    const {
        setSelectedTab,
        setShowSettingMessage,
    } = props;

    const onClickSetTab = (i) => {
        setSelectedTab(i);
        if (i !== tab_images.length - 1) {
            setShowSettingMessage(false);
        }
    };

    const images = tab_images.map((tab, i) => {
        return (
            <img
                key={`tab image ${tab[0]}`} 
                src={tab[1]}
                onClick={() => onClickSetTab(i)}
                className={`border-gray-800 bg-gray-700 p-2 2xl:p-3 border-x-6 2xl:border-x-8 border-b-6 2xl:border-b-8 ${i === tab_images.length - 1 && "mt-auto border-t-6 2xl:border-t-8"} transition duration-350 ease-in-out hover:cursor-pointer hover:bg-amber-700`}>
            </img>
        )
    });

    return (
        <div className={`grow z-30 w-14 2xl:w-20 flex flex-col bg-gray-700`}>
            {images}
        </div>
    )
}

function MenuTabContent(props) {
    const {
        selectedTab,
        audioRef,
        intervalRef,
        startInterval,
        trackProgress,
        setTrackProgress,
        isPlaying,
        setIsPlaying,
        explicitQueue,
        setExplicitQueue,
        implicitQueuePlaylist,
        implicitQueueDiscIndex,
        implicitQueueTrackIndex,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
        serverUrl,
        setServerUrl,
        showSettingMessage,
        setShowSettingMessage,
    } = props;

    const tab_contents = [
        <Controller 
            key="tab controller"
            audioRef={audioRef}
            intervalRef={intervalRef}
            startInterval={startInterval}
            trackProgress={trackProgress}
            setTrackProgress={setTrackProgress}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
        />,
        <Queue 
            key="tab queue" 
            explicitQueue={explicitQueue}
            setExplicitQueue={setExplicitQueue}
            implicitQueuePlaylist={implicitQueuePlaylist}
            implicitQueueDiscIndex={implicitQueueDiscIndex}
            implicitQueueTrackIndex={implicitQueueTrackIndex}
            setImplicitQueueDiscIndex={setImplicitQueueDiscIndex}
            setImplicitQueueTrackIndex={setImplicitQueueTrackIndex}
        />,
        <Setting 
            key="tab setting"
            serverUrl={serverUrl}
            setServerUrl={setServerUrl}
            showSettingMessage={showSettingMessage}
            setShowSettingMessage={setShowSettingMessage}
        />
    ];

    return (
        <div className={`bg-gray-500 grow z-30 w-42 2xl:w-60`}>
            {tab_contents[selectedTab]}
        </div>
    )
}

export default MenuContent;