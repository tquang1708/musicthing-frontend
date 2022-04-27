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
        ? <Login setServerUrl={setServerUrl} /> 
        : <Main 
            tabTitle={tabTitle}
            sidebarOverlay={sidebarOverlay}
            artSource={artSource}
            npSource={npSource}
            npArtist={npArtist}
            npAlbum={npAlbum}
            npTitle={npTitle}
            isPlaying={isPlaying}
            onBigScreen={onBigScreen}
            setIsPlaying={setIsPlaying}
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
        artSource,
        npSource,
        npArtist,
        npAlbum,
        npTitle,
        isPlaying,
        onBigScreen,
        setIsPlaying,
    } = props;

    // audio source
    const audioRef = useRef(new Audio(npSource));

    // handle source change
    useEffect(() => {
        audioRef.current.pause();
        audioRef.current = new Audio(npSource);
        audioRef.current.play();
    }, [npSource]);

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
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
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

// const reload = () => {
//     fetch(`${serverUrl}/api/reload`)
//         .then((response) => response.text())
//         .then(() => location.reload())
//         .catch((error) => console.log(error));
// }

// const hard_reload = () => {
//     fetch(`${serverUrl}/api/hard_reload`)
//         .then((response) => response.text())
//         .then(() => location.reload())
//         .catch((error) => console.log(error));
// }

// const disconnect = () => {
//     localStorage.removeItem('serverUrl');
//     setServerUrl(null);
//     location.reload();
// }
// {/* <button onClick={reload}>Reload Metadata DB</button>
// <button onClick={hard_reload}>Hard-Reload Metadata DB</button> */}
// {/* <button onClick={disconnect}>Disconnect from DB</button> */}

export default App;
