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
import BottomMenuMobile from './sidemenu/BottomMenuMobile';
import AlbumDisplay from './maindisplay/AlbumDisplay';
import Album from './maindisplay/Album';

import { incrementQueueIndex } from './misc/helper/queueIndex';

function App() {
    const [ serverUrl, setServerUrl ] = useState(localStorage.getItem("serverUrl"));
    const [ tabTitle, setTabTitle ] = useState("musicthing");
    const [ sidebarOverlay, setSidebarOverlay ] = useState(false);
    
    const [ npAlbum, setnpAlbum ] = useState(null);
    const [ npTrack, setnpTrack ] = useState(null);
    const [ newTrack, setNewTrack ] = useState(false);

    const [ explicitQueue , setExplicitQueue ] = useState([]);
    const [ implicitQueuePlaylist, setImplicitQueuePlaylist ] = useState(null);
    const [ implicitQueueDiscIndex, setImplicitQueueDiscIndex ] = useState(-1);
    const [ implicitQueueTrackIndex, setImplicitQueueTrackIndex ] = useState(-1);

    const [ onBigScreen, setOnBigScreen ] = useState(
        window.matchMedia("(min-width: 768px)").matches
    );
    // detect mobile
    // from https://stackoverflow.com/questions/54491645/media-query-syntax-for-reactjs
    useEffect(() => {
        const setBigScreen = (e) => {
            setOnBigScreen(e.matches);
        };

        window
        .matchMedia("(min-width: 768px)")
        .addEventListener('change', setBigScreen);

        return(() => {
            window.removeEventListener('change', setBigScreen);
        });
    }, []);

    const mainApp = serverUrl === null 
        ? <Login 
            setServerUrl={setServerUrl} /> 
        : <Main 
            tabTitle={tabTitle}
            setTabTitle={setTabTitle}
            sidebarOverlay={sidebarOverlay}
            onBigScreen={onBigScreen}
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
            setTabTitle={setTabTitle}
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
        onBigScreen,
        npAlbum,
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
    } = props;
    const [ isPlaying, setIsPlaying ] = useState(false);
    const [ trackProgress, setTrackProgress ] = useState(0);
    const [ inExplicitQueue, setInExplicitQueue ] = useState(false);

    const audioRef = useRef(new Audio());
    const intervalRef = useRef();

    // start interval function
    const startInterval = () => {
        // clear previous interval
        clearInterval(intervalRef.current);

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

            // consume explicit queue first
            if (explicitQueue.length > 0) {
                let newExplicitQueue = [...explicitQueue];
                nextnpTrack = newExplicitQueue.pop();
                setExplicitQueue(newExplicitQueue);
                setInExplicitQueue(true);
            } else {
                setInExplicitQueue(false);
                const [ newDiscIndex, newTrackIndex ] = incrementQueueIndex(implicitQueuePlaylist, implicitQueueDiscIndex, implicitQueueTrackIndex);
                if (newDiscIndex !== implicitQueueDiscIndex || newTrackIndex !== implicitQueueTrackIndex) {
                    nextnpTrack = implicitQueuePlaylist.discs[newDiscIndex].tracks[newTrackIndex];
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
            }
        }
    }, [audioRef.current.ended]);

    // handle isPlaying change
    useEffect(async () => {
        if (isPlaying) {
            try {
                await audioRef.current.play();
            } catch(e) {
                console.log(`Error: ${e}`);
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
                        setTabTitle={setTabTitle}
                        npAlbum={npAlbum}
                        npTrack={npTrack}
                        setnpTrack={setnpTrack}
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
                    />
                    :
                    <BottomMenuMobile 
                        serverUrl={serverUrl}
                        npTrack={npTrack}
                        npAlbum={npAlbum}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                    />
                }
                <div className="flex flex-col grow min-w-0">
                    <Outlet />
                    <div className="h-8 md:h-20"></div>
                </div>
            </div>
        </div>
    );
}

export default App;
