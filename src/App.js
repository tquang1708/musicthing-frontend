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
    const [ nextTrack, setNextTrack ] = useState(false);

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
            nextTrack={nextTrack}
            setNextTrack={setNextTrack}
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
        nextTrack,
        setNextTrack,
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

    const audioRefFirst = useRef(new Audio());
    const audioRefSecond = useRef(new Audio());
    const currAudioRefIsFirst = useRef(true);
    const intervalRef = useRef();

    // preload next track on the ref that is not currently playing
    const preloadNextTrack = () => {
        const [ newDiscIndex, newTrackIndex ] = incrementQueueIndex(implicitQueuePlaylist, implicitQueueDiscIndex, implicitQueueTrackIndex);

        // only preload if the index is not at the end of queue
        if (newDiscIndex !== implicitQueueDiscIndex || newTrackIndex !== implicitQueueTrackIndex) {
            const nextTrack = implicitQueuePlaylist.discs[newDiscIndex].tracks[newTrackIndex];
            const nextSource = `${serverUrl}/api/track/${nextTrack.path}`

            if (currAudioRefIsFirst.current) {
                audioRefSecond.current.pause();
                audioRefSecond.current = new Audio(nextSource);
                audioRefSecond.current.load();
            } else {
                audioRefFirst.current.pause();
                audioRefFirst.current = new Audio(nextSource);
                audioRefFirst.current.load();
            }
        }
    }

    // go to next on end - copied from next button function
    useEffect(() => {
        if (audioRefFirst.current.ended || audioRefSecond.current.ended) {
            const [ newDiscIndex, newTrackIndex ] = incrementQueueIndex(implicitQueuePlaylist, implicitQueueDiscIndex, implicitQueueTrackIndex);
            if (newDiscIndex !== implicitQueueDiscIndex || newTrackIndex !== implicitQueueTrackIndex) {
                setNextTrack(true);
        
                const nextnpTrack = implicitQueuePlaylist.discs[newDiscIndex].tracks[newTrackIndex];
                setnpTrack(nextnpTrack);
                setTabTitle(`${nextnpTrack.artist} - ${nextnpTrack.name} | musicthing`);
        
                setImplicitQueueDiscIndex(newDiscIndex);
                setImplicitQueueTrackIndex(newTrackIndex);
            }
        }
    }, [audioRefFirst.current.ended, audioRefSecond.current.ended]);

    // start interval function
    const startInterval = () => {
        // clear previous interval
        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            if (currAudioRefIsFirst.current) {
                setTrackProgress(audioRefFirst.current.currentTime);
            } else {
                setTrackProgress(audioRefSecond.current.currentTime);
            }
        }, 1000);
    }

    // play the other ref on nextTrack
    useEffect(() => {
        if (nextTrack) {
            // flip curraudioref then play - the other audio ref would always have the next track
            currAudioRefIsFirst.current = !currAudioRefIsFirst.current;
            setIsPlaying(true);
            startInterval();

            // preload next track
            preloadNextTrack();
            setNextTrack(false);
        }
    }, [nextTrack]);

    // set new source on newTrack
    useEffect(() => {
        if (newTrack) {
            const npSource = `${serverUrl}/api/track/${npTrack.path}`

            if (currAudioRefIsFirst.current) {
                audioRefFirst.current.pause();
                audioRefFirst.current = new Audio(npSource);
                audioRefFirst.current.load();
            } else {
                audioRefSecond.current.pause();
                audioRefSecond.current = new Audio(npSource);
                audioRefSecond.current.load();
            }
            setIsPlaying(true);
            startInterval();
    
            // preload next track
            preloadNextTrack();
            setNewTrack(false);
        }
    }, [newTrack]);

    // handle isPlaying change
    useEffect(async () => {
        if (currAudioRefIsFirst.current) {
            if (isPlaying) {
                try {
                    await audioRefFirst.current.play();
                } catch(e) {
                    console.log(`Error: ${e}`);
                }
            } else {
                audioRefFirst.current.pause();
            }
        } else {
            if (isPlaying) {
                try {
                    await audioRefSecond.current.play();
                } catch(e) {
                    console.log(`Error: ${e}`);
                }
            } else {
                audioRefSecond.current.pause();
            }
        }
    }, [isPlaying, newTrack, nextTrack]);

    // cleanup when component unmounted
    useEffect(() => {
        return () => {
            audioRefFirst.current.pause();
            audioRefSecond.current.pause();
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
                        setNextTrack={setNextTrack}
                        trackProgress={trackProgress}
                        setTrackProgress={setTrackProgress}
                        audioRefFirst={audioRefFirst}
                        audioRefSecond={audioRefSecond}
                        currAudioRefIsFirst={currAudioRefIsFirst}
                        intervalRef={intervalRef}
                        startInterval={startInterval}
                        serverUrl={serverUrl}
                        setServerUrl={setServerUrl}
                        explicitQueue={explicitQueue}
                        setExplicitQueue={setExplicitQueue}
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
