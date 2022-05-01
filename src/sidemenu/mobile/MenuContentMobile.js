import React from "react";
import Controller from "../tabs/Controller";
import Queue from "../tabs/Queue";
import Setting from "../tabs/Setting";

function MenuContentMobile(props) {
    const {
        bottomMenuContentVisible,
        selectedTab,
        npTrack,
        npAlbum,
        audioRef,
        intervalRef,
        startInterval,
        trackProgress,
        setTrackProgress,
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
        currTheme,
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
            currTheme={currTheme}
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
            setBottomMenuContentVisible={setBottomMenuContentVisible}
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
        <div className={`bg-gray-500 grow mb-auto overflow-auto ${!bottomMenuContentVisible && "hidden"}`}>
            {tab_contents[selectedTab]}
        </div>
    )
}

export default MenuContentMobile;