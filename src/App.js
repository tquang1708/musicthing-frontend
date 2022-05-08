import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Routes,
    Route,
    Outlet,
} from 'react-router-dom';

import Login from './misc/Login';
import NotFound from './misc/NotFound';

import SideMenu from './sidemenu/SideMenu';
import BottomMenuMobile from './sidemenu/mobile/BottomMenuMobile';
import AlbumDisplay from './maindisplay/AlbumDisplay';
import Album from './maindisplay/Album';

import { incrementQueueIndex } from './misc/helper/queueIndex';

function App() {
    const [ serverUrl, setServerUrl ] = useState(localStorage.getItem("serverUrl"));
    const [ tabTitle, setTabTitle ] = useState("musicthing");

    const [ sidebarOverlay, setSidebarOverlay ] = useState(false);
    const [ showMenu, setShowMenu ] = useState(true);
    const [ showSidebar, setShowSidebar ] = useState(true);

    const hideSidebarOnDisplayMediumLocal = localStorage.getItem("hideSidebarOnDisplayMedium") ? JSON.parse(localStorage.getItem("hideSidebarOnDisplayMedium")) : true;
    const hideSidebarOnDisplayLargeLocal = localStorage.getItem("hideSidebarOnDisplayLarge") ? JSON.parse(localStorage.getItem("hideSidebarOnDisplayLarge")) : false;
    const [ hideSidebarOnDisplayMedium, setHideSidebarOnDisplayMedium ] = useState(hideSidebarOnDisplayMediumLocal);
    const [ hideSidebarOnDisplayLarge, setHideSidebarOnDisplayLarge ] = useState(hideSidebarOnDisplayLargeLocal);
    
    const [ npAlbum, setnpAlbum ] = useState(null);
    const [ npTrack, setnpTrack ] = useState(null);
    const [ newTrack, setNewTrack ] = useState(false);

    const [ explicitQueue , setExplicitQueue ] = useState([]);
    const [ implicitQueuePlaylist, setImplicitQueuePlaylist ] = useState(null);
    const [ implicitQueueDiscIndex, setImplicitQueueDiscIndex ] = useState(-1);
    const [ implicitQueueTrackIndex, setImplicitQueueTrackIndex ] = useState(-1);

    // set theme
    const menuTextIconColorLocal = localStorage.getItem("menuTextIconColor") ? localStorage.getItem("menuTextIconColor") : "#000";
    const highlightColorLocal = localStorage.getItem("highlightColor") ? localStorage.getItem("highlightColor") : "#f8fafc";
    
    document.documentElement.style.setProperty('--menu-text-icon-color', menuTextIconColorLocal);
    document.documentElement.style.setProperty('--highlight-color', highlightColorLocal);

    // detect mobile
    // from https://stackoverflow.com/questions/54491645/media-query-syntax-for-reactjs
    const [ onBigScreen, setOnBigScreen ] = useState(
        window.matchMedia("(min-width: 768px)").matches
    );
    const [ onBiggerScreen, setOnBiggerScreen ] = useState(
        window.matchMedia("(min-width: 1536px)").matches
    );
    useEffect(() => {
        const setBigScreen = (e) => setOnBigScreen(e.matches);
        const setBiggerScreen = (e) => setOnBiggerScreen(e.matches);

        window
        .matchMedia("(min-width: 768px)")
        .addEventListener('change', setBigScreen);
        
        window
        .matchMedia("(min-width: 1536px)")
        .addEventListener('change', setBiggerScreen);

        return(() => {
            window.removeEventListener('change', setBigScreen);
            window.removeEventListener('change', setBiggerScreen);
        });
    }, []);

    const mainApp = serverUrl === null 
        ? <Login 
            setServerUrl={setServerUrl} /> 
        : <Main 
            tabTitle={tabTitle}
            setTabTitle={setTabTitle}
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
            sidebarOverlay={sidebarOverlay}
            onBigScreen={onBigScreen}
            onBiggerScreen={onBiggerScreen}
            npAlbum={npAlbum}
            setnpAlbum={setnpAlbum}
            npTrack={npTrack}
            setnpTrack={setnpTrack}
            newTrack={newTrack}
            setNewTrack={setNewTrack}
            serverUrl={serverUrl}
            setServerUrl={setServerUrl}
            explicitQueue={explicitQueue}
            setExplicitQueue={setExplicitQueue}
            implicitQueuePlaylist={implicitQueuePlaylist}
            implicitQueueDiscIndex={implicitQueueDiscIndex}
            implicitQueueTrackIndex={implicitQueueTrackIndex}
            setImplicitQueueDiscIndex={setImplicitQueueDiscIndex}
            setImplicitQueueTrackIndex={setImplicitQueueTrackIndex}
            hideSidebarOnDisplayMedium={hideSidebarOnDisplayMedium}
            setHideSidebarOnDisplayMedium={setHideSidebarOnDisplayMedium}
            hideSidebarOnDisplayLarge={hideSidebarOnDisplayLarge}
            setHideSidebarOnDisplayLarge={setHideSidebarOnDisplayLarge}
        />;

    const albumDisplay = 
        <AlbumDisplay 
            serverUrl={serverUrl}
            setSidebarOverlay={setSidebarOverlay}
        />

    const album =
        <Album 
            serverUrl={serverUrl}
            onBigScreen={onBigScreen}
            onBiggerScreen={onBiggerScreen}
            setTabTitle={setTabTitle}
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
            hideSidebarOnDisplayMedium={hideSidebarOnDisplayMedium}
            hideSidebarOnDisplayLarge={hideSidebarOnDisplayLarge}
            setSidebarOverlay={setSidebarOverlay}
            setnpAlbum={setnpAlbum}
            npTrack={npTrack}
            setnpTrack={setnpTrack}
            setNewTrack={setNewTrack}
            explicitQueue={explicitQueue}
            setExplicitQueue={setExplicitQueue}
            setImplicitQueuePlaylist={setImplicitQueuePlaylist}
            setImplicitQueueDiscIndex={setImplicitQueueDiscIndex}
            setImplicitQueueTrackIndex={setImplicitQueueTrackIndex}
        />

    return(
        <Routes>
            <Route path='*' element={<NotFound />} />
            <Route path="/" element={mainApp}>
                <Route index element={albumDisplay} />
                <Route path="album" element={albumDisplay} />
                <Route path="album/:id" element={album} />
            </Route>
        </Routes>
    );
}

function Main(props) {
    const { 
        tabTitle,
        setTabTitle,
        sidebarOverlay,
        showMenu,
        setShowMenu,
        showSidebar,
        setShowSidebar,
        onBigScreen,
        onBiggerScreen,
        npAlbum,
        setnpAlbum,
        npTrack,
        setnpTrack,
        newTrack,
        setNewTrack,
        serverUrl,
        setServerUrl,
        explicitQueue,
        setExplicitQueue,
        implicitQueuePlaylist,
        implicitQueueDiscIndex,
        implicitQueueTrackIndex,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
        hideSidebarOnDisplayMedium,
        setHideSidebarOnDisplayMedium,
        hideSidebarOnDisplayLarge,
        setHideSidebarOnDisplayLarge,
    } = props;
    const [ isPlaying, setIsPlaying ] = useState(false);
    const [ trackProgress, setTrackProgress ] = useState(0);
    const [ inExplicitQueue, setInExplicitQueue ] = useState(false);
    const [ bottomMenuContentVisible, setBottomMenuContentVisible ] = useState(false);

    const audioRef = useRef(new Audio());
    const intervalRef = useRef();

    // start interval function
    const startInterval = () => {
        // clear previous interval
        clearInterval(intervalRef.current);

        // interval that update track length once a second
        intervalRef.current = setInterval(() => {
            setTrackProgress(audioRef.current.currentTime);
        }, 1000);
    }

    // set new source on newTrack
    useEffect(() => {
        if (newTrack) {
            const npSource = `${serverUrl}/api/track/${npTrack.path}`
            
            audioRef.current.pause();
            audioRef.current = new Audio(npSource);
            audioRef.current.load();

            setIsPlaying(true);
            startInterval();
    
            // preload next track
            setNewTrack(false);
        }
    }, [newTrack]);

    // go to next on end
    useEffect(() => {
        if (audioRef.current.ended) {
            let nextnpTrack = null;
            let nextnpAlbum = null;

            // consume explicit queue first
            if (explicitQueue.length > 0) {
                let newExplicitQueue = [...explicitQueue];
                const [ track, album ] = newExplicitQueue.pop();
                nextnpTrack = track;
                nextnpAlbum = album;

                setExplicitQueue(newExplicitQueue);
                setInExplicitQueue(true);
            } else {
                setInExplicitQueue(false);
                const [ newDiscIndex, newTrackIndex ] = incrementQueueIndex(implicitQueuePlaylist, implicitQueueDiscIndex, implicitQueueTrackIndex);
                if (newDiscIndex !== implicitQueueDiscIndex || newTrackIndex !== implicitQueueTrackIndex) {
                    nextnpTrack = implicitQueuePlaylist.discs[newDiscIndex].tracks[newTrackIndex];
                    nextnpAlbum = implicitQueuePlaylist;
                    setImplicitQueueDiscIndex(newDiscIndex);
                    setImplicitQueueTrackIndex(newTrackIndex);
                } else {
                    setIsPlaying(false); // audio ref current ended exclusive
                }
            }
    
            if (nextnpTrack) {
                setNewTrack(true);
                setnpTrack(nextnpTrack);
                setTabTitle(`${nextnpTrack.artist} - ${nextnpTrack.name} | musicthing`);

                if (nextnpAlbum) {
                    setnpAlbum(nextnpAlbum);
                }
            }
        }
    }, [audioRef.current.ended]);

    // handle isPlaying change
    useEffect(async () => {
        if (isPlaying) {
            try {
                await audioRef.current.play();
            } catch(e) {
                alert(`Failure to play audio at ${audioRef.current.src}. Perhaps the server is down?\n\nError: ${e}`);
            }
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, newTrack]);

    // cleanup when component unmounted
    useEffect(() => {
        return () => {
            audioRef.current.pause();
            clearInterval(intervalRef.current);
        }
    }, []);

    return (
        <div className="bg-gray-600">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{tabTitle}</title>
            </Helmet>
            <div className="flex flex-row">
                {onBigScreen ? 
                    <SideMenu
                        sidebarOverlay={sidebarOverlay}
                        showMenu={showMenu}
                        setShowMenu={setShowMenu}
                        showSidebar={showSidebar}
                        setShowSidebar={setShowSidebar}
                        setTabTitle={setTabTitle}
                        npAlbum={npAlbum}
                        npTrack={npTrack}
                        setnpTrack={setnpTrack}
                        setnpAlbum={setnpAlbum}
                        onBigScreen={onBigScreen}
                        onBiggerScreen={onBiggerScreen}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        setNewTrack={setNewTrack}
                        trackProgress={trackProgress}
                        setTrackProgress={setTrackProgress}
                        audioRef={audioRef}
                        intervalRef={intervalRef}
                        startInterval={startInterval}
                        serverUrl={serverUrl}
                        setServerUrl={setServerUrl}
                        explicitQueue={explicitQueue}
                        setExplicitQueue={setExplicitQueue}
                        inExplicitQueue={inExplicitQueue}
                        setInExplicitQueue={setInExplicitQueue}
                        implicitQueuePlaylist={implicitQueuePlaylist}
                        implicitQueueDiscIndex={implicitQueueDiscIndex}
                        implicitQueueTrackIndex={implicitQueueTrackIndex}
                        setImplicitQueueDiscIndex={setImplicitQueueDiscIndex}
                        setImplicitQueueTrackIndex={setImplicitQueueTrackIndex}
                        setBottomMenuContentVisible={setBottomMenuContentVisible}
                        hideSidebarOnDisplayMedium={hideSidebarOnDisplayMedium}
                        setHideSidebarOnDisplayMedium={setHideSidebarOnDisplayMedium}
                        hideSidebarOnDisplayLarge={hideSidebarOnDisplayLarge}
                        setHideSidebarOnDisplayLarge={setHideSidebarOnDisplayLarge}
                    />
                    :
                    <BottomMenuMobile 
                        bottomMenuContentVisible={bottomMenuContentVisible}
                        setBottomMenuContentVisible={setBottomMenuContentVisible}
                        serverUrl={serverUrl}
                        setServerUrl={setServerUrl}
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
                        setNewTrack={setNewTrack}
                        setnpTrack={setnpTrack}
                        setnpAlbum={setnpAlbum}
                        setTabTitle={setTabTitle}
                        hideSidebarOnDisplayMedium={hideSidebarOnDisplayMedium}
                        setHideSidebarOnDisplayMedium={setHideSidebarOnDisplayMedium}
                        hideSidebarOnDisplayLarge={hideSidebarOnDisplayLarge}
                        setHideSidebarOnDisplayLarge={setHideSidebarOnDisplayLarge}
                    />
                }
                <div className="flex flex-col grow min-w-0">
                    <Outlet />
                    <div className="h-20"></div>
                </div>
            </div>
        </div>
    );
}

export default App;
