import React, { useState } from 'react';
import tab_images from './tabs/tabimages/tabImages.js'
import Controller from './tabs/Controller.js';
import Queue from "./tabs/Queue";
import Setting from "./tabs/Setting";

function MenuContent(props) {
    const {
        showSidebar,
        npTrack,
        npAlbum,
        audioRef,
        intervalRef,
        startInterval,
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
    } = props;
    const [ selectedTab, setSelectedTab ] = useState(0);
    const [ showSettingMessage, setShowSettingMessage ] = useState(false);

    return (
        <div className={`flex flex-row grow overflow-auto .display-hidden transition ease-in-out duration-500 ${showSidebar ? "translate-y-0" : "-translate-y-full"}`}>
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
                className={`p-2 2xl:p-3 w-14 h-14 2xl:w-20 2xl:h-20
                    ${i === tab_images.length - 1 && "mt-auto"} 
                    ${i !== selectedTab ? "bg-gray-700" : "bg-gray-500"} 
                    transition duration-350 ease-in-out hover:cursor-pointer hover:bg-amber-700`}>
            </img>
        )
    });

    return (
        <div className={`grow z-30 w-14 2xl:w-20 overflow-auto flex flex-col bg-gray-700`}>
            {images}
        </div>
    )
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
    } = props;

    const tab_contents = [
        <Controller 
            key="tab controller"
            serverUrl={serverUrl}
            npTrack={npTrack}
            npAlbum={npAlbum}
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
            serverUrl={serverUrl}
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
            setTabTitle={setTabTitle}
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
        <div className={`bg-gray-500 grow z-30 overflow-auto w-42 2xl:w-60`}>
            {tab_contents[selectedTab]}
        </div>
    )
}

export default MenuContent;