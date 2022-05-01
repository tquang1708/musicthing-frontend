import React, { useEffect, useState } from 'react';
import MenuContentMobile from './MenuContentMobile';
import MenuContentTabMiniPlayerMobile from './MenuContentTabMiniPlayerMobile';

function BottomMenuMobile(props) {
    const {
        bottomMenuContentVisible,
        setBottomMenuContentVisible,
        serverUrl,
        setServerUrl,
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
        setNewTrack,
        setnpTrack,
        setnpAlbum,
        setTabTitle,
        currTheme,
    } = props;
    const [ selectedTab, setSelectedTab ] = useState(0);
    const [ showSettingMessage, setShowSettingMessage ] = useState(false);

    // close bottom bar on back button
    useEffect(() => {
        if (bottomMenuContentVisible) {
            window.onpopstate = () => {
                window.history.forward(); // just go forward again
                setBottomMenuContentVisible(false);
            }
        } else {
            // when bottom menu is not visible back button should not do anything
            window.onpopstate = undefined;
        }
    }, [bottomMenuContentVisible]);

    return (
        <div className={`flex flex-col fixed bottom-0 ${bottomMenuContentVisible ? "h-screen" : "h-10"} z-10`}>
            <MenuContentMobile 
                bottomMenuContentVisible={bottomMenuContentVisible}
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
                setBottomMenuContentVisible={setBottomMenuContentVisible}
                currTheme={currTheme}
            />
            <MenuContentTabMiniPlayerMobile
                serverUrl={serverUrl}
                npTrack={npTrack}
                npAlbum={npAlbum}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                explicitQueue={explicitQueue}
                setExplicitQueue={setExplicitQueue}
                inExplicitQueue={inExplicitQueue}
                setInExplicitQueue={setInExplicitQueue}
                implicitQueuePlaylist={implicitQueuePlaylist}
                setNewTrack={setNewTrack}
                setnpTrack={setnpTrack}
                setnpAlbum={setnpAlbum}
                setTabTitle={setTabTitle}
                bottomMenuContentVisible={bottomMenuContentVisible}
                setBottomMenuContentVisible={setBottomMenuContentVisible}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                setShowSettingMessage={setShowSettingMessage}
            />
        </div>
    );
}

export default BottomMenuMobile;