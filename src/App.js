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
    const [ implicitQueueDiscIndex, setImplicitQueueDiscIndex ] = useState(0);
    const [ implicitQueueTrackIndex, setImplicitQueueTrackIndex ] = useState(0);

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
            sidebarOverlay={sidebarOverlay}
            onBigScreen={onBigScreen}
            artSource={artSource}
            npSource={npSource}
            npArtist={npArtist}
            npAlbum={npAlbum}
            npTitle={npTitle}
            setnpSource={setnpSource}
            setnpArtist={setnpArtist}
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
            displayType="tiles"
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
        sidebarOverlay,
        onBigScreen,
        artSource,
        npSource,
        npArtist,
        npAlbum,
        npTitle,
        setnpSource,
        setnpArtist,
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

    // audio source
    const audioRef = useRef(new Audio(npSource));

    // handle source change
    useEffect(() => {
        audioRef.current.pause();
        audioRef.current = new Audio(npSource);
        audioRef.current.play();
        setNewAudio(false);
    }, [npSource, newAudio]);

    // cleanup when component unmounted
    useEffect(() => {
        return () => {
            audioRef.current.pause();
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
