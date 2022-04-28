import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Routes,
    Route,
    Outlet,
} from 'react-router-dom';
import Login from './Login';
import SideMenu from './sidemenu/SideMenu';
import BottomMenuMobile from './sidemenu/BottomMenuMobile';
import AlbumDisplay from './maindisplay/AlbumDisplay';
import Album from './maindisplay/Album';

import incrementQueueIndex from './helper/incrementQueueIndex';
import unknown_album from './unknown_album.svg';

function App() {
    const [ serverUrl, setServerUrl ] = useState(localStorage.getItem("serverUrl"));
    const [ tabTitle, setTabTitle ] = useState("musicthing");
    const [ sidebarOverlay, setSidebarOverlay ] = useState(false);
    
    const [ artSource, setArtSource ] = useState(unknown_album);
    const [ npSource, setnpSource ] = useState("");
    const [ npArtist, setnpArtist ] = useState("Unknown Artist");
    const [ npAlbum, setnpAlbum ] = useState(null);
    const [ npTitle, setnpTitle ] = useState("Untitled");
    const [ isPlaying, setIsPlaying ] = useState(false);    
    const [ newAudio, setNewAudio ] = useState(false);

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
            artSource={artSource}
            setArtSource={setArtSource}
            npSource={npSource}
            npArtist={npArtist}
            npAlbum={npAlbum}
            npTitle={npTitle}
            setnpSource={setnpSource}
            setnpArtist={setnpArtist}
            setnpAlbum={setnpAlbum}
            setnpTitle={setnpTitle}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            newAudio={newAudio}
            setNewAudio={setNewAudio}
            serverUrl={serverUrl}
            setServerUrl={setServerUrl}
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
            backLinkTo="/album"
            onBigScreen={onBigScreen}
            setTabTitle={setTabTitle}
            setSidebarOverlay={setSidebarOverlay}
            setArtSource={setArtSource}
            setnpSource={setnpSource}
            setnpArtist={setnpArtist}
            setnpAlbum={setnpAlbum}
            setnpTitle={setnpTitle}
            setIsPlaying={setIsPlaying}
            setNewAudio={setNewAudio}
            setImplicitQueuePlaylist={setImplicitQueuePlaylist}
            setImplicitQueueDiscIndex={setImplicitQueueDiscIndex}
            setImplicitQueueTrackIndex={setImplicitQueueTrackIndex}
        />

    return(
        <Routes>
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
        artSource,
        setArtSource,
        npSource,
        npArtist,
        npAlbum,
        npTitle,
        setnpSource,
        setnpArtist,
        setnpAlbum,
        setnpTitle,
        isPlaying,
        setIsPlaying,
        newAudio,
        setNewAudio,
        serverUrl,
        setServerUrl,
        implicitQueuePlaylist,
        implicitQueueDiscIndex,
        implicitQueueTrackIndex,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
    } = props;
    const [ trackProgress, setTrackProgress ] = useState(0);

    // audio source and interval reference
    const audioRef = useRef(new Audio(npSource));
    const preLoadAudioRef = useRef(new Audio(npSource));
    const intervalRef = useRef();

    // start interval function
    const startInterval = () => {
        // clear previous interval
        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            if (audioRef.current.ended) {
                // update index
                const [ newDiscIndex, newTrackIndex ] = incrementQueueIndex(implicitQueuePlaylist, implicitQueueDiscIndex, implicitQueueTrackIndex);

                // if index did not change then set playing to paused and clear interval
                if (newDiscIndex === implicitQueueDiscIndex && newTrackIndex === implicitQueueTrackIndex) {
                    setIsPlaying(false);
                } else {
                    setImplicitQueueDiscIndex(newDiscIndex);
                    setImplicitQueueTrackIndex(newTrackIndex);
                }
            } else {
                // else keep track of track progress each interval
                setTrackProgress(audioRef.current.currentTime);
            }
        }, 500);
    }

    // handle source change
    useEffect(() => {
        audioRef.current.pause();
        audioRef.current = new Audio(npSource);
        audioRef.current.play();
        startInterval();
        setNewAudio(false);

        // preload next audio afterwards
        preLoadAudioRef.current.play();
        preLoadAudioRef.current.pause();
    }, [npSource, newAudio]);

    // cleanup when component unmounted
    useEffect(() => {
        return () => {
            audioRef.current.pause();
            clearInterval(intervalRef.current);
        }
    }, []);

    // handle isPlaying change
    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // handle queue indices change to play current track and preload next track
    // we know that queue indices are always valid from how they are set with prev/next buttons
    useEffect(() => {
        if (implicitQueuePlaylist) {
            const track = implicitQueuePlaylist.discs[implicitQueueDiscIndex].tracks[implicitQueueTrackIndex];

            setTabTitle(`${track.artist} - ${track.name} | musicthing`);
            setArtSource(artSource);
            setnpArtist(track.artist);
            setnpAlbum(implicitQueuePlaylist);
            setnpTitle(track.name);
            
            setnpSource(`${serverUrl}/track/${track.path}`);
            setIsPlaying(true);

            // preload next track if possible
            const [ newDiscIndex, newTrackIndex ] = incrementQueueIndex(implicitQueuePlaylist, implicitQueueDiscIndex, implicitQueueTrackIndex);
            const nextTrack = implicitQueuePlaylist.discs[newDiscIndex].tracks[newTrackIndex];
            preLoadAudioRef.current = new Audio(`${serverUrl}/track/${nextTrack.path}`);
        }
    }, [implicitQueueDiscIndex, implicitQueueTrackIndex]);

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
                        artSource={artSource}
                        npArtist={npArtist}
                        npAlbum={npAlbum}
                        npTitle={npTitle}
                        setnpSource={setnpSource}
                        setnpArtist={setnpArtist}
                        setnpTitle={setnpTitle}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        trackProgress={trackProgress}
                        setTrackProgress={setTrackProgress}
                        audioRef={audioRef}
                        intervalRef={intervalRef}
                        startInterval={startInterval}
                        serverUrl={serverUrl}
                        setServerUrl={setServerUrl}
                        implicitQueuePlaylist={implicitQueuePlaylist}
                        implicitQueueDiscIndex={implicitQueueDiscIndex}
                        implicitQueueTrackIndex={implicitQueueTrackIndex}
                        setImplicitQueueDiscIndex={setImplicitQueueDiscIndex}
                        setImplicitQueueTrackIndex={setImplicitQueueTrackIndex}
                    />
                    :
                    <BottomMenuMobile 
                        npArtist={npArtist}
                        npAlbum={npAlbum}
                        npTitle={npTitle}
                        artSource={artSource}
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
